
import { useState, useRef, useEffect } from 'react';
import { EnhancedSpeechService } from '@/services/EnhancedSpeechService';
import { EnhancedAIService, MultilingualResponse } from '@/services/EnhancedAIService';
import { toast } from 'sonner';

export interface ConversationEntry {
  question: string;
  nativeResponse: string;
  englishResponse: string;
  language: string;
  timestamp: Date;
}

export const useEnhancedVoiceTutor = (language: string) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [currentResponse, setCurrentResponse] = useState<MultilingualResponse | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);
  
  const speechServiceRef = useRef<EnhancedSpeechService | null>(null);

  useEffect(() => {
    speechServiceRef.current = new EnhancedSpeechService();
    
    if (!speechServiceRef.current.isSupported()) {
      toast.error('Speech recognition is not supported in this browser');
    }

    return () => {
      if (speechServiceRef.current) {
        speechServiceRef.current.stopListening();
      }
    };
  }, []);

  useEffect(() => {
    if (speechServiceRef.current) {
      speechServiceRef.current.setLanguage(language);
    }
  }, [language]);

  const startListening = async () => {
    if (!speechServiceRef.current || isListening) return;

    setIsListening(true);
    setCurrentQuestion('');
    setInterimTranscript('');
    setCurrentResponse(null);

    speechServiceRef.current.startListening(
      (transcript, isFinal) => {
        console.log('Transcript received:', transcript, 'Final:', isFinal);
        
        if (isFinal) {
          setCurrentQuestion(transcript);
          setInterimTranscript('');
          setIsListening(false);
          processQuestion(transcript);
        } else {
          setInterimTranscript(transcript);
        }
      },
      (error) => {
        console.error('Speech recognition error:', error);
        toast.error('Speech recognition error. Please try again.');
        setIsListening(false);
        setInterimTranscript('');
      }
    );
  };

  const stopListening = () => {
    if (speechServiceRef.current) {
      speechServiceRef.current.stopListening();
    }
    setIsListening(false);
    setInterimTranscript('');
  };

  const processQuestion = async (question: string) => {
    if (!question.trim()) return;

    setIsProcessing(true);
    
    try {
      console.log('Processing question with Enhanced AI service:', question);
      const response = await EnhancedAIService.processMultilingualQuestion(question, language);
      
      setCurrentResponse(response);
      
      // Add to conversation history
      const conversationEntry: ConversationEntry = {
        question,
        nativeResponse: response.nativeResponse,
        englishResponse: response.englishResponse,
        language: response.detectedLanguage,
        timestamp: new Date()
      };
      
      setConversationHistory(prev => [conversationEntry, ...prev]);

      // Speak the native language response
      if (speechServiceRef.current) {
        setIsSpeaking(true);
        try {
          await speechServiceRef.current.speakText(response.nativeResponse, language);
        } catch (speakError) {
          console.warn('Speech synthesis failed:', speakError);
        } finally {
          setIsSpeaking(false);
        }
      }

      toast.success(`Question processed successfully in ${language}!`);
    } catch (error) {
      console.error('Error processing question:', error);
      toast.error('Failed to process your question. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = async (text: string, targetLanguage?: string) => {
    if (speechServiceRef.current && !isSpeaking) {
      setIsSpeaking(true);
      try {
        await speechServiceRef.current.speakText(text, targetLanguage || language);
      } catch (error) {
        console.error('Speech synthesis error:', error);
        toast.error('Failed to play audio');
      } finally {
        setIsSpeaking(false);
      }
    }
  };

  const clearHistory = () => {
    setConversationHistory([]);
    setCurrentResponse(null);
    setCurrentQuestion('');
    setInterimTranscript('');
  };

  return {
    isListening,
    isProcessing,
    isSpeaking,
    currentQuestion,
    interimTranscript,
    currentResponse,
    conversationHistory,
    startListening,
    stopListening,
    processQuestion,
    speakResponse,
    clearHistory,
    isSupported: speechServiceRef.current?.isSupported() || false
  };
};
