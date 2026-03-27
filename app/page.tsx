'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const roles = [
  'Frontend Developer',
  'Backend Developer', 
  'Full Stack Developer',
  'React Developer',
  'Node.js Developer',
  'DevOps Engineer'
];

const techStacks = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'NestJS',
  'MongoDB',
  'PostgreSQL',
  'Tailwind CSS',
  'Docker',
  'AWS',
  'GraphQL',
  'Redis'
];

const programmingLanguages = [
  { id: 'javascript', name: 'JavaScript', icon: '🟨' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷' },
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'java', name: 'Java', icon: '☕' },
  { id: 'csharp', name: 'C#', icon: '🔷' }
];

export default function Home() {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleStackToggle = (stack: string) => {
    setSelectedStacks(prev => 
      prev.includes(stack) 
        ? prev.filter(s => s !== stack)
        : [...prev, stack]
    );
  };

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const handleStartInterview = async () => {
    if (!selectedRole || selectedStacks.length === 0 || selectedLanguages.length === 0) {
      setError('Please select a role, at least one tech stack, and at least one programming language');
      return;
    }

    setError(null);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: selectedRole,
          stack: selectedStacks.join(', '),
          languages: selectedLanguages.join(', ')
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate questions');
      }

      const data = await response.json();
      
      // Store in sessionStorage
      sessionStorage.setItem('questions', JSON.stringify(data.questions));
      sessionStorage.setItem('role', selectedRole);
      sessionStorage.setItem('selectedLanguages', JSON.stringify(selectedLanguages));
      
      // Navigate to interview page
      router.push('/interview');
    } catch (error) {
      console.error('Error generating questions:', error);
      setError(`Failed to generate questions: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API key configuration.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="grid-background"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400 mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AI Interview Prep
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Practice your interview skills with AI-powered questions and feedback
            </p>
            <div className="flex items-center justify-center gap-4 text-gray-300">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-cyan-400">Question {1} of {1}</span>
                <div className="w-px h-4 bg-gray-600"></div>
                <span className="text-sm">{selectedRole}</span>
              </div>
            </div>
            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={() => router.push('/assessment')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Try Coding Assessment
              </button>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                AI-Powered
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Real-time Feedback
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                Skill Assessment
              </span>
            </div>
          </div>

          {/* Main Card */}
          <div 
            className="backdrop-blur-md border border-cyan-500/10 rounded-2xl p-8"
            style={{ backgroundColor: 'rgba(25, 25, 31, 0.4)' }}
          >
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 text-red-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Role Selection */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                </svg>
                <h2 className="text-2xl font-semibold text-cyan-400">Select Your Role</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`px-4 py-3 rounded-lg border transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 ${
                      selectedRole === role
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/10'
                        : 'border-gray-600 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-200 hover:bg-cyan-500/5'
                    }`}
                  >
                    {selectedRole === role && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Tech Stack Selection */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <h2 className="text-2xl font-semibold text-purple-400">Select Tech Stack</h2>
                <span className="text-sm text-gray-400 ml-auto">{selectedStacks.length} selected</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {techStacks.map((stack) => (
                  <button
                    key={stack}
                    onClick={() => handleStackToggle(stack)}
                    className={`px-3 py-2 rounded-lg border transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 ${
                      selectedStacks.includes(stack)
                        ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-lg shadow-purple-500/10'
                        : 'border-gray-600 text-gray-300 hover:border-purple-500/50 hover:text-purple-200 hover:bg-purple-500/5'
                    }`}
                  >
                    {selectedStacks.includes(stack) && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {stack}
                  </button>
                ))}
              </div>
            </div>

            {/* Programming Languages Selection */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 001.414-1.414L11.414 10l1.293 1.293a1 1 0 001.414 1.414l3 3a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <h2 className="text-2xl font-semibold text-green-400">Select Programming Languages</h2>
                <span className="text-sm text-gray-400 ml-auto">{selectedLanguages.length} selected</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {programmingLanguages.map((language) => (
                  <button
                    key={language.id}
                    onClick={() => handleLanguageToggle(language.id)}
                    className={`px-3 py-3 rounded-lg border transition-all duration-200 text-sm font-medium flex flex-col items-center justify-center gap-1 ${
                      selectedLanguages.includes(language.id)
                        ? 'bg-green-500/20 border-green-400 text-green-300 shadow-lg shadow-green-500/10'
                        : 'border-gray-600 text-gray-300 hover:border-green-500/50 hover:text-green-200 hover:bg-green-500/5'
                    }`}
                  >
                    <span className="text-lg">{language.icon}</span>
                    <span>{language.name}</span>
                    {selectedLanguages.includes(language.id) && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <button
                onClick={handleStartInterview}
                disabled={isLoading || !selectedRole || selectedStacks.length === 0 || selectedLanguages.length === 0}
                className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 relative overflow-hidden group ${
                  isLoading || !selectedRole || selectedStacks.length === 0 || selectedLanguages.length === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 transform hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
              >
                <div className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Start Interview
                    </>
                  )}
                </div>
                {!isLoading && selectedRole && selectedStacks.length > 0 && selectedLanguages.length > 0 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                )}
              </button>
              <p className="mt-4 text-sm text-gray-400">
                Get personalized interview questions based on your role, tech stack, and programming languages
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
