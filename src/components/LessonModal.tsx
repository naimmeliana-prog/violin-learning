import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Lesson, ViolinNote } from '../types/violin';
import { ViolinFingerboard } from './ViolinFingerboard';
import { InteractiveStave } from './InteractiveStave';
import { soundEngine } from '../services/soundEngine';
import {
  X,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Lightbulb,
  Award,
  Clock,
  Flame,
} from 'lucide-react';

interface LessonModalProps {
  lesson: Lesson;
  activeSkinColor?: string;
  activeSkinAccent?: string;
  onClose: () => void;
  onComplete: (lessonId: string, earnedGems: number, earnedStars: number) => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  activeSkinColor,
  activeSkinAccent,
  onClose,
  onComplete,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [taskProgress, setTaskProgress] = useState<number>(0);
  const [taskCompleted, setTaskCompleted] = useState<boolean>(false);
  const [isLessonFinished, setIsLessonFinished] = useState<boolean>(false);
  const [lastPlayedNote, setLastPlayedNote] = useState<ViolinNote | null>(null);

  const step = lesson.steps[currentStepIdx];
  const requiredCount = step?.practiceTask?.requiredTaps || step?.practiceTask?.targetNotes?.length || 1;

  const handleNotePlayed = (note: ViolinNote) => {
    setLastPlayedNote(note);

    if (taskCompleted || isLessonFinished) return;

    // Check if matches expected target
    const targetNotes = step.practiceTask?.targetNotes;
    if (targetNotes && targetNotes.length > 0) {
      const expectedNoteName = targetNotes[taskProgress % targetNotes.length];
      if (note.name === expectedNoteName) {
        soundEngine.playRewardChime('small');
        const nextProgress = taskProgress + 1;
        setTaskProgress(nextProgress);

        if (nextProgress >= requiredCount) {
          setTaskCompleted(true);
          soundEngine.playRewardChime('major');
        }
      }
    } else {
      // General tap requirement
      soundEngine.playRewardChime('small');
      const nextProgress = taskProgress + 1;
      setTaskProgress(nextProgress);
      if (nextProgress >= requiredCount) {
        setTaskCompleted(true);
        soundEngine.playRewardChime('major');
      }
    }
  };

  const handleBowPractice = (direction: 'down' | 'up') => {
    soundEngine.playViolinNote(440, 1.1, 'bow');
    soundEngine.playRhythmClick('perfect');

    if (step.practiceTask.bowDirection && step.practiceTask.bowDirection !== direction) {
      return;
    }

    const nextProgress = taskProgress + 1;
    setTaskProgress(nextProgress);
    if (nextProgress >= requiredCount) {
      setTaskCompleted(true);
      soundEngine.playRewardChime('major');
    }
  };

