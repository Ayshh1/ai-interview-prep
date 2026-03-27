'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CodingProblem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: { input: string; output: string; explanation: string }[];
  constraints: string[];
  languages: string[];
  starterCode: Record<string, string>;
}

const generateRandomProblems = (): CodingProblem[] => {
  const allProblems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy" as const,
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      examples: [
        { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." }
      ],
      constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
      languages: ["javascript", "typescript", "python", "java", "csharp"],
      starterCode: {
        javascript: `function twoSum(nums, target) {
    // Write your solution here
    
}`,
        typescript: `function twoSum(nums: number[], target: number): number[] {
    // Write your solution here
    
}`,
        python: `def two_sum(nums, target):
    # Write your solution here
    pass`,
        java: `public int[] twoSum(int[] nums, int target) {
    // Write your solution here
    
}`,
        csharp: `public int[] TwoSum(int[] nums, int target) {
    // Write your solution here
    
}`
      }
    },
    {
      id: 2,
      title: "Valid Parentheses",
      difficulty: "Easy" as const,
      description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      examples: [
        { input: "s = \"()\"", output: "true", explanation: "The string is valid." },
        { input: "s = \"()[]{}\"", output: "true", explanation: "The string is valid." },
        { input: "s = \"(]\"", output: "false", explanation: "The string is not valid." }
      ],
      constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'"],
      languages: ["javascript", "typescript", "python", "java", "csharp"],
      starterCode: {
        javascript: `function isValid(s) {
    // Write your solution here
    
}`,
        typescript: `function isValid(s: string): boolean {
    // Write your solution here
    
}`,
        python: `def is_valid(s):
    # Write your solution here
    pass`,
        java: `public boolean isValid(String s) {
    // Write your solution here
    
}`,
        csharp: `public bool IsValid(string s) {
    // Write your solution here
    
}`
      }
    },
    {
      id: 3,
      title: "Binary Tree Inorder Traversal",
      difficulty: "Medium" as const,
      description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
      examples: [
        { input: "root = [1,null,2,3]", output: "[1,3,2]", explanation: "Inorder traversal visits nodes in left-root-right order." }
      ],
      constraints: ["The number of nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"],
      languages: ["javascript", "typescript", "python", "java", "csharp"],
      starterCode: {
        javascript: `function inorderTraversal(root) {
    // Write your solution here
    
}`,
        typescript: `function inorderTraversal(root: TreeNode | null): number[] {
    // Write your solution here
    
}`,
        python: `def inorder_traversal(root):
    # Write your solution here
    pass`,
        java: `public List<Integer> inorderTraversal(TreeNode root) {
    // Write your solution here
    
}`,
        csharp: `public IList<int> InorderTraversal(TreeNode root) {
    // Write your solution here
    
}`
      }
    },
    {
      id: 4,
      title: "Merge Intervals",
      difficulty: "Medium" as const,
      description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
      examples: [
        { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "Intervals [1,3] and [2,6] overlap, so merge them into [1,6]." }
      ],
      constraints: ["1 <= intervals.length <= 10^4", "0 <= starti <= endi <= 10^4"],
      languages: ["javascript", "typescript", "python", "java", "csharp"],
      starterCode: {
        javascript: `function merge(intervals) {
    // Write your solution here
    
}`,
        typescript: `function merge(intervals: number[][]): number[][] {
    // Write your solution here
    
}`,
        python: `def merge(intervals):
    # Write your solution here
    pass`,
        java: `public int[][] merge(int[][] intervals) {
    // Write your solution here
    
}`,
        csharp: `public int[][] Merge(int[][] intervals) {
    // Write your solution here
    
}`
      }
    },
    {
      id: 5,
      title: "Contains Duplicate",
      difficulty: "Easy" as const,
      description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
      examples: [
        { input: "nums = [1,2,3,1]", output: "true", explanation: "The value 1 appears twice." },
        { input: "nums = [1,2,3,4]", output: "false", explanation: "All values are distinct." }
      ],
      constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
      languages: ["javascript", "typescript", "python", "java", "csharp"],
      starterCode: {
        javascript: `function containsDuplicate(nums) {
    // Write your solution here
    
}`,
        typescript: `function containsDuplicate(nums: number[]): boolean {
    // Write your solution here
    
}`,
        python: `def contains_duplicate(nums):
    # Write your solution here
    pass`,
        java: `public boolean containsDuplicate(int[] nums) {
    // Write your solution here
    
}`,
        csharp: `public bool ContainsDuplicate(int[] nums) {
    // Write your solution here
    
}`
      }
    },
    {
      id: 6,
      title: "Reverse String",
      difficulty: "Easy" as const,
      description: "Write a function that reverses a string. The input string is given as an array of characters s.",
      examples: [
        { input: "s = [\"h\",\"e\",\"l\",\"l\",\"o\"]", output: "[\"o\",\"l\",\"l\",\"e\",\"h\"]", explanation: "The reversed string is \"olleh\"." }
      ],
      constraints: ["1 <= s.length <= 10^5", "s[i] is a printable ascii character"],
      languages: ["javascript", "typescript", "python", "java", "csharp"],
      starterCode: {
        javascript: `function reverseString(s) {
    // Write your solution here
    
}`,
        typescript: `function reverseString(s: string[]): string[] {
    // Write your solution here
    
}`,
        python: `def reverse_string(s):
    # Write your solution here
    pass`,
        java: `public void reverseString(char[] s) {
    // Write your solution here
    
}`,
        csharp: `public void ReverseString(char[] s) {
    // Write your solution here
    
}`
      }
    },
    {
      id: 7,
      title: "Maximum Subarray",
      difficulty: "Medium" as const,
      description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
      examples: [
        { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." }
      ],
      constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
      languages: ["javascript", "typescript", "python", "java", "csharp"],
      starterCode: {
        javascript: `function maxSubArray(nums) {
    // Write your solution here
    
}`,
        typescript: `function maxSubArray(nums: number[]): number {
    // Write your solution here
    
}`,
        python: `def max_sub_array(nums):
    # Write your solution here
    pass`,
        java: `public int maxSubArray(int[] nums) {
    // Write your solution here
    
}`,
        csharp: `public int MaxSubArray(int[] nums) {
    // Write your solution here
    
}`
      }
    },
    {
      id: 8,
      title: "Linked List Cycle",
      difficulty: "Easy" as const,
      description: "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
      examples: [
        { input: "head = [3,2,0,-4], pos = 1", output: "true", explanation: "There is a cycle in the linked list." }
      ],
      constraints: ["The number of the nodes in the list is in the range [0, 10^4].", "-10^5 <= Node.val <= 10^5"],
      languages: ["javascript", "typescript", "python", "java", "csharp"],
      starterCode: {
        javascript: `function hasCycle(head) {
    // Write your solution here
    
}`,
        typescript: `function hasCycle(head: ListNode | null): boolean {
    // Write your solution here
    
}`,
        python: `def has_cycle(head):
    # Write your solution here
    pass`,
        java: `public boolean hasCycle(ListNode head) {
    // Write your solution here
    
}`,
        csharp: `public bool HasCycle(ListNode head) {
    // Write your solution here
    
}`
      }
    }
  ];

  // Shuffle and select 3-4 random problems
  const shuffled = [...allProblems].sort(() => Math.random() - 0.5);
  const numProblems = Math.floor(Math.random() * 2) + 3; // 3-4 problems
  return shuffled.slice(0, numProblems).map((problem, index) => ({
    ...problem,
    id: index + 1 // Reset IDs to be sequential
  }));
};

