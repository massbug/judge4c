import { SupportedLanguage } from "@/constants/language";

export const DEFAULT_EDITOR_VALUE: Record<SupportedLanguage, string> = {
  c: `/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    
}`,
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
};
