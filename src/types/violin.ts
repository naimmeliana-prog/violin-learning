export type StringName = 'G' | 'D' | 'A' | 'E';

export interface ViolinNote {
  name: string; // e.g., 'Sol', 'La', 'Si', 'Do#', 'Re', 'Mi'
  englishName: string; // 'G', 'A', 'B', 'C#', 'D', 'E'
  octave: number;
  freq: number;
  string: StringName;
  finger: number; // 0 = open string, 1 = index, 2 = middle, 3 = ring, 4 = pinky
  stavePosition: number; // Vertical step on treble clef (0 = middle C, 4 = G3 below stave, etc.)
  color: string;
}

export interface LessonStep {
  id: string;
  title: string;
  explanation: string;
  tip?: string;
  diagramType: 'fingerboard' | 'bow' | 'stave' | 'posture' | 'rhythm';
  highlightStrings?: StringName[];
  highlightFingers?: { string: StringName; finger: number }[];
  targetNote?: ViolinNote;
  practiceTask: {
    instruction: string;
    targetNotes?: string[];
    requiredTaps?: number;
    bowDirection?: 'down' | 'up';
  };
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  japaneseTag?: string;
  estimatedMinutes: number;
  iconName: string;
  difficulty: 'fácil' | 'medio' | 'avanzado';
  description: string;
  gemReward: number;
  starReward: number;
  steps: LessonStep[];
  completed?: boolean;
}

export interface ViolinSkin {
  id: string;
  name: string;
  colorName: string;
  description: string;
  bodyColor: string;
  accentColor: string;
  edgeColor: string;
  gemCost: number;
  unlocked: boolean;
  tag: string;
}

export interface BowStyle {
  id: string;
  name: string;
  stickColor: string;
  hairColor: string;
  gemCost: number;
  unlocked: boolean;
}

export interface CaseSticker {
  id: string;
  name: string;
  emoji: string;
  gemCost: number;
  unlocked: boolean;
  x: number;
  y: number;
  rotation: number;
}

export interface UserProgress {
  gems: number;
  stars: number;
  streakDays: number;
  lastPracticeDate: string;
  completedLessons: string[];
  unlockedSkins: string[];
  activeSkinId: string;
  unlockedBows: string[];
  activeBowId: string;
  unlockedStickers: string[];
  placedStickers: { id: string; stickerId: string; x: number; y: number; rotation: number }[];
  gamesPlayed: number;
  totalNotesPlayed: number;
}
