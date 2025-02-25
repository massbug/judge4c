export const DEFAULT_PROBLEM_DESCRIPTION = `

# Two Sum

Given an array of integers \`nums\` and an integer \`target\`, return *indices* of the **two numbers** such that they add up to \`target\`.

You **must not** use the same element twice, and you are guaranteed to have **exactly one solution** for each input.

The order of the indices you return does not matter.

## Examples

### Example 1

\`\`\`bash
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

### Example 2

\`\`\`bash
Input: nums = [3,2,4], target = 6
Output: [1,2]
Explanation: Because nums[1] + nums[2] == 6, we return [1, 2].
\`\`\`

### Example 3

\`\`\`bash
Input: nums = [3,3], target = 6
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 6, we return [0, 1].
\`\`\`

## Constraints

*   \`2 <= nums.length <= 10^4\`

*   \`-10^9 <= nums[i] <= 10^9\`

*   \`-10^9 <= target <= 10^9\`

*   **It is guaranteed that only one valid answer exists.**

**Follow-up:** Can you devise an algorithm with a time complexity less than \`O(n^2)\`?

`;
