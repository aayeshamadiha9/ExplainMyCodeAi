/**
 * High-quality curated code examples for "Load Example" button
 */

export const CODE_EXAMPLES = [
  {
    title: "Python: Recursive Fibonacci with Memoization",
    language: "Python",
    mode: "intermediate",
    code: `def fibonacci_memo(n: int, memo: dict = None) -> int:
    """
    Computes the n-th Fibonacci number using top-down dynamic programming (memoization).
    O(n) time complexity and O(n) space complexity.
    """
    if memo is None:
        memo = {}

    # Base cases
    if n < 0:
        raise ValueError("Fibonacci sequence is not defined for negative integers.")
    if n in (0, 1):
        return n

    # Check cache
    if n in memo:
        return memo[n]

    # Recursive computation with caching
    memo[n] = fibonacci_memo(n - 1, memo) + fibonacci_memo(n - 2, memo)
    return memo[n]

# Example execution
if __name__ == "__main__":
    result = fibonacci_memo(50)
    print(f"50th Fibonacci number: {result}")`,
  },
  {
    title: "JavaScript: Debounce Function with Immediate Option",
    language: "JavaScript",
    mode: "advanced",
    code: `/**
 * Creates a debounced function that delays invoking func until after
 * wait milliseconds have elapsed since the last time it was invoked.
 *
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @param {boolean} immediate - Trigger on leading edge instead of trailing
 * @returns {Function} Debounced function with .cancel() method
 */
function debounce(func, wait = 300, immediate = false) {
  let timeoutId = null;

  function debounced(...args) {
    const context = this;
    const callNow = immediate && !timeoutId;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        func.apply(context, args);
      }
    }, wait);

    if (callNow) {
      func.apply(context, args);
    }
  }

  debounced.cancel = function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}`,
  },
  {
    title: "Java: Binary Search with Overflow Prevention",
    language: "Java",
    mode: "interview",
    code: `public class BinarySearch {
    /**
     * Searches for a target value within a sorted array of integers.
     * Prevents integer overflow when calculating midpoint: low + (high - low) / 2
     *
     * @param nums Sorted array of integers
     * @param target Value to locate
     * @return 0-based index of target, or -1 if not found
     */
    public static int search(int[] nums, int target) {
        if (nums == null || nums.length == 0) {
            return -1;
        }

        int low = 0;
        int high = nums.length - 1;

        while (low <= high) {
            // Avoids integer overflow compared to (low + high) / 2
            int mid = low + (high - low) / 2;

            if (nums[mid] == target) {
                return mid; // Element found
            } else if (nums[mid] < target) {
                low = mid + 1; // Discard left half
            } else {
                high = mid - 1; // Discard right half
            }
        }

        return -1; // Target not present
    }

    public static void main(String[] args) {
        int[] sortedData = {-10, -3, 0, 5, 9, 12, 45, 89};
        int target = 9;
        int index = search(sortedData, target);
        System.out.println("Target index: " + index);
    }
}`,
  },
];
