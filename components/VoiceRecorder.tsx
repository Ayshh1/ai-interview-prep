'use client';

import { useState, useEffect, useRef } from 'react';

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceRecorder({ onTranscript, disabled = false }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isChrome, setIsChrome] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser is Chrome
    setIsChrome(navigator.userAgent.includes('Chrome'));
    
    // Initialize speech recognition if available
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        onTranscript(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
    }
  }, [onTranscript]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not available in your browser. Please use Chrome.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggleRecording}
        disabled={disabled || !isChrome}
        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-cyan-500 hover:bg-cyan-600 text-white'
        } ${disabled || !isChrome ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isRecording ? '🔴 Stop Recording' : '🎤 Start Voice Recording'}
      </button>
      {isRecording && (
        <div className="flex items-center gap-2">
          <div className="animate-pulse w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-red-400">Recording...</span>
        </div>
      )}
      {!isChrome && (
        <div className="text-yellow-400 text-sm">
          ⚠️ Voice recording works best in Chrome
        </div>
      )}
    </div>
  );
}
