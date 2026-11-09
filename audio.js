/**
 * PT Sumatera Kemasindo - Sound & Audio Engine
 * Provides dual-engine audio: Native HTML5 Audio + Web Audio API synthesizer.
 * Handles browser autoplay policies with smooth user-gesture activation.
 */

class AudioController {
  constructor() {
    this.audioContext = null;
    this.isMuted = true;
    this.isPlaying = false;
    this.ambientOscillators = [];
    this.ambientGain = null;
    this.hasUnlocked = false;

    // DOM Elements
    this.audioWelcome = document.getElementById('audioWelcome');
    this.audioClick = document.getElementById('audioClick');
    this.audioHover = document.getElementById('audioHover');
    this.btnToggle = document.getElementById('btnAudioToggle');
    this.audioLabel = document.getElementById('audioLabel');
    this.btnChimeReplay = document.getElementById('btnChimeReplay');
    this.cardLogoBtn = document.getElementById('cardLogoBtn');
    this.toast = document.getElementById('audioToast');

    this.init();
  }

  init() {
    // Attach listeners
    this.btnToggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleAudio();
    });

    this.btnChimeReplay?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.playChime(true);
    });

    this.cardLogoBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.playChime(true);
      this.playClickSfx();
    });

    // Hover sounds on interactive buttons
    document.querySelectorAll('.tool-btn, .card-icon-btn, .bottom-badge').forEach(el => {
      el.addEventListener('mouseenter', () => this.playHoverSfx());
    });

    // Global first-click unlock listener
    const unlockHandler = () => {
      if (!this.hasUnlocked) {
        this.unlockAudio();
      }
    };
    window.addEventListener('pointerdown', unlockHandler, { once: true });
    window.addEventListener('keydown', unlockHandler, { once: true });

    this.toast?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.unlockAudio();
    });
  }

  ensureContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  unlockAudio() {
    this.hasUnlocked = true;
    this.isMuted = false;
    this.isPlaying = true;
    this.ensureContext();

    // Hide initial gesture prompt
    if (this.toast) {
      this.toast.classList.add('hide');
    }

    this.updateUI();

    // Play Welcome Chime
    this.playChime();

    // Start soothing background ambient loop
    this.startAmbient();
  }

  toggleAudio() {
    this.ensureContext();
    this.hasUnlocked = true;
    this.isMuted = !this.isMuted;
    this.isPlaying = !this.isMuted;

    if (this.toast) {
      this.toast.classList.add('hide');
    }

    if (this.isMuted) {
      this.stopAmbient();
      if (this.audioWelcome) this.audioWelcome.pause();
    } else {
      this.startAmbient();
      this.playChime();
    }

    this.updateUI();
  }

  updateUI() {
    if (this.isPlaying && !this.isMuted) {
      document.body.classList.add('audio-playing');
      if (this.audioLabel) this.audioLabel.textContent = 'Sound On';
    } else {
      document.body.classList.remove('audio-playing');
      if (this.audioLabel) this.audioLabel.textContent = 'Muted';
    }
  }

  /**
   * Plays the luxury corporate welcome chime
   * Uses native WAV element if loaded, complemented by Web Audio API crystal harmonics.
   */
  playChime(forceWebAudio = false) {
    if (this.isMuted && !forceWebAudio) return;
    this.ensureContext();

    // Play WAV file if available
    if (this.audioWelcome && !forceWebAudio) {
      this.audioWelcome.currentTime = 0;
      this.audioWelcome.volume = 0.85;
      const playPromise = this.audioWelcome.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback to Web Audio synthesis if browser policy or codec blocked
          this.synthesizeChime();
        });
      }
    } else {
      this.synthesizeChime();
    }
  }

  /**
   * Synthesizes a luxury crystal welcome chime using Web Audio API
   * Resonant Major 9th chord progression: C4, E4, G4, C5, E5, G5
   */
  synthesizeChime() {
    this.ensureContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const notes = [
      { freq: 261.63, delay: 0.00, dur: 3.5, gain: 0.22, type: 'sine' },      // C4
      { freq: 329.63, delay: 0.08, dur: 3.6, gain: 0.20, type: 'sine' },      // E4
      { freq: 392.00, delay: 0.18, dur: 4.0, gain: 0.18, type: 'sine' },      // G4
      { freq: 523.25, delay: 0.28, dur: 4.4, gain: 0.16, type: 'sine' },      // C5
      { freq: 659.25, delay: 0.38, dur: 4.8, gain: 0.14, type: 'triangle' },  // E5
      { freq: 783.99, delay: 0.48, dur: 5.2, gain: 0.11, type: 'sine' },      // G5
      { freq: 1046.50, delay: 0.58, dur: 5.6, gain: 0.08, type: 'sine' }      // C6 (sparkle)
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = n.type;
      osc.frequency.setValueAtTime(n.freq, now + n.delay);

      // Fast exponential envelope for bell chime resonance
      gain.gain.setValueAtTime(0.0001, now + n.delay);
      gain.gain.linearRampToValueAtTime(n.gain, now + n.delay + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.delay + n.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + n.delay);
      osc.stop(now + n.delay + n.dur);
    });
  }

  /**
   * Starts a tranquil industrial ambient background soundscape
   */
  startAmbient() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioContext) return;

    this.stopAmbient();

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.0001, now);
    this.ambientGain.gain.linearRampToValueAtTime(0.07, now + 3.0); // smooth 3s fade in
    this.ambientGain.connect(ctx.destination);

    // Subtle warm chord drone: C2 (65.41Hz), G2 (98.00Hz), C3 (130.81Hz), E3 (164.81Hz)
    const freqs = [65.41, 98.00, 130.81, 164.81];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Low pass filter for soft velvet texture
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320 + idx * 40, now);

      osc.connect(filter);
      filter.connect(this.ambientGain);

      osc.start(now);
      this.ambientOscillators.push(osc);
    });
  }

  stopAmbient() {
    if (this.ambientGain && this.audioContext) {
      const now = this.audioContext.currentTime;
      this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
      setTimeout(() => {
        this.ambientOscillators.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch (e) {}
        });
        this.ambientOscillators = [];
        this.ambientGain = null;
      }, 900);
    }
  }

  playClickSfx() {
    if (this.isMuted) return;
    if (this.audioClick) {
      this.audioClick.currentTime = 0;
      this.audioClick.volume = 0.4;
      this.audioClick.play().catch(() => {});
    }
  }

  playHoverSfx() {
    if (this.isMuted) return;
    if (this.audioHover) {
      this.audioHover.currentTime = 0;
      this.audioHover.volume = 0.25;
      this.audioHover.play().catch(() => {});
    }
  }
}

// Instantiate globally when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.audioController = new AudioController();
});
