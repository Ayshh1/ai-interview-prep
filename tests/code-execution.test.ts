import { describe, it, expect } from 'vitest';

// Code execution utilities
const executeJavaScript = (code: string): { success: boolean; result?: any; error?: string } => {
  try {
    // Create a safe execution context
    const func = new Function('return ' + code);
    const result = func();
    return { success: true, result };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { success: false, error: `SyntaxError: ${error.message}` };
    }
    return { success: false, error: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
};

const validateAndExecute = (code: string, language: string): { success: boolean; result?: any; error?: string } => {
  switch (language) {
    case 'javascript':
    case 'typescript':
      return executeJavaScript(code);
    
    case 'python':
      // For Python, we can only validate syntax patterns
      return validatePythonSyntax(code);
    
    case 'java':
      return validateJavaSyntax(code);
    
    case 'csharp':
      return validateCSharpSyntax(code);
    
    default:
      return { success: false, error: 'Unsupported language' };
  }
};

const validatePythonSyntax = (code: string): { success: boolean; result?: any; error?: string } => {
  // Basic Python syntax validation
  if (code.match(/def\s+\w+\s*\([^)]*\)\s*:/)) {
    if (!code.match(/def\s+\w+\s*\([^)]*\)\s*:.*\n(\s+.+|\s*$)/s)) {
      return { success: false, error: 'SyntaxError: Function body is missing or incomplete' };
    }
  }
  if (code.match(/:\s*$/)) {
    return { success: false, error: 'SyntaxError: Incomplete block statement' };
  }
  return { success: true };
};

const validateJavaSyntax = (code: string): { success: boolean; result?: any; error?: string } => {
  if (code.match(/public\s+\w+\s+\w+\s*\([^)]*\)\s*\{[^}]*$/)) {
    return { success: false, error: 'SyntaxError: Unclosed method brace' };
  }
  if (code.match(/class\s+\w+\s*\{[^}]*$/)) {
    return { success: false, error: 'SyntaxError: Unclosed class brace' };
  }
  return { success: true };
};

const validateCSharpSyntax = (code: string): { success: boolean; result?: any; error?: string } => {
  if (code.match(/public\s+\w+\s+\w+\s*\([^)]*\)\s*\{[^}]*$/)) {
    return { success: false, error: 'SyntaxError: Unclosed method brace' };
  }
  return { success: true };
};

describe('Code Execution Tests', () => {
  describe('JavaScript Execution', () => {
    it('should execute valid JavaScript code successfully', () => {
      const validCode = `
        (function() {
          function twoSum(nums, target) {
            for (let i = 0; i < nums.length; i++) {
              for (let j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] === target) {
                  return [i, j];
                }
              }
            }
            return [];
          }
          return twoSum([2, 7, 11, 15], 9);
        })()
      `;
      
      const result = executeJavaScript(validCode);
      expect(result.success).toBe(true);
      expect(result.result).toEqual([0, 1]);
    });

    it('should throw SyntaxError for invalid JavaScript syntax', () => {
      const invalidCode = `
        (function() {
          function test() {
            console.log((1 + 2);
          // Missing closing brace
        })()
      `;
      
      const result = executeJavaScript(invalidCode);
      expect(result.success).toBe(false);
      expect(result.error).toContain('SyntaxError');
    });

    it('should throw SyntaxError for unclosed parentheses', () => {
      const invalidCode = `
        (function() {
          console.log((1 + 2);
        })()
      `;
      
      const result = executeJavaScript(invalidCode);
      expect(result.success).toBe(false);
      expect(result.error).toContain('SyntaxError');
    });

    it('should throw SyntaxError for unclosed brackets', () => {
      const invalidCode = `
        (function() {
          const arr = [1, 2, 3;
          return arr;
        })()
      `;
      
      const result = executeJavaScript(invalidCode);
      expect(result.success).toBe(false);
      expect(result.error).toContain('SyntaxError');
    });

    it('should throw SyntaxError for invalid function declaration', () => {
      const invalidCode = `
        (function() {
          function test( {
            return 1;
          }
          return test();
        })()
      `;
      
      const result = executeJavaScript(invalidCode);
      expect(result.success).toBe(false);
      expect(result.error).toContain('SyntaxError');
    });

    it('should handle complex JavaScript algorithms', () => {
      const complexCode = `
        (function() {
          function isValidParentheses(s) {
            const stack = [];
            const pairs = { '(': ')', '[': ']', '{': '}' };
            
            for (let char of s) {
              if (Object.keys(pairs).includes(char)) {
                stack.push(char);
              } else if (Object.values(pairs).includes(char)) {
                if (stack.length === 0 || pairs[stack.pop()] !== char) {
                  return false;
                }
              }
            }
            return stack.length === 0;
          }
          
          return isValidParentheses("()[]{}");
        })()
      `;
      
      const result = executeJavaScript(complexCode);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });
  });

  describe('Python Syntax Validation', () => {
    it('should validate correct Python syntax', () => {
      const validCode = `
def two_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []
      `;
      
      const result = validatePythonSyntax(validCode);
      expect(result.success).toBe(true);
    });

    it('should detect Python syntax errors', () => {
      const invalidCode = `
def two_sum(nums, target):
    for i in range(len(nums)):
        if nums[i] + nums[j] == target:
      `;
      
      const result = validatePythonSyntax(invalidCode);
      expect(result.success).toBe(false);
      expect(result.error).toContain('SyntaxError');
    });

    it('should detect incomplete function definition', () => {
      const invalidCode = `def test():`;
      
      const result = validatePythonSyntax(invalidCode);
      expect(result.success).toBe(false);
      expect(result.error).toContain('SyntaxError');
    });
  });

  describe('Java Syntax Validation', () => {
    it('should validate correct Java syntax', () => {
      const validCode = `
public class Solution {
    public int[] twoSum(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[0];
    }
}
      `;
      
      const result = validateJavaSyntax(validCode);
      expect(result.success).toBe(true);
    });

    it('should detect Java syntax errors', () => {
      const invalidCode = `
public class Solution {
    public int[] twoSum(int[] nums, int target) {
        return new int[]{i, j};
    // Missing closing brace
      `;
      
      const result = validateJavaSyntax(invalidCode);
      expect(result.success).toBe(false);
      expect(result.error).toContain('SyntaxError');
    });
  });

  describe('C# Syntax Validation', () => {
    it('should validate correct C# syntax', () => {
      const validCode = `
public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        for (int i = 0; i < nums.Length; i++) {
            for (int j = i + 1; j < nums.Length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[0];
    }
}
      `;
      
      const result = validateCSharpSyntax(validCode);
      expect(result.success).toBe(true);
    });

    it('should detect C# syntax errors', () => {
      const invalidCode = `
public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        return new int[]{i, j};
    // Missing closing brace
      `;
      
      const result = validateCSharpSyntax(invalidCode);
      expect(result.success).toBe(false);
      expect(result.error).toContain('SyntaxError');
    });
  });
});

