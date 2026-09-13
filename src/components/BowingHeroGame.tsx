import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../services/soundEngine';
import { Sparkles, Trophy, RotateCcw, CheckCircle2, Flame } from 'lucide-react';

interface BowingNote {
  id: number;
  direction: 'down' | 'up'; // 'down' = ⊓ (down-bow), 'up' = ∨ (up-bow)
  stringName: 'A' | 'D' | 'E';
  freq: number;
  timePosition: number; // in seconds relative to song start
  hit?: 'perfect' | 'good' | 'miss';
}

interface BowingHeroGameProps {
  onGameComplete: (earnedGems: number, earnedStars: number) => void;
  onExit: () => void;
}

export const BowingHeroGame: React.FC<BowingHeroGameProps> = ({ onGameComplete, onExit }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeTrack, setActiveTrack] = useState<'easy' | 'medium'>('easy');

  // Song definitions: 30-45 seconds short interactive sessions
  const generateTrackNotes = (track: 'easy' | 'medium'): BowingNote[] => {
    if (track === 'easy') {
      const list: BowingNote[] = [];
      const count = 16;
      for (let i = 0; i < count; i++) {
        list.push({
          id: i,
          direction: i % 2 === 0 ? 'down' : 'up',
          stringName: 'A',
          freq: 440,
          timePosition: 2.0 + i * 1.4,
        });
      }
      return list;
    } else {
      const pattern: { dir: 'down' | 'up'; freq: number; str: 'A' | 'E'; interval: number }[] = [
        { dir: 'down', freq: 440, str: 'A', interval: 1.2 },
        { dir: 'up', freq: 440, str: 'A', interval: 1.2 },
        { dir: 'down', freq: 440, str: 'A', interval: 0.7 },
        { dir: 'up', freq: 440, str: 'A', interval: 0.7 },
        { dir: 'down', freq: 659.25, str: 'E', interval: 1.2 },
        { dir: 'up', freq: 659.25, str: 'E', interval: 1.2 },
        { dir: 'down', freq: 659.25, str: 'E', interval: 0.7 },
        { dir: 'up', freq: 659.25, str: 'E', interval: 0.7 },
        { dir: 'down', freq: 440, str: 'A', interval: 1.2 },
        { dir: 'up', freq: 440, str: 'A', interval: 1.2 },
        { dir: 'down', freq: 440, str: 'A', interval: 1.2 },
        { dir: 'up', freq: 440, str: 'A', interval: 1.2 },
      ];
      let t = 2.0;
      return pattern.map((p, idx) => {
        const item: BowingNote = {
          id: idx,
          direction: p.dir,
          stringName: p.str,
          freq: p.freq,
          timePosition: t,
        };
        t += p.interval;
        return item;
      });
    }
  };

  const [notes, setNotes] = useState<BowingNote[]>(() => generateTrackNotes('easy'));
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const startGame = () => {
    const trackNotes = generateTrackNotes(activeTrack);
    setNotes(trackNotes);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setFeedback(null);
    setGameFinished(false);
    setIsPlaying(true);
    setCurrentTime(0);
    startTimeRef.current = performance.now();

    soundEngine.playRewardChime('small');
  };

  const handleBowStroke = useCallback(
    (direction: 'down' | 'up') => {
      if (!isPlaying || gameFinished) return;

      const tolerance = 0.35;
      let closestNote: BowingNote | null = null;
      let minDiff = 999;

      notes.forEach((n) => {
        if (!n.hit) {
          const diff = Math.abs(n.timePosition - currentTime);
          if (diff < minDiff) {
            minDiff = diff;
            closestNote = n;
          }
        }
      });

      if (closestNote && minDiff <= tolerance) {
        const isDirCorrect = (closestNote as BowingNote).direction === direction;

        if (isDirCorrect) {
          let accuracy: 'perfect' | 'good' = 'good';
          let points = 50;

          if (minDiff <= 0.18) {
            accuracy = 'perfect';
            points = 100;
            soundEngine.playRhythmClick('perfect');
            setFeedback({ text: '¡PERFECTO! 🔥', color: 'text-[#FF5F00]' });
          } else {
            soundEngine.playRhythmClick('good');
            setFeedback({ text: '¡BIEN! ✨', color: 'text-white' });
          }

          soundEngine.playViolinNote((closestNote as BowingNote).freq, 0.8, 'bow');

          const newCombo = combo + 1;
          setCombo(newCombo);
          if (newCombo > maxCombo) setMaxCombo(newCombo);
          setScore((s) => s + points + newCombo * 10);

          setNotes((prev) =>
            prev.map((n) => (n.id === (closestNote as BowingNote).id ? { ...n, hit: accuracy } : n))
          );
        } else {
          soundEngine.playRhythmClick('miss');
          setCombo(0);
          setFeedback({ text: '¡Dirección contraria!', color: 'text-zinc-400' });
          setNotes((prev) =>
            prev.map((n) => (n.id === (closestNote as BowingNote).id ? { ...n, hit: 'miss' } : n))
          );
        }
      } else {
        soundEngine.playViolinNote(440, 0.5, 'bow');
      }
    },
    [isPlaying, gameFinished, notes, currentTime, combo, maxCombo]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleBowStroke('down');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleBowStroke('up');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBowStroke]);

  useEffect(() => {
    if (!isPlaying) return;

    const loop = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      setCurrentTime(elapsed);

      setNotes((prev) =>
        prev.map((n) => {
          if (!n.hit && elapsed - n.timePosition > 0.35) {
            setCombo(0);
            return { ...n, hit: 'miss' };
          }
          return n;
        })
      );

      const lastNote = notes[notes.length - 1];
      if (lastNote && elapsed > lastNote.timePosition + 1.2) {
        setIsPlaying(false);
        setGameFinished(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        soundEngine.playRewardChime('major');
        return;
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, notes]);

  const gemsEarned = Math.round(score * 0.4) + 25;
  const starsEarned = score >= 800 ? 3 : score >= 400 ? 2 : 1;

  return (
    <div id="bowing-hero-root" className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center select-none">
      {/* Top Header in Blanco, Negro & Naranja Pantone 165 C */}
      <div className="w-full flex items-center justify-between mb-4 bg-black p-4 rounded-2xl border-2 border-white shadow-[4px_4px_0px_#FF5F00]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF5F00] border-2 border-black flex items-center justify-center text-black font-black text-xl shadow-[2px_2px_0px_#FFFFFF]">
            ⊓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">Ritmo con Arco</h2>
              <span className="font-manga text-[11px] text-[#FF5F00]">「ボーイング・ゾーン」</span>
            </div>
            <p className="text-xs text-zinc-300 font-medium">Sincroniza la dirección de tu arco al compás</p>
          </div>
        </div>

        <button
          onClick={onExit}
          className="px-3 py-1.5 rounded-xl border-2 border-white bg-black text-xs font-black text-white hover:bg-[#FF5F00] hover:text-black transition-colors shadow-[2px_2px_0px_#FFFFFF]"
        >
          Volver
        </button>
      </div>

      {/* Score & Combo HUD */}
      <div className="w-full grid grid-cols-3 gap-3 mb-4">
        <div className="bg-black p-3 rounded-2xl border-2 border-white text-center shadow-[3px_3px_0px_#000000]">
          <span className="text-[10px] uppercase font-black tracking-wider text-zinc-400">Puntos</span>
          <div className="text-xl font-black text-white">{score}</div>
        </div>

        <div className="bg-black p-3 rounded-2xl border-2 border-[#FF5F00] text-center shadow-[3px_3px_0px_#FF5F00]">
          <span className="text-[10px] uppercase font-black tracking-wider text-[#FF5F00] flex items-center justify-center gap-1">
            <Flame className="w-3 h-3 text-[#FF5F00]" /> Combo
          </span>
          <div className="text-xl font-black text-[#FF5F00]">{combo}x</div>
        </div>

        <div className="bg-black p-1.5 rounded-2xl border-2 border-white flex items-center gap-1 shadow-[3px_3px_0px_#000000]">
          <button
            onClick={() => {
              setActiveTrack('easy');
              if (!isPlaying) setNotes(generateTrackNotes('easy'));
            }}
            disabled={isPlaying}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all ${
              activeTrack === 'easy'
                ? 'bg-[#FF5F00] text-black border border-black shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Fácil
          </button>
          <button
            onClick={() => {
              setActiveTrack('medium');
              if (!isPlaying) setNotes(generateTrackNotes('medium'));
            }}
            disabled={isPlaying}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all ${
              activeTrack === 'medium'
                ? 'bg-[#FF5F00] text-black border border-black shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Medio
          </button>
        </div>
      </div>

      {/* Main Rhythm Runway View */}
      <div className="relative w-full h-48 bg-black rounded-3xl border-3 border-white overflow-hidden shadow-[6px_6px_0px_#FF5F00] flex flex-col justify-center">
        {/* Contact Line (Target Line in Pantone 165 C) */}
        <div className="absolute left-20 top-0 bottom-0 w-3 bg-[#FF5F00] shadow-[0_0_15px_#FF5F00] z-10 flex flex-col items-center justify-between py-2">
          <span className="text-[8px] font-black text-black bg-white px-1 rounded-sm rotate-90">
            PUNTO
          </span>
        </div>

        {/* Traveling Bow Notes */}
        <div className="relative w-full h-28">
          {notes.map((note) => {
            const delta = note.timePosition - currentTime;
            const xPercent = 80 + delta * 180;

            if (xPercent < -50 || xPercent > 650) return null;

            const isDown = note.direction === 'down';

            return (
              <div
                key={note.id}
                style={{ left: `${xPercent}px` }}
                className={`absolute top-2 w-14 h-20 rounded-2xl flex flex-col items-center justify-center border-2 transition-transform duration-75 font-black shadow-lg ${
                  note.hit === 'perfect'
                    ? 'bg-[#FF5F00]/50 border-white text-white scale-90 opacity-40'
                    : note.hit === 'good'
                    ? 'bg-white/40 border-white text-black scale-90 opacity-40'
                    : note.hit === 'miss'
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-600 opacity-25'
                    : isDown
                    ? 'bg-black border-white text-white shadow-[3px_3px_0px_#FF5F00]'
                    : 'bg-[#FF5F00] border-black text-black shadow-[3px_3px_0px_#FFFFFF]'
                }`}
              >
                <span className="text-2xl font-black leading-none">{isDown ? '⊓' : '∨'}</span>
                <span className="text-[10px] font-black mt-1 uppercase">
                  {isDown ? 'Abajo' : 'Arriba'}
                </span>
                <span className="text-[9px] opacity-80 font-mono">Cuerda {note.stringName}</span>
              </div>
            );
          })}
        </div>

        {/* Dynamic Timing Feedback Text */}
        {feedback && (
          <div className="absolute top-3 right-5 text-sm font-black animate-bounce">
            <span className={feedback.color}>{feedback.text}</span>
          </div>
        )}

        {/* Start Overlay if not playing */}
        {!isPlaying && !gameFinished && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-20 p-4 text-center">
            <span className="font-manga text-xs text-[#FF5F00]">「準備完了」</span>
            <p className="text-sm text-white max-w-xs font-bold">
              Pulsa los botones o las teclas <strong className="text-[#FF5F00]">← (Abajo)</strong> y{' '}
              <strong className="text-white">→ (Arriba)</strong> justo cuando pasen por la línea.
            </p>
            <button
              id="start-bowing-game-btn"
              onClick={startGame}
              className="px-6 py-3 rounded-2xl bg-[#FF5F00] text-black font-black text-sm border-2 border-black shadow-[4px_4px_0px_#FFFFFF] hover:bg-white hover:text-black active:scale-95 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              ¡Iniciar Pista!
            </button>
          </div>
        )}

        {/* Game Completed Overlay */}
        {gameFinished && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xs flex flex-col items-center justify-center p-4 z-20 text-center">
            <span className="font-manga text-xs text-[#FF5F00]">「パーフェクト・フィニッシュ」</span>
            <h3 className="text-xl font-black text-white mb-1">¡Sesión de Arco Completada!</h3>
            <p className="text-xs text-zinc-300 mb-3 font-medium">
              Excelente control de arco y ritmo. ¡Tu sonido se vuelve más limpio con cada nota!
            </p>

            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black border-2 border-white text-white font-black text-sm shadow-[3px_3px_0px_#FF5F00]">
                <span>⭐ {starsEarned} Estrellas</span>
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black border-2 border-[#FF5F00] text-[#FF5F00] font-black text-sm shadow-[3px_3px_0px_#FFFFFF]">
                <span>💎 +{gemsEarned} Gemas</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={startGame}
                className="px-4 py-2.5 rounded-xl bg-black text-white border-2 border-white text-xs font-black hover:border-[#FF5F00] flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Repetir
              </button>
              <button
                id="claim-bowing-rewards-btn"
                onClick={() => {
                  onGameComplete(gemsEarned, starsEarned);
                  onExit();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#FF5F00] text-black font-black text-xs border-2 border-black shadow-[3px_3px_0px_#FFFFFF] hover:bg-white hover:text-black flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Guardar Recompensas
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Two Big High-Contrast Touch / Click Controls for Down-Bow & Up-Bow */}
      <div className="w-full grid grid-cols-2 gap-3 mt-4">
        <button
          id="bow-down-trigger-btn"
          onClick={() => handleBowStroke('down')}
          disabled={!isPlaying}
          className="h-24 rounded-2xl bg-black border-3 border-white text-white p-3 flex flex-col items-center justify-center gap-1 shadow-[4px_4px_0px_#FF5F00] active:scale-95 transition-transform disabled:opacity-50 hover:bg-zinc-900"
        >
          <div className="text-3xl font-black leading-none">⊓</div>
          <div className="font-black text-sm">Arco Abajo</div>
          <div className="text-[11px] text-zinc-300 font-mono">Tirar (Tecla ← o A)</div>
        </button>

        <button
          id="bow-up-trigger-btn"
          onClick={() => handleBowStroke('up')}
          disabled={!isPlaying}
          className="h-24 rounded-2xl bg-[#FF5F00] border-3 border-black text-black p-3 flex flex-col items-center justify-center gap-1 shadow-[4px_4px_0px_#FFFFFF] active:scale-95 transition-transform disabled:opacity-50 hover:brightness-110"
        >
          <div className="text-3xl font-black leading-none">∨</div>
          <div className="font-black text-sm">Arco Arriba</div>
          <div className="text-[11px] text-black/80 font-mono">Empujar (Tecla → o D)</div>
        </button>
      </div>
    </div>
  );
};
