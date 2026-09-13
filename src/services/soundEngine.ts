/**
 * High-Fidelity Acoustic Violin & Audio Synthesis Engine
 * Pure Web Audio API - physical acoustic modeling of bowed strings,
 * wood resonance formants, rosin bow bite friction, organic vibrato, and pitch reference.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.85;

  // Active continuous drone for tuner
  private activeDroneNodes: {
    osc: OscillatorNode;
    harm: OscillatorNode;
    gain: GainNode;
  } | null = null;

  private initContext(): AudioContext | null {
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopContinuousTone();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Generates a 0.1s buffer of realistic rosin friction noise (bow scrape)
   */
  private createRosinNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const bufferSize = Math.floor(ctx.sampleRate * 0.12);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;

    // Filtered pink-ish noise with high frequency scraping
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      const pink = b0 + b1 + b2 + white * 0.5362;
      output[i] = pink * 0.15;
    }
    return buffer;
  }

  /**
   * Plays a realistic acoustic bowed violin note
   * @param freq frequency in Hz
   * @param duration in seconds
   * @param articulation 'bow' | 'pizzicato'
   * @param direction 'down' (firmer heel attack) or 'up' (smoother stroke)
   */
  public playViolinNote(
    freq: number,
    duration: number = 1.3,
    articulation: 'bow' | 'pizzicato' = 'bow',
    direction: 'down' | 'up' = 'down'
  ) {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * 0.55, now);
      masterGain.connect(ctx.destination);

      if (articulation === 'pizzicato') {
        // --- REALISTIC ACOUSTIC PIZZICATO ---
        // Pluck impulse + rich acoustic body resonance with quick woody thump
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const bodyThump = ctx.createOscillator();

        const filter = ctx.createBiquadFilter();
        const env = ctx.createGain();
        const thumpGain = ctx.createGain();

        // Main vibrating string harmonics
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(freq, now);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2.002, now); // Octave overtone

        // Low body thump (finger snap on string)
        bodyThump.type = 'sine';
        bodyThump.frequency.setValueAtTime(260, now);
        bodyThump.frequency.exponentialRampToValueAtTime(120, now + 0.06);

        thumpGain.gain.setValueAtTime(0.3, now);
        thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

        // Warm lowpass filter with decay
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(Math.min(4500, freq * 4), now);
        filter.frequency.exponentialRampToValueAtTime(Math.max(300, freq * 0.9), now + duration * 0.7);

        // Fast attack, exponential plucked decay
        env.gain.setValueAtTime(0, now);
        env.gain.linearRampToValueAtTime(0.9, now + 0.005);
        env.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.85);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(env);
        env.connect(masterGain);

        bodyThump.connect(thumpGain);
        thumpGain.connect(masterGain);

        osc1.start(now);
        osc2.start(now);
        bodyThump.start(now);

        osc1.stop(now + duration);
        osc2.stop(now + duration);
        bodyThump.stop(now + 0.08);
      } else {
        // --- REALISTIC ACOUSTIC BOWED STRING ---
        // 1. Dual rich oscillators with micro-detune for authentic chorus/string warmth
        const oscMain = ctx.createOscillator();
        const oscHarmonic = ctx.createOscillator();

        oscMain.type = 'sawtooth';
        oscMain.frequency.setValueAtTime(freq, now);

        oscHarmonic.type = 'sawtooth';
        // Subtle 1.2 cent organic phase shift
        oscHarmonic.frequency.setValueAtTime(freq * 1.0008, now);

        const harmGain = ctx.createGain();
        harmGain.gain.setValueAtTime(0.35, now);
        oscHarmonic.connect(harmGain);

        // 2. Rosin Bow Friction Noise Burst (the signature "bite" at stroke onset)
        try {
          const noiseBuffer = this.createRosinNoiseBuffer(ctx);
          const noiseSource = ctx.createBufferSource();
          noiseSource.buffer = noiseBuffer;

          const noiseFilter = ctx.createBiquadFilter();
          noiseFilter.type = 'bandpass';
          noiseFilter.frequency.setValueAtTime(Math.min(3800, freq * 3.2), now);
          noiseFilter.Q.setValueAtTime(1.5, now);

          const noiseGain = ctx.createGain();
          const attackBite = direction === 'down' ? 0.28 : 0.18;
          noiseGain.gain.setValueAtTime(attackBite, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

          noiseSource.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(masterGain);

          noiseSource.start(now);
          noiseSource.stop(now + 0.1);
        } catch {
          // Noise fallback
        }

        // 3. Violin Wood Resonance Formant Filters
        // Formant 1: Wood body f1 resonance (~480 Hz)
        const woodFormant = ctx.createBiquadFilter();
        woodFormant.type = 'peaking';
        woodFormant.frequency.setValueAtTime(480, now);
        woodFormant.Q.setValueAtTime(2.2, now);
        woodFormant.gain.setValueAtTime(4.5, now);

        // Formant 2: Bridge hill peak brilliance (~2800 Hz)
        const bridgeFormant = ctx.createBiquadFilter();
        bridgeFormant.type = 'peaking';
        bridgeFormant.frequency.setValueAtTime(2800, now);
        bridgeFormant.Q.setValueAtTime(2.0, now);
        bridgeFormant.gain.setValueAtTime(3.8, now);

        // Formant 3: Natural acoustic rolloff above 6800 Hz (cuts harsh digital buzzer tone)
        const airCutFilter = ctx.createBiquadFilter();
        airCutFilter.type = 'lowpass';
        airCutFilter.frequency.setValueAtTime(Math.min(7200, freq * 6), now);
        airCutFilter.Q.setValueAtTime(0.7, now);

        // 4. Organic Human Vibrato
        // Delayed onset: real violinists bow before vibrato kicks in
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(5.6, now); // 5.6 Hz natural expressive speed
        lfoGain.gain.setValueAtTime(0, now);
        lfoGain.gain.setValueAtTime(0, now + 0.18);
        lfoGain.gain.linearRampToValueAtTime(freq * 0.014, now + 0.5); // ~1.4% pitch depth

        lfo.connect(lfoGain);
        lfoGain.connect(oscMain.frequency);
        lfoGain.connect(oscHarmonic.frequency);

        // 5. Natural Bow ADSR Dynamic Envelope
        const bowEnv = ctx.createGain();
        const attackTime = direction === 'down' ? 0.06 : 0.09;
        const releaseTime = 0.16;

        bowEnv.gain.setValueAtTime(0.001, now);
        // Bow acceleration into string
        bowEnv.gain.linearRampToValueAtTime(0.85, now + attackTime);
        // Steady singing sustain
        bowEnv.gain.setValueAtTime(0.85, Math.max(now + attackTime, now + duration - releaseTime));
        // Natural release of vibrating wood box
        bowEnv.gain.exponentialRampToValueAtTime(0.001, now + duration);

        // Connect audio graph
        oscMain.connect(woodFormant);
        harmGain.connect(woodFormant);
        woodFormant.connect(bridgeFormant);
        bridgeFormant.connect(airCutFilter);
        airCutFilter.connect(bowEnv);
        bowEnv.connect(masterGain);

        lfo.start(now);
        oscMain.start(now);
        oscHarmonic.start(now);

        lfo.stop(now + duration + 0.05);
        oscMain.stop(now + duration + 0.05);
        oscHarmonic.stop(now + duration + 0.05);
      }
    } catch {
      // AudioContext fallback
    }
  }

  /**
   * Starts a continuous, steady acoustic violin drone for tuning reference
   */
  public startContinuousTone(freq: number) {
    if (this.isMuted) return;
    this.stopContinuousTone();

    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const harm = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      harm.type = 'triangle';
      harm.frequency.setValueAtTime(freq * 2, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.min(3500, freq * 4), now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(this.volume * 0.4, now + 0.15);

      osc.connect(filter);
      harm.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      harm.start(now);

      this.activeDroneNodes = { osc, harm, gain };
    } catch {
      // Fallback
    }
  }

  /**
   * Stops active continuous drone tone
   */
  public stopContinuousTone() {
    if (!this.activeDroneNodes || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const { osc, harm, gain } = this.activeDroneNodes;
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      setTimeout(() => {
        try {
          osc.stop();
          harm.stop();
          osc.disconnect();
          harm.disconnect();
          gain.disconnect();
        } catch {
          // Ignore
        }
      }, 90);
      this.activeDroneNodes = null;
    } catch {
      this.activeDroneNodes = null;
    }
  }

  /**
   * Positive reinforcement chime for collecting rewards
   */
  public playRewardChime(level: 'small' | 'major' = 'small') {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes =
        level === 'major'
          ? [523.25, 659.25, 783.99, 1046.5, 1318.51]
          : [587.33, 739.99, 880.0];

      notes.forEach((freq, idx) => {
        if (!ctx) return;
        const noteTime = now + idx * 0.065;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(this.volume * 0.3, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.5);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Sound effect for rhythmic tap feedback
   */
  public playRhythmClick(quality: 'perfect' | 'good' | 'miss') {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (quality === 'perfect') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.12);
        gain.gain.setValueAtTime(this.volume * 0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      } else if (quality === 'good') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(659.25, now);
        gain.gain.setValueAtTime(this.volume * 0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.1);
        gain.gain.setValueAtTime(this.volume * 0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Catch
    }
  }

  /**
   * Plays two notes together (double stops / chord / interval) in bowed acoustic violin sound
   */
  public playInterval(freq1: number, freq2: number, duration: number = 2.0) {
    if (this.isMuted) return;
    this.playViolinNote(freq1, duration, 'bow');
    this.playViolinNote(freq2, duration, 'bow');
  }

  /**
   * Metronome click
   */
  public playMetronomeTick(isStrongBeat: boolean = false) {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isStrongBeat ? 800 : 500, now);

      gain.gain.setValueAtTime(this.volume * (isStrongBeat ? 0.2 : 0.12), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Catch
    }
  }
}

export const soundEngine = new SoundEngine();
