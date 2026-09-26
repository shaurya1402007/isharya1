// Web Audio API Generative Romantic Soundscape & Interactive FX

class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private gainNode: GainNode | null = null;
  private currentChordIndex = 0;

  // Romantic chord progressions (F frequencies in Hz)
  private chords = [
    [174.61, 261.63, 329.63, 440.0], // F3, C4, E4, A4 (Fmaj7)
    [130.81, 196.0, 246.94, 329.63], // C3, G3, B3, E4 (Cmaj7)
    [146.83, 220.0, 261.63, 349.23, 440.0], // D3, A3, C4, F4, A4 (Dm7)
    [116.54, 174.61, 220.0, 293.66, 349.23], // Bb2, F3, A3, D4, F4 (Bbmaj7)
    [164.81, 246.94, 311.13, 392.0], // E3, B3, D#4, G4 (Em7)
    [220.0, 329.63, 392.0, 493.88], // A3, E4, G4, B4 (Am9)
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public start() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.scheduleNextArpeggio();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private scheduleNextArpeggio() {
    if (!this.isPlaying || !this.ctx || !this.gainNode) return;

    const chord = this.chords[this.currentChordIndex];
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;

    // Play dreamy warm piano-like notes with subtle delay
    chord.forEach((freq, idx) => {
      const noteDelay = idx * 0.18 + Math.random() * 0.05;
      const noteTime = this.ctx!.currentTime + noteDelay;

      const osc = this.ctx!.createOscillator();
      const noteGain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      // Soft triangle + sine blend for warm rhodes/piano tone
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      // Lowpass filter for cozy intimate warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800 + Math.random() * 400, noteTime);
      filter.Q.setValueAtTime(2, noteTime);

      // Natural piano attack & long decay
      noteGain.gain.setValueAtTime(0.0001, noteTime);
      noteGain.gain.exponentialRampToValueAtTime(0.16 / (idx + 1), noteTime + 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.00001, noteTime + 3.8);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.gainNode!);

      osc.start(noteTime);
      osc.stop(noteTime + 4.0);
    });

    // Schedule next chord in 3.6 to 4.2 seconds
    const interval = 3800 + Math.random() * 600;
    this.timer = window.setTimeout(() => {
      this.scheduleNextArpeggio();
    }, interval);
  }

  // Romantic interaction sound on slide change (crystal chime)
  public playChime(pitchMultiplier = 1.0) {
    try {
      this.initContext();
      if (!this.ctx || !this.gainNode) return;

      const now = this.ctx.currentTime;
      const pitches = [587.33, 783.99, 1046.5].map((f) => f * pitchMultiplier);

      pitches.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);

        gain.gain.setValueAtTime(0.001, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.06, now + i * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.6);

        osc.connect(gain);
        gain.connect(this.gainNode!);

        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.65);
      });
    } catch {
      // Audio context might be restricted before first click
    }
  }

  // Soft camera shutter sound for photo click
  public playHeartbeat() {
    try {
      this.initContext();
      if (!this.ctx || !this.gainNode) return;

      const now = this.ctx.currentTime;
      [0, 0.16].forEach((offset) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(65, now + offset);
        osc.frequency.exponentialRampToValueAtTime(45, now + offset + 0.12);

        gain.gain.setValueAtTime(0.12, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.14);

        osc.connect(gain);
        gain.connect(this.gainNode!);
        osc.start(now + offset);
        osc.stop(now + offset + 0.15);
      });
    } catch {
      // Ignore
    }
  }
}

export const audioEngine = new RomanticAudioEngine();
