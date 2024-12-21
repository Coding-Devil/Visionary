import { translateText, synthesizeSpeech } from './api/google-cloud';
import { AudioPlayer } from './audio/audio-player';
import type { LanguageCode } from './config/google-cloud';

export class GoogleTextToSpeech {
  private audioPlayer: AudioPlayer;
  private isSpeaking: boolean = false;

  constructor() {
    this.audioPlayer = new AudioPlayer();
  }

  async speakInLanguage(text: string, lang: LanguageCode): Promise<void> {
    if (this.isSpeaking) {
      this.stop();
    }

    try {
      this.isSpeaking = true;
      let translatedText = text;

      if (lang !== 'en') {
        translatedText = await translateText(text, lang);
      }

      const audioContent = await synthesizeSpeech(translatedText, lang);
      await this.audioPlayer.playAudio(audioContent);
    } catch (error) {
      console.error('Error in text-to-speech process:', error);
      // Optionally, you could emit an event or callback here to notify the UI
    } finally {
      this.isSpeaking = false;
    }
  }

  stop(): void {
    this.isSpeaking = false;
    this.audioPlayer.stop();
  }

  isActive(): boolean {
    return this.isSpeaking;
  }
}