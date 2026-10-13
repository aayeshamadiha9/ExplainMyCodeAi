import React from "react";
import { Baby, Compass, Cpu, HelpCircle, Briefcase } from "lucide-react";

const MODES = [
  {
    id: "beginner",
    label: "Beginner",
    icon: Baby,
    description: "Plain language, analogies, no jargon, step-by-step concepts",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    icon: Compass,
    description: "Program logic, data flow, structure, and language idioms",
  },
  {
    id: "advanced",
    label: "Advanced",
    icon: Cpu,
    description: "Deep technical dive, Big-O complexity, edge cases, and optimizations",
  },
  {
    id: "interview",
    label: "Interview",
    icon: Briefcase,
    description: "Candidate walkthrough style with 3-5 likely follow-up interview questions",
  },
];

export default function ModeSelector({ selectedMode, onChange }) {
  return (
    <div className="control-item" style={{ flex: 2, minWidth: "300px" }}>
      <label className="control-label">Explanation Depth</label>
      <div className="mode-segmented-control" role="tablist">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = selectedMode === mode.id;

          return (
            <button
              key={mode.id}
              role="tab"
              aria-selected={isActive}
              id={`tab-mode-${mode.id}`}
              className={`mode-tab-button ${isActive ? `active mode-${mode.id}` : ""}`}
              onClick={() => onChange(mode.id)}
              title={mode.description}
            >
              <Icon size={14} />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
