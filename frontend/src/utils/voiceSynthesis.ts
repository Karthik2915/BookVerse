interface VoiceProfile {
  name: string;
  gender: 'male' | 'female' | 'child' | 'elder';
  pitch: number;
  rate: number;
  volume: number;
  voiceName?: string;
}

interface CharacterVoice {
  characterName: string;
  voice: VoiceProfile;
  isNarrator?: boolean;
}

export class VoiceSynthesisService {
  private synthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private characterVoices: Map<string, CharacterVoice> = new Map();
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isInitialized = false;
  private watchdogTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeVoices();
  }

  private async initializeVoices(): Promise<void> {
    return new Promise((resolve) => {
      const loadVoices = () => {
        this.voices = this.synthesis.getVoices();
        this.isInitialized = true;
        resolve();
      };

      const voices = this.synthesis.getVoices();
      if (voices.length > 0) {
        this.voices = voices;
        this.isInitialized = true;
        resolve();
      } else {
        this.synthesis.addEventListener('voiceschanged', loadVoices, { once: true });
        setTimeout(() => {
          if (!this.isInitialized) {
            loadVoices();
          }
        }, 2000);
      }
    });
  }

  private getVoiceProfiles(): { [key: string]: VoiceProfile } {
    return {
      maleHero: { name: 'Male Hero', gender: 'male', pitch: 0.8, rate: 0.9, volume: 1.0, voiceName: 'male' },
      maleVillain: { name: 'Male Villain', gender: 'male', pitch: 0.6, rate: 0.8, volume: 1.0, voiceName: 'male' },
      maleWise: { name: 'Wise Male', gender: 'male', pitch: 0.7, rate: 0.8, volume: 0.9, voiceName: 'male' },
      maleYoung: { name: 'Young Male', gender: 'male', pitch: 1.0, rate: 1.0, volume: 1.0, voiceName: 'male' },
      femaleHeroine: { name: 'Female Heroine', gender: 'female', pitch: 1.2, rate: 0.9, volume: 1.0, voiceName: 'female' },
      femaleVillainess: { name: 'Female Villainess', gender: 'female', pitch: 1.0, rate: 0.8, volume: 1.0, voiceName: 'female' },
      femaleWise: { name: 'Wise Female', gender: 'female', pitch: 1.1, rate: 0.8, volume: 0.9, voiceName: 'female' },
      femaleYoung: { name: 'Young Female', gender: 'female', pitch: 1.3, rate: 1.0, volume: 1.0, voiceName: 'female' },
      grandmother: { name: 'Grandmother', gender: 'elder', pitch: 1.1, rate: 0.7, volume: 0.9, voiceName: 'female' },
      mother: { name: 'Mother', gender: 'female', pitch: 1.2, rate: 0.8, volume: 1.0, voiceName: 'female' },
      narrator: { name: 'Narrator', gender: 'female', pitch: 1.0, rate: 0.9, volume: 0.9, voiceName: 'female' }
    };
  }

  private detectCharacterGender(characterName: string, context: string): 'male' | 'female' | 'unknown' {
    const maleIndicators = ['he ', 'him ', 'his ', 'himself', 'man', 'boy', 'father', 'dad', 'brother', 'son', 'king', 'prince', 'lord', 'sir', 'mr.', 'gentleman', 'guy', 'male'];
    const femaleIndicators = ['she ', 'her ', 'hers', 'herself', 'woman', 'girl', 'mother', 'mom', 'sister', 'daughter', 'queen', 'princess', 'lady', 'madam', 'mrs.', 'ms.', 'miss', 'female'];
    const contextLower = context.toLowerCase();
    const nameLower = characterName.toLowerCase();
    const maleScore = maleIndicators.reduce((score, indicator) => score + (contextLower.includes(indicator) ? 1 : 0), 0);
    const femaleScore = femaleIndicators.reduce((score, indicator) => score + (contextLower.includes(indicator) ? 1 : 0), 0);
    const commonMaleNames = ['john', 'james', 'michael', 'david', 'william', 'richard', 'thomas', 'alexander'];
    const commonFemaleNames = ['mary', 'patricia', 'jennifer', 'linda', 'elizabeth', 'barbara', 'susan', 'sarah'];
    if (commonMaleNames.some(name => nameLower.includes(name))) return 'male';
    if (commonFemaleNames.some(name => nameLower.includes(name))) return 'female';
    if (maleScore > femaleScore) return 'male';
    if (femaleScore > maleScore) return 'female';
    return 'unknown';
  }

  private assignVoiceToCharacter(characterName: string, gender: 'male' | 'female' | 'unknown', storyGenre: string): VoiceProfile {
    const profiles = this.getVoiceProfiles();
    const existingVoices = Array.from(this.characterVoices.values()).map(cv => cv.voice.name);
    if (storyGenre.toLowerCase() === 'children') {
      if (characterName.toLowerCase().includes('grandmother') || characterName.toLowerCase().includes('grandma')) return profiles.grandmother;
      if (characterName.toLowerCase().includes('mother') || characterName.toLowerCase().includes('mom')) return profiles.mother;
      return profiles.grandmother;
    }
    if (gender === 'male') {
      const maleVoices = ['maleHero', 'maleVillain', 'maleWise', 'maleYoung'];
      for (const voiceKey of maleVoices) {
        if (!existingVoices.includes(profiles[voiceKey].name)) return profiles[voiceKey];
      }
      return profiles.maleHero;
    } else if (gender === 'female') {
      const femaleVoices = ['femaleHeroine', 'femaleVillainess', 'femaleWise', 'femaleYoung'];
      for (const voiceKey of femaleVoices) {
        if (!existingVoices.includes(profiles[voiceKey].name)) return profiles[voiceKey];
      }
      return profiles.femaleHeroine;
    }
    return profiles.narrator;
  }

  public async analyzeStoryCharacters(text: string, storyGenre: string): Promise<void> {
    if (!this.isInitialized) await this.initializeVoices();
    this.characterVoices.clear();
    this.characterVoices.set('narrator', { characterName: 'narrator', voice: this.getVoiceProfiles().narrator, isNarrator: true });
    const dialoguePattern = /"([^"]+)",?\s*([A-Za-z][a-zA-Z\s]*?)\s*(?:said|asked|replied|whispered|shouted|exclaimed)/g;
    const characters = new Set<string>();
    let match;
    while ((match = dialoguePattern.exec(text)) !== null) {
      const characterName = match[2].trim();
      if (characterName && characterName.length > 1 && characterName.length < 20) characters.add(characterName);
    }
    const introPattern = /([A-Z][a-zA-Z]+)\s+(?:was|is|stood|walked|looked|smiled|frowned|said)/g;
    while ((match = introPattern.exec(text)) !== null) {
      const characterName = match[1].trim();
      if (characterName && characterName.length > 2 && characterName.length < 15) characters.add(characterName);
    }
    characters.forEach(characterName => {
      const gender = this.detectCharacterGender(characterName, text);
      const voice = this.assignVoiceToCharacter(characterName, gender, storyGenre);
      this.characterVoices.set(characterName.toLowerCase(), { characterName, voice });
    });
  }

  private findBestVoice(voiceProfile: VoiceProfile): SpeechSynthesisVoice | null {
    if (!this.isInitialized || this.voices.length === 0) return null;
    const preferredVoices = this.voices.filter(voice => {
      const voiceName = voice.name.toLowerCase();
      const voiceLang = voice.lang.toLowerCase();
      if (!voiceLang.includes('en')) return false;
      if (voiceProfile.gender === 'male') return voiceName.includes('male') || voiceName.includes('man') || voiceName.includes('david') || voiceName.includes('mark');
      if (voiceProfile.gender === 'female') return voiceName.includes('female') || voiceName.includes('woman') || voiceName.includes('karen') || voiceName.includes('samantha');
      return true;
    });
    if (preferredVoices.length > 0) return preferredVoices[0];
    const englishVoices = this.voices.filter(voice => voice.lang.toLowerCase().includes('en'));
    return englishVoices.length > 0 ? englishVoices[0] : this.voices[0];
  }

  public async speakText(text: string, characterName?: string, onEnd?: () => void, onError?: (error: any) => void): Promise<void> {
    if (!this.isInitialized) {
      await this.initializeVoices();
    }

    if (this.synthesis.speaking) {
      this.synthesis.cancel();
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (this.watchdogTimer) clearTimeout(this.watchdogTimer);

    const cleanText = text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\*([^*]+)\*/g, '$1').replace(/_{1,2}([^_]+)_{1,2}/g, '$1').replace(/Chapter \d+:?\s*/g, '').trim();
    if (!cleanText) {
      onEnd?.();
      return;
    }

    let voiceProfile: VoiceProfile;
    const lowerCharacterName = characterName?.toLowerCase() || 'narrator';
    voiceProfile = this.characterVoices.has(lowerCharacterName) ? this.characterVoices.get(lowerCharacterName)!.voice : this.getVoiceProfiles().narrator;

    this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
    const voice = this.findBestVoice(voiceProfile);
    if (voice) {
      this.currentUtterance.voice = voice;
    }

    this.currentUtterance.pitch = Math.max(0, Math.min(2, voiceProfile.pitch));
    this.currentUtterance.rate = Math.max(0.1, Math.min(10, voiceProfile.rate));
    this.currentUtterance.volume = Math.max(0, Math.min(1, voiceProfile.volume));

    let hasEnded = false;
    const endHandler = () => {
      if (this.watchdogTimer) clearTimeout(this.watchdogTimer);
      if (!hasEnded) {
        hasEnded = true;
        this.currentUtterance = null;
        onEnd?.();
      }
    };

    this.currentUtterance.onend = endHandler;

    this.currentUtterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      console.error('[VoiceSynthesis] ❌ Speech error:', { error: event.error, type: event.type });
      endHandler(); // Ensure we always progress
    };

    // Watchdog timer
    const estimatedDuration = (cleanText.length / 15) * 1000; // Assuming 15 chars/sec
    const maxDuration = estimatedDuration + 5000; // Add 5 seconds buffer
    this.watchdogTimer = setTimeout(() => {
      console.warn('[VoiceSynthesis] 🟡 Watchdog triggered. Forcing end of speech.');
      endHandler();
    }, maxDuration);

    try {
      this.synthesis.speak(this.currentUtterance);
    } catch (err) {
      console.error('[VoiceSynthesis] Failed to start speech:', err);
      if (this.watchdogTimer) clearTimeout(this.watchdogTimer);
      onError?.(err);
    }
  }

  public stopSpeaking(): void {
    try {
      if (this.watchdogTimer) {
        clearTimeout(this.watchdogTimer);
        this.watchdogTimer = null;
      }
      if (this.synthesis.speaking || this.synthesis.pending) {
        this.synthesis.cancel();
      }
      this.currentUtterance = null;
    } catch (err) {
      console.error('[VoiceSynthesis] Error stopping speech:', err);
      this.currentUtterance = null;
    }
  }

  public pauseSpeaking(): void {
    if (this.synthesis.speaking && !this.synthesis.paused) this.synthesis.pause();
  }

  public resumeSpeaking(): void {
    if (this.synthesis.paused) this.synthesis.resume();
  }

  public isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  public isPaused(): boolean {
    return this.synthesis.paused;
  }

  public getCharacterVoices(): CharacterVoice[] {
    return Array.from(this.characterVoices.values());
  }

  public setCharacterVoice(characterName: string, voiceProfile: VoiceProfile): void {
    this.characterVoices.set(characterName.toLowerCase(), { characterName, voice: voiceProfile });
  }
}

export const voiceSynthesis = new VoiceSynthesisService();