
export class SpeechService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
  }

  setLanguage(language: string) {
    if (!this.recognition) return;
    
    const languageCodes: { [key: string]: string } = {
      'English': 'en-US',
      'Yoruba': 'yo-NG',
      'Igbo': 'ig-NG',
      'Hausa': 'ha-NG'
    };
    
    this.recognition.lang = languageCodes[language] || 'en-US';
  }

  startListening(onResult: (text: string) => void, onError: (error: string) => void) {
    if (!this.recognition || this.isListening) return;

    this.isListening = true;
    
    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      this.isListening = false;
    };

    this.recognition.onerror = (event) => {
      onError(`Speech recognition error: ${event.error}`);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
    } catch (error) {
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

  speak(text: string, language: string) {
    // Stop any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice based on language
    const voices = this.synthesis.getVoices();
    const languageVoices: { [key: string]: string[] } = {
      'English': ['en-US', 'en-GB'],
      'Yoruba': ['yo-NG'],
      'Igbo': ['ig-NG'],
      'Hausa': ['ha-NG']
    };

    const preferredLangs = languageVoices[language] || ['en-US'];
    const voice = voices.find(v => preferredLangs.some(lang => v.lang.includes(lang.split('-')[0])));
    
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    this.synthesis.speak(utterance);
  }

  isSupported() {
    return !!(this.recognition && this.synthesis);
  }
}
