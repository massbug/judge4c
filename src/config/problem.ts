export const DEFAULT_PROBLEM = `

# Two Sum

## Problem Description

Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

### Example 1

\`\`\`sh
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

### Example 2

\`\`\`sh
Input: nums = [3,2,4], target = 6
Output: [1,2]
Explanation: Because nums[1] + nums[2] == 6, we return [1, 2].
\`\`\`

### Example 3

\`\`\`sh
Input: nums = [3,3], target = 6
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 6, we return [0, 1].
\`\`\`

## Solution Approach

Use a hash table to store each number and its corresponding index. Then, iterate through the array, and for each number, check if \`target - num\` exists in the hash table.

## C Language Code

\`\`\`c showLineNumbers title="Two Sum" caption="Example Code" {4-8,40-43} {22} {29,32,33} /target - nums/
#include <stdio.h>
#include <stdlib.h>

// Define Hash Table structure
typedef struct {
    int key;
    int value;
} HashTable;

// Hash Table insert function
void insert(HashTable *table, int key, int value) {
    // Simplified handling, assuming no collisions
    table[key].key = key;
    table[key].value = value;
}

// Hash Table search function
int search(HashTable *table, int key) {
    if (table[key].key == key) {
        return table[key].value;
    }
    return -1; // Not found
}

// Two Sum function
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    HashTable *table = (HashTable *)malloc(sizeof(HashTable) * 1024); // Assume a small range of array elements
    *returnSize = 2;
    int *result = (int *)malloc(sizeof(int) * (*returnSize));

    // Build the Hash Table
    for (int i = 0; i < numsSize; i++) {
        insert(table, nums[i], i);
    }

    // Find the two numbers that meet the criteria
    for (int i = 0; i < numsSize; i++) {
        int complement = target - nums[i];
        int index = search(table, complement);
        if (index != -1 && index != i) { // Found two numbers that meet the criteria
            result[0] = i;
            result[1] = index;
            break;
        }
    }

    free(table);
    return result;
}

int main() {
    int nums[] = {2, 7, 11, 15};
    int numsSize = sizeof(nums) // sizeof(nums[0]);
    int target = 9;
    int returnSize;
    int *result = twoSum(nums, numsSize, target, &returnSize);

    printf("Result: [%d, %d]\\n", result[0], result[1]);

    free(result);
    return 0;
}
\`\`\`

## Code Comment Highlighting

- Line 29: \`if (index != -1 && index != i)\`, highlighted to emphasize that the two numbers found cannot be the same number.
- Line 32: \`result[0] = i;\`, highlighted to indicate that the index of the first number is stored in the result array.
- Line 33: \`result[1] = index;\`, highlighted to indicate that the index of the second number is stored in the result array.

## Task List

- [x] Complete problem description
- [ ] Complete solution approach
- [x] Complete C language code
- [ ] Add code comment highlighting
- [x] Add example code and results

## Table

|  **Language**  |  **LSP Server**  |  **Port**  |
|----------------|------------------|------------|
| \`C\`          | \`clangd\`       | \`4594\`   |
| \`C++\`        | \`clangd\`       | \`4595\`   |

## ANSI Highlighting

\`\`\`ansi
[0;31mHelloWorld.java:3: error: ';' expected[0m
  System.out.println("Hello, World!")
[0;31m                                      ^[0m
[0;31m1 error[0m
\`\`\`

## Inline Code

- Regular inline code: \`int x = 10;\`
- Highlighted inline code: \`int x = 10;{:c}\`

`
