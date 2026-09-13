import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../services/soundEngine';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  ArrowDown,
  ArrowUp,
  AlertTriangle,
  Info,
  Radio,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ViolinStringTarget {
  name: string;
  note: string;
  freq: number;
  description: string;
  order: number;
  color: string;
}

const VIOLIN_STRINGS: ViolinStringTarget[] = [
  {
    name: 'La',
    note: 'A4',
    freq: 440.0,
    description: '1º Cuerda a afinar (440 Hz). Es la referencia de toda la orquesta.',
    order: 1,
    color: '#FF5F00',
  },
  {
    name: 'Re',
    note: 'D4',
    freq: 293.66,
    description: '2º Cuerda a afinar. Tono cálido en el medio del violín.',
    order: 2,
    color: '#3B82F6',
  },
  {
    name: 'Sol',
    note: 'G3',
    freq: 196.0,
    description: '3º Cuerda a afinar. La más gruesa, grave y resonante.',
    order: 3,
    color: '#10B981',
  },
  {
    name: 'Mi',
    note: 'E5',
    freq: 659.25,
    description: '4º Cuerda a afinar. La más fina y brillante. ¡Cuidado: afinar con microafinador!',
    order: 4,
    color: '#EC4899',
  },
];

const NOTE_NAMES = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];

