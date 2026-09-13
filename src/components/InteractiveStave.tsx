import React from 'react';
import { ViolinNote } from '../types/violin';

interface InteractiveStaveProps {
  currentNote?: ViolinNote | null;
  targetNote?: ViolinNote | null;
  showNoteName?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

export const InteractiveStave: React.FC<InteractiveStaveProps> = ({
  currentNote,
  targetNote,
  showNoteName = true,
  className = '',
  width = 340,
  height = 140,
}) => {
  const getYForStavePosition = (stavePos: number): number => {
    return 85 - stavePos * 5;
  };

  const activeNote = currentNote || targetNote;
  const noteY = activeNote ? getYForStavePosition(activeNote.stavePosition) : null;
  const isTargetOnly = !currentNote && !!targetNote;
  const noteColor = isTargetOnly ? '#FF5F00' : (activeNote ? '#FF5F00' : '#FFFFFF');

  return (
    <div id="interactive-stave-container" className={`flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto max-h-[160px] drop-shadow-sm"
      >
        {/* Background Paper Glow: Pure Black with White & Pantone 165 C border */}
        <rect
          x="10"
          y="15"
          width={width - 20}
          height={height - 30}
          rx="12"
          fill="#000000"
          stroke="#FFFFFF"
          strokeWidth="2"
        />

        {/* 5 Stave Lines in crisp white */}
        {[40, 50, 60, 70, 80].map((y, idx) => (
          <line
            key={idx}
            x1="35"
            y1={y}
            x2={width - 35}
            y2={y}
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        ))}

        {/* Treble Clef (𝄞) */}
        <text
          x="42"
          y="78"
          fill="#FF5F00"
          fontSize="48"
          fontFamily="serif"
          className="font-black select-none pointer-events-none"
        >
          𝄞
        </text>

        {/* 4/4 Time Signature */}
        <g fill="#FFFFFF" fontSize="16" fontWeight="bold" fontFamily="'Outfit', sans-serif">
          <text x="88" y="58" textAnchor="middle">4</text>
          <text x="88" y="78" textAnchor="middle">4</text>
        </g>

        {/* Render Note */}
        {activeNote && noteY !== null && (
          <g>
            {/* Ledger lines below stave if needed */}
            {activeNote.stavePosition <= -1 && (
              <line
                x1={width / 2 - 20}
                y1="90"
                x2={width / 2 + 20}
                y2="90"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            )}
            {activeNote.stavePosition <= -3 && (
              <line
                x1={width / 2 - 20}
                y1="100"
                x2={width / 2 + 20}
                y2="100"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            )}
            {/* Ledger line above stave if needed */}
            {activeNote.stavePosition >= 11 && (
              <line
                x1={width / 2 - 20}
                y1="30"
                x2={width / 2 + 20}
                y2="30"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            )}

            {/* Note head (oval tilted in Pantone 165 C) */}
            <ellipse
              cx={width / 2}
              cy={noteY}
              rx="9"
              ry="6.8"
              transform={`rotate(-22 ${width / 2} ${noteY})`}
              fill={isTargetOnly ? 'transparent' : '#FF5F00'}
              stroke="#FFFFFF"
              strokeWidth={isTargetOnly ? 2.5 : 1.5}
              strokeDasharray={isTargetOnly ? '3,3' : 'none'}
              className="transition-all duration-200"
            />

            {/* Accidental (#) if present */}
            {activeNote.name.includes('#') && (
              <text
                x={width / 2 - 22}
                y={noteY + 6}
                fill="#FF5F00"
                fontSize="20"
                fontWeight="900"
                textAnchor="middle"
              >
                ♯
              </text>
            )}

            {/* Note Stem */}
            {noteY >= 60 ? (
              // Stem goes UP
              <line
                x1={width / 2 + 7.5}
                y1={noteY - 2}
                x2={width / 2 + 7.5}
                y2={noteY - 32}
                stroke="#FF5F00"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ) : (
              // Stem goes DOWN
              <line
                x1={width / 2 - 7.5}
                y1={noteY + 2}
                x2={width / 2 - 7.5}
                y2={noteY + 32}
                stroke="#FF5F00"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}
          </g>
        )}
      </svg>

      {/* Note info tag below stave in Manga Badge style */}
      {showNoteName && (
        <div className="mt-1 flex items-center gap-2 min-h-[28px]">
          {activeNote ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-black border-2 border-white text-xs text-white shadow-[2px_2px_0px_#FF5F00]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F00] inline-block shadow-sm" />
              <span className="font-black text-sm text-white">{activeNote.name}</span>
              <span className="text-zinc-400 font-bold">({activeNote.englishName})</span>
              <span className="text-white border-l border-white/40 pl-2">
                Cuerda <strong className="text-[#FF5F00]">{activeNote.string}</strong>
              </span>
              <span className="text-white border-l border-white/40 pl-2">
                Dedo <strong className="text-[#FF5F00]">{activeNote.finger === 0 ? 'Al aire (0)' : activeNote.finger}</strong>
              </span>
            </div>
          ) : (
            <span className="text-xs text-zinc-400 font-medium">Toca una cuerda o nota en el mástil</span>
          )}
        </div>
      )}
    </div>
  );
};
