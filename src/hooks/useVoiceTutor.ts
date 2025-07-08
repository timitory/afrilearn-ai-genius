
import { useState, useRef, useEffect } from 'react';
import { SpeechService } from '@/services/SpeechService';
import { AIService } from '@/services/AIService';
import { toast } from 'sonner';

export const useVoiceTutor = (language: string) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{question: string, answer: string}>>([]);
  
  const speechServiceRef = useRef<SpeechService | null>(null);

  useEffect(() => {
    speechServiceRef.current = new SpeechService();
    
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
    setCurrentAnswer('');

    speechServiceRef.current.startListening(
      async (transcript) => {
        console.log('Transcript received:', transcript);
        setCurrentQuestion(transcript);
        setIsListening(false);
        await processQuestion(transcript);
      },
      (error) => {
        console.error('Speech recognition error:', error);
        toast.error('Speech recognition error. Please try again.');
        setIsListening(false);
      }
    );
  };

  const stopListening = () => {
    if (speechServiceRef.current) {
      speechServiceRef.current.stopListening();
    }
    setIsListening(false);
  };

  const processQuestion = async (question: string) => {
    if (!question.trim()) return;

    setIsProcessing(true);
    
    try {
      console.log('Processing question with AI service:', question);
      const answer = await AIService.processQuestion(question, language);
      
      setCurrentAnswer(answer);
      
      // Add to conversation history
      setConversationHistory(prev => [
        ...prev,
        { question, answer }
      ]);

      // Speak the answer
      if (speechServiceRef.current) {
        speechServiceRef.current.speak(answer, language);
      }

      toast.success('Question processed successfully!');
    } catch (error) {
      console.error('Error processing question:', error);
      toast.error('Failed to process your question. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakAnswer = (text: string) => {
    if (speechServiceRef.current) {
      speechServiceRef.current.speak(text, language);
    }
  };

  return {
    isListening,
    isProcessing,
    currentQuestion,
    currentAnswer,
    conversationHistory,
    startListening,
    stopListening,
    processQuestion,
    speakAnswer,
    isSupported: speechServiceRef.current?.isSupported() || false
  };
};
