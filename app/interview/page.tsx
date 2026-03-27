'use client';

import { useState, useEffect, useRef } from 'react';
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

// Type definitions for Web Speech API
interface WebkitSpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface WebkitSpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

type WebkitSpeechRecognition = {
  new (): {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((event: WebkitSpeechRecognitionEvent) => void) | null;
    onerror: ((event: WebkitSpeechRecognitionErrorEvent) => void) | null;
    start(): void;
    stop(): void;
  };
};

export default function InterviewPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [role, setRole] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answersWithFeedback, setAnswersWithFeedback] = useState<AnswerWithFeedback[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isChrome, setIsChrome] = useState(true);
  
  const router = useRouter();
  const recognitionRef = useRef<WebkitSpeechRecognition | null>(null);

  useEffect(() => {
    // Check if browser is Chrome
    setIsChrome(navigator.userAgent.includes('Chrome'));
    
    // Load questions and role from sessionStorage
    const storedQuestions = sessionStorage.getItem('questions');
    const storedRole = sessionStorage.getItem('role');
    
    if (!storedQuestions || !storedRole) {
      router.push('/');
      return;
    }
    
    try {
      setQuestions(JSON.parse(storedQuestions));
      setRole(storedRole);
    } catch (error) {
      console.error('Error loading session data:', error);
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    // Initialize speech recognition if available
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as unknown as { webkitSpeechRecognition: WebkitSpeechRecognition }).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: WebkitSpeechRecognitionEvent) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswer(prev => prev + transcript);
      };

      recognitionRef.current.onerror = (event: WebkitSpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not available in your browser. Please use Chrome.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
      setError(null);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      setError('Please provide an answer before submitting.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: questions[currentQuestionIndex].question,
          answer: answer.trim(),
          role: role
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate answer');
      }

      const data = await response.json();
      setFeedback(data.feedback);
      
      // Store answer with feedback
      setAnswersWithFeedback(prev => [...prev, {
        question: questions[currentQuestionIndex],
        answer: answer.trim(),
        feedback: data.feedback
      }]);
    } catch (error) {
      console.error('Error evaluating answer:', error);
      setError('Failed to evaluate answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswer('');
      setFeedback(null);
    } else {
      // Save results and navigate to results page
      sessionStorage.setItem('results', JSON.stringify(answersWithFeedback));
      sessionStorage.setItem('role', role);
      router.push('/results');
    }
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

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen relative">
      <div className="grid-background"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Interview Session
            </h1>
          </div>
          <div className="flex items-center justify-center gap-4 text-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-cyan-400">Question {currentQuestionIndex + 1} of {questions.length}</span>
              <div className="w-px h-4 bg-gray-600"></div>
              <span className="text-sm">{role}</span>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-4 w-full max-w-md mx-auto">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 text-red-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Browser Warning */}
        {!isChrome && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-center gap-2 text-yellow-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Voice recording works best in Chrome. Some features may not work in your current browser.</span>
              </div>
            </div>
          </div>
        )}

        {/* Question Card */}
        <div className="max-w-4xl mx-auto mb-8">
          <div 
            className="backdrop-blur-md border border-cyan-500/10 rounded-2xl p-8"
            style={{ backgroundColor: 'rgba(25, 25, 31, 0.4)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(currentQuestion.difficulty)}`}>
                  {currentQuestion.difficulty.toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-600/30 text-gray-300 border border-gray-600">
                  {currentQuestion.type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Take your time to answer</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-6 text-white leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Answer Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <label className="text-sm font-medium text-gray-300">
                  Your Answer:
                </label>
                <span className="text-xs text-gray-500 ml-auto">{answer.length} characters</span>
              </div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here or use voice recording..."
                className="w-full h-40 px-4 py-3 rounded-lg border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 resize-none transition-all duration-200"
                disabled={!!feedback}
              />
              {!feedback && (
                <div className="mt-2 text-xs text-gray-400">
                  💡 Tip: Be detailed and specific in your answer for better feedback
                </div>
              )}
            </div>

            {/* Voice Recording Button */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={toggleRecording}
                disabled={!!feedback}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
                    : 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                } ${feedback ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isRecording ? (
                  <>
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                    Stop Recording
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                    Start Voice Recording
                  </>
                )}
              </button>
              {isRecording && (
                <div className="flex items-center gap-2 text-red-400">
                  <div className="animate-pulse w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Recording... Speak clearly</span>
                </div>
              )}
              {!isRecording && !feedback && (
                <div className="flex items-center gap-2 text-gray-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Chrome recommended for best experience</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            {!feedback && (
              <button
                onClick={handleSubmitAnswer}
                disabled={isSubmitting || !answer.trim()}
                className={`w-full px-6 py-4 rounded-lg font-semibold transition-all duration-200 relative overflow-hidden group ${
                  isSubmitting || !answer.trim()
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
                }`}
              >
                <div className="relative z-10 flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Evaluating your answer...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Submit Answer for AI Feedback
                    </>
                  )}
                </div>
                {!isSubmitting && answer.trim() && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                )}
              </button>
            )}

            {/* Feedback Section */}
            {feedback && (
              <div className="mt-6 p-6 rounded-lg border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-purple-500/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-cyan-400">AI Feedback</h3>
                      <p className="text-sm text-gray-400">Detailed analysis of your answer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(feedback.confidence)}`}>
                      {feedback.confidence.toUpperCase()} CONFIDENCE
                    </span>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(feedback.score)}`}>
                        {feedback.score}/10
                      </div>
                      <div className="text-xs text-gray-400">Score</div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <h4 className="font-semibold text-green-400">Strengths</h4>
                    </div>
                    <ul className="space-y-2">
                      {feedback.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-300 text-sm">
                          <span className="text-green-400 mt-1">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-yellow-500/5 rounded-lg p-4 border border-yellow-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a3 3 0 11-6 0 3 3 0 016 0zm-1-9a1 1 0 00-2 0v4a1 1 0 102 0V5z" clipRule="evenodd" />
                      </svg>
                      <h4 className="font-semibold text-yellow-400">Areas to Improve</h4>
                    </div>
                    <ul className="space-y-2">
                      {feedback.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-300 text-sm">
                          <span className="text-yellow-400 mt-1">•</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <h4 className="font-semibold text-purple-400">Summary</h4>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{feedback.summary}</p>
                </div>

                {/* Next Question Button */}
                <button
                  onClick={handleNextQuestion}
                  className="w-full mt-6 px-6 py-4 rounded-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {currentQuestionIndex < questions.length - 1 ? (
                    <>
                      Next Question
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  ) : (
                    <>
                      See Full Results
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