  const nextStep = () => {
    if (currentStepIdx + 1 < lesson.steps.length) {
      setCurrentStepIdx(currentStepIdx + 1);
      setTaskProgress(0);
      setTaskCompleted(false);
      setLastPlayedNote(null);
    } else {
      setIsLessonFinished(true);
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.55 },
      });
      soundEngine.playRewardChime('major');
    }
  };

  return (
    <div
      id="lesson-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none"
    >
      <div
        id="lesson-modal-card"
        className="relative w-full max-w-2xl bg-black rounded-3xl border-3 border-white shadow-[8px_8px_0px_#FF5F00] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top Header in Black, White and Pantone 165 C */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-white bg-black">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#FF5F00] text-black font-black flex items-center justify-center text-sm border-2 border-black shadow-[2px_2px_0px_#FFFFFF]">
              {lesson.number}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {lesson.title}
                </h2>
                {lesson.japaneseTag && (
                  <span className="font-manga text-[11px] text-[#FF5F00]">
                    {lesson.japaneseTag}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-300 font-bold">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#FF5F00]" /> ~{lesson.estimatedMinutes} min
                </span>
                <span>•</span>
                <span className="text-[#FF5F00]">Paso {currentStepIdx + 1} de {lesson.steps.length}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white bg-black border-2 border-white/50 hover:border-[#FF5F00] hover:text-[#FF5F00] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-zinc-900 h-2 flex border-b border-zinc-800">
          {lesson.steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-300 ${
                idx < currentStepIdx
                  ? 'bg-white'
                  : idx === currentStepIdx
                  ? 'bg-[#FF5F00]'
                  : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Body content */}
        <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4 bg-[#0A0A0A]">
          {!isLessonFinished ? (
            <>
              {/* Concept Presentation Box (Manga Panel) */}
              <div className="p-4 rounded-2xl bg-black border-2 border-white/80 shadow-[4px_4px_0px_#FF5F00] flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-lg bg-[#FF5F00] text-black font-black text-[11px] uppercase tracking-wider">
                    Paso {currentStepIdx + 1}
                  </span>
                  <h3 className="font-black text-white text-base">{step.title}</h3>
                </div>

                <p className="text-sm text-zinc-200 leading-relaxed font-medium">{step.explanation}</p>

                {step.tip && (
                  <div className="mt-1 flex items-start gap-2 p-2.5 rounded-xl bg-zinc-900 border-2 border-[#FF5F00] text-xs text-white">
                    <Lightbulb className="w-4 h-4 text-[#FF5F00] shrink-0 mt-0.5" />
                    <span><strong className="text-[#FF5F00]">Consejo Maestro:</strong> {step.tip}</span>
                  </div>
                )}
              </div>

              {/* Stave diagram if step uses stave */}
              {step.diagramType === 'stave' && (
                <div className="w-full p-2 bg-black rounded-2xl border-2 border-zinc-800">
                  <InteractiveStave
                    currentNote={lastPlayedNote}
                    targetNote={step.targetNote}
                    showNoteName={true}
                  />
                </div>
              )}

              {/* Bow gesture simulation if step is bow */}
              {step.diagramType === 'bow' && (
                <div className="w-full p-4 bg-black rounded-2xl border-2 border-white/80 shadow-[3px_3px_0px_#FF5F00] flex flex-col items-center gap-3">
                  <div className="text-xs text-white font-black flex items-center gap-1.5">
                    <span>Simulación de movimiento de arco:</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#FF5F00] text-black font-bold">Arco Abajo / Arriba</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleBowPractice('down')}
                      className={`px-6 py-3 rounded-2xl border-2 flex items-center gap-3 font-black transition-all active:scale-95 ${
                        step.practiceTask.bowDirection === 'down'
                          ? 'bg-[#FF5F00] text-black border-black shadow-[3px_3px_0px_#FFFFFF]'
                          : 'bg-black text-white border-white hover:border-[#FF5F00]'
                      }`}
                    >
                      <span className="text-2xl font-black">⊓</span>
                      <span>Arco Abajo (Tirar)</span>
                    </button>

                    <button
                      onClick={() => handleBowPractice('up')}
                      className={`px-6 py-3 rounded-2xl border-2 flex items-center gap-3 font-black transition-all active:scale-95 ${
                        step.practiceTask.bowDirection === 'up'
                          ? 'bg-[#FF5F00] text-black border-black shadow-[3px_3px_0px_#FFFFFF]'
                          : 'bg-black text-white border-white hover:border-[#FF5F00]'
                      }`}
                    >
                      <span className="text-2xl font-black">∨</span>
                      <span>Arco Arriba (Empujar)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Interactive Practice Zone */}
              <div className="p-4 rounded-2xl bg-black border-2 border-white flex flex-col gap-3 shadow-[4px_4px_0px_#000000]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F00] animate-ping" />
                    <span className="text-xs font-black text-[#FF5F00] uppercase tracking-wider flex items-center gap-1.5">
                      <span>Práctica Inmediata</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white text-black font-black">¡A Tocar!</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-xl bg-zinc-900 border border-white text-white">
                    <span className="text-zinc-400">Progreso:</span>
                    <span className="text-[#FF5F00]">
                      {taskProgress} / {requiredCount}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-bold text-white">
                  {step.practiceTask.instruction}
                </p>

                {/* Target Notes helper chips */}
                {step.practiceTask.targetNotes && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-zinc-300 font-bold">Secuencia objetivo:</span>
                    {step.practiceTask.targetNotes.map((noteName, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-xl text-xs font-black border-2 transition-all ${
                          idx < taskProgress
                            ? 'bg-white text-black border-black line-through opacity-80'
                            : idx === taskProgress
                            ? 'bg-[#FF5F00] text-black border-white animate-bounce shadow-[2px_2px_0px_#FFFFFF]'
                            : 'bg-black text-zinc-400 border-zinc-700'
                        }`}
                      >
                        {noteName}
                      </span>
                    ))}
                  </div>
                )}

                {/* Interactive Violin Fingerboard inside lesson */}
                <ViolinFingerboard
                  onNotePlay={handleNotePlayed}
                  highlightedStrings={step.highlightStrings}
                  highlightedFingers={step.highlightFingers}
                  targetNote={step.targetNote}
                  activeSkinColor={activeSkinColor}
                  activeSkinAccent={activeSkinAccent}
                />
              </div>

              {/* Task Completion Celebration & Next Button */}
              {taskCompleted && (
                <div className="p-4 rounded-2xl bg-black border-2 border-[#FF5F00] shadow-[4px_4px_0px_#FFFFFF] flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center gap-2.5 text-white font-black">
                    <CheckCircle2 className="w-5 h-5 text-[#FF5F00]" />
                    <span className="text-xs font-black">¡Completado con éxito!</span>
                    <span className="text-xs px-2 py-0.5 rounded-lg bg-[#FF5F00] text-black font-black">¡Perfecto! ⭐</span>
                  </div>

                  <button
                    id="lesson-next-step-btn"
                    onClick={nextStep}
                    className="px-5 py-2.5 rounded-xl bg-[#FF5F00] text-black font-black text-xs shadow-[3px_3px_0px_#FFFFFF] hover:bg-white hover:text-black border-2 border-black flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <span>{currentStepIdx + 1 < lesson.steps.length ? 'Siguiente Paso' : 'Finalizar Lección'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Whole Lesson Completed Screen */
            <div className="py-8 flex flex-col items-center text-center gap-4 bg-black rounded-2xl border-2 border-white p-6 shadow-[6px_6px_0px_#FF5F00]">
              <div className="w-20 h-20 rounded-2xl bg-[#FF5F00] border-3 border-black flex items-center justify-center text-black shadow-[4px_4px_0px_#FFFFFF]">
                <Award className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-[#FF5F00] text-black font-black uppercase tracking-wider">¡Misión Cumplida!</span>
                <h3 className="text-2xl font-black text-white mt-2">¡Lección Dominada!</h3>
                <p className="text-xs text-zinc-300 mt-1 max-w-sm font-medium">
                  Has superado &quot;{lesson.title}&quot;. Tu técnica, oído y memoria muscular se han activado al máximo.
                </p>
              </div>

              {/* Reward Cards */}
              <div className="flex items-center justify-center gap-4 my-2">
                <div className="px-5 py-3 rounded-2xl bg-black border-2 border-white shadow-[3px_3px_0px_#FF5F00] text-center">
                  <div className="text-2xl font-black text-white">⭐ +{lesson.starReward}</div>
                  <div className="text-[11px] text-zinc-400 font-bold">Estrellas de Virtuosa</div>
                </div>

                <div className="px-5 py-3 rounded-2xl bg-black border-2 border-[#FF5F00] shadow-[3px_3px_0px_#FFFFFF] text-center">
                  <div className="text-2xl font-black text-[#FF5F00]">💎 +{lesson.gemReward}</div>
                  <div className="text-[11px] text-zinc-400 font-bold">Gemas Musicales</div>
                </div>
              </div>

              <button
                id="lesson-claim-reward-btn"
                onClick={() => {
                  onComplete(lesson.id, lesson.gemReward, lesson.starReward);
                  onClose();
                }}
                className="px-6 py-3 rounded-2xl bg-[#FF5F00] text-black font-black text-sm border-2 border-black shadow-[4px_4px_0px_#FFFFFF] hover:bg-white hover:text-black active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                ¡Reclamar Recompensas y Continuar!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
