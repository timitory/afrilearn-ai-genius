
export interface MultilingualResponse {
  nativeResponse: string;
  englishResponse: string;
  detectedLanguage: string;
  confidence: number;
}

export class EnhancedAIService {
  private static readonly GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  private static readonly API_KEY = 'AIzaSyB4DfF1H_LGdNeXvbZq3V3TOBy_Gmu3onk';

  private static readonly LANGUAGE_PROMPTS = {
    'English': {
      systemPrompt: 'You are an expert STEM tutor. Provide clear, educational responses in English.',
      languageCode: 'en-US'
    },
    'Yoruba': {
      systemPrompt: 'Ìwọ ni olùkọ́ STEM tí ó mọ̀ púpọ̀. Pèsè àwọn ìdáhùn tó ṣe àlàyé ní èdè Yorùbá. Dá sí àwọn kókó STEM bíi Mathematics, Physics, Chemistry, Biology àti Coding.',
      languageCode: 'yo-NG'
    },
    'Igbo': {
      systemPrompt: 'Ị bụ onye nkuzi STEM nke ọma. Nye azịza doro anya na asụsụ Igbo. Lekwasị anya na isiokwu STEM dị ka Mathematics, Physics, Chemistry, Biology na Coding.',
      languageCode: 'ig-NG'
    },
    'Hausa': {
      systemPrompt: 'Kai malamin STEM ne mai kwarewa. Ka bayar da amsoshi masu bayani da harshen Hausa. Mayar da hankali kan batutuwan STEM kamar Mathematics, Physics, Chemistry, Biology da Coding.',
      languageCode: 'ha-NG'
    }
  };

  static async processMultilingualQuestion(question: string, selectedLanguage: string): Promise<MultilingualResponse> {
    console.log('Processing multilingual question:', question, 'in language:', selectedLanguage);
    
    try {
      const languageConfig = this.LANGUAGE_PROMPTS[selectedLanguage] || this.LANGUAGE_PROMPTS['English'];
      
      const prompt = `${languageConfig.systemPrompt}\n\nQuestion: ${question}\n\nProvide a comprehensive educational response in ${selectedLanguage}. Focus on STEM topics including Mathematics, Physics, Chemistry, Biology, and Coding. Make the explanation clear and educational.`;

      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      };

      console.log('Sending request to Gemini API...');
      
      const response = await fetch(this.GEMINI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': this.API_KEY
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Gemini API response:', data);

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }

      const nativeResponse = data.candidates[0].content.parts[0].text;

      // Get English translation if not already in English
      let englishResponse = nativeResponse;
      if (selectedLanguage !== 'English') {
        try {
          englishResponse = await this.translateToEnglish(nativeResponse, selectedLanguage);
        } catch (error) {
          console.warn('Translation failed, using original response:', error);
          englishResponse = nativeResponse;
        }
      }

      return {
        nativeResponse,
        englishResponse,
        detectedLanguage: selectedLanguage,
        confidence: 0.95
      };

    } catch (error) {
      console.error('Error processing multilingual question:', error);
      // Fallback to basic response
      return this.getFallbackResponse(question, selectedLanguage);
    }
  }

  private static async translateToEnglish(text: string, fromLanguage: string): Promise<string> {
    const translatePrompt = `Translate the following ${fromLanguage} text to English. Maintain the educational context and technical accuracy:\n\n${text}`;

    const requestBody = {
      contents: [{
        parts: [{
          text: translatePrompt
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 512,
      }
    };

    const response = await fetch(this.GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': this.API_KEY
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  private static getFallbackResponse(question: string, language: string): MultilingualResponse {
    const fallbackResponses = {
      'English': 'I understand you\'re asking about a STEM topic. Could you please rephrase your question? I\'m here to help with Mathematics, Physics, Chemistry, Biology, and Coding.',
      'Yoruba': 'Ó yé mi pé o ń béèrè nípa kókó STEM kan. Ṣé o lè tún ìbéèrè rẹ sọ? Mo wà níbí láti ràn ọ́ lọ́wọ́ pẹ̀lú Mathematics, Physics, Chemistry, Biology, àti Coding.',
      'Igbo': 'Aghọtara m na ị na-ajụ banyere isiokwu STEM. Ị nwere ike ịkwughachi ajụjụ gị? Anọ m ebe a inyere gị aka na Mathematics, Physics, Chemistry, Biology, na Coding.',
      'Hausa': 'Na fahimci cewa kana tambaya game da batun STEM. Za ka iya sake faɗin tambayarka? Ina nan don taimaka maka da Mathematics, Physics, Chemistry, Biology, da Coding.'
    };

    const nativeResponse = fallbackResponses[language] || fallbackResponses['English'];
    const englishResponse = language !== 'English' ? fallbackResponses['English'] : nativeResponse;

    return {
      nativeResponse,
      englishResponse,
      detectedLanguage: language,
      confidence: 0.8
    };
  }
}
