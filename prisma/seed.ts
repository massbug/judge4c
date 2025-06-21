import { PrismaClient, Prisma } from "@/generated/client";

const prisma = new PrismaClient();

const dockerConfigData: Prisma.DockerConfigCreateInput[] = [
  {
    language: "c",
    image: "gcc",
    tag: "latest",
    workingDir: "/src",
    compileOutputLimit: 1 * 1024 * 1024,
    runOutputLimit: 1 * 1024 * 1024,
  },
  {
    language: "cpp",
    image: "gcc",
    tag: "latest",
    workingDir: "/src",
    compileOutputLimit: 1 * 1024 * 1024,
    runOutputLimit: 1 * 1024 * 1024,
  },
];

const languageServerConfigData: Prisma.LanguageServerConfigCreateInput[] = [
  {
    language: "c",
    protocol: "wss",
    hostname: "lsp-c.litchi.icu",
    path: "/clangd",
  },
  {
    language: "cpp",
    protocol: "wss",
    hostname: "lsp-cpp.litchi.icu",
    path: "/clangd",
  },
];

const problemData: Prisma.ProblemCreateInput[] = [
  {
    displayId: 1000,
    difficulty: "EASY",
    isPublished: true,
    localizations: {
      create: [
        {
          locale: "en",
          type: "TITLE",
          content: "Two Sum",
        },
        {
          locale: "zh",
          type: "TITLE",
          content: "两数之和",
        },
        {
          locale: "en",
          type: "DESCRIPTION",
          content: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

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

**Follow-up:** Can you come up with an algorithm that is less than $O(n^2)$ time complexity?

---

<Accordion title="Hint 1">
A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it's best to try out brute force solutions for just for completeness. It is from these brute force solutions that you can come up with optimizations.
</Accordion>

<Accordion title="Hint 2">
So, if we fix one of the numbers, say \`x\`, we have to scan the entire array to find the next number \`y\` which is \`value - x\` where value is the input parameter. Can we change our array somehow so that this search becomes faster?
</Accordion>

<Accordion title="Hint 3">
The second train of thought is, without changing the array, can we use additional space somehow? Like maybe a hash map to speed up the search?
</Accordion>`,
        },
        {
          locale: "zh",
          type: "DESCRIPTION",
          content: `给定一个整数数组\`nums\` 一个整数\`target\`, 返回数组中两个数的下标，使得它们的和等于 \`target\`.

你可以假设每个输入恰好有一个解，并且你不能重复使用同一个元素。

答案可以按任意顺序返回。

## 示例

### 示例 1

\`\`\`shell
输入: nums = [2,7,11,15], target = 9
输出: [0,1]
解释: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

### 示例 2

\`\`\`shell
输入: nums = [3,2,4], target = 6
输出: [1,2]
\`\`\`

### 示例 3

\`\`\`shell
输入: nums = [3,3], target = 6
输出: [0,1]
\`\`\`

## 约束

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
只存在一个有效的答案。
</div>

**进阶问题：** 你能否设计一个时间复杂度低于 $O(n^2)$ 的算法来解决这个问题？?

---

<Accordion title="提示 1">
一种真正的暴力方法是遍历所有可能的数字对，但这种方法太慢了。不过，为了完整性，尝试暴力解法仍然是有意义的。正是从这些暴力解法中，你才能找到优化的思路。
</Accordion>

<Accordion title="提示 2">
所以，如果我们固定其中一个数字，例如 \`x\`, 我们就必须遍历整个数组来找到另一个数字 \`y\`，而 \`y\`等于 \`value - x\` （这里的 value 是输入的参数）。我们能否以某种方式对数组进行处理，从而让这种查找变得更快呢？
</Accordion>

<Accordion title="提示 3">
第二种思路是，在不改变数组的前提下，我们能否借助额外的空间呢？比如，是否可以用哈希表来加快查找速度？
</Accordion>`,
        },
        {
          locale: "en",
          type: "SOLUTION",
          content: `![Example](https://assets.leetcode.com/uploads/2020/10/02/addtwonumber1.jpg)

## Approach 1: Brute Force

### Algorithm

The brute force approach is simple. Loop through each element $x$ and find if there is another value that equals to $target - x$.

### Implementation

\`\`\`c showLineNumbers {2-3,6-7,15}
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[j] == target - nums[i]) {
                int* result = malloc(sizeof(int) * 2);
                result[0] = i;
                result[1] = j;
                *returnSize = 2;
                return result;
            }
        }
    }
    // Return an empty array if no solution is found
    *returnSize = 0;
    return malloc(sizeof(int) * 0);
}
\`\`\`

### Complexity Analysis

- **Time complexity:** $O(n^2)$.

  For each element, we try to find its complement by looping through the rest of the array which takes $O(n)$ time. Therefore, the time complexity is $O(n^2)$.

- **Space complexity:** $O(1)$.

  The space required does not depend on the size of the input array, so only constant space is used.

<VideoEmbed platform="bilibili" id="BV1vkNGehEun" />

---

## Approach 2: Two-pass Hash Table

### Intuition

To improve our runtime complexity, we need a more efficient way to check if the complement exists in the array. If the complement exists, we need to get its index. What is the best way to maintain a mapping of each element in the array to its index? A hash table.

We can reduce the lookup time from $O(n)$ to $O(1)$ by trading space for speed. A hash table is well suited for this purpose because it supports fast lookup in near constant time. I say "near" because if a collision occurred, a lookup could degenerate to $O(n)$ time. However, lookup in a hash table should be amortized $O(1)$ time as long as the hash function was chosen carefully.

### Algorithm

A simple implementation uses two iterations. In the first iteration, we add each element's value as a key and its index as a value to the hash table. Then, in the second iteration, we check if each element's complement ($target - nums[i]$) exists in the hash table. If it does exist, we return current element's index and its complement's index. Beware that the complement must not be $nums[i]$ itself!

### Implementation

\`\`\`c showLineNumbers
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    struct hashTable {
        int key;
        int value;
        UT_hash_handle hh;
    } *hashTable = NULL, *item, *tmpItem;

    for (int i = 0; i < numsSize; i++) {
        HASH_FIND_INT(hashTable, &nums[i], item);
        if (item) {
            int* result = malloc(sizeof(int) * 2);
            result[0] = item->value;
            result[1] = i;
            *returnSize = 2;
            HASH_ITER(hh, hashTable, item, tmpItem) {
                HASH_DEL(hashTable, item);
                free(item);
            }
            return result;
        }
        item = malloc(sizeof(struct hashTable));
        item->key = target - nums[i];
        item->value = i;
        HASH_ADD_INT(hashTable, key, item);
    }

    HASH_ITER(hh, hashTable, item, tmpItem) {
        HASH_DEL(hashTable, item);
        free(item);
    }

    *returnSize = 0;
    // If no valid pair is found, return an empty array
    return malloc(sizeof(int) * 0);
}
\`\`\`

### Complexity Analysis

- **Time complexity:** $O(n)$.

  We traverse the list containing $n$ elements exactly twice. Since the hash table reduces the lookup time to $O(1)$, the overall time complexity is $O(n)$.

- **Space complexity:** $O(n)$.

  The extra space required depends on the number of items stored in the hash table, which stores exactly $n$ elements.

---

## Approach 3: One-pass Hash Table

### Algorithm

It turns out we can do it in one-pass. While we are iterating and inserting elements into the hash table, we also look back to check if current element's complement already exists in the hash table. If it exists, we have found a solution and return the indices immediately.

### Implementation

\`\`\`c showLineNumbers
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    struct hashTable {
        int key;
        int value;
        UT_hash_handle hh;
    } *hashTable = NULL, *item;

    for (int i = 0; i < numsSize; i++) {
        int complement = target - nums[i];
        HASH_FIND_INT(hashTable, &complement, item);
        if (item) {
            int* result = malloc(sizeof(int) * 2);
            result[0] = item->value;
            result[1] = i;
            *returnSize = 2;
            HASH_CLEAR(hh, hashTable);  // Free the hash table
            return result;
        }
        item = malloc(sizeof(struct hashTable));
        item->key = nums[i];
        item->value = i;
        HASH_ADD_INT(hashTable, key, item);
    }

    *returnSize = 0;
    HASH_CLEAR(hh, hashTable);  // Free the hash table
    // Return an empty array if no solution is found
    return malloc(0);  // Allocate 0 bytes
}
\`\`\`

### Complexity Analysis

- **Time complexity:** $O(n)$.

  We traverse the list containing $n$ elements only once. Each lookup in the table costs only $O(1)$ time.

- **Space complexity:** $O(n)$.

  The extra space required depends on the number of items stored in the hash table, which stores at most $n$ elements.

---

## Summary of Approaches

| Approach            | Time Complexity | Space Complexity |
| ------------------- | :-------------: | :--------------: |
| Brute Force         | $O(n^2)$        | $O(1)$           |
| Two-pass Hash Table | $O(n)$          | $O(n)$           |
| One-pass Hash Table | $O(n)$          | $O(n)$           |`,
        },
        {
          locale: "zh",
          type: "SOLUTION",
          content: `![示例](https://assets.leetcode.com/uploads/2020/10/02/addtwonumber1.jpg)

## 方法一：暴力枚举

### 算法思路

暴力枚举法的思路很简单：遍历数组中的每个元素 x，并查找是否存在另一个元素的值等于 $target - x$.

### 代码实现

\`\`\`c showLineNumbers {2-3,6-7,15}
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[j] == target - nums[i]) {
                int* result = malloc(sizeof(int) * 2);
                result[0] = i;
                result[1] = j;
                *returnSize = 2;
                return result;
            }
        }
    }
    // 如果未找到解，返回一个空数组
    *returnSize = 0;
    return malloc(sizeof(int) * 0);
}
\`\`\`

### 复杂度分析

- **时间复杂度：** $O(n^2)$.

  对于数组中的每个元素，我们都要通过遍历数组的剩余部分来查找它的补数，这需要 $O(n)$ 的时间。因此，总的时间复杂度是 $O(n^2)$.

- **空间复杂度：\(O(1)\)** $O(1)$.

  所需的空间并不依赖于输入数组的大小，所以只使用了常数级别的空间。

<VideoEmbed platform="bilibili" id="BV1vkNGehEun" />

---

## 方法 2: 两遍哈希表

### 思路

为了提高运行时的时间复杂度，我们需要一种更高效的方法来检查数组中是否存在某个元素的补数。如果补数存在，我们还需要获取它的索引。维护数组中每个元素与其索引之间的映射的最佳方法是什么呢？答案是哈希表。

我们可以通过用空间换取时间的方式，将查找时间从 $O(n)$ 降低到 $O(1)$ 。哈希表非常适合这个目的，因为它支持在近似常数时间内进行快速查找。我之所以说 “近似”，是因为如果发生了哈希冲突，查找时间可能会退化为 $O(n)$ 。不过，只要精心选择哈希函数，哈希表的查找时间平均为 $O(1)$ 。

### 算法

一种简单的实现方式是使用两次迭代。在第一次迭代中，我们将每个元素的值作为键，其索引作为值添加到哈希表中。然后，在第二次迭代中，我们检查每个元素的补数 ($target - nums[i]$) 是否存在于哈希表中。如果存在，我们就返回当前元素的索引和它补数的索引。需要注意的是，补数不能是元素本身 $nums[i]$ !

### 代码实现

\`\`\`c showLineNumbers
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    struct hashTable {
        int key;
        int value;
        UT_hash_handle hh;
    } *hashTable = NULL, *item, *tmpItem;

    for (int i = 0; i < numsSize; i++) {
        HASH_FIND_INT(hashTable, &nums[i], item);
        if (item) {
            int* result = malloc(sizeof(int) * 2);
            result[0] = item->value;
            result[1] = i;
            *returnSize = 2;
            HASH_ITER(hh, hashTable, item, tmpItem) {
                HASH_DEL(hashTable, item);
                free(item);
            }
            return result;
        }
        item = malloc(sizeof(struct hashTable));
        item->key = target - nums[i];
        item->value = i;
        HASH_ADD_INT(hashTable, key, item);
    }

    HASH_ITER(hh, hashTable, item, tmpItem) {
        HASH_DEL(hashTable, item);
        free(item);
    }

    *returnSize = 0;
    // 如果没有找到有效的数对，则返回一个空数组
    return malloc(sizeof(int) * 0);
}
\`\`\`

### 复杂度分析

- **时间复杂度：** $O(n)$.

  我们精确地遍历包含 n 个元素的列表两次。由于哈希表将查找时间减少到 $O(1)$，所以总的时间复杂度为 $O(n)$。

- **空间复杂度：** $O(n)$.

  所需的额外空间取决于存储在哈希表中的元素数量，而哈希表中恰好存储了 $n$ 个元素。

---

## 方法三：一遍哈希表

### 算法

事实证明，我们可以通过一遍遍历实现。在我们遍历并将元素插入哈希表的同时，我们还要检查当前元素的补数是否已经存在于哈希表中。如果存在，我们就找到了一个解决方案，并立即返回索引。

### 代码实现

\`\`\`c showLineNumbers
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    struct hashTable {
        int key;
        int value;
        UT_hash_handle hh;
    } *hashTable = NULL, *item;

    for (int i = 0; i < numsSize; i++) {
        int complement = target - nums[i];
        HASH_FIND_INT(hashTable, &complement, item);
        if (item) {
            int* result = malloc(sizeof(int) * 2);
            result[0] = item->value;
            result[1] = i;
            *returnSize = 2;
            HASH_CLEAR(hh, hashTable);  // 释放哈希表内存
            return result;
        }
        item = malloc(sizeof(struct hashTable));
        item->key = nums[i];
        item->value = i;
        HASH_ADD_INT(hashTable, key, item);
    }

    *returnSize = 0;
    HASH_CLEAR(hh, hashTable);  // 释放哈希表内存
    // 若未找到解，返回一个空数组
    return malloc(0);  // 分配0字节内存（即空数组）
}
\`\`\`

### 复杂度分析

- **时间复杂度：** $O(n)$.

  我们仅遍历包含 n 个元素的列表一次。表中每次查找仅需 $O(1)$ 时间。

- **空间复杂度：** $O(n)$.

  所需的额外空间取决于哈希表中存储的元素数量，该哈希表最多存储 $n$ 个元素。

---

## 方法总结

| 方法                |    时间复杂度   |     空间复杂度     |
| ------------------- | :-------------: | :--------------: |
| 暴力枚举   | $O(n^2)$        | $O(1)$           |
| 两遍哈希表 | $O(n)$          | $O(n)$           |
| 一遍哈希表 | $O(n)$          | $O(n)$           |`,
        },
      ],
    },
    templates: {
      create: [
        {
          language: "c",
          content: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int *twoSum(int *nums, int numsSize, int target, int *returnSize) {
  
}

int *parseIntArray(char *line, int *len) {
  line[strcspn(line, "\\n")] = 0;
  char *p = line;
  while (*p && (*p == '[' || *p == ' ' || *p == ']'))
    p++;

  int capacity = 10;
  int *arr = malloc(capacity * sizeof(int));
  *len = 0;

  char *token = strtok(p, ",");
  while (token) {
    if (*len >= capacity) {
      capacity *= 2;
      arr = realloc(arr, capacity * sizeof(int));
    }
    arr[(*len)++] = atoi(token);
    token = strtok(NULL, ",");
  }
  return arr;
}

char *formatOutput(int *res, int resLen) {
  if (resLen == 0)
    return "[]";

  char *buf = malloc(resLen * 12 + 3);
  char *p = buf;
  *p++ = '[';
  for (int i = 0; i < resLen; i++) {
    p += sprintf(p, "%d", res[i]);
    if (i != resLen - 1)
      *p++ = ',';
  }
  *p++ = ']';
  *p = 0;
  return buf;
}

int main() {
  char line[1024];
  while (fgets(line, sizeof(line), stdin)) {
    int numsSize;
    int *nums = parseIntArray(line, &numsSize);

    if (!fgets(line, sizeof(line), stdin))
      break;
    int target = atoi(line);

    int returnSize;
    int *res = twoSum(nums, numsSize, target, &returnSize);

    char *output = formatOutput(res, returnSize);
    printf("%s\\n", output);

    free(nums);
    if (returnSize > 0)
      free(res);
    if (returnSize > 0)
      free(output);
  }
  return 0;
}`,
        },
        {
          language: "cpp",
          content: `#include <iostream>
#include <sstream>
#include <string>
#include <vector>

using namespace std;

class Solution {
public:
  vector<int> twoSum(vector<int> &nums, int target) {
    
  }
};

vector<int> parseIntArray(const string &input) {
  vector<int> result;
  string trimmed = input.substr(1, input.size() - 2);
  stringstream ss(trimmed);
  string token;

  while (getline(ss, token, ',')) {
    result.push_back(stoi(token));
  }

  return result;
}

string formatOutput(const vector<int> &output) {
  if (output.empty())
    return "[]";

  stringstream ss;
  ss << "[";

  for (size_t i = 0; i < output.size(); ++i) {
    ss << output[i];
    if (i != output.size() - 1)
      ss << ",";
  }

  ss << "]";
  return ss.str();
}

int main() {
  string line;

  while (getline(cin, line)) {
    vector<int> nums = parseIntArray(line);

    getline(cin, line);
    int target = stoi(line);

    Solution sol;
    vector<int> result = sol.twoSum(nums, target);

    cout << formatOutput(result) << endl;
  }

  return 0;
}`,
        },
      ],
    },
    testcases: {
      create: [
        {
          inputs: {
            create: [
              {
                index: 0,
                name: "nums",
                value: "[2,7,11,15]",
              },
              {
                index: 1,
                name: "target",
                value: "9",
              },
            ],
          },
          expectedOutput: "[0,1]",
        },
        {
          inputs: {
            create: [
              {
                index: 0,
                name: "nums",
                value: "[3,2,4]",
              },
              {
                index: 1,
                name: "target",
                value: "6",
              },
            ],
          },
          expectedOutput: "[1,2]",
        },
        {
          inputs: {
            create: [
              {
                index: 0,
                name: "nums",
                value: "[3,3]",
              },
              {
                index: 1,
                name: "target",
                value: "6",
              },
            ],
          },
          expectedOutput: "[0,1]",
        },
      ],
    },
  },
  {
    displayId: 1001,
    difficulty: "MEDIUM",
    isPublished: true,
    localizations: {
      create: [
        {
          locale: "en",
          type: "TITLE",
          content: "Add Two Numbers",
        },
        {
          locale: "zh",
          type: "TITLE",
          content: "两数相加",
        },
        {
          locale: "en",
          type: "DESCRIPTION",
          content: `You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

## Examples

### Example 1

![Example 1](https://assets.leetcode.com/uploads/2020/10/02/addtwonumber1.jpg)

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
        },
        {
          locale: "zh",
          type: "DESCRIPTION",
          content: `给定两个**非空**链表，它们表示两个非负整数。这些数字以**逆序**存储，并且每个节点包含一个数字。将这两个数字相加，并以链表形式返回它们的和。

你可以假设这两个数字除了数字 0 本身外，不包含任何前导零。 

## 示例

### 示例1

![示例1](https://assets.leetcode.com/uploads/2020/10/02/addtwonumber1.jpg)

\`\`\`shell
输入: l1 = [2,4,3], l2 = [5,6,4]
输出: [7,0,8]
解释: 342 + 465 = 807.
\`\`\`

### 示例2

\`\`\`shell
输入: l1 = [0], l2 = [0]
输出: [0]
\`\`\`

### 示例3

\`\`\`shell
输入: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
输出: [8,9,9,9,0,0,0,1]
\`\`\`

## 约束条件

<div align="center">
每个链表中的节点数范围是 e $[1, 100]$.
</div>

\`\`\`math
0 <= 节点值 <= 9
\`\`\`

<div align="center">
保证链表表示的数字无前导零。
</div>`,
        },
        {
          locale: "en",
          type: "SOLUTION",
          content: `## Approach 1: Elementary Math

### Intuition

Keep track of the carry using a variable and simulate digits-by-digits sum starting from the head of list, which contains the least-significant digit.

![Figure 1](https://leetcode.com/problems/add-two-numbers/Figures/2_add_two_numbers.svg)

*Figure 1. Visualization of the addition of two numbers: $342 + 465 = 807$.*

*Each node contains a single digit and the digits are stored in reverse order.*

### Algorithm

Just like how you would sum two numbers on a piece of paper, we begin by summing the least-significant digits, which is the head of $l1$ and $l2$. Since each digit is in the range of $0…9$, summing two digits may "overflow". For example $5 + 7 = 12$. In this case, we set the current digit to $2$ and bring over the $carry = 1$ to the next iteration. $carry$ must be either $0$ or $1$ because the largest possible sum of two digits (including the carry) is $9 + 9 + 1 = 19$.

The pseudocode is as following:

- Initialize current node to dummy head of the returning list.

- Initialize carry to $0$.

- Loop through lists $l1$ and $l2$ until you reach both ends and carry is $0$.

  - Set $x$ to node $l1$'s value. If $l1$ has reached the end of $l1$, set to $0$.

  - Set $y$ to node $l2$'s value. If $l2$ has reached the end of $l2$, set to $0$.

  - Set $sum = x + y + carry$.

  - Update $carry = sum/10$.

  - Create a new node with the digit value of ($sum$ $mod$ $10$) and set it to current node's next, then advance current node to next.

  - Advance both $l1$ and $l2$.

- Return dummy head's next node.

Note that we use a dummy head to simplify the code. Without a dummy head, you would have to write extra conditional statements to initialize the head's value.

Take extra caution of the following cases:

| Test case               | Explanation                                                                   |
| ----------------------- | ----------------------------------------------------------------------------- |
| l1=[0,1]<br/>l2=[0,1,2] | When one list is longer than the other.                                       |
| l1=[]<br/>l2=[0,1]      | When one list is null, which means an empty list.                             |
| l1=[9,9]<br/>l2=[1]     | The sum could have an extra carry of one at the end, which is easy to forget. |

### Implementation

\`\`\`c showLineNumbers
struct ListNode* addTwoNumbers(struct ListNode* l1, struct ListNode* l2) {
    struct ListNode* dummyHead = malloc(sizeof(struct ListNode));
    dummyHead->val = 0;
    dummyHead->next = NULL;
    struct ListNode* curr = dummyHead;
    int carry = 0;

    while (l1 != NULL || l2 != NULL || carry != 0) {
        int x = (l1 != NULL) ? l1->val : 0;
        int y = (l2 != NULL) ? l2->val : 0;
        int sum = carry + x + y;
        carry = sum / 10;

        curr->next = malloc(sizeof(struct ListNode));
        curr->next->val = sum % 10;
        curr->next->next = NULL;
        curr = curr->next;

        if (l1 != NULL) l1 = l1->next;
        if (l2 != NULL) l2 = l2->next;
    }

    struct ListNode* result = dummyHead->next;
    free(dummyHead);  // Free the memory allocated for dummyHead
    return result;
}
\`\`\`

### Complexity Analysis

- **Time complexity:** $O(max(m,n))$

  Assume that $m$ and $n$ represents the length of $l1$ and $l2$ respectively, the algorithm above iterates at most $max(m,n)$ times.

- **Space complexity:** $O(1)$

  The length of the new list is at most $max(m,n) + 1$ However, we don't count the answer as part of the space complexity.

### Follow up

What if the the digits in the linked list are stored in non-reversed order? For example:

$(3 → 4 → 2) + (4 → 6 → 5) = 8 → 0 → 7$`,
        },
        {
          locale: "zh",
          type: "SOLUTION",
          content: `## 方法 1：基础数学方法

### 思路

使用一个变量跟踪进位，并从链表头部（存储最低有效位）开始逐位模拟数字相加。

![Figure 1](https://leetcode.com/problems/add-two-numbers/Figures/2_add_two_numbers.svg)

*图 1. 两数相加的可视化过程： $342 + 465 = 807$.*

*每个节点包含一个数字，且数字按逆序存储*

### 算法

就像在纸上计算两数相加一样，我们从最低有效位（即 $l1$ 和 $l2$ 的头部）开始逐位相加。由于每个数字在 $0…9$ 范围内，两数相加可能会产生 “进位”。例如 $5 + 7 = 12$，此时当前位设为 $2$ ，并将进位 $carry = 1$ 带入下一次计算。进位 $carry$ 只能是 $0$ 或 $1$ ，因为两个数字（含进位）的最大和为 $9 + 9 + 1 = 19$.

伪代码如下：

- 初始化当前节点为返回链表的哑结点（dummy head）。

- 初始化进位 carry 为 $0$.

- 遍历链表 $l1$ 和 $l2$ ，直到两链表均遍历完毕且进位为 $0$.

  - 设 $x$ 为 $l1$ 当前节点的值，若 $l1$ 已遍历结束则设为 $0$.

  - 设 $y$ 为 $l2$ 当前节点的值，若 $l2$ 已遍历结束则设为 $0$.

  - 计算总和 $sum = x + y + carry$.

  - 更新进位 $carry = sum/10$.

  - 创建新节点，值为 $sum$ $mod$ $10$ ，连接到当前节点的下一个位置，并将当前节点后移。

  - 同时后移 $l1$ 和 $l2$ 指针（若未遍历结束）。

- 返回哑结点的下一个节点（即实际链表的头节点）。

说明：使用哑结点可简化代码逻辑。若无哑结点，需额外处理头节点的初始化条件。

需特别注意以下测试用例：

| 测试用例               | 说明                                                                   |
| ----------------------- | ----------------------------------------------------------------------------- |
| l1=[0,1]<br/>l2=[0,1,2] | 其中一个链表较长的情况。                                      |
| l1=[]<br/>l2=[0,1]      | 链表为空的情况（等价于数字0）。                             |
| l1=[9,9]<br/>l2=[1]     | 末尾相加后仍有进位的情况（易遗漏最终进位）。 |

### 实现

\`\`\`c showLineNumbers
struct ListNode* addTwoNumbers(struct ListNode* l1, struct ListNode* l2) {
    struct ListNode* dummyHead = malloc(sizeof(struct ListNode));
    dummyHead->val = 0;
    dummyHead->next = NULL;
    struct ListNode* curr = dummyHead;
    int carry = 0;

    while (l1 != NULL || l2 != NULL || carry != 0) {
        int x = (l1 != NULL) ? l1->val : 0;
        int y = (l2 != NULL) ? l2->val : 0;
        int sum = carry + x + y;
        carry = sum / 10;

        curr->next = malloc(sizeof(struct ListNode));
        curr->next->val = sum % 10;
        curr->next->next = NULL;
        curr = curr->next;

        if (l1 != NULL) l1 = l1->next;
        if (l2 != NULL) l2 = l2->next;
    }

    struct ListNode* result = dummyHead->next;
    free(dummyHead);  // 释放为哑结点（dummyHead）分配的内存。
    return result;
}
\`\`\`

### 复杂度分析

- **时间复杂度：** $O(max(m,n))$

  假设 $m$ 和 $n$ 分别表示链表 $l1$ 和 $l2$ 的长度，上述算法最多迭代 $max(m,n)$ 次。

- **空间复杂度：** $O(1)$

  新链表的长度最多为 $max(m,n) + 1$ ，但我们通常不将结果链表计入空间复杂度分析。

### 后续问题

如果链表中的数字以非逆序（正序）存储，该如何处理？例如：

$(3 → 4 → 2) + (4 → 6 → 5) = 8 → 0 → 7$`,
        },
      ],
    },
    templates: {
      create: [
        {
          language: "c",
          content: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct ListNode {
  int val;
  struct ListNode *next;
};

struct ListNode *addTwoNumbers(struct ListNode *l1, struct ListNode *l2) {
  
}

struct ListNode *parseList(char *line) {
  line[strcspn(line, "\\n")] = 0;
  char *p = line;
  while (*p && (*p == '[' || *p == ' ' || *p == ']'))
    p++;

  struct ListNode dummy;
  struct ListNode *cur = &dummy;
  dummy.next = NULL;

  char *token = strtok(p, ",");
  while (token) {
    struct ListNode *node = malloc(sizeof(struct ListNode));
    node->val = atoi(token);
    node->next = NULL;
    cur->next = node;
    cur = node;
    token = strtok(NULL, ",");
  }

  return dummy.next;
}

void printList(struct ListNode *head) {
  printf("[");
  while (head) {
    printf("%d", head->val);
    head = head->next;
    if (head)
      printf(",");
  }
  printf("]\\n");
}

void freeList(struct ListNode *head) {
  while (head) {
    struct ListNode *tmp = head;
    head = head->next;
    free(tmp);
  }
}

int main() {
  char line[1024];
  while (fgets(line, sizeof(line), stdin)) {
    struct ListNode *l1 = parseList(line);
    if (!fgets(line, sizeof(line), stdin))
      break;
    struct ListNode *l2 = parseList(line);

    struct ListNode *result = addTwoNumbers(l1, l2);
    printList(result);

    freeList(l1);
    freeList(l2);
    freeList(result);
  }
  return 0;
}`,
        },
        {
          language: "cpp",
          content: `#include <algorithm>
#include <iostream>
#include <sstream>
#include <string>

using namespace std;

struct ListNode {
  int val;
  ListNode *next;
  ListNode() : val(0), next(nullptr) {}
  ListNode(int x) : val(x), next(nullptr) {}
  ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
  ListNode *addTwoNumbers(ListNode *l1, ListNode *l2) {
    
  }
};

ListNode *createList(const string &line) {
  ListNode dummy;
  ListNode *tail = &dummy;
  dummy.next = nullptr;

  string nums = line;
  nums.erase(remove(nums.begin(), nums.end(), '['), nums.end());
  nums.erase(remove(nums.begin(), nums.end(), ']'), nums.end());

  stringstream ss(nums);
  string token;
  while (getline(ss, token, ',')) {
    if (!token.empty()) {
      int val = stoi(token);
      tail->next = new ListNode(val);
      tail = tail->next;
    }
  }

  return dummy.next;
}

void printList(ListNode *head) {
  cout << "[";
  while (head) {
    cout << head->val;
    if (head->next)
      cout << ",";
    head = head->next;
  }
  cout << "]" << endl;
}

void freeList(ListNode *head) {
  while (head) {
    ListNode *tmp = head;
    head = head->next;
    delete tmp;
  }
}

int main() {
  string line;
  while (getline(cin, line)) {
    ListNode *l1 = createList(line);
    if (!getline(cin, line))
      break;
    ListNode *l2 = createList(line);

    Solution sol;
    ListNode *res = sol.addTwoNumbers(l1, l2);
    printList(res);

    freeList(l1);
    freeList(l2);
    freeList(res);
  }
  return 0;
}`,
        },
      ],
    },
    testcases: {
      create: [
        {
          inputs: {
            create: [
              {
                index: 0,
                name: "l1",
                value: "[2,4,3]",
              },
              {
                index: 1,
                name: "l2",
                value: "[5,6,4]",
              },
            ],
          },
          expectedOutput: "[7,0,8]",
        },
        {
          inputs: {
            create: [
              {
                index: 0,
                name: "l1",
                value: "[0]",
              },
              {
                index: 1,
                name: "l2",
                value: "[0]",
              },
            ],
          },
          expectedOutput: "[0]",
        },
        {
          inputs: {
            create: [
              {
                index: 0,
                name: "l1",
                value: "[9,9,9,9,9,9,9]",
              },
              {
                index: 1,
                name: "l2",
                value: "[9,9,9,9]",
              },
            ],
          },
          expectedOutput: "[8,9,9,9,0,0,0,1]",
        },
      ],
    },
  },
  {
    displayId: 1002,
    difficulty: "HARD",
    isPublished: true,
    localizations: {
      create: [
        {
          locale: "en",
          type: "TITLE",
          content: "Median of Two Sorted Arrays",
        },
        {
          locale: "zh",
          type: "TITLE",
          content: "寻找两个正序数组的中位数",
        },
        {
          locale: "en",
          type: "DESCRIPTION",
          content: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return **the median** of the two sorted arrays.

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
        },
        {
          locale: "zh",
          type: "DESCRIPTION",
          content: `给定两个大小分别为 \`nums1\` 和 \`nums2\` 的有序数组 \`m\` 和 \`n\` ，请返回这两个有序数组的**中位数**。

要求整体时间复杂度为 $O(log(m+n))$.

## 示例

### 示例 1

\`\`\`shell
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.
\`\`\`

### 示例 2

\`\`\`shell
Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.50000
Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.
\`\`\`

## 约束条件

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
        },
        {
          locale: "en",
          type: "SOLUTION",
          content: `## Approach 1: Merge Sort

### Intuition

Let's start with the straightforward approach. If we put the elements of two arrays in one array \`A\` and arrange them in order. Assume the merged arrays has a length of \`n\`, then the median is:

- \`A[n / 2]\`, if \`n\` is odd.

- The average of \`A[n / 2]\` and \`A[n / 2 + 1]\`, if \`n\` is even.

However, we do not really need to merge and sort these arrays. Note that both arrays are already sorted, so the smallest element is either the first element of \`nums1\` or the first element of \`nums2\`. Therefore, we can set two pointers \`p1\` and \`p2\` at the start of each array, then we can get the smallest element from the \`nums1\` and \`nums2\` by comparing the values \`nums1[p1]\` and \`nums2[p2]\`.

Please refer to the following slide as an example:

### Algorithm

1. Get the total size of two arrays \`m + n\`

  - If \`m + n\` is odd, we are looking for the \`(m + n) / 2\` -th element.

  - If \`m + n\` is even, we are looking for the average of the \`(m + n) / 2\` -th and the \`(m + n) / 2 + 1\` -th elements.

2. Set two pointers \`p1\` and \`p2\` at the beginning of arrays \`nums1\` and \`nums2\`.

3. If both \`p1\` and \`p2\` are in bounds of the arrays, compare the values at \`p1\` and \`p2\`:

  - If \`nums1[p1]\` is smaller than \`nums2[p2]\`, we move \`p1\` one place to the right.

  - Otherwise, we move \`p2\` one place to the right.

  If \`p1\` is outside \`nums1\`, just move \`p2\` one place to the right.

  If \`p2\` is outside \`nums2\`, just move \`p1\` one place to the right.

4. Get the target elements and calculate the median:

  - If \`m + n\` is odd, repeat step 3 by \`(m + n + 1) / 2\` times and return the element from the last step.

  - If \`m + n\` is even, repeat step 3 by \`(m + n) / 2 + 1\` times and return the average of the elements from the last two steps.

### Implementation

\`\`\`c showLineNumbers
double findMedianSortedArrays(int* nums1, int nums1Size, int* nums2, int nums2Size) {
    int m = nums1Size, n = nums2Size;
    int p1 = 0, p2 = 0;

    int getMin() {
        if (p1 < m && p2 < n) {
            return nums1[p1] < nums2[p2] ? nums1[p1++] : nums2[p2++];
        } else if (p1 < m) {
            return nums1[p1++];
        } else if (p2 < n) {
            return nums2[p2++];
        }
        return -1;
    }

    double median;
    if ((m + n) % 2 == 0) {
        for (int i = 0; i < ((m + n) / 2) - 1; ++i) {
            int temp = getMin();
        }
        median = (getMin() + getMin()) / 2.0;
    } else {
        for (int i = 0; i < (m + n) / 2; ++i) {
            int temp = getMin();
        }
        median = getMin();
    }

    return median;
}
\`\`\`

### Complexity Analysis

Let $m$ be the size of array \`nums1\` and $n$ be the size of array \`nums2\`.

- **Time complexity:** $O(m + n)$

  - We get the smallest element by comparing two values at \`p1\` and \`p2\`, it takes $O(1)$ to compare two elements and move the corresponding pointer to the right.

  - We need to traverse half of the arrays before reaching the median element(s).

  - To sum up, the time complexity is $O(m + n)$.

- **Space complexity:** $O(1)$

  - We only need to maintain two pointers \`p1\` and \`p2\`.`,
        },
        {
          locale: "zh",
          type: "SOLUTION",
          content: `## 方法 1: 归并排序思路

### 思路

我们从最直接的方法开始思考。如果将两个数组合并成一个数组 \`A\` 并排序，假设合并后数组的长度为 \`n\`，那么中位数为：

- 当 n 为奇数时，中位数是 \`A[n / 2]\`。

- 当 n 为偶数时，中位数是 \`A[n / 2]\` 和 \`A[n / 2 + 1]\` 的平均值。

不过，我们实际上不需要真正合并和排序数组。注意到两个数组已经是有序的，因此最小的元素一定是 \`nums1\` 或  \`nums2\`。 因此，我们可以设置两个指针 \`p1\` 和 \`p2\` 分别指向两个数组的起始位置，通过比较 \`nums1[p1]\` 和 \`nums2[p2]\`的值来逐步获取合并后的有序元素。

以下面的示例流程为例（可参考对应图示）：

### 算法

1. 计算两个数组的总长度 \`m + n\`

  - 若 \`m + n\` 为奇数，我们需要找到第 \`(m + n) / 2\` 个元素（从 0 开始计数）。

  - 若 \`m + n\` 为偶数，我们需要找到第 \`(m + n) / 2\` 个和第 \`(m + n) / 2 + 1\` 个元素的平均值。

2. 初始化指针 \`p1\` = 0（指向 \`nums1\` 起始）和 \`p2\` = 0（指向 \`nums2\` 起始）。

3. 如果 \`p1\` 和 \`p2\` 都在数组的有效范围内（即未越界），则比较 \`p1\` 和 \`p2\`所指位置的值：

  - 如果 \`nums1[p1]\` 小于 \`nums2[p2]\`，则将 \`p1\` 向右移动一位。

  - 否则，将 \`p2\` 向右移动一位。

  如果 \`p1\` 超出 \`nums1\`的范围，则直接将 \`p2\` 向右移动一位。

  如果 \`p2\` 超出 \`nums2\`的范围，则直接将 \`p1\` 向右移动一位。

4. 获取目标元素并计算中位数：

  - 若 \`m + n\` 为奇数，重复步骤 \`3 (m + n + 1) / 2\` 次（每次移动指针对应获取一个元素），最后一次步骤中得到的元素即为中位数。
  - 若 \`m + n\` 为偶数，重复步骤 \`3 (m + n) / 2 + 1\` 次，取最后两次步骤中得到的元素，计算它们的平均值作为中位数。

### 实现

\`\`\`c showLineNumbers
double findMedianSortedArrays(int* nums1, int nums1Size, int* nums2, int nums2Size) {
    int m = nums1Size, n = nums2Size;
    int p1 = 0, p2 = 0;

    int getMin() {
        if (p1 < m && p2 < n) {
            return nums1[p1] < nums2[p2] ? nums1[p1++] : nums2[p2++];
        } else if (p1 < m) {
            return nums1[p1++];
        } else if (p2 < n) {
            return nums2[p2++];
        }
        return -1;
    }

    double median;
    if ((m + n) % 2 == 0) {
        for (int i = 0; i < ((m + n) / 2) - 1; ++i) {
            int temp = getMin();
        }
        median = (getMin() + getMin()) / 2.0;
    } else {
        for (int i = 0; i < (m + n) / 2; ++i) {
            int temp = getMin();
        }
        median = getMin();
    }

    return median;
}
\`\`\`

### 复杂度分析

设数组 \`nums1\` 的长度为 $m$ ，数组 \`nums2\` 的长度为 $n$ 。

- **时间复杂度：** $O(m + n)$

  - 我们通过比较 \`p1\` 和 \`p2\`指向的两个元素来获取当前最小元素，每次比较和移动指针的时间为 $O(1)$ 。

  - 在找到中位数元素（或元素对）之前，需要遍历两个数组中最多一半的元素。

  - 综上，总时间复杂度为 $O(m + n)$.

- **空间复杂度：** $O(1)$

  - 仅需维护两个指针 \`p1\` 和 \`p2\` ，无需额外线性空间。`,
        },
      ],
    },
    templates: {
      create: [
        {
          language: "c",
          content: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

double findMedianSortedArrays(int* nums1, int nums1Size, int* nums2, int nums2Size) {
  
}

int *parseIntArray(char *line, int *len) {
  line[strcspn(line, "\\n")] = 0;
  char *p = line;
  while (*p && (*p == '[' || *p == ' ' || *p == ']'))
    p++;

  int capacity = 10;
  int *arr = malloc(capacity * sizeof(int));
  *len = 0;

  char *token = strtok(p, ",");
  while (token) {
    if (*len >= capacity) {
      capacity *= 2;
      arr = realloc(arr, capacity * sizeof(int));
    }
    arr[(*len)++] = atoi(token);
    token = strtok(NULL, ",");
  }
  return arr;
}

int main() {
  char line[1024];

  while (fgets(line, sizeof(line), stdin)) {
    int nums1Size;
    int *nums1 = parseIntArray(line, &nums1Size);

    if (!fgets(line, sizeof(line), stdin))
      break;
    int nums2Size;
    int *nums2 = parseIntArray(line, &nums2Size);

    double result = findMedianSortedArrays(nums1, nums1Size, nums2, nums2Size);
    printf("%.5f\\n", result);

    free(nums1);
    free(nums2);
  }

  return 0;
}`,
        },
        {
          language: "cpp",
          content: `#include <iostream>
#include <sstream>
#include <string>
#include <vector>

using namespace std;

class Solution {
public:
  double findMedianSortedArrays(vector<int> &nums1, vector<int> &nums2) {
    
  }
};

vector<int> parseVector(const string &line) {
  vector<int> result;
  stringstream ss(line);
  char c;
  int num;
  while (ss >> c) {
    if (isdigit(c) || c == '-' || c == '+') {
      ss.putback(c);
      ss >> num;
      result.push_back(num);
    }
  }
  return result;
}

int main() {
  string line;
  while (getline(cin, line)) {
    vector<int> nums1 = parseVector(line);

    if (!getline(cin, line))
      break;
    vector<int> nums2 = parseVector(line);

    Solution sol;
    double result = sol.findMedianSortedArrays(nums1, nums2);
    printf("%.5f\\n", result);
  }
  return 0;
}`,
        },
      ],
    },
    testcases: {
      create: [
        {
          inputs: {
            create: [
              {
                index: 0,
                name: "nums1",
                value: "[1,3]",
              },
              {
                index: 1,
                name: "nums2",
                value: "[2]",
              },
            ],
          },
          expectedOutput: "2.00000",
        },
        {
          inputs: {
            create: [
              {
                index: 0,
                name: "nums1",
                value: "[1,2]",
              },
              {
                index: 1,
                name: "nums2",
                value: "[3,4]",
              },
            ],
          },
          expectedOutput: "2.50000",
        },
      ],
    },
  },
];

export async function main() {
  for (const dockerConfig of dockerConfigData) {
    await prisma.dockerConfig.create({
      data: dockerConfig,
    });
  }

  for (const languageServerConfig of languageServerConfigData) {
    await prisma.languageServerConfig.create({
      data: languageServerConfig,
    });
  }

  for (const problem of problemData) {
    await prisma.problem.create({
      data: problem,
    });
  }
}

main();
