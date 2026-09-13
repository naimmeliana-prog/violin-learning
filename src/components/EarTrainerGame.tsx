import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../services/soundEngine';
import { VIOLIN_STRINGS } from '../data/violinNotes';
import { Sparkles, Trophy, CheckCircle2, RotateCcw, Volume2, Headphones } from 'lucide-react';

interface EarTrainerGameProps {
  onGameComplete: (earnedGems: number, earnedStars: number) => void;
  onExit: () => void;
}

export const EarTrainerGame: React.FC<EarTrainerGameProps> = ({ onGameComplete, onExit }) => {
  const [round, setRound] = useState<number>(1);
  const totalRounds = 6;
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Tuning question state
  const [baseFreq, setBaseFreq] = useState<number>(440);
  const [stringName, setStringName] = useState<string>('La');
  const [pitchOffset, setPitchOffset] = useState<'sharp' | 'flat' | 'perfect'>('perfect');
  const [userSelection, setUserSelection] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const generateQuestion = () => {
    const randomStr = VIOLIN_STRINGS[Math.floor(Math.random() * VIOLIN_STRINGS.length)];
    setStringName(`${randomStr.spanish} (${randomStr.name})`);

    const offsets: ('sharp' | 'flat' | 'perfect')[] = ['sharp', 'flat', 'perfect'];
    const chosenOffset = offsets[Math.floor(Math.random() * offsets.length)];
    setPitchOffset(chosenOffset);

    // Calculate detuning in Hz (sharp is +3.5%, flat is -3.5%)
    let freq = randomStr.freq;
    if (chosenOffset === 'sharp') freq = randomStr.freq * 1.035;
    if (chosenOffset === 'flat') freq = randomStr.freq * 0.965;
    setBaseFreq(freq);

    setUserSelection(null);
    setIsCorrect(null);

    // Play initial sound
    setTimeout(() => {
      soundEngine.playViolinNote(freq, 1.4, 'bow');
    }, 250);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleAnswer = (choice: 'sharp' | 'flat' | 'perfect') => {
    if (userSelection) return;

    setUserSelection(choice);
    const correct = choice === pitchOffset;
    setIsCorrect(correct);

    if (correct) {
      soundEngine.playRewardChime('small');
      setScore((s) => s + 100);
    } else {
      soundEngine.playRhythmClick('miss');
    }

    setTimeout(() => {
      if (round >= totalRounds) {
        setIsFinished(true);
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
        soundEngine.playRewardChime('major');
      } else {
        setRound((r) => r + 1);
        generateQuestion();
      }
    }, 1400);
  };

  const replayNote = () => {
    soundEngine.playViolinNote(baseFreq, 1.4, 'bow');
  };

  const gemsEarned = Math.round(score * 0.4) + 20;
  const starsEarned = score >= 500 ? 3 : score >= 300 ? 2 : 1;

  return (
    <div id="ear-trainer-root" className="w-full max-w-xl mx-auto p-4 flex flex-col items-center select-none">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4 bg-black p-4 rounded-2xl border-2 border-white shadow-[4px_4px_0px_#FF5F00]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF5F00] text-black border-2 border-black flex items-center justify-center font-black text-xl shadow-[2px_2px_0px_#FFFFFF]">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">Oído Maestro</h2>
              <span className="font-manga text-[11px] text-[#FF5F00]">「聴音トレーニング」</span>
            </div>
            <p className="text-xs text-zinc-300 font-medium">Detecta la afinación exacta del violín</p>
          </div>
        </div>

        <button
          onClick={onExit}
          className="px-3 py-1.5 rounded-xl border-2 border-white bg-black text-xs font-black text-white hover:bg-[#FF5F00] hover:text-black transition-colors shadow-[2px_2px_0px_#FFFFFF]"
        >
          Volver
        </button>
      </div>

      {/* Round & Score */}
      <div className="w-full flex items-center justify-between px-4 py-2 mb-4 bg-black rounded-2xl border-2 border-white shadow-[3px_3px_0px_#000000]">
        <span className="text-xs text-zinc-300 font-bold">Ronda {round} de {totalRounds}</span>
        <div className="px-3 py-1 rounded-xl bg-[#FF5F00] text-black font-black text-xs border border-black shadow-xs">
          {score} Puntos
        </div>
      </div>

      {!isFinished ? (
        <div className="w-full flex flex-col items-center gap-5">
          {/* Sound listening box */}
          <div className="w-full p-6 rounded-3xl bg-black border-3 border-white shadow-[6px_6px_0px_#FF5F00] flex flex-col items-center text-center gap-3">
            <span className="text-xs font-black text-[#FF5F00] uppercase tracking-wider">
              Cuerda evaluada: {stringName}
            </span>

            <div className="w-20 h-20 rounded-2xl bg-black border-3 border-[#FF5F00] flex items-center justify-center text-[#FF5F00] animate-pulse shadow-[3px_3px_0px_#FFFFFF]">
              <Volume2 className="w-10 h-10" />
            </div>

            <p className="text-sm text-white font-bold max-w-xs">
              Escucha atentamente el sonido. ¿Está en su tono justo, pasada de agudo (♯) o caída hacia lo grave (♭)?
            </p>

            <button
              id="replay-ear-sound-btn"
              onClick={replayNote}
              className="px-5 py-2.5 rounded-xl bg-black text-white hover:text-[#FF5F00] text-xs font-black border-2 border-white hover:border-[#FF5F00] shadow-[3px_3px_0px_#FFFFFF] flex items-center gap-2 transition-all active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-[#FF5F00]" />
              <span>Volver a Escuchar</span>
            </button>
          </div>

          {/* 3 Answer Choices in Blanco, Negro & Naranja Pantone 165 C */}
          <div className="w-full grid grid-cols-3 gap-3">
            {/* Flat */}
            <button
              id="ear-choice-flat"
              onClick={() => handleAnswer('flat')}
              disabled={userSelection !== null}
              className={`p-4 rounded-2xl border-2 font-black flex flex-col items-center gap-1 transition-all active:scale-95 ${
                userSelection
                  ? pitchOffset === 'flat'
                    ? 'bg-[#FF5F00] text-black border-black ring-2 ring-white shadow-[4px_4px_0px_#FFFFFF]'
                    : 'bg-black text-zinc-600 border-zinc-800 opacity-40'
                  : 'bg-black text-white border-white hover:border-[#FF5F00] shadow-[3px_3px_0px_#000000]'
              }`}
            >
              <span className="text-2xl font-black">♭</span>
              <span className="text-xs">Demasiado Grave</span>
              <span className="text-[10px] text-zinc-400 font-mono">(Baja)</span>
            </button>

            {/* Perfect */}
            <button
              id="ear-choice-perfect"
              onClick={() => handleAnswer('perfect')}
              disabled={userSelection !== null}
              className={`p-4 rounded-2xl border-2 font-black flex flex-col items-center gap-1 transition-all active:scale-95 ${
                userSelection
                  ? pitchOffset === 'perfect'
                    ? 'bg-[#FF5F00] text-black border-black ring-2 ring-white shadow-[4px_4px_0px_#FFFFFF]'
                    : 'bg-black text-zinc-600 border-zinc-800 opacity-40'
                  : 'bg-black text-white border-white hover:border-[#FF5F00] shadow-[3px_3px_0px_#000000]'
              }`}
            >
              <span className="text-2xl font-black">✨</span>
              <span className="text-xs">¡Bien Afinada!</span>
              <span className="text-[10px] text-[#FF5F00] font-mono">(Tono Puro)</span>
            </button>

            {/* Sharp */}
            <button
              id="ear-choice-sharp"
              onClick={() => handleAnswer('sharp')}
              disabled={userSelection !== null}
              className={`p-4 rounded-2xl border-2 font-black flex flex-col items-center gap-1 transition-all active:scale-95 ${
                userSelection
                  ? pitchOffset === 'sharp'
                    ? 'bg-[#FF5F00] text-black border-black ring-2 ring-white shadow-[4px_4px_0px_#FFFFFF]'
                    : 'bg-black text-zinc-600 border-zinc-800 opacity-40'
                  : 'bg-black text-white border-white hover:border-[#FF5F00] shadow-[3px_3px_0px_#000000]'
              }`}
            >
              <span className="text-2xl font-black">♯</span>
              <span className="text-xs">Demasiado Aguda</span>
              <span className="text-[10px] text-zinc-400 font-mono">(Alta)</span>
            </button>
          </div>

          {/* Feedback banner */}
          {userSelection && (
            <div
              className={`w-full py-2.5 px-4 rounded-2xl text-center text-xs font-black transition-all border-2 ${
                isCorrect
                  ? 'bg-black text-white border-[#FF5F00] shadow-[3px_3px_0px_#FFFFFF]'
                  : 'bg-black text-zinc-300 border-zinc-700'
              }`}
            >
              {isCorrect
                ? '¡Oído perfecto! Diste exactamente con el estado de la cuerda. 🎯「大正解」'
                : `No exactamente: estaba ${
                    pitchOffset === 'perfect'
                      ? 'perfectamente afinada'
                      : pitchOffset === 'sharp'
                      ? 'demasiado aguda (♯)'
                      : 'demasiado grave (♭)'
                  }`}
            </div>
          )}
        </div>
      ) : (
        /* Game Finished celebration */
        <div className="w-full bg-black p-6 rounded-3xl border-3 border-white shadow-[6px_6px_0px_#FF5F00] text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FF5F00] border-2 border-black flex items-center justify-center text-black shadow-[3px_3px_0px_#FFFFFF] mb-2">
            <Trophy className="w-8 h-8" />
          </div>
          <span className="font-manga text-xs text-[#FF5F00]">「ステージ・クリア」</span>
          <h3 className="text-xl font-black text-white mb-1">¡Entrenamiento de Oído Superado!</h3>
          <p className="text-xs text-zinc-300 mb-4 max-w-sm font-medium">
            Tu cerebro musical está aprendiendo a distinguir microtonos como las grandes violinistas.
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
                setRound(1);
                setScore(0);
                setIsFinished(false);
                generateQuestion();
              }}
              className="px-4 py-2.5 rounded-xl bg-black text-white border-2 border-white text-xs font-black hover:border-[#FF5F00] flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Repetir
            </button>
            <button
              id="claim-ear-rewards-btn"
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
