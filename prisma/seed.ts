import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: "cfngc4594",
    email: "cfngc4594@gmail.com",
    role: "ADMIN",
    problems: {
      create: [
        {
          title: "Two Sum",
          description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

## Examples

### Example 1

\`\`\`shell
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

### Example 2

\`\`\`shell
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

### Example 3

\`\`\`shell
Input: nums = [3,3], target = 6
Output: [0,1]
\`\`\`

## Constraints

\`\`\`math
2 <= nums.length <= 10^4
\`\`\`

\`\`\`math
-10^9 <= nums[i] <= 10^9
\`\`\`

\`\`\`math
-10^9 <= target <= 10^9
\`\`\`

<div align="center">
Only one valid answer exists.
</div>

---

**Follow-up:** Can you come up with an algorithm that is less than $O(n^2)$ time complexity?`,
          difficulty: "EASY",
          published: true,
          templates: {
            create: [
              {
                language: "c",
                template: `/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    
}`,
              },
              {
                language: "cpp",
                template: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
              },
            ],
          },
        },
        {
          title: "Add Two Numbers",
          description: `You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

## Examples

### Example 1

\`\`\`shell
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.
\`\`\`

### Example 2

\`\`\`shell
Input: l1 = [0], l2 = [0]
Output: [0]
\`\`\`

### Example 3

\`\`\`shell
Input: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
Output: [8,9,9,9,0,0,0,1]
\`\`\`

## Constraints

<div align="center">
The number of nodes in each linked list is in the range $[1, 100]$.
</div>

\`\`\`math
0 <= Node.val <= 9
\`\`\`

<div align="center">
It is guaranteed that the list represents a number that does not have leading zeros.
</div>`,
          difficulty: "MEDIUM",
          published: true,
          templates: {
            create: [
              {
                language: "c",
                template: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     struct ListNode *next;
 * };
 */
struct ListNode* addTwoNumbers(struct ListNode* l1, struct ListNode* l2) {
    
}`,
              },
              {
                language: "cpp",
                template: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        
    }
};`,
              },
            ],
          },
        },
      ],
    },
  },
  {
    name: "fly6516",
    email: "fly6516@outlook.com",
    role: "TEACHER",
    problems: {
      create: [
        {
          title: "Median of Two Sorted Arrays",
          description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return **the median** of the two sorted arrays.

The overall run time complexity should be $O(log(m+n))$.

## Examples

### Example 1

\`\`\`shell
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.
\`\`\`

### Example 2

\`\`\`shell
Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.50000
Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.
\`\`\`

## Constraints

\`\`\`math
nums_1.length == m
\`\`\`

\`\`\`math
nums_2.length == n
\`\`\`

\`\`\`math
0 <= m <= 1000
\`\`\`

\`\`\`math
0 <= n <= 1000
\`\`\`

\`\`\`math
1 <= m + n <= 2000
\`\`\`

\`\`\`math
-10^6 <= nums_1[i], nums_2[i] <= 10^6
\`\`\``,
          difficulty: "HARD",
          published: true,
          templates: {
            create: [
              {
                language: "c",
                template: `double findMedianSortedArrays(int* nums1, int nums1Size, int* nums2, int nums2Size) {
    
}`,
              },
              {
                language: "cpp",
                template: `class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        
    }
};`,
              },
            ],
          },
        },
      ],
    },
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();
