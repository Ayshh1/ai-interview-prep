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

// Speech recognition interfaces
interface WebkitSpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: WebkitSpeechRecognitionEvent) => void) | null;
  onerror: ((event: WebkitSpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
}

interface WebkitSpeechRecognitionConstructor {
  new (): WebkitSpeechRecognitionInstance;
}

interface WebkitSpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface WebkitSpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

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
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  const router = useRouter();
  const recognitionRef = useRef<WebkitSpeechRecognitionInstance | null>(null);

  useEffect(() => {
    setIsChrome(navigator.userAgent.includes('Chrome'));
    
    const storedQuestions = sessionStorage.getItem('questions');
    const storedRole = sessionStorage.getItem('role');
    const storedStartTime = sessionStorage.getItem('startTime');
    
    if (!storedQuestions || !storedRole) {
      router.push('/');
      return;
    }
    
    try {
      setQuestions(JSON.parse(storedQuestions));
      setRole(storedRole);
      if (storedStartTime) {
        setStartTime(parseInt(storedStartTime));
      }
    } catch (error) {
      console.error('Error loading session data:', error);
      router.push('/');
    }
  }, [router]);

  // Timer effect
  useEffect(() => {
    if (startTime > 0) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition as WebkitSpeechRecognitionConstructor;
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: WebkitSpeechRecognitionEvent) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        if (transcript) {
          setAnswer(prev => prev + (prev ? ' ' : '') + transcript);
        }
      };

      recognition.onerror = (event: WebkitSpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        
        if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone access in your browser settings and try again.');
        } else if (event.error === 'no-speech') {
          setError('No speech detected. Please try speaking clearly.');
        } else if (event.error === 'network') {
          setError('Network error occurred. Please check your internet connection.');
        } else {
          setError(`Speech recognition error: ${event.error}`);
        }
      };

      recognitionRef.current = recognition;
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questions[currentQuestionIndex].question,
          answer: answer.trim(),
          role: role
        }),
      });

      if (!response.ok) throw new Error('Failed to evaluate answer');

      const data = await response.json();
      setFeedback(data.feedback);
      
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

  const getScoreColor = (score: number) => {
    if (score < 5) return 'text-red-400';
    if (score < 8) return 'text-yellow-400';
    return 'text-green-400';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
              <div className="w-px h-4 bg-gray-600"></div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-yellow-400">{formatTime(elapsedTime)}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 w-full max-w-md mx-auto">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

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

        {!isChrome && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-center gap-2 text-yellow-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Voice recording works best in Chrome.</span>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto mb-8 w-full">
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
            </div>
            
            <h2 className="text-2xl font-semibold mb-6 text-white leading-relaxed">
              {currentQuestion.question}
            </h2>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <label className="text-sm font-medium text-gray-300">Your Answer:</label>
                <span className="text-xs text-gray-500 ml-auto">{answer.length} characters</span>
              </div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here or use voice recording..."
                className="w-full h-40 px-4 py-3 rounded-lg border border-gray-600 bg-gray-800/50 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 resize-none"
                disabled={!!feedback}
              />
            </div>

            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={toggleRecording}
                disabled={!!feedback}
                className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${
                  isRecording
                    ? 'bg-red-500 text-white'
                    : 'bg-cyan-500 text-white'
                } ${feedback ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isRecording ? 'Stop Recording' : 'Start Voice Recording'}
              </button>
            </div>

            {!feedback && (
              <button
                onClick={handleSubmitAnswer}
                disabled={isSubmitting || !answer.trim()}
                className={`w-full px-6 py-4 rounded-lg font-semibold transition-all ${
                  isSubmitting || !answer.trim()
                    ? 'bg-gray-700 text-gray-500'
                    : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                }`}
              >
                {isSubmitting ? 'Evaluating...' : 'Submit Answer for AI Feedback'}
              </button>
            )}

            {feedback && (
              <div className="mt-6 p-6 rounded-lg border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-purple-500/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-cyan-400">AI Feedback</h3>
                  </div>
                  <div className={`text-3xl font-bold ${getScoreColor(feedback.score)}`}>
                    {feedback.score}/10
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
                    <h4 className="font-semibold text-green-400 mb-2">Strengths</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {feedback.strengths.map((s, i) => <li key={i}>• {s}</li>)}
                    </ul>
                  </div>
                  <div className="bg-yellow-500/5 rounded-lg p-4 border border-yellow-500/20">
                    <h4 className="font-semibold text-yellow-400 mb-2">To Improve</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {feedback.improvements.map((im, i) => <li key={i}>• {im}</li>)}
                    </ul>
                  </div>
                </div>

                <p className="text-gray-300 text-sm italic">{feedback.summary}</p>

                <button
                  onClick={handleNextQuestion}
                  className="w-full mt-6 px-6 py-4 rounded-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Full Results'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}