describe('Build Failure Tests', () => {
  it('should fail build when syntax errors are present in any language', () => {
    const testCases = [
      {
        language: 'javascript',
        code: `function test() { console.log((1 + 2);`,
        expectedError: 'SyntaxError'
      },
      {
        language: 'python',
        code: `def test():`,
        expectedError: 'SyntaxError'
      },
      {
        language: 'java',
        code: `public class Test { public void method() {`,
        expectedError: 'SyntaxError'
      },
      {
        language: 'csharp',
        code: `public class Test { public void Method() {`,
        expectedError: 'SyntaxError'
      }
    ];
    
    testCases.forEach(({ language, code, expectedError }) => {
      const result = validateAndExecute(code, language);
      expect(result.success).toBe(false);
      expect(result.error).toContain(expectedError);
    });
  });

  it('should pass build when all syntax is valid', () => {
    const testCases = [
      {
        language: 'javascript',
        code: `(function() { return (1 + 2); })()`
      },
      {
        language: 'python',
        code: `def test():\n    return (1 + 2)`
      },
      {
        language: 'java',
        code: `public class Test { public int method() { return (1 + 2); } }`
      },
      {
        language: 'csharp',
        code: `public class Test { public int Method() { return (1 + 2); } }`
      }
    ];
    
    testCases.forEach(({ language, code }) => {
      const result = validateAndExecute(code, language);
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});

describe('Real Algorithm Tests', () => {
  describe('Two Sum Algorithm', () => {
    it('should execute Two Sum solution correctly', () => {
      const twoSumCode = `
        (function() {
          function twoSum(nums, target) {
            const map = new Map();
            for (let i = 0; i < nums.length; i++) {
              const complement = target - nums[i];
              if (map.has(complement)) {
                return [map.get(complement), i];
              }
              map.set(nums[i], i);
            }
            return [];
          }
          
          const testCases = [
            { nums: [2, 7, 11, 15], target: 9, expected: [0, 1] },
            { nums: [3, 2, 4], target: 6, expected: [1, 2] },
            { nums: [3, 3], target: 6, expected: [0, 1] }
          ];
          
          const results = testCases.map(test => ({
            input: { nums: test.nums, target: test.target },
            result: twoSum(test.nums, test.target),
            expected: test.expected
          }));
          
          return results.every(r => 
            JSON.stringify(r.result) === JSON.stringify(r.expected)
          );
        })()
      `;
      
      const result = executeJavaScript(twoSumCode);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });
  });

  describe('Valid Parentheses Algorithm', () => {
    it('should execute Valid Parentheses solution correctly', () => {
      const validParenthesesCode = `
        (function() {
          function isValid(s) {
            const stack = [];
            const pairs = { '(': ')', '[': ']', '{': '}' };
            
            for (const char of s) {
              if (Object.keys(pairs).includes(char)) {
                stack.push(char);
              } else if (Object.values(pairs).includes(char)) {
                if (stack.length === 0 || pairs[stack.pop()] !== char) {
                  return false;
                }
              }
            }
            return stack.length === 0;
          }
          
          const testCases = [
            { input: "()", expected: true },
            { input: "()[]{}", expected: true },
            { input: "(]", expected: false },
            { input: "([)]", expected: false },
            { input: "{[]}", expected: true }
          ];
          
          const results = testCases.map(test => ({
            input: test.input,
            result: isValid(test.input),
            expected: test.expected
          }));
          
          return results.every(r => r.result === r.expected);
        })()
      `;
      
      const result = executeJavaScript(validParenthesesCode);
      expect(result.success).toBe(true);
      expect(result.result).toBe(true);
    });
  });
});
