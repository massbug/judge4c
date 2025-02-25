export const DEFAULT_PROBLEM_SOLUTION = `

# Solution Article: Two Sum Problem

This article explores different approaches to solve the "Two Sum" problem, ranging from a straightforward brute-force method to more efficient hash table based solutions.

## Approach 1: Brute Force

### Intuition

The most intuitive approach is to check every possible pair of numbers in the input array \`nums\`.  For each number, we iterate through the rest of the array to find its complement that sums up to the \`target\`.

### Algorithm

1.  Iterate through the \`nums\` array with index \`i\` from 0 to \`numsSize - 1\`.
2.  For each element \`nums[i]\`, iterate through the rest of the array with index \`j\` from \`i + 1\` to \`numsSize - 1\`.
3.  Check if the sum of \`nums[i] + nums[j]\` equals the \`target\`.
4.  If the sum equals the \`target\`, return the indices \`[i, j]\`.

### Implementation

\`\`\`c showLineNumbers title="Brute Force Implementation in C" caption="Simple nested loop approach." {2-3} {8,14} /target - nums[i]/
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

-   **Time complexity: O(n^2)**. The nested loops result in a quadratic time complexity because, in the worst case, we compare each number with every other number in the array.
-   **Space complexity: O(1)**.  The algorithm uses a constant amount of extra space, regardless of the input size.

---

## Approach 2: Two-pass Hash Table

### Intuition

To optimize the runtime, we can use a hash table to reduce the lookup time for the complement.  Instead of iterating through the rest of the array to find the complement, we can check for its existence in the hash table in near-constant time on average.

### Algorithm

1.  Create an empty hash table.
2.  **First pass:** Iterate through the \`nums\` array and insert each element's value as the key and its index as the value into the hash table.
3.  **Second pass:** Iterate through the \`nums\` array again. For each element \`nums[i]\`, calculate its complement \`complement = target - nums[i]\`.
4.  Check if the \`complement\` exists as a key in the hash table.
5.  If the \`complement\` exists and its index in the hash table is not equal to \`i\` (to avoid using the same element twice), return the indices \`[i, index of complement from hash table]\`.

### Implementation

\`\`\`c showLineNumbers title="Two-pass Hash Table Implementation in C" caption="Using a hash table for faster lookups." {4-8} {22,27,35} /hashTable/ /HASH_ADD_INT/ /HASH_FIND_INT/ /HASH_DEL/ /HASH_ITER/
#include "uthash.h" // Assuming uthash.h is included for hash table implementation

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    struct hashTable {
        int key;
        int value;
        UT_hash_handle hh;
    } *hashTable = NULL, *item, *tmpItem;

    // First pass: Populate hash table
    for (int i = 0; i < numsSize; i++) {
        item = malloc(sizeof(struct hashTable));
        item->key = nums[i];
        item->value = i;
        HASH_ADD_INT(hashTable, key, item);
    }

    // Second pass: Find complement
    for (int i = 0; i < numsSize; i++) {
        int complement = target - nums[i];
        HASH_FIND_INT(hashTable, &complement, item);
        if (item && item->value != i) { // Ensure not using the same element twice (though problem guarantees only one solution, and using same index is avoided by algorithm logic anyway)
            int* result = malloc(sizeof(int) * 2);
            result[0] = i;
            result[1] = item->value;
            *returnSize = 2;
            HASH_ITER(hh, hashTable, item, tmpItem) { // Free hash table
                HASH_DEL(hashTable, item);
                free(item);
            }
            return result;
        }
    }

    HASH_ITER(hh, hashTable, item, tmpItem) { // Free hash table if no solution found (though should not happen as per problem constraints)
        HASH_DEL(hashTable, item);
        free(item);
    }
    *returnSize = 0;
    return malloc(sizeof(int) * 0);
}
\`\`\`

### Complexity Analysis

-   **Time complexity: O(n)**.  We iterate through the array twice. Hash table operations (insertion and lookup) take O(1) time on average.
-   **Space complexity: O(n)**. We use a hash table to store at most \`n\` elements, resulting in linear space complexity.

---

## Approach 3: One-pass Hash Table

### Intuition

We can optimize the two-pass hash table approach into a single pass.  While iterating through the array, for each number, we immediately check if its complement already exists in the hash table. If it does, we have found the pair.  If not, we add the current number to the hash table for future lookups.

### Algorithm

1.  Create an empty hash table.
2.  Iterate through the \`nums\` array with index \`i\` from 0 to \`numsSize - 1\`.
3.  For each element \`nums[i]\`, calculate its complement \`complement = target - nums[i]\`.
4.  Check if the \`complement\` exists as a key in the hash table.
5.  If the \`complement\` exists in the hash table, return the indices \`[index of complement from hash table, i]\`.
6.  If the \`complement\` does not exist, add the current element \`nums[i]\` as the key and its index \`i\` as the value to the hash table.

### Implementation

\`\`\`c showLineNumbers title="One-pass Hash Table Implementation in C" caption="Efficient single-pass solution." {4-8} {15-16,18,28-29} /hashTable/ /HASH_ADD_INT/ /HASH_FIND_INT/ /HASH_CLEAR/
#include "uthash.h" // Assuming uthash.h is included for hash table implementation

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
            result[0] = item->value; // Index of complement (which was added earlier)
            result[1] = i;          // Current index
            *returnSize = 2;
            HASH_CLEAR(hh, hashTable);  // Free hash table
            return result;
        } else {
            item = malloc(sizeof(struct hashTable));
            item->key = nums[i];
            item->value = i;
            HASH_ADD_INT(hashTable, key, item);
        }
    }
    *returnSize = 0;
    HASH_CLEAR(hh, hashTable);  // Free hash table if no solution found (though should not happen)
    return malloc(0); // Allocate 0 bytes - indicates no solution
}
\`\`\`

### Complexity Analysis

-   **Time complexity: O(n)**. We iterate through the array only once. Hash table operations are O(1) on average.
-   **Space complexity: O(n)**.  Similar to the two-pass approach, we use a hash table that can store up to \`n\` elements.

---

## Summary of Approaches

| Approach            | Time Complexity | Space Complexity |
| ------------------- | --------------- | ---------------- |
| Brute Force         | O(n^2)          | O(1)             |
| Two-pass Hash Table | O(n)            | O(n)             |
| One-pass Hash Table | O(n)            | O(n)             |

`;
