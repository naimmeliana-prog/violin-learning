import React, { useState, useEffect, useRef } from 'react';
import { ViolinNote } from '../types/violin';
import { ViolinFingerboard } from './ViolinFingerboard';
import { InteractiveStave } from './InteractiveStave';
import { soundEngine } from '../services/soundEngine';
import { FIRST_POSITION_NOTES } from '../data/violinNotes';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Sparkles,
  Music2,
  CheckCircle2,
  Headphones,
  Gauge,
  Sliders,
  Bell,
  Clock,
  VolumeX,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SongNote {
  name: string;
  string: 'G' | 'D' | 'A' | 'E';
  finger: number;
  beats: number; // Duration in beats: 1 = negra, 2 = blanca, 4 = redonda, 0.5 = corchea, 1.5 = negra con puntillo
  figure: string; // '♩', '𝅗𝅥', '𝅝', '♪', '♩.'
}

interface GuidedSong {
  id: string;
  title: string;
  japaneseTitle: string;
  composer: string;
  timeSignature: string;
  defaultBpm: number;
  notes: SongNote[];
}

const GUIDED_SONGS: GuidedSong[] = [
  {
    id: 'song-twinkle',
    title: 'Estrellita / Campanita',
    japaneseTitle: '「きらきら星」',
    composer: 'Tradicional Suzuki',
    timeSignature: '4/4',
    defaultBpm: 76,
    notes: [
      { name: 'La', string: 'A', finger: 0, beats: 1, figure: '♩' },
      { name: 'La', string: 'A', finger: 0, beats: 1, figure: '♩' },
      { name: 'Mi', string: 'E', finger: 0, beats: 1, figure: '♩' },
      { name: 'Mi', string: 'E', finger: 0, beats: 1, figure: '♩' },
      { name: 'Fa#', string: 'E', finger: 1, beats: 1, figure: '♩' },
      { name: 'Fa#', string: 'E', finger: 1, beats: 1, figure: '♩' },
      { name: 'Mi', string: 'E', finger: 0, beats: 2, figure: '𝅗𝅥' }, // Blanca (2 tiempos)
      { name: 'Re', string: 'A', finger: 3, beats: 1, figure: '♩' },
      { name: 'Re', string: 'A', finger: 3, beats: 1, figure: '♩' },
      { name: 'Do#', string: 'A', finger: 2, beats: 1, figure: '♩' },
      { name: 'Do#', string: 'A', finger: 2, beats: 1, figure: '♩' },
      { name: 'Si', string: 'A', finger: 1, beats: 1, figure: '♩' },
      { name: 'Si', string: 'A', finger: 1, beats: 1, figure: '♩' },
      { name: 'La', string: 'A', finger: 0, beats: 2, figure: '𝅗𝅥' }, // Blanca (2 tiempos)
    ],
  },
  {
    id: 'song-joy',
    title: 'Himno de la Alegría',
    japaneseTitle: '「歓喜の歌」',
    composer: 'L. v. Beethoven',
    timeSignature: '4/4',
    defaultBpm: 84,
    notes: [
      { name: 'Do#', string: 'A', finger: 2, beats: 1, figure: '♩' },
      { name: 'Do#', string: 'A', finger: 2, beats: 1, figure: '♩' },
      { name: 'Re', string: 'A', finger: 3, beats: 1, figure: '♩' },
      { name: 'Mi', string: 'E', finger: 0, beats: 1, figure: '♩' },
      { name: 'Mi', string: 'E', finger: 0, beats: 1, figure: '♩' },
      { name: 'Re', string: 'A', finger: 3, beats: 1, figure: '♩' },
      { name: 'Do#', string: 'A', finger: 2, beats: 1, figure: '♩' },
      { name: 'Si', string: 'A', finger: 1, beats: 1, figure: '♩' },
      { name: 'La', string: 'A', finger: 0, beats: 1, figure: '♩' },
      { name: 'La', string: 'A', finger: 0, beats: 1, figure: '♩' },
      { name: 'Si', string: 'A', finger: 1, beats: 1, figure: '♩' },
      { name: 'Do#', string: 'A', finger: 2, beats: 1, figure: '♩' },
      { name: 'Do#', string: 'A', finger: 2, beats: 1.5, figure: '♩.' }, // Negra con puntillo
      { name: 'Si', string: 'A', finger: 1, beats: 0.5, figure: '♪' }, // Corchea
      { name: 'Si', string: 'A', finger: 1, beats: 2, figure: '𝅗𝅥' }, // Blanca
    ],
  },
  {
    id: 'song-lamb',
    title: 'La Ovejita de María',
    japaneseTitle: '「メリーさんの羊」',
    composer: 'Tradicional Suzuki',
    timeSignature: '4/4',
    defaultBpm: 80,
    notes: [
      { name: 'Do#', string: 'A', finger: 2, beats: 1, figure: '♩' },
      { name: 'Si', string: 'A', finger: 1, beats: 1, figure: '♩' },
      { name: 'La', string: 'A', finger: 0, beats: 1, figure: '♩' },
      { name: 'Si', string: 'A', finger: 1, beats: 1, figure: '♩' },
      { name: 'Do#', string: 'A', finger: 2, beats: 1, figure: '♩' },
      { name: 'Do#', string: 'A', finger: 2, beats: 1, figure: '♩' },
      { name: 'Do#', string: 'A', finger: 2, beats: 2, figure: '𝅗𝅥' }, // Blanca
      { name: 'Si', string: 'A', finger: 1, beats: 1, figure: '♩' },
      { name: 'Si', string: 'A', finger: 1, beats: 1, figure: '♩' },
      { name: 'Si', string: 'A', finger: 1, beats: 2, figure: '𝅗𝅥' }, // Blanca
      { name: 'Do#', string: 'A', finger: 2, beats: 1, figure: '♩' },
      { name: 'Mi', string: 'E', finger: 0, beats: 1, figure: '♩' },
      { name: 'Mi', string: 'E', finger: 0, beats: 2, figure: '𝅗𝅥' }, // Blanca
    ],
  },
  {
    id: 'song-lightly-row',
    title: 'Remando Suavemente',
    japaneseTitle: '「春の小川」',
    composer: 'Suzuki Libro 1',
    timeSignature: '4/4',
    defaultBpm: 76,
    notes: [
      { name: 'Mi', string: 'E', finger: 0, beats: 1, figure: '♩' },
      { name: 'Do#', string: 'A', finger: 2, beats: 1, figure: '♩' },
      { name: 'Do#', string: 'A', finger: 2, beats: 2, figure: '𝅗𝅥' }, // Blanca
      { name: 'Re', string: 'A', finger: 3, beats: 1, figure: '♩' },
      { name: 'Si', string: 'A', finger: 1, beats: 1, figure: '♩' },
      { name: 'Si', string: 'A', finger: 1, beats: 2, figure: '𝅗𝅥' }, // Blanca
      { name: 'La', string: 'A', finger: 0, beats: 1, figure: '♩' },
      { name: 'Si', string: 'A', finger: 1, beats: 1, figure: '♩' },
      { name: 'Do#', string: 'A', finger: 2, beats: 1, figure: '♩' },
      { name: 'Re', string: 'A', finger: 3, beats: 1, figure: '♩' },
      { name: 'Mi', string: 'E', finger: 0, beats: 1, figure: '♩' },
      { name: 'Mi', string: 'E', finger: 0, beats: 1, figure: '♩' },
      { name: 'Mi', string: 'E', finger: 0, beats: 2, figure: '𝅗𝅥' }, // Blanca
    ],
  },
  {
    id: 'song-frere-jacques',
    title: 'Campanero (Frère Jacques)',
    japaneseTitle: '「鐘の音」',
    composer: 'Tradicional',
    timeSignature: '4/4',
    defaultBpm: 80,
    notes: [
      { name: 'Re', string: 'D', finger: 0, beats: 1, figure: '♩' },
      { name: 'Mi', string: 'D', finger: 1, beats: 1, figure: '♩' },
      { name: 'Fa#', string: 'D', finger: 2, beats: 1, figure: '♩' },
      { name: 'Re', string: 'D', finger: 0, beats: 1, figure: '♩' },
      { name: 'Re', string: 'D', finger: 0, beats: 1, figure: '♩' },
      { name: 'Mi', string: 'D', finger: 1, beats: 1, figure: '♩' },
      { name: 'Fa#', string: 'D', finger: 2, beats: 1, figure: '♩' },
      { name: 'Re', string: 'D', finger: 0, beats: 1, figure: '♩' },
    ],
  },
];

