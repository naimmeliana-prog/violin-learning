import React, { useState } from 'react';
import { ViolinNote, StringName } from '../types/violin';
import { VIOLIN_STRINGS, FIRST_POSITION_NOTES } from '../data/violinNotes';
import { soundEngine } from '../services/soundEngine';
import { Volume2, Music, Sparkles } from 'lucide-react';

interface ViolinFingerboardProps {
  onNotePlay?: (note: ViolinNote) => void;
  highlightedStrings?: StringName[];
  highlightedFingers?: { string: StringName; finger: number }[];
  targetNote?: ViolinNote | null;
  activeSkinColor?: string;
  activeSkinAccent?: string;
  className?: string;
}

export const ViolinFingerboard: React.FC<ViolinFingerboardProps> = ({
  onNotePlay,
  highlightedStrings = [],
  highlightedFingers = [],
  targetNote = null,
  activeSkinColor = '#121212',
  activeSkinAccent = '#FF5F00',
  className = '',
}) => {
  const [activeNote, setActiveNote] = useState<ViolinNote | null>(null);
  const [vibratingString, setVibratingString] = useState<StringName | null>(null);
  const [articulation, setArticulation] = useState<'bow' | 'pizzicato'>('bow');
  const [showFingerTapes, setShowFingerTapes] = useState<boolean>(true);

  const handlePlayNote = (note: ViolinNote) => {
    setActiveNote(note);
    setVibratingString(note.string);
    soundEngine.playViolinNote(note.freq, articulation === 'bow' ? 1.3 : 0.8, articulation);

    if (onNotePlay) {
      onNotePlay(note);
    }

    setTimeout(() => {
      setVibratingString(null);
    }, 450);
  };

  const isFingerHighlighted = (str: StringName, finger: number) => {
    return highlightedFingers.some((hf) => hf.string === str && hf.finger === finger);
  };

  const isStringHighlighted = (str: StringName) => {
    return highlightedStrings.includes(str);
  };

  // Tape labels for beginner guidance
  const fingerLabels = [
    { finger: 1, label: '1er Dedo', distancePercent: '22%' },
    { finger: 2, label: '2º Dedo', distancePercent: '40%' },
    { finger: 3, label: '3er Dedo', distancePercent: '56%' },
    { finger: 4, label: '4º Dedo', distancePercent: '74%' },
  ];

  return (
    <div id="violin-fingerboard-root" className={`flex flex-col items-center select-none ${className}`}>
      {/* Top Controls: Articulation selector (Arco / Pizzicato) & Tapes toggle */}
      <div className="flex items-center justify-between w-full max-w-md px-3 py-2 mb-2 bg-black border-2 border-white/80 rounded-2xl shadow-[3px_3px_0px_#FF5F00] text-xs">
        <div className="flex items-center gap-1.5">
          <button
            id="articulation-bow-btn"
            onClick={() => setArticulation('bow')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 border-2 ${
              articulation === 'bow'
                ? 'bg-[#FF5F00] text-black border-black shadow-[2px_2px_0px_#FFFFFF]'
                : 'bg-black text-white border-white/30 hover:border-white'
            }`}
          >
            <span>🎻 Arco</span>
            <span className="text-[10px] opacity-90">(sostenido)</span>
          </button>
          <button
            id="articulation-pizz-btn"
            onClick={() => setArticulation('pizzicato')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 border-2 ${
              articulation === 'pizzicato'
                ? 'bg-[#FF5F00] text-black border-black shadow-[2px_2px_0px_#FFFFFF]'
                : 'bg-black text-white border-white/30 hover:border-white'
            }`}
          >
            <span>🤏 Pizzicato</span>
            <span className="text-[10px] opacity-90">(pulsado)</span>
          </button>
        </div>

        <button
          id="toggle-tapes-btn"
          onClick={() => setShowFingerTapes(!showFingerTapes)}
          className={`px-2.5 py-1.5 rounded-xl transition-all border-2 text-[11px] font-black ${
            showFingerTapes
              ? 'bg-white text-black border-black shadow-[2px_2px_0px_#FF5F00]'
              : 'bg-black text-zinc-400 border-zinc-700 hover:border-white'
          }`}
        >
          {showFingerTapes ? '✓ Cintas Guía ON' : 'Cintas Guía OFF'}
        </button>
      </div>

      {/* Violin Body Silhouette & Ebony Fingerboard in Black, White and Pantone 165 C */}
      <div
        className="relative w-full max-w-md p-4 rounded-3xl border-3 shadow-[6px_6px_0px_#000000] transition-colors duration-500 bg-black"
        style={{
          borderColor: activeSkinAccent || '#FF5F00',
        }}
      >
        {/* Subtle decorative manga screentone vibe */}
        <div className="absolute left-2.5 bottom-8 text-3xl opacity-20 select-none font-serif text-white pointer-events-none">
          𝄢
        </div>
        <div className="absolute right-2.5 bottom-8 text-3xl opacity-20 select-none font-serif text-white pointer-events-none transform scale-x-[-1]">
          𝄢
        </div>

        {/* Pegbox / Nut (Cejuela superior) with String Tuning Pegs */}
        <div className="w-full flex items-center justify-between px-3 py-2 bg-zinc-950 rounded-t-2xl border-b-2 border-white/40">
          <div className="text-[11px] font-black tracking-wider text-white uppercase flex items-center gap-1.5">
            <span className="text-[#FF5F00]">⚡</span>
            <span>Cuerdas al Aire</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#FF5F00] text-black font-extrabold">Dedo 0</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-bold">Toca para sonar</span>
        </div>

        {/* Nut Buttons (Open Strings: 0 finger) */}
        <div className="grid grid-cols-4 gap-2 px-2 py-2 bg-black border-b-2 border-[#FF5F00]">
          {VIOLIN_STRINGS.map((str) => {
            const openNote = FIRST_POSITION_NOTES[str.name][0];
            const isHigh = isStringHighlighted(str.name);
            const isTarget = targetNote?.string === str.name && targetNote.finger === 0;

            return (
              <button
                key={str.name}
                id={`open-string-${str.name.toLowerCase()}-btn`}
                onClick={() => handlePlayNote(openNote)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all transform active:scale-95 border-2 ${
                  isTarget
                    ? 'bg-[#FF5F00] text-black border-white ring-4 ring-[#FF5F00]/50 animate-pulse font-black shadow-[3px_3px_0px_#FFFFFF]'
                    : isHigh
                    ? 'bg-white text-black border-[#FF5F00] font-black shadow-[2px_2px_0px_#FF5F00]'
                    : 'bg-zinc-900 border-zinc-700 text-white hover:border-[#FF5F00] hover:bg-zinc-800'
                }`}
              >
                <span className="text-[11px] text-zinc-400 font-bold">{str.name} ({str.spanish})</span>
                <span className={`text-base font-black ${isTarget ? 'text-black' : isHigh ? 'text-[#FF5F00]' : 'text-white'}`}>
                  {openNote.name}
                </span>
                <span className="text-[9px] text-zinc-400 uppercase font-mono">0 (Aire)</span>
              </button>
            );
          })}
        </div>

        {/* Ebony Fingerboard Surface (Diapasón de Ébano) */}
        <div className="relative w-full h-[290px] bg-gradient-to-b from-[#0A0A0A] via-[#121212] to-[#000000] rounded-b-xl overflow-hidden border-x-2 border-zinc-800 shadow-2xl">
          {/* Finger Tape Guide Overlays (Horizontal tape guide lines for beginner) */}
          {showFingerTapes && (
            <div className="absolute inset-0 pointer-events-none">
              {fingerLabels.map((tape) => (
                <div
                  key={tape.finger}
                  className="absolute w-full border-t-2 border-dashed border-[#FF5F00]/70 flex items-center justify-between px-2"
                  style={{ top: tape.distancePercent }}
                >
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-black text-[#FF5F00] border border-[#FF5F00] shadow-sm">
                    {tape.label}
                  </span>
                  <span className="text-[8px] font-bold text-white bg-black/80 px-1 rounded">
                    Cinta {tape.finger}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Strings & Note Positions Grid */}
          <div className="relative h-full grid grid-cols-4 px-2">
            {VIOLIN_STRINGS.map((str, colIdx) => {
              const notes = FIRST_POSITION_NOTES[str.name];
              const isVibrating = vibratingString === str.name;

              // String wire visual thickness: G is 4px, D is 3px, A is 2px, E is 1.4px
              const stringWidth = colIdx === 0 ? '4px' : colIdx === 1 ? '3px' : colIdx === 2 ? '2px' : '1.4px';
              const stringColor = colIdx === 0 ? '#FF5F00' : colIdx === 1 ? '#FFFFFF' : colIdx === 2 ? '#E4E4E7' : '#FFFFFF';

              return (
                <div key={str.name} className="relative h-full flex flex-col items-center justify-between py-2 group">
                  {/* Physical string line running down */}
                  <div
                    className={`absolute top-0 bottom-0 pointer-events-none transition-transform duration-75 ${
                      isVibrating ? 'scale-x-150 opacity-100' : 'opacity-80'
                    }`}
                    style={{
                      width: stringWidth,
                      backgroundColor: stringColor,
                      boxShadow: isVibrating ? '0 0 12px #FF5F00' : 'none',
                    }}
                  />

                  {/* Finger Note Buttons (1, 2, 3, 4) placed along the fingerboard string */}
                  {notes.slice(1).map((note) => {
                    const isFingHigh = isFingerHighlighted(str.name, note.finger);
                    const isTarget = targetNote?.string === str.name && targetNote.finger === note.finger;
                    const isCurrent = activeNote?.name === note.name && activeNote.octave === note.octave;

                    // Compute vertical position for standard violin tape spacing
                    const topPos =
                      note.finger === 1 ? '16%' : note.finger === 2 ? '34%' : note.finger === 3 ? '50%' : '68%';

                    return (
                      <button
                        key={`${note.name}-${note.octave}`}
                        id={`note-btn-${note.string}-${note.finger}`}
                        onClick={() => handlePlayNote(note)}
                        style={{ top: topPos }}
                        className={`absolute z-10 w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-all transform active:scale-90 border-2 font-black ${
                          isTarget
                            ? 'bg-[#FF5F00] text-black border-white ring-4 ring-[#FF5F00] animate-bounce scale-110 shadow-[3px_3px_0px_#FFFFFF]'
                            : isCurrent
                            ? 'bg-white text-black border-[#FF5F00] scale-105 shadow-[2px_2px_0px_#FF5F00]'
                            : isFingHigh
                            ? 'bg-[#FF5F00] text-black border-black shadow-[2px_2px_0px_#FFFFFF]'
                            : 'bg-black text-white border-zinc-700 hover:border-[#FF5F00] hover:bg-zinc-900'
                        }`}
                      >
                        <span className="text-xs font-black leading-none">{note.name}</span>
                        <span className="text-[9px] font-bold opacity-80 leading-none mt-0.5">D{note.finger}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Wooden Bridge at bottom (Puente del violín) */}
        <div className="w-full flex items-center justify-center mt-2 py-1.5 bg-zinc-900 rounded-xl border-2 border-white/30 text-[11px] text-white font-black shadow-sm gap-2">
          <span className="text-[#FF5F00]">🎻</span>
          <span>Puente del Violín (Punto de contacto del arco)</span>
        </div>
      </div>
    </div>
  );
};
