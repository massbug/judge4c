import { EditorLanguage } from "@prisma/client";

export const TEMP_DEFAULT_EDITOR_VALUE: Record<EditorLanguage, string> = {
    [EditorLanguage.c]: `/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    
}`,
    [EditorLanguage.cpp]: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
};
