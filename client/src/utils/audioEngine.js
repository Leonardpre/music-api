// Web Audio API engine for ambient editorial playback + HTML5 Audio support

class EditorialAudioEngine {
  constructor() {
    this.audioContext = null;
    this.activeOscillators = [];
    this.htmlAudio = new Audio();
    this.isPlaying = false;
    this.currentTrack = null;
    this.volume = 0.8;
    this.onTimeUpdateCallback = null;
    this.onEndedCallback = null;
    this.timer = null;
    this.currentTimeSeconds = 0;
    this.totalDurationSeconds = 200;

    this.htmlAudio.volume = this.volume;
    this.htmlAudio.ontimeupdate = () => {
      if (this.onTimeUpdateCallback && this.htmlAudio.duration) {
        this.currentTimeSeconds = this.htmlAudio.currentTime;
        this.totalDurationSeconds = this.htmlAudio.duration;
        this.onTimeUpdateCallback(this.currentTimeSeconds, this.totalDurationSeconds);
      }
    };
    this.htmlAudio.onended = () => {
      this.stop();
      if (this.onEndedCallback) this.onEndedCallback();
    };
  }

  initContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.htmlAudio) {
      this.htmlAudio.volume = this.volume;
    }
    if (this.masterGainNode) {
      this.masterGainNode.gain.setValueAtTime(this.volume * 0.25, this.audioContext.currentTime);
    }
  }

  playTrack(track, onTimeUpdate, onEnded) {
    this.stop();
    this.initContext();
    this.currentTrack = track;
    this.onTimeUpdateCallback = onTimeUpdate;
    this.onEndedCallback = onEnded;
    this.isPlaying = true;

    // Parse duration string e.g. "3:39" -> 219 seconds
    if (track.duration) {
      const parts = track.duration.split(':');
      if (parts.length === 2) {
        this.totalDurationSeconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      }
    } else {
      this.totalDurationSeconds = 180;
    }
    this.currentTimeSeconds = 0;

    if (track.audio && track.audio.startsWith('http') && (track.audio.endsWith('.mp3') || track.audio.endsWith('.wav'))) {
      this.htmlAudio.src = track.audio;
      this.htmlAudio.play().catch(() => {
        this.startSynthesizerMelody(track);
      });
    } else {
      this.startSynthesizerMelody(track);
    }
  }

  startSynthesizerMelody(track) {
    if (!this.audioContext) return;

    // Generate warm chord frequencies based on track ID or genre
    const baseFreqs = {
      "Afrobeats": [220.00, 277.18, 329.63, 440.00], // A Major / F# Minor feel
      "Anime J-Rock": [261.63, 329.63, 392.00, 523.25], // C Major energetic
      "Anime J-Pop": [293.66, 369.99, 440.00, 587.33], // D Major bright
      "Dark Pop": [174.61, 207.65, 261.63, 349.23], // F Minor dark vinyl
      "Default": [220.00, 261.63, 329.63, 392.00]
    };

    const freqs = baseFreqs[track.genre] || baseFreqs["Default"];
    
    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.gain.setValueAtTime(this.volume * 0.2, this.audioContext.currentTime);

    // Warm Low-pass filter for vintage analog feel
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.audioContext.currentTime);

    this.masterGainNode.connect(filter);
    filter.connect(this.audioContext.destination);

    freqs.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const oscGain = this.audioContext.createGain();
      
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);

      // Subtle LFO modulation for warm vinyl swell
      const lfo = this.audioContext.createOscillator();
      const lfoGain = this.audioContext.createGain();
      lfo.frequency.value = 0.5 + i * 0.2;
      lfoGain.gain.value = 4.0;
      lfo.connect(osc.frequency);
      lfo.start();

      oscGain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
      osc.connect(oscGain);
      oscGain.connect(this.masterGainNode);

      osc.start();
      this.activeOscillators.push(osc, lfo);
    });

    // Simulated progress timer
    this.timer = setInterval(() => {
      if (!this.isPlaying) return;
      this.currentTimeSeconds += 1;
      if (this.currentTimeSeconds >= this.totalDurationSeconds) {
        this.stop();
        if (this.onEndedCallback) this.onEndedCallback();
      } else if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.currentTimeSeconds, this.totalDurationSeconds);
      }
    }, 1000);
  }

  pause() {
    this.isPlaying = false;
    if (this.htmlAudio && !this.htmlAudio.paused) {
      this.htmlAudio.pause();
    }
    if (this.audioContext && this.audioContext.state === 'running') {
      this.audioContext.suspend();
    }
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  resume() {
    this.isPlaying = true;
    if (this.htmlAudio && this.htmlAudio.src) {
      this.htmlAudio.play();
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    if (!this.timer && this.currentTrack) {
      this.timer = setInterval(() => {
        if (!this.isPlaying) return;
        this.currentTimeSeconds += 1;
        if (this.currentTimeSeconds >= this.totalDurationSeconds) {
          this.stop();
          if (this.onEndedCallback) this.onEndedCallback();
        } else if (this.onTimeUpdateCallback) {
          this.onTimeUpdateCallback(this.currentTimeSeconds, this.totalDurationSeconds);
        }
      }, 1000);
    }
  }

  seek(seconds) {
    this.currentTimeSeconds = seconds;
    if (this.htmlAudio && this.htmlAudio.src && !isNaN(this.htmlAudio.duration)) {
      this.htmlAudio.currentTime = seconds;
    }
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(this.currentTimeSeconds, this.totalDurationSeconds);
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.htmlAudio) {
      this.htmlAudio.pause();
      this.htmlAudio.currentTime = 0;
    }
    this.activeOscillators.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch (e) {}
    });
    this.activeOscillators = [];
  }
}

export const audioEngine = new EditorialAudioEngine();
