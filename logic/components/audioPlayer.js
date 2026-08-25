// ==========================================
// CineFlow Ambient Audio & Commentary Engine
// ==========================================

export class CommentaryAudioPlayer {
  constructor(containerEl, options = {}) {
    this.containerEl = containerEl;
    this.duration = options.durationSeconds || 740; // ~12m 20s
    this.currentTime = 134; // starts at 02:14
    this.isPlaying = false;
    this.interval = null;
    this.audioCtx = null;
    this.oscillators = [];
    this.gainNode = null;
    this.onToggle = options.onToggle || null;

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.playBtn = this.containerEl.querySelector('#audio-toggle-btn');
    this.playIcon = this.containerEl.querySelector('#audio-play-icon');
    this.timeEl = this.containerEl.querySelector('#audio-current-time');
    this.waveformBars = this.containerEl.querySelectorAll('.v-film__waveform-bar');
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  _startSynthesizer() {
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
      this.gainNode.gain.exponentialRampToValueAtTime(0.08, this.audioCtx.currentTime + 1.5);
      this.gainNode.connect(this.audioCtx.destination);

      // Create ambient cinematic chord (D minor drone / cinematic chord: D2, A2, F3, A3)
      const freqs = [73.42, 110.00, 174.61, 220.00];
      this.oscillators = freqs.map(freq => {
        const osc = this.audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        osc.connect(this.gainNode);
        osc.start();
        return osc;
      });
    } catch (e) {
      console.warn('Web Audio synthesis not supported or permitted:', e);
    }
  }

  _stopSynthesizer() {
    if (this.gainNode && this.audioCtx) {
      try {
        this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.5);
        setTimeout(() => {
          this.oscillators.forEach(osc => {
            try { osc.stop(); osc.disconnect(); } catch (e) {}
          });
          this.oscillators = [];
        }, 500);
      } catch (e) {}
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.isPlaying = true;
    if (this.playIcon) this.playIcon.textContent = 'pause_circle';
    this._startSynthesizer();

    // Animate bars
    this.waveformBars.forEach((bar, idx) => {
      bar.classList.add('v-film__waveform-bar--active');
      bar.style.animationDelay = `${idx * 0.12}s`;
    });

    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.currentTime++;
      if (this.currentTime >= this.duration) {
        this.currentTime = 0;
      }
      if (this.timeEl) {
        this.timeEl.textContent = this.formatTime(this.currentTime);
      }
    }, 1000);

    if (this.onToggle) this.onToggle(true);
  }

  pause() {
    this.isPlaying = false;
    if (this.playIcon) this.playIcon.textContent = 'play_circle';
    this._stopSynthesizer();

    clearInterval(this.interval);
    this.waveformBars.forEach(bar => {
      bar.classList.remove('v-film__waveform-bar--active');
    });

    if (this.onToggle) this.onToggle(false);
  }

  bindEvents() {
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.toggle());
    }

    // Allow clicking waveform bars to seek
    const waveform = this.containerEl.querySelector('#audio-waveform');
    if (waveform) {
      waveform.style.cursor = 'pointer';
      waveform.title = 'Click to seek commentary audio';
      waveform.addEventListener('click', (e) => {
        const rect = waveform.getBoundingClientRect();
        const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.currentTime = Math.floor(clickRatio * this.duration);
        if (this.timeEl) {
          this.timeEl.textContent = this.formatTime(this.currentTime);
        }
        if (!this.isPlaying) {
          this.play();
        }
      });
    }
  }

  destroy() {
    this.pause();
  }
}