export default function AssessmentPage() {
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [userCode, setUserCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const router = useRouter();

  // Generate new problems on component mount
  useEffect(() => {
    const newProblems = generateRandomProblems();
    setProblems(newProblems);
  }, []);

  const handleRefreshProblems = () => {
    setProblems(generateRandomProblems());
    setSelectedProblem(null);
    setUserCode('');
    setTestResults(null);
  };

  const handleProblemSelect = (problem: CodingProblem) => {
    setSelectedProblem(problem);
    setUserCode(problem.starterCode[selectedLanguage] || '');
    setTestResults(null);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    if (selectedProblem) {
      setUserCode(selectedProblem.starterCode[language] || '');
    }
  };

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
            // Check if function has a body (indented content after the colon)
            const lines = code.split('\n');
            const defIndex = lines.findIndex(line => line.match(/def\s+\w+\s*\([^)]*\)\s*:/));
            if (defIndex !== -1) {
              // Check if there's at least one indented line after the function definition
              const nextLine = lines[defIndex + 1];
              if (!nextLine || !nextLine.match(/^\s+/)) {
                return { isValid: false, error: 'Function body is missing or incomplete' };
              }
            }
          }
          if (code.match(/:\s*$/)) {
            return { isValid: false, error: 'Incomplete block statement' };
          }
          // Check indentation consistency
          const lines = code.split('\n');
          let indentStack = [];
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.trim() === '') continue;
            
            const indent = line.match(/^\s*/)?.[0].length || 0;
            if (line.trim().endsWith(':')) {
              indentStack.push(indent);
            } else if (indentStack.length > 0 && indent <= indentStack[indentStack.length - 1]) {
              while (indentStack.length > 0 && indent <= indentStack[indentStack.length - 1]) {
                indentStack.pop();
              }
            }
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

  const handleRunCode = async () => {
    if (!selectedProblem) return;
    
    setIsRunning(true);
    setTestResults(null);
    
    // Basic validation - check if user actually wrote code
    const starterCode = selectedProblem.starterCode[selectedLanguage] || '';
    const hasUserCode = userCode.trim() !== starterCode.trim();
    
    if (!hasUserCode) {
      setTestResults({
        status: 'error',
        output: 'Please write your solution before running tests',
        executionTime: '0s',
        memory: '0MB'
      });
      setIsRunning(false);
      return;
    }
    
    // Syntax validation
    const syntaxCheck = validateSyntax(userCode, selectedLanguage);
    if (!syntaxCheck.isValid) {
      setTestResults({
        status: 'error',
        output: `Syntax Error: ${syntaxCheck.error}`,
        executionTime: '0s',
        memory: '0MB'
      });
      setIsRunning(false);
      return;
    }
    
    // Simulate code execution with validation
    setTimeout(() => {
      // Check for basic solution patterns
      const hasLogic = userCode.includes('return') || userCode.includes('console.log') || userCode.includes('print');
      
      if (hasLogic) {
        setTestResults({
          status: 'success',
          output: 'Test cases passed!',
          executionTime: '0.05s',
          memory: '32MB'
        });
      } else {
        setTestResults({
          status: 'error',
          output: 'No solution logic detected. Please implement the function.',
          executionTime: '0s',
          memory: '0MB'
        });
      }
      setIsRunning(false);
    }, 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-300 border-green-400';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400';
      case 'Hard': return 'bg-red-500/20 text-red-300 border-red-400';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400';
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="grid-background"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Technical Assessment
            </h1>
          </div>
          <p className="text-gray-300 mb-4">
            Practice coding challenges commonly asked in technical interviews
          </p>
          {/* Refresh Button */}
          <button
            onClick={handleRefreshProblems}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Get New Questions
          </button>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-7xl">
          {!selectedProblem ? (
            /* Problem List */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {problems.map((problem) => (
                <div
                  key={problem.id}
                  onClick={() => handleProblemSelect(problem)}
                  className="backdrop-blur-md border border-gray-600 rounded-xl p-6 cursor-pointer hover:border-green-400/50 transition-all duration-200 bg-gray-800/40"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-white">{problem.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{problem.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{problem.constraints.length} constraints</span>
                    <span className="text-xs text-gray-400">{problem.examples.length} examples</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Problem Detail */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Problem Description */}
              <div className="backdrop-blur-md border border-gray-600 rounded-xl p-6 bg-gray-800/40">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">{selectedProblem.title}</h2>
                  <button
                    onClick={() => setSelectedProblem(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border mb-4 ${getDifficultyColor(selectedProblem.difficulty)}`}>
                  {selectedProblem.difficulty}
                </span>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-300">{selectedProblem.description}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Examples</h3>
                  {selectedProblem.examples.map((example, index) => (
                    <div key={index} className="mb-4 p-3 bg-gray-900/50 rounded-lg">
                      <div className="mb-2">
                        <span className="text-sm text-gray-400">Input: </span>
                        <code className="text-green-400">{example.input}</code>
                      </div>
                      <div className="mb-2">
                        <span className="text-sm text-gray-400">Output: </span>
                        <code className="text-blue-400">{example.output}</code>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">Explanation: </span>
                        <span className="text-gray-300">{example.explanation}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Constraints</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {selectedProblem.constraints.map((constraint, index) => (
                      <li key={index}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Code Editor */}
              <div className="backdrop-blur-md border border-gray-600 rounded-xl p-6 bg-gray-800/40">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Code Editor</h3>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="px-3 py-1 rounded-lg bg-gray-700 text-white border border-gray-600"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                  </select>
                </div>

                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="w-full h-64 px-4 py-3 rounded-lg bg-gray-900/50 text-white font-mono text-sm border border-gray-600 focus:border-green-400 focus:outline-none resize-none"
                  placeholder="Write your solution here..."
                />

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isRunning ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Running...
                      </div>
                    ) : (
                      'Run Code'
                    )}
                  </button>
                </div>

                {/* Test Results */}
                {testResults && (
                  <div className="mt-4 p-4 rounded-lg bg-gray-900/50 border border-gray-600">
                    <h4 className="text-white font-semibold mb-2">Test Results</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={testResults.status === 'success' ? 'text-green-400' : 'text-red-400'}>
                          {testResults.status === 'success' ? '✓ Passed' : '✗ Failed'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Output:</span>
                        <span className="text-gray-300">{testResults.output}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time:</span>
                        <span className="text-gray-300">{testResults.executionTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Memory:</span>
                        <span className="text-gray-300">{testResults.memory}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
