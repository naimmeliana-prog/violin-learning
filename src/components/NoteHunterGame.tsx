import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ViolinNote } from '../types/violin';
import { ALL_NOTES_LIST, FIRST_POSITION_NOTES } from '../data/violinNotes';
import { InteractiveStave } from './InteractiveStave';
import { soundEngine } from '../services/soundEngine';
import { Sparkles, Trophy, CheckCircle2, RotateCcw, Volume2 } from 'lucide-react';

interface NoteHunterGameProps {
  onGameComplete: (earnedGems: number, earnedStars: number) => void;
  onExit: () => void;
}

export const NoteHunterGame: React.FC<NoteHunterGameProps> = ({ onGameComplete, onExit }) => {
  const [difficulty, setDifficulty] = useState<'openStrings' | 'laString' | 'all'>('laString');
  const [currentRound, setCurrentRound] = useState<number>(0);
  const totalRounds = 8;
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [targetNote, setTargetNote] = useState<ViolinNote | null>(null);
  const [options, setOptions] = useState<ViolinNote[]>([]);
  const [selectedOption, setSelectedOption] = useState<ViolinNote | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Pool of candidate notes based on difficulty
  const getNotePool = () => {
    if (difficulty === 'openStrings') {
      return [
        FIRST_POSITION_NOTES.G[0],
        FIRST_POSITION_NOTES.D[0],
        FIRST_POSITION_NOTES.A[0],
        FIRST_POSITION_NOTES.E[0],
      ];
    } else if (difficulty === 'laString') {
      return [...FIRST_POSITION_NOTES.A, FIRST_POSITION_NOTES.E[0], FIRST_POSITION_NOTES.E[1]];
    } else {
      return ALL_NOTES_LIST;
    }
  };

  const nextQuestion = () => {
    const pool = getNotePool();
    const randomTarget = pool[Math.floor(Math.random() * pool.length)];
    setTargetNote(randomTarget);

    // Pick 3 distractors
    const distractors = pool.filter(
      (n) => n.name !== randomTarget.name || n.octave !== randomTarget.octave
    );
    const shuffledDistractors = [...distractors].sort(() => 0.5 - Math.random()).slice(0, 3);
    const roundOptions = [randomTarget, ...shuffledDistractors].sort(() => 0.5 - Math.random());

    setOptions(roundOptions);
    setSelectedOption(null);
    setIsCorrect(null);

    // Play target sound
    setTimeout(() => {
      soundEngine.playViolinNote(randomTarget.freq, 1.2, 'bow');
    }, 200);
  };

  useEffect(() => {
    setCurrentRound(1);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
    nextQuestion();
  }, [difficulty]);

  const handleSelectNote = (option: ViolinNote) => {
    if (selectedOption || !targetNote) return;

    setSelectedOption(option);
    soundEngine.playViolinNote(option.freq, 1.0, 'bow');

    const correct = option.name === targetNote.name && option.octave === targetNote.octave;
    setIsCorrect(correct);

    if (correct) {
      soundEngine.playRewardChime('small');
      setScore((s) => s + 50 + streak * 10);
      setStreak((st) => st + 1);
    } else {
      soundEngine.playRhythmClick('miss');
      setStreak(0);
    }

    // Advance after brief positive pause
    setTimeout(() => {
      if (currentRound >= totalRounds) {
        setIsFinished(true);
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
        soundEngine.playRewardChime('major');
      } else {
        setCurrentRound((r) => r + 1);
        nextQuestion();
      }
    }, 1200);
  };

  const replaySound = () => {
    if (targetNote) {
      soundEngine.playViolinNote(targetNote.freq, 1.2, 'bow');
    }
  };

  const gemsEarned = Math.round(score * 0.4) + 30;
  const starsEarned = score >= 350 ? 3 : score >= 200 ? 2 : 1;

  return (
    <div id="note-hunter-root" className="w-full max-w-xl mx-auto p-4 flex flex-col items-center select-none">
      {/* Top Header in Blanco, Negro & Naranja Pantone 165 C */}
      <div className="w-full flex items-center justify-between mb-3 bg-black p-4 rounded-2xl border-2 border-white shadow-[4px_4px_0px_#FF5F00]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF5F00] text-black border-2 border-black flex items-center justify-center font-black text-xl shadow-[2px_2px_0px_#FFFFFF]">
            𝄞
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">Cazador de Notas</h2>
              <span className="font-manga text-[11px] text-[#FF5F00]">「音符ハント」</span>
            </div>
            <p className="text-xs text-zinc-300 font-medium">Identifica la nota en el pentagrama</p>
          </div>
        </div>
        <button
          onClick={onExit}
          className="px-3 py-1.5 rounded-xl border-2 border-white bg-black text-xs font-black text-white hover:bg-[#FF5F00] hover:text-black transition-colors shadow-[2px_2px_0px_#FFFFFF]"
        >
          Volver
        </button>
      </div>

      {/* Difficulty Tabs & Progress */}
      <div className="w-full flex items-center justify-between gap-2 mb-3 bg-black p-2 rounded-2xl border-2 border-white shadow-[3px_3px_0px_#000000]">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setDifficulty('openStrings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              difficulty === 'openStrings' ? 'bg-[#FF5F00] text-black border-2 border-black shadow-xs' : 'text-zinc-400 hover:text-white'
            }`}
          >
            4 Cuerdas
          </button>
          <button
            onClick={() => setDifficulty('laString')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              difficulty === 'laString' ? 'bg-[#FF5F00] text-black border-2 border-black shadow-xs' : 'text-zinc-400 hover:text-white'
            }`}
          >
            La & Mi
          </button>
          <button
            onClick={() => setDifficulty('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              difficulty === 'all' ? 'bg-[#FF5F00] text-black border-2 border-black shadow-xs' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Completo
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-black">
          <span className="text-zinc-300">Ronda {currentRound}/{totalRounds}</span>
          <span className="px-2.5 py-1 rounded-xl bg-[#FF5F00] text-black font-black border border-black shadow-xs">
            {score} pts
          </span>
        </div>
      </div>

      {!isFinished ? (
        <div className="w-full flex flex-col items-center gap-4">
          {/* Target Note Stave Display */}
          <div className="relative w-full bg-black rounded-3xl border-3 border-white p-4 shadow-[6px_6px_0px_#FF5F00] flex flex-col items-center">
            <InteractiveStave
              targetNote={targetNote}
              showNoteName={false}
              className="w-full"
            />

            {/* Play audio again button */}
            <button
              onClick={replaySound}
              className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white hover:text-[#FF5F00] text-xs font-black border-2 border-white hover:border-[#FF5F00] shadow-[2px_2px_0px_#FFFFFF]"
            >
              <Volume2 className="w-4 h-4 text-[#FF5F00]" />
              <span>Escuchar de nuevo</span>
            </button>
          </div>

          {/* Question Prompt */}
          <div className="text-center">
            <p className="text-sm font-black text-white">
              ¿Qué nota es la que aparece en el pentagrama?
            </p>
            <p className="text-xs text-zinc-400 font-medium">
              Fíjate en la línea o espacio en el que está colocada
            </p>
          </div>

          {/* 4 Interactive Answer Choices in Blanco, Negro & Naranja Pantone 165 C */}
          <div className="w-full grid grid-cols-2 gap-3">
            {options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isTarget = targetNote && opt.name === targetNote.name && opt.octave === targetNote.octave;

              let btnStyle = 'bg-black text-white border-white hover:border-[#FF5F00] hover:bg-zinc-900 shadow-[3px_3px_0px_#000000]';

              if (selectedOption) {
                if (isTarget) {
                  btnStyle = 'bg-[#FF5F00] text-black border-black ring-2 ring-white shadow-[4px_4px_0px_#FFFFFF] scale-102';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-zinc-900 border-zinc-700 text-zinc-500 opacity-70';
                } else {
                  btnStyle = 'bg-black text-zinc-600 border-zinc-800 opacity-40';
                }
              }

              return (
                <button
                  key={`${opt.name}-${opt.octave}-${idx}`}
                  id={`option-note-${idx}`}
                  onClick={() => handleSelectNote(opt)}
                  disabled={selectedOption !== null}
                  className={`p-3.5 rounded-2xl border-2 font-black text-left flex items-center justify-between transition-all transform active:scale-95 ${btnStyle}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FF5F00] inline-block shadow-sm" />
                    <div>
                      <div className="text-base font-black">{opt.name}</div>
                      <div className="text-[11px] font-mono opacity-80">
                        Cuerda {opt.string} · Dedo {opt.finger === 0 ? '0 (aire)' : opt.finger}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono">({opt.englishName})</span>
                </button>
              );
            })}
          </div>

          {/* Feedback banner */}
          {selectedOption && (
            <div
              className={`w-full py-2.5 px-4 rounded-2xl text-center text-xs font-black transition-all border-2 ${
                isCorrect
                  ? 'bg-black text-white border-[#FF5F00] shadow-[3px_3px_0px_#FFFFFF]'
                  : 'bg-black text-zinc-300 border-zinc-700'
              }`}
            >
              {isCorrect
                ? `¡Exacto! Es ${targetNote?.name} en cuerda ${targetNote?.string} (dedo ${
                    targetNote?.finger === 0 ? '0 al aire' : targetNote?.finger
                  }) ✨「大正解」`
                : `¡Casi! Era ${targetNote?.name} en cuerda ${targetNote?.string}`}
            </div>
          )}
        </div>
      ) : (
        /* Round Finished celebration */
        <div className="w-full bg-black p-6 rounded-3xl border-3 border-white shadow-[6px_6px_0px_#FF5F00] text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FF5F00] border-2 border-black flex items-center justify-center text-black shadow-[3px_3px_0px_#FFFFFF] mb-2">
            <Trophy className="w-8 h-8" />
          </div>
          <span className="font-manga text-xs text-[#FF5F00]">「ステージ・クリア」</span>
          <h3 className="text-xl font-black text-white mb-1">¡Cacería de Notas Exitosa!</h3>
          <p className="text-xs text-zinc-300 mb-4 max-w-sm font-medium">
            Tu lectura musical y memoria visual en el pentagrama van a toda velocidad.
          </p>

          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black border-2 border-white text-white font-black text-sm shadow-[3px_3px_0px_#FF5F00]">
              <span>⭐ {starsEarned} Estrellas</span>
            </div>
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black border-2 border-[#FF5F00] text-[#FF5F00] font-black text-sm shadow-[3px_3px_0px_#FFFFFF]">
              <span>💎 +{gemsEarned} Gemas</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentRound(1);
                setScore(0);
                setStreak(0);
                setIsFinished(false);
                nextQuestion();
              }}
              className="px-4 py-2.5 rounded-xl bg-black text-white border-2 border-white text-xs font-black hover:border-[#FF5F00] flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Repetir
            </button>
            <button
              id="claim-hunter-rewards-btn"
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
  );
};
