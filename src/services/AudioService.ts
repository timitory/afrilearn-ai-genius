
export class AudioService {
  private synthesis: SpeechSynthesis;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  async speakText(text: string, language: string): Promise<void> {
    return new Promise((resolve, reject) => {
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

      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      this.synthesis.speak(utterance);
    });
  }

  getAudioExplanation(topicId: string, language: string): string {
    const explanations: { [key: string]: { [key: string]: string } } = {
      'math-1': {
        'English': 'Algebra is a branch of mathematics that uses symbols and letters to represent numbers and quantities in formulas and equations. It allows us to solve problems by finding unknown values.',
        'Yoruba': 'Algebra jẹ ẹka ti mathematiki ti o nlo awọn ami ati lẹta lati soju awọn nọmba ati awọn iwọn ninu awọn agbekalẹ ati awọn idogba. O gba wa laaye lati yanju awọn isoró nipa wiwa awọn iye ti a ko mọ.',
        'Igbo': 'Algebra bụ ngalaba nke mgbakọ na mwepụ nke na-eji akara na mkpụrụedemede anọchi anya ọnụọgụgụ na ọnụọgụgụ na usoro na nhata. Ọ na-enye anyị ohere idozi nsogbu site n'ịchọta ụkpụrụ ndị a na-amaghị.',
        'Hausa': 'Algebra wani reshe ne na lissafi wanda ke amfani da alamomi da haruffa don wakiltar lambobi da adadi a cikin dabbobi da ma\'auni. Yana ba mu damar warware matsaloli ta hanyar gano kimar da ba mu sani ba.'
      },
      'physics-1': {
        'English': 'Newton\'s Laws of Motion describe the relationship between forces acting on a body and its motion. The first law states that objects at rest stay at rest, and objects in motion stay in motion unless acted upon by an external force.',
        'Yoruba': 'Awọn ofin ti Newton ti ishipopada ṣe apejuwe ibatan laarin awọn ipa ti o nṣiṣẹ lori ara ati ishipopada rẹ. Ofin akọkọ sọ pe awọn nkan ti o wa ni isinmi wa ni isinmi, ati awọn nkan ti o wa ni ishipopada wa ni ishipopada ayafi ti ipa ode ba ṣiṣẹ lori wọn.',
        'Igbo': 'Iwu Newton nke Mmegharị na-akọwa mmekọrịta dị n\'etiti ike ndị na-eme n\'ahụ na mmegharị ya. Iwu mbụ na-ekwu na ihe ndị nọ n\'izu ike na-anọgide n\'izu ike, na ihe ndị na-emegharị na-anọgide na-emegharị ma ọ bụrụ na ike mpụga emeghị ha.',
        'Hausa': 'Dokokin Newton na Motsi suna bayyana dangantaka tsakanin karfin da ke aiki akan jiki da motsinsa. Doka ta farko ta ce abubuwan da ke hutawa suna ci gaba da hutawa, kuma abubuwan da ke motsi suna ci gaba da motsi sai in wani karfi na waje ya shafe su.'
      }
    };

    return explanations[topicId]?.[language] || explanations[topicId]?.['English'] || 'Audio explanation not available for this topic.';
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}
