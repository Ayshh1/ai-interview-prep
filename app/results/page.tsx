'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Question {
  id: number;
  question: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Feedback {
  score: number;
  confidence: 'low' | 'medium' | 'high';
  strengths: string[];
  improvements: string[];
  summary: string;
}

interface AnswerWithFeedback {
  question: Question;
  answer: string;
  feedback: Feedback;
}

export default function ResultsPage() {
  const [copied, setCopied] = useState(false);
  const [results, setResults] = useState<AnswerWithFeedback[]>([]);
  const [role, setRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();

  useEffect(() => {
    // Load data only on client side
    const storedResults = sessionStorage.getItem('results');
    const storedRole = sessionStorage.getItem('role');
    
    if (!storedResults || !storedRole) {
      router.push('/');
      return;
    }
    
    try {
      setResults(JSON.parse(storedResults));
      setRole(storedRole);
    } catch (error) {
      console.error('Error loading results:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const calculateAverageScore = (): string => {
    if (results.length === 0) return "0.0";
    const total = results.reduce((sum, result) => sum + result.feedback.score, 0);
    return (total / results.length).toFixed(1);
  };

  const getOverallConfidence = (): 'low' | 'medium' | 'high' => {
    if (results.length === 0) return 'low';
    
    const confidenceScores = { high: 3, medium: 2, low: 1 };
    const totalConfidence = results.reduce((sum, result) => 
      sum + confidenceScores[result.feedback.confidence], 0
    );
    const average = totalConfidence / results.length;
    
    if (average >= 2.5) return 'high';
    if (average >= 1.5) return 'medium';
    return 'low';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-300 border-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400';
      case 'hard': return 'bg-red-500/20 text-red-300 border-red-400';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-500/20 text-green-300 border-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400';
      case 'low': return 'bg-red-500/20 text-red-300 border-red-400';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 5) return 'text-red-400';
    if (score < 8) return 'text-yellow-400';
    return 'text-green-400';
  };

  const copyResultsToClipboard = () => {
    const avg = calculateAverageScore();
    const conf = getOverallConfidence();
    
    let text = `AI Interview Prep Results - ${role}\n`;
    text += `=====================================\n\n`;
    text += `Overall Score: ${avg}/10\n`;
    text += `Overall Confidence: ${conf}\n\n`;
    
    results.forEach((result, index) => {
      text += `Question ${index + 1} (${result.question.difficulty})\n`;
      text += `-------------------------------------\n`;
      text += `Question: ${result.question.question}\n`;
      text += `Your Answer: ${result.answer}\n`;
      text += `Score: ${result.feedback.score}/10\n`;
      text += `Confidence: ${result.feedback.confidence}\n`;
      text += `Strengths:\n${result.feedback.strengths.map(s => `- ${s}`).join('\n')}\n`;
      text += `Improvements:\n${result.feedback.improvements.map(i => `- ${i}`).join('\n')}\n`;
      text += `Summary: ${result.feedback.summary}\n\n`;
    });
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartOver = () => {
    sessionStorage.clear();
    router.push('/');
  };

  // Prevent rendering until data is loaded
  if (isLoading || results.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const averageScore = parseFloat(calculateAverageScore());
  const overallConfidence = getOverallConfidence();

  return (
    <div className="min-h-screen relative">
      <div className="grid-background"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Interview Results
          </h1>
          <p className="text-gray-300">
            {role} • {results.length} Questions Completed
          </p>
        </div>

        {/* Score Summary */}
        <div className="max-w-4xl mx-auto mb-8">
          <div 
            className="backdrop-blur-md border border-cyan-500/10 rounded-2xl p-8 text-center"
            style={{ backgroundColor: 'rgba(25, 25, 31, 0.4)' }}
          >
            <div className="mb-6">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(averageScore)}`}>
                {averageScore}
              </div>
              <div className="text-2xl text-gray-300 mb-4">out of 10</div>
              <div className={`inline-block px-4 py-2 rounded-full text-lg font-medium border ${getConfidenceColor(overallConfidence)}`}>
                {overallConfidence.toUpperCase()} CONFIDENCE
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleStartOver}
                className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 transition-all duration-200"
              >
                Start Over
              </button>
              <button
                onClick={copyResultsToClipboard}
                className="px-6 py-3 rounded-lg font-semibold bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200"
              >
                {copied ? '✓ Copied!' : 'Copy Results'}
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="max-w-4xl mx-auto space-y-6">
          {results.map((result, index) => (
            <div 
              key={index}
              className="backdrop-blur-md border border-cyan-500/10 rounded-2xl p-6"
              style={{ backgroundColor: 'rgba(25, 25, 31, 0.4)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-white">
                    Question {index + 1}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(result.question.difficulty)}`}>
                    {result.question.difficulty.toUpperCase()}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {result.question.type}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(result.feedback.confidence)}`}>
                    {result.feedback.confidence.toUpperCase()}
                  </span>
                  <span className={`text-xl font-bold ${getScoreColor(result.feedback.score)}`}>
                    {result.feedback.score}/10
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-cyan-400 mb-2">Question:</h4>
                <p className="text-gray-300">{result.question.question}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-purple-400 mb-2">Your Answer:</h4>
                <p className="text-gray-300 bg-gray-800/30 p-3 rounded-lg">
                  {result.answer}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-green-400 mb-2">Strengths:</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    {result.feedback.strengths.map((strength, strengthIndex) => (
                      <li key={strengthIndex}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-400 mb-2">Improvements:</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                    {result.feedback.improvements.map((improvement, improvementIndex) => (
                      <li key={improvementIndex}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-600 pt-4">
                <h4 className="font-medium text-pink-400 mb-2">Summary:</h4>
                <p className="text-gray-300 text-sm">{result.feedback.summary}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}