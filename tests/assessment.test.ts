import { describe, it, expect, beforeEach } from 'vitest';

// Mock the assessment functions for testing
const validateSyntax = (code: string, language: string): { isValid: boolean; error?: string } => {
  try {
    switch (language) {
      case 'javascript':
      case 'typescript':
        // Basic JS/TS syntax validation
        if (code.match(/function\s+\w+\s*\([^)]*\)\s*\{[^}]*$/)) {
          return { isValid: false, error: 'Unclosed function brace' };
        }
        if (code.match(/\{\s*$/)) {
          return { isValid: false, error: 'Unclosed brace' };
        }
        if (code.match(/\[[^\]]*$/)) {
          return { isValid: false, error: 'Unclosed bracket' };
        }
        if ((code.match(/\(/g) || []).length !== (code.match(/\)/g) || []).length) {
          return { isValid: false, error: 'Unmatched parentheses' };
        }
        if ((code.match(/\[/g) || []).length !== (code.match(/\]/g) || []).length) {
          return { isValid: false, error: 'Unmatched brackets' };
        }
        if ((code.match(/\{/g) || []).length !== (code.match(/\}/g) || []).length) {
          return { isValid: false, error: 'Unmatched braces' };
        }
        break;
        
      case 'python':
        // Basic Python syntax validation
        if (code.match(/def\s+\w+\s*\([^)]*\)\s*:/)) {
          if (!code.match(/def\s+\w+\s*\([^)]*\)\s*:.*\n(\s+.+|\s*$)/s)) {
            return { isValid: false, error: 'Function body is missing or incomplete' };
          }
        }
        if (code.match(/:\s*$/)) {
          return { isValid: false, error: 'Incomplete block statement' };
        }
        break;
        
      case 'java':
        // Basic Java syntax validation
        if (code.match(/public\s+\w+\s+\w+\s*\([^)]*\)\s*\{[^}]*$/)) {
          return { isValid: false, error: 'Unclosed method brace' };
        }
        if (code.match(/class\s+\w+\s*\{[^}]*$/)) {
          return { isValid: false, error: 'Unclosed class brace' };
        }
        break;
        
      case 'csharp':
        // Basic C# syntax validation
        if (code.match(/public\s+\w+\s+\w+\s*\([^)]*\)\s*\{[^}]*$/)) {
          return { isValid: false, error: 'Unclosed method brace' };
        }
        break;
    }
    
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Syntax validation error' };
  }
};

describe('Assessment Syntax Validation', () => {
  describe('JavaScript/TypeScript', () => {
    it('should validate correct JavaScript syntax', () => {
      const validCode = `function twoSum(nums, target) {
    return [0, 1];
}`;
      
      const result = validateSyntax(validCode, 'javascript');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should catch unclosed function brace', () => {
      const invalidCode = `function twoSum(nums, target) {
    return [0, 1];`;
      
      const result = validateSyntax(invalidCode, 'javascript');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Unclosed function brace');
    });

    it('should catch unmatched parentheses', () => {
      const invalidCode = `function test() {
    console.log((1 + 2);`;
      
      const result = validateSyntax(invalidCode, 'javascript');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Unmatched parentheses');
    });

    it('should catch unmatched brackets', () => {
      const invalidCode = `function test() {
    const arr = [1, 2, 3;`;
      
      const result = validateSyntax(invalidCode, 'javascript');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Unmatched brackets');
    });

    it('should catch unmatched braces', () => {
      const invalidCode = `function test() {
    if (true) {
      console.log('test');`;
      
      const result = validateSyntax(invalidCode, 'javascript');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Unmatched braces');
    });
  });

  describe('Python', () => {
    it('should validate correct Python syntax', () => {
      const validCode = `def two_sum(nums, target):
    return [0, 1]`;
      
      const result = validateSyntax(validCode, 'python');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should catch incomplete function body', () => {
      const invalidCode = `def two_sum(nums, target):`;
      
      const result = validateSyntax(invalidCode, 'python');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Function body is missing or incomplete');
    });

    it('should catch incomplete block statement', () => {
      const invalidCode = `if True:`;
      
      const result = validateSyntax(invalidCode, 'python');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Incomplete block statement');
    });
  });

  describe('Java', () => {
    it('should validate correct Java syntax', () => {
      const validCode = `public int[] twoSum(int[] nums, int target) {
    return new int[]{0, 1};
}`;
      
      const result = validateSyntax(validCode, 'java');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should catch unclosed method brace', () => {
      const invalidCode = `public int[] twoSum(int[] nums, int target) {
    return new int[]{0, 1};`;
      
      const result = validateSyntax(invalidCode, 'java');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Unclosed method brace');
    });

    it('should catch unclosed class brace', () => {
      const invalidCode = `public class Solution {
    public int[] twoSum(int[] nums, int target) {
      return new int[]{0, 1];
    }`;
      
      const result = validateSyntax(invalidCode, 'java');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Unclosed class brace');
    });
  });

  describe('C#', () => {
    it('should validate correct C# syntax', () => {
      const validCode = `public int[] TwoSum(int[] nums, int target) {
    return new int[]{0, 1];
}`;
      
      const result = validateSyntax(validCode, 'csharp');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should catch unclosed method brace', () => {
      const invalidCode = `public int[] TwoSum(int[] nums, int target) {
    return new int[]{0, 1};`;
      
      const result = validateSyntax(invalidCode, 'csharp');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Unclosed method brace');
    });
  });
});