interface FreePracticeViewProps {
  activeSkinColor: string;
  activeSkinAccent: string;
  onAwardGems?: (gems: number, stars: number) => void;
}

export const FreePracticeView: React.FC<FreePracticeViewProps> = ({
  activeSkinColor,
  activeSkinAccent,
  onAwardGems,
}) => {
  const [selectedString, setSelectedString] = useState<'all' | 'G' | 'D' | 'A' | 'E'>('all');
  const [showNoteNames, setShowNoteNames] = useState<boolean>(true);
  const [showTapes, setShowTapes] = useState<boolean>(true);
  const [lastNote, setLastNote] = useState<ViolinNote | null>(null);
  const [activeSong, setActiveSong] = useState<GuidedSong | null>(null);
  const [songStepIdx, setSongStepIdx] = useState<number>(0);
  const [isSongComplete, setIsSongComplete] = useState<boolean>(false);
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);

  // BPM and Metronome state
  const [bpm, setBpm] = useState<number>(76);
  const [isMetronomeActive, setIsMetronomeActive] = useState<boolean>(false);
  const [metronomeBeat, setMetronomeBeat] = useState<number>(0);

  const demoTimeoutRef = useRef<NodeJS.Timeout[]>([]);
  const metronomeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Metronome loop
  useEffect(() => {
    if (isMetronomeActive) {
      const beatMs = (60 / bpm) * 1000;
      let count = 0;
      metronomeIntervalRef.current = setInterval(() => {
        count = (count + 1) % 4;
        setMetronomeBeat(count);
        soundEngine.playMetronomeTick(count === 0);
      }, beatMs);
    } else {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
        metronomeIntervalRef.current = null;
      }
      setMetronomeBeat(0);
    }

    return () => {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
        metronomeIntervalRef.current = null;
      }
    };
  }, [isMetronomeActive, bpm]);

  const stopDemo = () => {
    demoTimeoutRef.current.forEach((t) => clearTimeout(t));
    demoTimeoutRef.current = [];
    setIsPlayingDemo(false);
  };

  useEffect(() => {
    return () => {
      stopDemo();
    };
  }, [activeSong]);

  // Demo playback with exact musical rhythmic durations based on BPM
  const handlePlaySongDemo = () => {
    if (!activeSong) return;
    if (isPlayingDemo) {
      stopDemo();
      return;
    }

    setIsPlayingDemo(true);
    demoTimeoutRef.current = [];

    const beatDurationSeconds = 60 / bpm;
    const beatDurationMs = beatDurationSeconds * 1000;

    let cumulativeMs = 0;

    activeSong.notes.forEach((item, idx) => {
      const noteDurationSeconds = item.beats * beatDurationSeconds;
      const noteDurationMs = item.beats * beatDurationMs;
      const currentStart = cumulativeMs;
      cumulativeMs += noteDurationMs;

      const timer = setTimeout(() => {
        setSongStepIdx(idx); // Keep visual focus on active note for its full duration
        const found = FIRST_POSITION_NOTES[item.string]?.find((n) => n.name === item.name);
        if (found) {
          setLastNote(found);
          // Play acoustic note with realistic sustained duration
          soundEngine.playViolinNote(
            found.freq,
            Math.max(0.25, noteDurationSeconds * 0.92),
            'bow',
            idx % 2 === 0 ? 'down' : 'up'
          );
        }

        if (idx === activeSong.notes.length - 1) {
          const finishTimer = setTimeout(() => {
            setIsPlayingDemo(false);
            setSongStepIdx(0);
          }, noteDurationMs);
          demoTimeoutRef.current.push(finishTimer);
        }
      }, currentStart);

      demoTimeoutRef.current.push(timer);
    });
  };

  const currentSongTarget = activeSong ? activeSong.notes[songStepIdx] : null;

  const handleNotePlayed = (note: ViolinNote) => {
    setLastNote(note);

    if (activeSong && !isSongComplete && currentSongTarget) {
      if (note.name === currentSongTarget.name && note.string === currentSongTarget.string) {
        soundEngine.playRewardChime('small');
        const nextIdx = songStepIdx + 1;
        setSongStepIdx(nextIdx);

        if (nextIdx >= activeSong.notes.length) {
          setIsSongComplete(true);
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
          });
          soundEngine.playRewardChime('major');

          if (onAwardGems) {
            onAwardGems(40, 1);
          }
        }
      }
    }
  };

  const handleSelectSong = (song: GuidedSong) => {
    stopDemo();
    if (activeSong?.id === song.id) {
      setActiveSong(null);
      setSongStepIdx(0);
      setIsSongComplete(false);
    } else {
      setActiveSong(song);
      setBpm(song.defaultBpm);
      setSongStepIdx(0);
      setIsSongComplete(false);
    }
  };

  const handleResetSong = () => {
    stopDemo();
    setSongStepIdx(0);
    setIsSongComplete(false);
  };

  return (
    <div id="free-practice-view" className="w-full flex flex-col gap-6 select-none">
      {/* Header Banner - Light theme */}
      <div className="p-5 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#FF5F00] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-[#FF5F00] uppercase tracking-wider mb-1">
            <Music2 className="w-4 h-4" />
            <span>Toca y Experimenta sin Presión</span>
            <span className="font-manga text-[11px] text-black">「フリー練習」</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-black">
            Laboratorio de Práctica Libre y Melodías
          </h2>
          <p className="text-xs text-zinc-600 font-medium mt-0.5">
            Toca las cuerdas con tu ratón o pantalla táctil, ajusta el tempo (BPM) y sigue las partituras con sus tiempos reales.
          </p>
        </div>

        {/* Global Metronome & BPM Bar */}
        <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-zinc-100 border-2 border-black">
          <button
            id="metronome-toggle-btn"
            onClick={() => setIsMetronomeActive(!isMetronomeActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border-2 transition-all ${
              isMetronomeActive
                ? 'bg-[#FF5F00] text-black border-black shadow-[2px_2px_0px_#000000] animate-pulse'
                : 'bg-white text-black border-black hover:bg-zinc-200'
            }`}
            title="Activar / Desactivar metrónomo"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isMetronomeActive ? 'Metrónomo ON' : 'Metrónomo'}</span>
            <span className="w-2 h-2 rounded-full border border-black" style={{ backgroundColor: isMetronomeActive && metronomeBeat === 0 ? '#000000' : '#FF5F00' }} />
          </button>

          {/* BPM Slider & Stepper */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-xl border border-black">
            <button
              onClick={() => setBpm((b) => Math.max(40, b - 4))}
              className="w-6 h-6 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-black font-black text-xs flex items-center justify-center border border-black/30"
              title="Disminuir tempo (-4 BPM)"
            >
              -
            </button>
            <div className="flex items-center gap-1 text-xs font-black font-mono px-1">
              <span className="text-[#FF5F00] text-sm">{bpm}</span>
              <span className="text-[10px] text-zinc-600 font-sans font-bold">BPM</span>
            </div>
            <button
              onClick={() => setBpm((b) => Math.min(160, b + 4))}
              className="w-6 h-6 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-black font-black text-xs flex items-center justify-center border border-black/30"
              title="Aumentar tempo (+4 BPM)"
            >
              +
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="hidden lg:flex items-center gap-1 text-[10px] font-black">
            <button
              onClick={() => setBpm(56)}
              className={`px-2 py-1 rounded-lg border border-black/40 ${bpm === 56 ? 'bg-[#FF5F00] text-black font-bold' : 'bg-white text-zinc-700'}`}
            >
              Lento
            </button>
            <button
              onClick={() => setBpm(76)}
              className={`px-2 py-1 rounded-lg border border-black/40 ${bpm === 76 ? 'bg-[#FF5F00] text-black font-bold' : 'bg-white text-zinc-700'}`}
            >
              Andante
            </button>
            <button
              onClick={() => setBpm(96)}
              className={`px-2 py-1 rounded-lg border border-black/40 ${bpm === 96 ? 'bg-[#FF5F00] text-black font-bold' : 'bg-white text-zinc-700'}`}
            >
              Moderato
            </button>
            <button
              onClick={() => setBpm(120)}
              className={`px-2 py-1 rounded-lg border border-black/40 ${bpm === 120 ? 'bg-[#FF5F00] text-black font-bold' : 'bg-white text-zinc-700'}`}
            >
              Allegro
            </button>
          </div>
        </div>
      </div>

      {/* Repertoire Song Selection Strip */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5F00]" />
            <span>Canciones Guiadas con Duración y Tiempos Reales</span>
          </span>
          {activeSong && (
            <span className="text-xs font-black text-[#FF5F00]">
              Compás: {activeSong.timeSignature} • Tempo base: {activeSong.defaultBpm} BPM
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {GUIDED_SONGS.map((song) => {
            const isSelected = activeSong?.id === song.id;
            return (
              <button
                key={song.id}
                id={`btn-song-${song.id}`}
                onClick={() => handleSelectSong(song)}
                className={`p-3 rounded-2xl text-left border-2 transition-all flex flex-col justify-between gap-1 select-none ${
                  isSelected
                    ? 'bg-[#FF5F00] text-black border-black shadow-[3px_3px_0px_#000000] scale-102 font-black'
                    : 'bg-white text-zinc-800 border-black hover:border-[#FF5F00] shadow-[2px_2px_0px_#000000]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold opacity-80">
                      {song.notes.length} notas
                    </span>
                    <span className="font-manga text-[9px]">{song.japaneseTitle}</span>
                  </div>
                  <h4 className="text-xs font-black truncate mt-1 text-black">{song.title}</h4>
                  <div className="text-[10px] opacity-75 truncate">{song.composer}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Guided Song Follow-Along Strip (if selected) */}
      {activeSong && (
        <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0px_#000000] flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-[#FF5F00] text-black font-black text-xs border border-black shadow-xs">
                Canción Activa
              </span>
              <h3 className="font-black text-black text-sm sm:text-base">
                {activeSong.title} — {activeSong.composer}
              </h3>
              <span className="text-xs text-zinc-600 font-bold hidden sm:inline">
                ({activeSong.timeSignature})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePlaySongDemo}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all border-2 ${
                  isPlayingDemo
                    ? 'bg-[#FF5F00] text-black border-black animate-pulse shadow-[2px_2px_0px_#000000]'
                    : 'bg-white text-black border-black hover:bg-zinc-100 shadow-[2px_2px_0px_#000000]'
                }`}
                title="Escuchar la canción con su ritmo y duraciones exactas"
              >
                {isPlayingDemo ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pausar Demo</span>
                  </>
                ) : (
                  <>
                    <Headphones className="w-3.5 h-3.5 text-[#FF5F00]" />
                    <span>Escuchar Violín Real (Tiempos)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetSong}
                className="px-3 py-1.5 rounded-xl bg-white text-black border-2 border-black hover:bg-zinc-100 text-xs font-black flex items-center gap-1 shadow-[2px_2px_0px_#000000]"
              >
                <RotateCcw className="w-3 h-3" /> Reiniciar
              </button>
            </div>
          </div>

          {/* Song notes progress horizontal track with explicit RHYTHM BADGES */}
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {activeSong.notes.map((n, idx) => {
              const isPast = idx < songStepIdx;
              const isCurrent = idx === songStepIdx;

              return (
                <div
                  key={idx}
                  className={`px-3 py-2 rounded-2xl border-2 shrink-0 flex flex-col items-center transition-all ${
                    isCurrent
                      ? 'bg-[#FF5F00] text-black border-black shadow-[3px_3px_0px_#000000] scale-110 font-black'
                      : isPast
                      ? 'bg-zinc-100 text-zinc-400 border-zinc-300'
                      : 'bg-white text-black border-black'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-black">{n.name}</span>
                    <span className="text-xs font-bold text-[#FF5F00] font-mono">{n.figure}</span>
                  </div>
                  <div className="text-[10px] font-bold opacity-80 mt-0.5">
                    Cuerda {n.string} (D.{n.finger})
                  </div>
                  <div className="text-[9px] font-mono text-zinc-500 font-bold">
                    {n.beats} {n.beats === 1 ? 'tiempo' : 'tiempos'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current Note instruction bar */}
          {currentSongTarget && !isSongComplete && (
            <div className="p-3 rounded-xl bg-orange-50 border-2 border-[#FF5F00] text-xs text-black font-bold flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span>Nota {songStepIdx + 1} de {activeSong.notes.length}:</span>
                <span className="text-base text-[#FF5F00] font-black">{currentSongTarget.name}</span>
                <span className="px-2 py-0.5 rounded-md bg-white border border-black font-black text-[11px]">
                  {currentSongTarget.figure} ({currentSongTarget.beats} {currentSongTarget.beats === 1 ? 'tiempo' : 'tiempos'})
                </span>
                <span>en cuerda <strong className="text-[#FF5F00]">{currentSongTarget.string}</strong></span>
                <span>con el <strong>Dedo {currentSongTarget.finger}</strong></span>
              </div>
              <span className="text-[11px] text-zinc-600 italic">
                {isPlayingDemo ? '▶ Reproduciendo a tempo real...' : '¡Písala en el mástil abajo!'}
              </span>
            </div>
          )}

          {/* Completion celebratory message */}
          {isSongComplete && (
            <div className="p-4 rounded-xl bg-green-50 border-2 border-green-600 text-green-800 text-xs font-black flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>¡Bravo! Has completado {activeSong.title} con ritmo perfecto (+40 💎).</span>
              </div>
              <button
                onClick={handleResetSong}
                className="px-3 py-1 rounded-lg bg-green-600 text-white font-black hover:bg-green-700"
              >
                Tocar otra vez
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Interactive Stage: Fingerboard & Stave */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Top: Interactive Fingerboard */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="p-5 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#000000]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-black text-base sm:text-lg">
                  Mástil y Cintas de Primera Posición
                </h3>
                <span className="font-manga text-[10px] text-[#FF5F00]">「指板」</span>
              </div>

              {/* String Filter Pills */}
              <div className="flex items-center gap-1">
                {(['all', 'G', 'D', 'A', 'E'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedString(s)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all border ${
                      selectedString === s
                        ? 'bg-[#FF5F00] text-black border-black shadow-xs'
                        : 'bg-white text-zinc-700 border-zinc-300 hover:border-black'
                    }`}
                  >
                    {s === 'all' ? 'Todas' : s}
                  </button>
                ))}
              </div>
            </div>

            {/* Fingerboard Component */}
            <ViolinFingerboard
              activeStringFilter={selectedString}
              showNoteLabels={showNoteNames}
              showFingerTapes={showTapes}
              targetNote={currentSongTarget ? { name: currentSongTarget.name, string: currentSongTarget.string } : null}
              onNoteClick={handleNotePlayed}
            />

            {/* Display Toggles */}
            <div className="flex flex-wrap items-center justify-between pt-4 mt-4 border-t border-zinc-200 text-xs font-bold text-zinc-700">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showNoteNames}
                    onChange={(e) => setShowNoteNames(e.target.checked)}
                    className="rounded text-[#FF5F00] focus:ring-[#FF5F00] w-4 h-4 border-black"
                  />
                  <span>Mostrar nombres de notas</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTapes}
                    onChange={(e) => setShowTapes(e.target.checked)}
                    className="rounded text-[#FF5F00] focus:ring-[#FF5F00] w-4 h-4 border-black"
                  />
                  <span>Mostrar cintas guía (D.1, D.2, D.3, D.4)</span>
                </label>
              </div>

              {lastNote && (
                <div className="flex items-center gap-2 text-[#FF5F00] font-black">
                  <span>Última nota:</span>
                  <span className="px-2 py-0.5 rounded-lg bg-orange-100 text-black border border-black font-mono">
                    {lastNote.name} ({lastNote.freq.toFixed(1)} Hz)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right / Bottom: Live Pentagram Stave */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-5 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#000000] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-black text-base">
                  Pentagrama en Clave de Sol
                </h3>
                <span className="font-manga text-[10px] text-[#FF5F00]">「五線譜」</span>
              </div>
            </div>

            {/* Pentagram */}
            <InteractiveStave
              highlightNote={lastNote ? { name: lastNote.name, octave: lastNote.octave } : null}
            />

            {/* Note details readout */}
            {lastNote ? (
              <div className="p-4 rounded-2xl bg-orange-50 border-2 border-[#FF5F00] flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-black">{lastNote.name}{lastNote.octave}</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FF5F00] text-black font-black text-xs">
                    Cuerda {lastNote.string}
                  </span>
                </div>
                <div className="text-xs text-zinc-700 font-medium">
                  {lastNote.finger === 0 ? 'Cuerda al aire (sin pisar)' : `Dedo ${lastNote.finger} en la cinta`}
                </div>
                <div className="text-[11px] font-mono text-zinc-500 mt-1">
                  Frecuencia acústica: {lastNote.freq.toFixed(1)} Hz
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-zinc-200 text-center text-xs text-zinc-500 font-medium">
                Toca cualquier cuerda o nota en el mástil para verla reflejada en el pentagrama.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