export const ViolinTuner: React.FC = () => {
  // Mode: 'mic' | 'reference'
  const [activeMode, setActiveMode] = useState<'mic' | 'reference'>('mic');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);

  // Pitch Detection State
  const [detectedFreq, setDetectedFreq] = useState<number | null>(null);
  const [detectedNoteName, setDetectedNoteName] = useState<string>('--');
  const [centsOffset, setCentsOffset] = useState<number>(0);
  const [matchedString, setMatchedString] = useState<ViolinStringTarget | null>(null);
  const [isInTune, setIsInTune] = useState<boolean>(false);

  // Drone reference sound state
  const [activeDroneFreq, setActiveDroneFreq] = useState<number | null>(null);

  // Web Audio Nodes for Mic
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Track lock for celebration chime
  const lockedRef = useRef<boolean>(false);

  // Fifths playback state & guide expansion
  const [playingFifth, setPlayingFifth] = useState<string | null>(null);
  const [showFifthsGuide, setShowFifthsGuide] = useState<boolean>(true);

  const handlePlayFifth = (pairName: string, f1: number, f2: number) => {
    setPlayingFifth(pairName);
    soundEngine.playInterval(f1, f2, 2.8);
    setTimeout(() => {
      setPlayingFifth((current) => (current === pairName ? null : current));
    }, 2800);
  };

  // Autocorrelation pitch detector
  const autoCorrelate = (buffer: Float32Array, sampleRate: number): number => {
    const SIZE = buffer.length;
    let sumOfSquares = 0;
    for (let i = 0; i < SIZE; i++) {
      const val = buffer[i];
      sumOfSquares += val * val;
    }
    const rms = Math.sqrt(sumOfSquares / SIZE);
    // If signal too quiet, ignore
    if (rms < 0.015) {
      return -1;
    }

    // Trim quiet ends
    let r1 = 0;
    let r2 = SIZE - 1;
    const thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buffer[i]) < thres) {
        r1 = i;
        break;
      }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buffer[SIZE - i]) < thres) {
        r2 = SIZE - i;
        break;
      }
    }

    const trimmed = buffer.slice(r1, r2);
    const c = new Array(trimmed.length).fill(0);
    for (let i = 0; i < trimmed.length; i++) {
      for (let j = 0; j < trimmed.length - i; j++) {
        c[i] = c[i] + trimmed[j] * trimmed[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1;
    let maxpos = -1;
    for (let i = d; i < trimmed.length; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;

    // Parabolic interpolation for fine tuning
    const x1 = c[T0 - 1] || 0;
    const x2 = c[T0] || 0;
    const x3 = c[T0 + 1] || 0;
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) {
      T0 = T0 - b / (2 * a);
    }

    return sampleRate / T0;
  };

  const getNoteFromFreq = (freq: number) => {
    const noteNum = 12 * (Math.log(freq / 440) / Math.log(2));
    const roundedNote = Math.round(noteNum) + 69;
    const noteIndex = (roundedNote % 12 + 12) % 12;
    const octave = Math.floor(roundedNote / 12) - 1;
    const standardFreq = 440 * Math.pow(2, (roundedNote - 69) / 12);
    const cents = Math.floor((1200 * Math.log(freq / standardFreq)) / Math.log(2));

    return {
      noteName: `${NOTE_NAMES[noteIndex]}${octave}`,
      cents,
      standardFreq,
    };
  };

  const startMicTuner = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsListening(true);
      runPitchLoop();
    } catch (err) {
      setMicError('No se pudo acceder al micrófono. Verifica los permisos en tu navegador o usa los tonos de referencia abajo.');
      setIsListening(false);
    }
  };

  const stopMicTuner = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsListening(false);
    setDetectedFreq(null);
    setDetectedNoteName('--');
    setCentsOffset(0);
    setMatchedString(null);
    setIsInTune(false);
    lockedRef.current = false;
  };

  const runPitchLoop = () => {
    if (!analyserRef.current || !audioContextRef.current) return;
    const buffer = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buffer);

    const freq = autoCorrelate(buffer, audioContextRef.current.sampleRate);

    // Range for violin (G3 ~196Hz to E6 ~1300Hz)
    if (freq > 140 && freq < 1400) {
      setDetectedFreq(Math.round(freq * 10) / 10);
      const { noteName, cents } = getNoteFromFreq(freq);
      setDetectedNoteName(noteName);
      setCentsOffset(Math.max(-50, Math.min(50, cents)));

      // Find closest open string
      let closest: ViolinStringTarget | null = null;
      let minDiff = 60; // within 60 Hz or so
      VIOLIN_STRINGS.forEach((st) => {
        const diff = Math.abs(freq - st.freq);
        if (diff < minDiff) {
          minDiff = diff;
          closest = st;
        }
      });
      setMatchedString(closest);

      const inTuneNow = Math.abs(cents) <= 4;
      setIsInTune(inTuneNow);

      if (inTuneNow && !lockedRef.current) {
        lockedRef.current = true;
        soundEngine.playRewardChime('small');
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.5 },
        });
      } else if (!inTuneNow) {
        lockedRef.current = false;
      }
    } else {
      // Noise/silence
      if (detectedFreq !== null) {
        // keep last readable note for a brief moment or reset
      }
    }

    animationFrameRef.current = requestAnimationFrame(runPitchLoop);
  };

  useEffect(() => {
    return () => {
      stopMicTuner();
      soundEngine.stopContinuousTone();
    };
  }, []);

  const handleToggleDrone = (freq: number) => {
    if (activeDroneFreq === freq) {
      soundEngine.stopContinuousTone();
      setActiveDroneFreq(null);
    } else {
      soundEngine.startContinuousTone(freq);
      setActiveDroneFreq(freq);
    }
  };

  const handlePlayOneShot = (freq: number) => {
    soundEngine.playViolinNote(freq, 2.5, 'bow', 'down');
  };

  // Needle angle for gauge (-45 deg to +45 deg)
  const needleAngle = (centsOffset / 50) * 45;

  return (
    <div id="violin-tuner-container" className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#FF5F00] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-[#FF5F00] uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Afinador de Precisión</span>
            <span className="font-manga text-[11px] text-black">「バイオリン・チューナー」</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-black">
            Afinador de Violín en Vivo
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-xl font-medium leading-relaxed">
            Afina tu instrumento con el micrófono en tiempo real o escucha los tonos de referencia acústicos reales para Sol, Re, La y Mi.
          </p>
        </div>

        {/* Mode Selector Pill */}
        <div className="flex items-center bg-zinc-100 border-2 border-black rounded-2xl p-1 gap-1 shadow-[2px_2px_0px_#000000]">
          <button
            id="tuner-mode-mic-btn"
            onClick={() => {
              setActiveMode('mic');
              soundEngine.stopContinuousTone();
              setActiveDroneFreq(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeMode === 'mic'
                ? 'bg-[#FF5F00] text-black shadow-xs'
                : 'text-zinc-700 hover:text-black'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Micrófono</span>
          </button>
          <button
            id="tuner-mode-ref-btn"
            onClick={() => {
              setActiveMode('reference');
              stopMicTuner();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeMode === 'reference'
                ? 'bg-[#FF5F00] text-black shadow-xs'
                : 'text-zinc-700 hover:text-black'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Diapasón</span>
          </button>
        </div>
      </div>

      {/* MODE 1: MIC IN REAL TIME */}
      {activeMode === 'mic' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Dial & Gauge Panel */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#000000] flex flex-col items-center justify-between text-center relative overflow-hidden">
            {/* Top status */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    isListening ? 'bg-[#FF5F00] animate-ping' : 'bg-zinc-400'
                  }`}
                />
                <span className="text-xs font-black text-black">
                  {isListening ? 'Escuchando tu violín...' : 'Micrófono apagado'}
                </span>
              </div>

              {matchedString && (
                <span className="px-3 py-1 rounded-xl text-xs font-black bg-orange-100 border-2 border-black text-[#FF5F00] shadow-[2px_2px_0px_#000000]">
                  Cuerda {matchedString.name} ({matchedString.note})
                </span>
              )}
            </div>

            {/* Central Big Note Display */}
            <div className="my-6 flex flex-col items-center">
              <div
                className={`text-6xl sm:text-7xl font-black transition-all ${
                  isInTune
                    ? 'text-[#FF5F00] scale-110 drop-shadow-[0_0_20px_rgba(255,95,0,0.6)]'
                    : 'text-black'
                }`}
              >
                {detectedNoteName}
              </div>

              <div className="flex items-center gap-3 mt-2 text-sm font-bold text-zinc-600">
                <span>{detectedFreq ? `${detectedFreq} Hz` : '0.0 Hz'}</span>
                <span>•</span>
                <span
                  className={`font-black ${
                    Math.abs(centsOffset) <= 4
                      ? 'text-[#FF5F00]'
                      : centsOffset < 0
                      ? 'text-blue-600'
                      : 'text-amber-600'
                  }`}
                >
                  {centsOffset > 0 ? `+${centsOffset} cents` : `${centsOffset} cents`}
                </span>
              </div>

              {/* Status Message Badge */}
              <div className="mt-4">
                {isInTune ? (
                  <div className="px-4 py-1.5 rounded-full bg-[#FF5F00] text-black font-black text-sm flex items-center gap-2 border-2 border-black shadow-[3px_3px_0px_#000000] animate-bounce">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>¡AFINADO PERFECTO!</span>
                  </div>
                ) : centsOffset < -4 && detectedFreq ? (
                  <div className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-900 font-bold text-xs flex items-center gap-1.5 border border-blue-300">
                    <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                    <span>Nota GRAVE: Tensa un poquito (Gira a la derecha)</span>
                  </div>
                ) : centsOffset > 4 && detectedFreq ? (
                  <div className="px-4 py-1.5 rounded-full bg-amber-50 text-amber-900 font-bold text-xs flex items-center gap-1.5 border border-amber-300">
                    <ArrowDown className="w-3.5 h-3.5 text-amber-600" />
                    <span>Nota AGUDA: Afloja un poquito (Gira a la izquierda)</span>
                  </div>
                ) : (
                  <div className="text-xs text-zinc-600 font-medium">
                    Toca una cuerda con el arco o con pizzicato cerca del micrófono
                  </div>
                )}
              </div>
            </div>

            {/* Visual Needle / Arch Meter */}
            <div className="w-full max-w-md relative pt-4 pb-2">
              {/* Arc baseline */}
              <div className="h-3 w-full bg-zinc-200 rounded-full overflow-hidden flex border-2 border-black">
                <div className="w-5/12 bg-blue-400" />
                <div className="w-2/12 bg-[#FF5F00]" />
                <div className="w-5/12 bg-amber-400" />
              </div>

              {/* Scale Ticks */}
              <div className="flex justify-between text-[10px] text-zinc-600 font-bold mt-1 px-1">
                <span>-50 (Grave)</span>
                <span>-25</span>
                <span className="text-[#FF5F00] font-black">0 (Afinado)</span>
                <span>+25</span>
                <span>+50 (Agudo)</span>
              </div>

              {/* Center Needle Marker */}
              <div
                className="w-2 h-6 bg-black border border-white rounded-full absolute -top-1 transition-all duration-75 shadow-sm"
                style={{
                  left: `calc(50% + ${(centsOffset / 50) * 45}%)`,
                  transform: 'translateX(-50%)',
                }}
              />
            </div>

            {/* Mic Error Notice */}
            {micError && (
              <div className="w-full mt-4 p-3 rounded-2xl bg-red-50 border-2 border-red-500 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{micError}</span>
              </div>
            )}

            {/* Mic Action Control Button */}
            <div className="mt-6 w-full flex justify-center">
              {!isListening ? (
                <button
                  id="start-mic-tuning-btn"
                  onClick={startMicTuner}
                  className="px-6 py-3.5 rounded-2xl bg-[#FF5F00] text-black font-black text-sm border-2 border-black shadow-[4px_4px_0px_#000000] hover:scale-102 active:scale-98 transition-all flex items-center gap-2"
                >
                  <Mic className="w-5 h-5" />
                  <span>Activar Micrófono y Afinar</span>
                </button>
              ) : (
                <button
                  id="stop-mic-tuning-btn"
                  onClick={stopMicTuner}
                  className="px-6 py-3 rounded-2xl bg-white text-black font-black text-sm border-2 border-black shadow-[3px_3px_0px_#FF5F00] hover:bg-zinc-100 transition-all flex items-center gap-2"
                >
                  <MicOff className="w-4 h-4 text-[#FF5F00]" />
                  <span>Pausar Micrófono</span>
                </button>
              )}
            </div>
          </div>

          {/* Side Helper: Violin Strings Reference Cards */}
          <div className="flex flex-col gap-3">
            <div className="p-4 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#000000]">
              <h3 className="text-sm font-black text-black flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#FF5F00]" />
                <span>Las 4 Cuerdas del Violín</span>
              </h3>

              <div className="flex flex-col gap-2.5">
                {VIOLIN_STRINGS.map((st) => (
                  <div
                    key={st.name}
                    className="p-3 rounded-2xl bg-zinc-50 border-2 border-black hover:border-[#FF5F00] transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#FF5F00] text-black font-black text-xs flex items-center justify-center border border-black">
                          {st.order}
                        </span>
                        <span className="text-sm font-black text-black">
                          Cuerda {st.name}
                        </span>
                        <span className="text-xs font-bold text-[#FF5F00]">
                          ({st.note} - {st.freq} Hz)
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-600 mt-1 line-clamp-1">
                        {st.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handlePlayOneShot(st.freq)}
                      title="Escuchar sonido de violín real"
                      className="p-2 rounded-xl bg-white border-2 border-black text-black hover:text-[#FF5F00] hover:border-[#FF5F00] shadow-[2px_2px_0px_#000000] transition-all shrink-0 ml-2"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips Box */}
            <div className="p-4 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#FF5F00]">
              <div className="flex items-center gap-2 text-xs font-black text-[#FF5F00] mb-2">
                <Info className="w-4 h-4" />
                <span>Regla de Oro de Afinación</span>
              </div>
              <ul className="text-xs text-zinc-700 space-y-1.5 font-medium">
                <li>
                  • <strong>Orden recomendado:</strong> Empieza siempre afinando la cuerda <strong>La</strong> (440 Hz), luego Re, Sol y al final Mi.
                </li>
                <li>
                  • <strong>Clavijas vs Microafinadores:</strong> Si le falta solo un poquito, usa siempre los tornillos pequeños (microafinadores) en el cordal.
                </li>
                <li>
                  • <strong>Giro a la derecha</strong> (sentido del reloj) sube el tono. <strong>Giro a la izquierda</strong> lo baja.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: DIAPASÓN / AUDITORY REFERENCE TONES */}
      {activeMode === 'reference' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VIOLIN_STRINGS.map((st) => {
              const isDroning = activeDroneFreq === st.freq;

              return (
                <div
                  key={st.name}
                  className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                    isDroning
                      ? 'bg-orange-50 border-[#FF5F00] shadow-[4px_4px_0px_#FF5F00]'
                      : 'bg-white border-black shadow-[4px_4px_0px_#000000] hover:border-[#FF5F00]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-7 h-7 rounded-xl bg-[#FF5F00] text-black font-black text-xs flex items-center justify-center border border-black">
                        #{st.order}
                      </span>
                      <span className="text-xs font-black text-[#FF5F00]">
                        {st.freq} Hz
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-black">
                      Cuerda {st.name}
                    </h3>
                    <div className="text-xs font-black text-zinc-600 mt-0.5">
                      Nota {st.note}
                    </div>

                    <p className="text-xs text-zinc-600 mt-3 leading-relaxed">
                      {st.description}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col gap-2">
                    <button
                      onClick={() => handlePlayOneShot(st.freq)}
                      className="w-full py-2.5 px-3 rounded-2xl bg-white text-black font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000000] hover:bg-zinc-100 flex items-center justify-center gap-2 transition-all"
                    >
                      <Volume2 className="w-4 h-4 text-black" />
                      <span>Tocar Tono (2.5s)</span>
                    </button>

                    <button
                      onClick={() => handleToggleDrone(st.freq)}
                      className={`w-full py-2.5 px-3 rounded-2xl font-black text-xs border-2 transition-all flex items-center justify-center gap-2 ${
                        isDroning
                          ? 'bg-[#FF5F00] text-black border-black shadow-[2px_2px_0px_#000000] animate-pulse'
                          : 'bg-white text-black border-black hover:border-[#FF5F00]'
                      }`}
                    >
                      {isDroning ? (
                        <>
                          <VolumeX className="w-4 h-4" />
                          <span>Detener Continuo</span>
                        </>
                      ) : (
                        <>
                          <Radio className="w-4 h-4 text-[#FF5F00]" />
                          <span>Sonido Continuo (Drone)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Educational Guide for Tuning by Ear */}
          <div className="p-6 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#FF5F00]">
            <h3 className="text-base font-black text-black flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#FF5F00]" />
              <span>Cómo afinar de oído (Método Suzuki y Tradicional)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-700">
              <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-black">
                <div className="font-black text-black text-sm mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#FF5F00] text-black flex items-center justify-center text-xs">1</span>
                  Activa el sonido continuo
                </div>
                <p className="leading-relaxed">
                  Pulsa el botón de <strong>Sonido Continuo</strong> en la cuerda La (A4 440 Hz). El violín sonará de fondo de forma constante y sin cortes.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-black">
                <div className="font-black text-black text-sm mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#FF5F00] text-black flex items-center justify-center text-xs">2</span>
                  Toca tu cuerda al aire
                </div>
                <p className="leading-relaxed">
                  Pasa el arco por tu cuerda La real al mismo tiempo. Si escuchas una ondulación o "batimiento" (uahuah-uah), significa que aún no coinciden.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-black">
                <div className="font-black text-black text-sm mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#FF5F00] text-black flex items-center justify-center text-xs">3</span>
                  Ajusta el microafinador
                </div>
                <p className="leading-relaxed">
                  Gira despacio el tornillo hasta que las dos ondas se fusionen en un solo sonido puro y cristalino sin ninguna vibración extraña. ¡Listo!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MASTER EDUCATIONAL MODULE: ¿POR QUÉ EL VIOLÍN SE AFINA POR QUINTAS? */}
      <section
        id="violin-fifths-explanation-module"
        className="mt-6 p-5 sm:p-7 rounded-3xl bg-white border-2 border-black shadow-[6px_6px_0px_#FF5F00] flex flex-col gap-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-4">
          <div className="flex items-start sm:items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-[#FF5F00] text-black font-black flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000000] shrink-0">
              5ª
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-black">
                  ¿Por qué el violín se afina por quintas?
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-lg bg-black text-white font-extrabold uppercase tracking-wider hidden sm:inline">
                  Aprende desde Cero
                </span>
              </div>
              <p className="text-xs text-zinc-600 font-bold">
                Explicación paso a paso de los intervalos musicales y la afinación mágica del violín
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowFifthsGuide(!showFifthsGuide)}
            className="px-3.5 py-1.5 rounded-xl border-2 border-black bg-zinc-100 hover:bg-[#FF5F00] hover:text-black font-black text-xs transition-all shadow-[2px_2px_0px_#000000] self-start sm:self-auto cursor-pointer"
          >
            {showFifthsGuide ? 'Ocultar Guía' : 'Ver Guía Completa'}
          </button>
        </div>

        {showFifthsGuide && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            {/* Step 1: Qué es un intervalo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#FFF9F5] border-2 border-black flex flex-col gap-2 shadow-[2px_2px_0px_#000000]">
                <div className="flex items-center gap-2 text-xs font-black text-black uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-[#FF5F00] text-black font-black text-xs flex items-center justify-center">1</span>
                  <span>¿Qué es un «Intervalo»?</span>
                </div>
                <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                  En música, un <strong>intervalo</strong> es simplemente la distancia entre dos notas. En lugar de usar una regla con centímetros, ¡medimos <strong>contando notas con los dedos</strong>!
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mt-1 text-[11px] font-bold">
                  <div className="p-2 rounded-xl bg-white border border-black">
                    <span className="text-[#FF5F00] font-black">1ª (Unísono):</span> Misma nota (Sol y Sol). Distancia 1.
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-black">
                    <span className="text-[#FF5F00] font-black">2ª (Segunda):</span> Vecinas (Do a Re). Cuentas 2 dedos.
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-black">
                    <span className="text-[#FF5F00] font-black">3ª (Tercera):</span> Tres notas (Do a Mi). Suena dulce.
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-black">
                    <span className="text-[#FF5F00] font-black">4ª (Cuarta):</span> Cuatro notas (Do a Fa). Firme.
                  </div>
                  <div className="p-2 rounded-xl bg-white border-2 border-[#FF5F00] col-span-2 sm:col-span-2 bg-orange-50/50">
                    <span className="text-black font-black">⭐ 5ª (Quinta Justa):</span> ¡5 notas de salto! La distancia perfecta del violín.
                  </div>
                </div>
              </div>

              {/* Step 2: Conteo de las 4 cuerdas */}
              <div className="p-4 rounded-2xl bg-[#FFF9F5] border-2 border-black flex flex-col gap-2 shadow-[2px_2px_0px_#000000]">
                <div className="flex items-center gap-2 text-xs font-black text-black uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-[#FF5F00] text-black font-black text-xs flex items-center justify-center">2</span>
                  <span>El salto de 5 en 5 notas</span>
                </div>
                <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                  Cada cuerda del violín está colocada exactamente a una <strong>Quinta Justa</strong> (5 notas contadas con la mano) de la cuerda de al lado:
                </p>
                <div className="flex flex-col gap-1.5 text-xs font-mono font-bold bg-white p-2.5 rounded-xl border border-black">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-700">De Cuerda Sol a Re:</span>
                    <span className="text-zinc-800">Sol(1) - La(2) - Si(3) - Do(4) - <strong>Re(5)</strong></span>
                  </div>
                  <div className="flex items-center justify-between border-t border-zinc-200 pt-1">
                    <span className="text-blue-700">De Cuerda Re a La:</span>
                    <span className="text-zinc-800">Re(1) - Mi(2) - Fa(3) - Sol(4) - <strong>La(5)</strong></span>
                  </div>
                  <div className="flex items-center justify-between border-t border-zinc-200 pt-1">
                    <span className="text-pink-700">De Cuerda La a Mi:</span>
                    <span className="text-zinc-800">La(1) - Si(2) - Do(3) - Re(4) - <strong>Mi(5)</strong></span>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-600 font-medium">
                  ¡Por eso decimos que están <em>afinadas por quintas</em>!
                </p>
              </div>
            </div>

            {/* Step 3: Interactive Fifths Audio Player */}
            <div className="p-4 rounded-2xl bg-black border-2 border-black text-white flex flex-col gap-3 shadow-[4px_4px_0px_#000000]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-[#FF5F00]" />
                  <h4 className="text-sm font-black text-white">
                    Entrena tu Oído: Escucha las 3 Quintas Puras del Violín
                  </h4>
                </div>
                <span className="text-[11px] font-bold text-zinc-300">
                  Doble cuerda simultánea
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                Haz clic en cada botón para escuchar cómo vibran dos cuerdas juntas sonando en una quinta perfecta. Fíjate en cómo ambas notas se abrazan sin temblores ni ondulaciones:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Quinta Sol - Re */}
                <button
                  type="button"
                  onClick={() => handlePlayFifth('G-D', 196.0, 293.66)}
                  className={`p-3.5 rounded-2xl border-2 font-black transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    playingFifth === 'G-D'
                      ? 'bg-[#FF5F00] text-black border-white shadow-[3px_3px_0px_#FFFFFF] scale-102'
                      : 'bg-zinc-900 text-white border-zinc-700 hover:border-[#FF5F00] hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-xs font-black uppercase text-emerald-400">Quinta Grave</span>
                  <span className="text-sm font-black">Cuerdas Sol + Re</span>
                  <span className="text-[10px] opacity-80">196.0 Hz + 293.7 Hz</span>
                  <span className="text-[11px] mt-1 px-2 py-0.5 rounded-lg bg-black/40 border border-white/20">
                    {playingFifth === 'G-D' ? '🔊 Sonando...' : '▶ Tocar Quinta'}
                  </span>
                </button>

                {/* Quinta Re - La */}
                <button
                  type="button"
                  onClick={() => handlePlayFifth('D-A', 293.66, 440.0)}
                  className={`p-3.5 rounded-2xl border-2 font-black transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    playingFifth === 'D-A'
                      ? 'bg-[#FF5F00] text-black border-white shadow-[3px_3px_0px_#FFFFFF] scale-102'
                      : 'bg-zinc-900 text-white border-zinc-700 hover:border-[#FF5F00] hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-xs font-black uppercase text-blue-400">Quinta Media</span>
                  <span className="text-sm font-black">Cuerdas Re + La</span>
                  <span className="text-[10px] opacity-80">293.7 Hz + 440.0 Hz</span>
                  <span className="text-[11px] mt-1 px-2 py-0.5 rounded-lg bg-black/40 border border-white/20">
                    {playingFifth === 'D-A' ? '🔊 Sonando...' : '▶ Tocar Quinta'}
                  </span>
                </button>

                {/* Quinta La - Mi */}
                <button
                  type="button"
                  onClick={() => handlePlayFifth('A-E', 440.0, 659.25)}
                  className={`p-3.5 rounded-2xl border-2 font-black transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    playingFifth === 'A-E'
                      ? 'bg-[#FF5F00] text-black border-white shadow-[3px_3px_0px_#FFFFFF] scale-102'
                      : 'bg-zinc-900 text-white border-zinc-700 hover:border-[#FF5F00] hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-xs font-black uppercase text-pink-400">Quinta Aguda</span>
                  <span className="text-sm font-black">Cuerdas La + Mi</span>
                  <span className="text-[10px] opacity-80">440.0 Hz + 659.3 Hz</span>
                  <span className="text-[11px] mt-1 px-2 py-0.5 rounded-lg bg-black/40 border border-white/20">
                    {playingFifth === 'A-E' ? '🔊 Sonando...' : '▶ Tocar Quinta'}
                  </span>
                </button>
              </div>
            </div>

            {/* Violinist Secret Box */}
            <div className="p-3.5 rounded-2xl bg-zinc-100 border-2 border-black flex items-start gap-2.5 text-xs text-zinc-800 font-medium">
              <span className="text-[#FF5F00] text-lg font-black shrink-0">💡</span>
              <div>
                <strong className="text-black font-black">El secreto de los violinistas profesionales:</strong> Los violinistas tocan dos cuerdas a la vez con el arco (por ejemplo, pasan el arco rozando Re y La a la vez). Si la quinta está desafinada, se escuchan ondulaciones rápidas en el aire llamadas "batimentos". Cuando giran suavemente el tornillo y la quinta queda afinada, ¡las dos ondas se funden en una campana mágica de armonía perfecta!
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