describe('Code Execution Tests', () => {
  describe('JavaScript Execution', () => {
    it('should execute valid JavaScript code', () => {
      const code = `
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
      `;
      
      // Test that the code can be executed without syntax errors
      expect(() => {
        eval(code);
        const result = twoSum([2, 7, 11, 15], 9);
        expect(result).toEqual([0, 1]);
      }).not.toThrow();
    });

    it('should throw SyntaxError for invalid JavaScript code', () => {
      const invalidCode = `
        function test() {
          console.log((1 + 2);
        `;
      
      expect(() => {
        eval(invalidCode);
      }).toThrow(SyntaxError);
    });

    it('should throw SyntaxError for unclosed function', () => {
      const invalidCode = `
        function test() {
          return 1;
        // Missing closing brace
      `;
      
      expect(() => {
        eval(invalidCode);
      }).toThrow(SyntaxError);
    });
  });

  describe('Python Execution (simulated)', () => {
    it('should validate Python syntax', () => {
      const validCode = `
def two_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []
      `;
      
      // For Python, we validate syntax patterns since we can't execute Python in Node.js
      const result = validateSyntax(validCode, 'python');
      expect(result.isValid).toBe(true);
    });

    it('should detect Python syntax errors', () => {
      const invalidCode = `
def two_sum(nums, target):
    for i in range(len(nums)):
        if nums[i] + nums[j] == target:
      `;
      
      const result = validateSyntax(invalidCode, 'python');
      expect(result.isValid).toBe(false);
    });
  });

  describe('Java Execution (simulated)', () => {
    it('should validate Java syntax', () => {
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
      
      const result = validateSyntax(validCode, 'java');
      expect(result.isValid).toBe(true);
    });

    it('should detect Java syntax errors', () => {
      const invalidCode = `
public class Solution {
    public int[] twoSum(int[] nums, int target) {
        return new int[]{i, j};
    // Missing closing brace
      `;
      
      const result = validateSyntax(invalidCode, 'java');
      expect(result.isValid).toBe(false);
    });
  });

  describe('C# Execution (simulated)', () => {
    it('should validate C# syntax', () => {
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
      
      const result = validateSyntax(validCode, 'csharp');
      expect(result.isValid).toBe(true);
    });

    it('should detect C# syntax errors', () => {
      const invalidCode = `
public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        return new int[]{i, j};
    // Missing closing brace
      `;
      
      const result = validateSyntax(invalidCode, 'csharp');
      expect(result.isValid).toBe(false);
    });
  });
});

describe('Build Failure Tests', () => {
  it('should fail build when syntax errors are present', () => {
    const invalidCodes = [
      `function test() { console.log((1 + 2);`, // JavaScript
      `def test():`, // Python
      `public class Test { public void method() {`, // Java
      `public class Test { public void Method() {`, // C#
    ];
    
    const languages = ['javascript', 'python', 'java', 'csharp'];
    
    invalidCodes.forEach((code, index) => {
      const language = languages[index];
      const result = validateSyntax(code, language);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  it('should pass build when all syntax is valid', () => {
    const validCodes = [
      `function test() { console.log((1 + 2)); }`, // JavaScript
      `def test():\n    print((1 + 2))`, // Python
      `public class Test { public void method() { System.out.println((1 + 2)); } }`, // Java
      `public class Test { public void Method() { Console.WriteLine((1 + 2)); } }`, // C#
    ];
    
    const languages = ['javascript', 'python', 'java', 'csharp'];
    
    validCodes.forEach((code, index) => {
      const language = languages[index];
      const result = validateSyntax(code, language);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});
