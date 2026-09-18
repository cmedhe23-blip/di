// Zero-dependency procedural Web Audio sound synthesizer for magical cosmic interactions
import { detectWebAudio } from "./featureDetection";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isAmbientPlaying: boolean = false;
  private activeOscillators: Set<OscillatorNode> = new Set();
  private ambientTimeoutId: number | null = null;
  private audioSupported: boolean = false;

  constructor() {
    this.audioSupported = detectWebAudio();
    if (!this.audioSupported) {
      console.info('ℹ️ Web Audio API not available - sound effects will be silent');
    }
  }

  private initCtx() {
    if (!this.audioSupported) return null;
    
    if (!this.ctx && typeof window !== "undefined") {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      } catch (error) {
        console.warn("Failed to create AudioContext:", error);
        return null;
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch((error) => {
        console.warn("Failed to resume AudioContext:", error);
      });
    }
    return this.ctx;
  }

  // Clean up an oscillator after it stops
  private cleanupOscillator(osc: OscillatorNode, stopTime: number) {
    setTimeout(() => {
      this.activeOscillators.delete(osc);
      try {
        osc.disconnect();
      } catch {
        // Already disconnected
      }
    }, (stopTime - (this.ctx?.currentTime || 0)) * 1000 + 100);
  }

  // Soft fairy glockenspiel chime for button clicks & navigation
  playChime(freq = 880) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      const stopTime = ctx.currentTime + 0.4;
      osc.start();
      osc.stop(stopTime);

      this.activeOscillators.add(osc);
      this.cleanupOscillator(osc, stopTime);
    } catch (error) {
      console.warn("Failed to play chime:", error);
    }
  }

  // Sweet acoustic bubble pop for balloons
  playPop() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(320 + Math.random() * 120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900 + Math.random() * 200, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      const stopTime = ctx.currentTime + 0.12;
      osc.start();
      osc.stop(stopTime);

      this.activeOscillators.add(osc);
      this.cleanupOscillator(osc, stopTime);
    } catch (error) {
      console.warn("Failed to play pop:", error);
    }
  }

  // Soft wind whoosh when blowing out candle
  playWhoosh() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.35);
      filter.Q.setValueAtTime(3, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.35);

      // Follow with a small chime
      setTimeout(() => this.playChime(1100), 120);
    } catch (error) {
      console.warn("Failed to play whoosh:", error);
    }
  }

  // Ascending celestial harp chord for unlocking chests / secrets
  playHarp() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    notes.forEach((note, i) => {
      setTimeout(() => {
        const ctx = this.initCtx();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(note, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      }, i * 65);
    });
  }

  // Sparkle arpeggio for photos and celestial interactions
  playSparkle() {
    if (this.isMuted) return;
    const notes = [880, 1174.66, 1396.91, 1760];
    notes.forEach((note, i) => {
      setTimeout(() => {
        const ctx = this.initCtx();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(note, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }, i * 50);
    });
  }

  // Firework explosion rumble + crackle
  playFirework() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    // Deep thud
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);

    // Crackle sparkles
    for (let i = 0; i < 4; i++) {
      setTimeout(() => this.playChime(1200 + Math.random() * 600), 80 + i * 45);
    }
  }

  // Toggle procedural ambient music generator
  toggleAmbient(enable?: boolean): boolean {
    const targetState = enable !== undefined ? enable : !this.isAmbientPlaying;
    const ctx = this.initCtx();
    if (!ctx) return false;

    if (!targetState) {
      if (this.ambientGain) {
        this.ambientGain.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
      }
      this.isAmbientPlaying = false;
      if (this.ambientTimeoutId !== null) {
        clearTimeout(this.ambientTimeoutId);
        this.ambientTimeoutId = null;
      }
      return false;
    }

    if (this.isAmbientPlaying) return true;

    try {
      // Create a gentle generative chime loop
      this.ambientGain = ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.04, ctx.currentTime);
      this.ambientGain.connect(ctx.destination);

      this.isAmbientPlaying = true;
      this.scheduleAmbientNote();
      return true;
    } catch (error) {
      console.warn("Failed to start ambient music:", error);
      return false;
    }
  }

  private scheduleAmbientNote() {
    if (!this.isAmbientPlaying) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 659.25, 783.99]; // Pentatonic C Major
      const freq = scale[Math.floor(Math.random() * scale.length)] || 440;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.8);

      if (this.ambientGain) {
        osc.connect(gain);
        gain.connect(this.ambientGain);
        
        const stopTime = ctx.currentTime + 2.8;
        osc.start();
        osc.stop(stopTime);
        
        this.activeOscillators.add(osc);
        this.cleanupOscillator(osc, stopTime);
      }

      const nextDelay = 800 + Math.random() * 1200;
      this.ambientTimeoutId = window.setTimeout(() => this.scheduleAmbientNote(), nextDelay);
    } catch (error) {
      console.warn("Failed to schedule ambient note:", error);
      this.isAmbientPlaying = false;
    }
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
    if (mute && this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }

  // Clean up all audio resources
  cleanup() {
    // Stop ambient music
    this.isAmbientPlaying = false;
    if (this.ambientTimeoutId !== null) {
      clearTimeout(this.ambientTimeoutId);
      this.ambientTimeoutId = null;
    }

    // Stop all active oscillators
    this.activeOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Already stopped/disconnected
      }
    });
    this.activeOscillators.clear();

    // Close audio context
    if (this.ctx && this.ctx.state !== "closed") {
      this.ctx.close().catch(() => {
        // Context already closed
      });
      this.ctx = null;
    }
    
    this.ambientGain = null;
  }

  // Dedicated rich button sounds & chords
  playButtonSound(type: "default" | "magic" | "gold" | "cosmic" | "glass" | "nav-next" | "nav-prev" | "pop" | "sparkle" | "chime" | "harp" | "neon" | "aurora" = "default") {
    if (this.isMuted) return;
    switch (type) {
      case "gold":
        // Radiant golden major third chord
        [1046.5, 1318.51].forEach((freq, idx) => {
          setTimeout(() => this.playChime(freq), idx * 30);
        });
        break;
      case "magic":
      case "aurora":
        this.playSparkle();
        break;
      case "cosmic":
      case "neon":
        // Ethereal deep harmonic chime
        [587.33, 880, 1174.66].forEach((freq, idx) => {
          setTimeout(() => this.playChime(freq), idx * 40);
        });
        break;
      case "glass":
        this.playChime(987.77); // B5 crystal ping
        break;
      case "nav-next":
        // Upward pleasant step
        this.playChime(880);
        setTimeout(() => this.playChime(1174.66), 45);
        break;
      case "nav-prev":
        // Downward soft step
        this.playChime(1046.5);
        setTimeout(() => this.playChime(783.99), 45);
        break;
      case "pop":
        this.playPop();
        break;
      case "sparkle":
        this.playSparkle();
        break;
      case "harp":
        this.playHarp();
        break;
      case "chime":
      default:
        this.playChime(880);
        break;
    }
  }
}

export const sound = new SoundEngine();
