import { ViolinNote, StringName } from '../types/violin';

export const VIOLIN_STRINGS: { name: StringName; spanish: string; note: string; octave: number; freq: number; color: string; gauge: string }[] = [
  { name: 'G', spanish: 'Sol', note: 'Sol 3', octave: 3, freq: 196.00, color: '#f59e0b', gauge: 'Gruesa' },
  { name: 'D', spanish: 'Re', note: 'Re 4', octave: 4, freq: 293.66, color: '#10b981', gauge: 'Media' },
  { name: 'A', spanish: 'La', note: 'La 4', octave: 4, freq: 440.00, color: '#3b82f6', gauge: 'Fina' },
  { name: 'E', spanish: 'Mi', note: 'Mi 5', octave: 5, freq: 659.25, color: '#ec4899', gauge: 'Muy fina' },
];

export const FIRST_POSITION_NOTES: Record<StringName, ViolinNote[]> = {
  G: [
    { name: 'Sol', englishName: 'G', octave: 3, freq: 196.00, string: 'G', finger: 0, stavePosition: -4, color: '#f59e0b' },
    { name: 'La', englishName: 'A', octave: 3, freq: 220.00, string: 'G', finger: 1, stavePosition: -3, color: '#3b82f6' },
    { name: 'Si', englishName: 'B', octave: 3, freq: 246.94, string: 'G', finger: 2, stavePosition: -2, color: '#8b5cf6' },
    { name: 'Do', englishName: 'C', octave: 4, freq: 261.63, string: 'G', finger: 3, stavePosition: -1, color: '#ec4899' },
    { name: 'Re', englishName: 'D', octave: 4, freq: 293.66, string: 'G', finger: 4, stavePosition: 0, color: '#10b981' },
  ],
  D: [
    { name: 'Re', englishName: 'D', octave: 4, freq: 293.66, string: 'D', finger: 0, stavePosition: 0, color: '#10b981' },
    { name: 'Mi', englishName: 'E', octave: 4, freq: 329.63, string: 'D', finger: 1, stavePosition: 1, color: '#06b6d4' },
    { name: 'Fa#', englishName: 'F#', octave: 4, freq: 369.99, string: 'D', finger: 2, stavePosition: 2, color: '#eab308' },
    { name: 'Sol', englishName: 'G', octave: 4, freq: 392.00, string: 'D', finger: 3, stavePosition: 3, color: '#f59e0b' },
    { name: 'La', englishName: 'A', octave: 4, freq: 440.00, string: 'D', finger: 4, stavePosition: 4, color: '#3b82f6' },
  ],
  A: [
    { name: 'La', englishName: 'A', octave: 4, freq: 440.00, string: 'A', finger: 0, stavePosition: 4, color: '#3b82f6' },
    { name: 'Si', englishName: 'B', octave: 4, freq: 493.88, string: 'A', finger: 1, stavePosition: 5, color: '#8b5cf6' },
    { name: 'Do#', englishName: 'C#', octave: 5, freq: 554.37, string: 'A', finger: 2, stavePosition: 6, color: '#ec4899' },
    { name: 'Re', englishName: 'D', octave: 5, freq: 587.33, string: 'A', finger: 3, stavePosition: 7, color: '#10b981' },
    { name: 'Mi', englishName: 'E', octave: 5, freq: 659.25, string: 'A', finger: 4, stavePosition: 8, color: '#06b6d4' },
  ],
  E: [
    { name: 'Mi', englishName: 'E', octave: 5, freq: 659.25, string: 'E', finger: 0, stavePosition: 8, color: '#06b6d4' },
    { name: 'Fa#', englishName: 'F#', octave: 5, freq: 739.99, string: 'E', finger: 1, stavePosition: 9, color: '#eab308' },
    { name: 'Sol#', englishName: 'G#', octave: 5, freq: 830.61, string: 'E', finger: 2, stavePosition: 10, color: '#f59e0b' },
    { name: 'La', englishName: 'A', octave: 5, freq: 880.00, string: 'E', finger: 3, stavePosition: 11, color: '#3b82f6' },
    { name: 'Si', englishName: 'B', octave: 5, freq: 987.77, string: 'E', finger: 4, stavePosition: 12, color: '#8b5cf6' },
  ],
};

export const ALL_NOTES_LIST: ViolinNote[] = [
  ...FIRST_POSITION_NOTES.G,
  ...FIRST_POSITION_NOTES.D,
  ...FIRST_POSITION_NOTES.A,
  ...FIRST_POSITION_NOTES.E,
];
