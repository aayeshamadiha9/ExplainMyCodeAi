process.env.NODE_ENV = "test";
process.env.GEMINI_API_KEY = "test-mock-key";
process.env.MOCK_GEMINI = "true";

const request = require("supertest");
const app = require("../src/app");
const geminiService = require("../src/services/gemini.service");

describe("Explain My Code AI - Backend API Tests", () => {
  describe("GET /api/health", () => {
    it("should return status ok and integer uptime", async () => {
      const res = await request(app).get("/api/health");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("status", "ok");
      expect(typeof res.body.uptime).toBe("number");
    });
  });

  describe("GET /api/meta", () => {
    it("should return list of supported languages and modes", async () => {
      const res = await request(app).get("/api/meta");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.languages)).toBe(true);
      expect(Array.isArray(res.body.modes)).toBe(true);
      expect(res.body.languages).toContain("JavaScript");
      expect(res.body.languages).toContain("Python");
      expect(res.body.modes).toEqual([
        "beginner",
        "intermediate",
        "advanced",
        "interview",
      ]);
    });
  });

  describe("POST /api/explain - Input Validation", () => {
    it("should return 400 when body is missing code", async () => {
      const res = await request(app)
        .post("/api/explain")
        .send({ language: "JavaScript", mode: "beginner" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should return 400 when code is empty string or whitespace", async () => {
      const res = await request(app)
        .post("/api/explain")
        .send({ code: "    ", language: "JavaScript", mode: "beginner" });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
      expect(res.body.error.message).toMatch(/cannot be empty/i);
    });

    it("should return 400 when language is unsupported", async () => {
      const res = await request(app)
        .post("/api/explain")
        .send({
          code: "console.log('hi')",
          language: "Brainfuck",
          mode: "beginner",
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
      expect(res.body.error.message).toMatch(/not supported/i);
    });

    it("should return 400 when mode is invalid", async () => {
      const res = await request(app)
        .post("/api/explain")
        .send({
          code: "console.log('hi')",
          language: "JavaScript",
          mode: "wizard",
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
      expect(res.body.error.message).toMatch(/invalid/i);
    });

    it("should return 413 when code exceeds MAX_CODE_LENGTH", async () => {
      const hugeCode = "a".repeat(8005);
      const res = await request(app)
        .post("/api/explain")
        .send({
          code: hugeCode,
          language: "JavaScript",
          mode: "beginner",
        });

      expect(res.status).toBe(413);
      expect(res.body.error.code).toBe("PAYLOAD_TOO_LARGE");
    });
  });

  describe("POST /api/explain - Successful Explanation", () => {
    it("should return structured explanation for beginner mode", async () => {
      const res = await request(app)
        .post("/api/explain")
        .send({
          code: "function add(a, b) { return a + b; }",
          language: "JavaScript",
          mode: "beginner",
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("language", "JavaScript");
      expect(res.body).toHaveProperty("mode", "beginner");
      expect(res.body).toHaveProperty("explanation");

      const exp = res.body.explanation;
      expect(typeof exp.overview).toBe("string");
      expect(Array.isArray(exp.stepByStep)).toBe(true);
      expect(exp.stepByStep.length).toBeGreaterThan(0);
      expect(exp.stepByStep[0]).toHaveProperty("lines");
      expect(exp.stepByStep[0]).toHaveProperty("explanation");
      expect(Array.isArray(exp.keyConcepts)).toBe(true);
      expect(Array.isArray(exp.potentialIssues)).toBe(true);
      expect(Array.isArray(exp.improvements)).toBe(true);
      expect(res.body.meta).toHaveProperty("latencyMs");
    });

    it("should return interview questions in interview mode", async () => {
      const res = await request(app)
        .post("/api/explain")
        .send({
          code: "def binary_search(arr, x):\n  # search logic\n  pass",
          language: "Python",
          mode: "interview",
        });

      expect(res.status).toBe(200);
      expect(res.body.mode).toBe("interview");
      expect(res.body.explanation).toHaveProperty("complexity");
      expect(res.body.explanation.complexity).toHaveProperty("time");
      expect(res.body.explanation.complexity).toHaveProperty("space");
      expect(Array.isArray(res.body.explanation.interviewQuestions)).toBe(true);
      expect(res.body.explanation.interviewQuestions.length).toBeGreaterThanOrEqual(1);
    });

    it("should handle auto-detect language successfully", async () => {
      const res = await request(app)
        .post("/api/explain")
        .send({
          code: "const x = [1, 2, 3].map(n => n * 2);",
          language: "auto",
          mode: "intermediate",
        });

      expect(res.status).toBe(200);
      expect(res.body.language).toBeTruthy();
    });
  });

  describe("Error handling", () => {
    it("should return 404 for unknown endpoints", async () => {
      const res = await request(app).get("/api/non-existent-route");
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });

    it("should handle Gemini service failure with 502 status", async () => {
      jest.spyOn(geminiService, "generateExplanation").mockImplementationOnce(async () => {
        const err = new Error("Gemini quota exceeded or network unavailable");
        err.status = 502;
        err.code = "GEMINI_ERROR";
        throw err;
      });

      const res = await request(app)
        .post("/api/explain")
        .send({
          code: "print('hello')",
          language: "Python",
          mode: "beginner",
        });

      expect(res.status).toBe(502);
      expect(res.body.error.code).toBe("GEMINI_FAILURE");
      expect(res.body.error.message).toMatch(/Gemini/i);
    });
  });
});
