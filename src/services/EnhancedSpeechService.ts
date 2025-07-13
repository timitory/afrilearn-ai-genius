
export class EnhancedSpeechService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;
  private currentLanguage = 'English';

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.setupSpeechRecognition();
  }

  private setupSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.setupRecognitionConfig();
    }
  }

  private setupRecognitionConfig() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 3;
  }

  setLanguage(language: string) {
    this.currentLanguage = language;
    if (!this.recognition) return;
    
    const languageCodes: { [key: string]: string } = {
      'English': 'en-US',
      'Yoruba': 'yo-NG',
      'Igbo': 'ig-NG',
      'Hausa': 'ha-NG'
    };
    
    this.recognition.lang = languageCodes[language] || 'en-US';
    console.log(`Speech recognition language set to: ${this.recognition.lang}`);
  }

  async startListening(
    onResult: (text: string, isFinal: boolean) => void, 
    onError: (error: string) => void
  ): Promise<void> {
    if (!this.recognition || this.isListening) return;

    this.isListening = true;
    
    this.recognition.onresult = (event) => {
      console.log('Speech recognition results:', event.results);
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const isFinal = result.isFinal;
        
        console.log(`Speech result: "${transcript}" (final: ${isFinal})`);
        onResult(transcript, isFinal);
        
        if (isFinal) {
          this.isListening = false;
        }
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      onError(`Speech recognition error: ${event.error}`);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      console.log('Speech recognition ended');
      this.isListening = false;
    };

    this.recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      onError('Failed to start speech recognition');
      this.isListening = false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  async speakText(text: string, language: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Stop any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Wait for voices to load
      const setVoiceAndSpeak = () => {
        const voices = this.synthesis.getVoices();
        console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
        
        // Enhanced voice selection with fallbacks
        const voice = this.selectBestVoice(voices, language);
        
        if (voice) {
          utterance.voice = voice;
          console.log(`Selected voice: ${voice.name} (${voice.lang})`);
        } else {
          console.warn(`No suitable voice found for ${language}, using default`);
        }

        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.lang = this.getLanguageCode(language);

        utterance.onend = () => {
          console.log('Speech synthesis completed');
          resolve();
        };
        
        utterance.onerror = (error) => {
          console.error('Speech synthesis error:', error);
          reject(error);
        };

        utterance.onstart = () => {
          console.log('Speech synthesis started');
        };

        this.synthesis.speak(utterance);
      };

      // Check if voices are already loaded
      if (this.synthesis.getVoices().length > 0) {
        setVoiceAndSpeak();
      } else {
        // Wait for voices to load
        this.synthesis.onvoiceschanged = () => {
          setVoiceAndSpeak();
        };
      }
    });
  }

  private selectBestVoice(voices: SpeechSynthesisVoice[], language: string): SpeechSynthesisVoice | null {
    const languageCode = this.getLanguageCode(language);
    const languageShort = languageCode.split('-')[0];

    // First, try to find exact language match
    let voice = voices.find(v => v.lang === languageCode);
    if (voice) return voice;

    // Then try language family match
    voice = voices.find(v => v.lang.startsWith(languageShort));
    if (voice) return voice;

    // For Nigerian languages, look for any available Nigerian or African voice
    if (['yo', 'ig', 'ha'].includes(languageShort)) {
      voice = voices.find(v => v.lang.includes('NG') || v.name.toLowerCase().includes('african'));
      if (voice) return voice;
    }

    // Fallback to English
    voice = voices.find(v => v.lang.startsWith('en'));
    return voice || null;
  }

  private getLanguageCode(language: string): string {
    const languageCodes: { [key: string]: string } = {
      'English': 'en-US',
      'Yoruba': 'yo-NG',
      'Igbo': 'ig-NG',
      'Hausa': 'ha-NG'
    };
    
    return languageCodes[language] || 'en-US';
  }

  isSupported(): boolean {
    return !!(this.recognition && this.synthesis);
  }

  getListeningState(): boolean {
    return this.isListening;
  }
}
