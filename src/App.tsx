import React, { useState, useEffect, useRef } from 'react';
import { UserProgress, Lesson } from './types/violin';
import { VIOLIN_LESSONS } from './data/lessonsData';
import { VIOLIN_SKINS, BOW_STYLES } from './data/shopData';
import { soundEngine } from './services/soundEngine';
import { LessonModal } from './components/LessonModal';
import { BowingHeroGame } from './components/BowingHeroGame';
import { NoteHunterGame } from './components/NoteHunterGame';
import { EarTrainerGame } from './components/EarTrainerGame';
import { FreePracticeView } from './components/FreePracticeView';
import { RewardShop } from './components/RewardShop';
import { ViolinCaseCustomizer } from './components/ViolinCaseCustomizer';
import { ViolinTuner } from './components/ViolinTuner';
import { DidacticLibrary } from './components/DidacticLibrary';
import { PostureCheck } from './components/PostureCheck';
import {
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  BookOpen,
  Gamepad2,
  Music,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Play,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Radio,
  Library,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';

const STORAGE_KEY = 'violin_academy_progress_v1';
const ZOOM_STORAGE_KEY = 'violin_academy_zoom_v1';

const DEFAULT_PROGRESS: UserProgress = {
  gems: 120, // generous starting gems so she can explore and unlock things right away!
  stars: 6,
  streakDays: 3,
  lastPracticeDate: new Date().toISOString(),
  completedLessons: ['lesson-1'],
  unlockedSkins: ['skin-classic', 'skin-amethyst'],
  activeSkinId: 'skin-classic',
  unlockedBows: ['bow-standard'],
  activeBowId: 'bow-standard',
  unlockedStickers: ['stk-clef', 'stk-notes', 'stk-star', 'stk-cinnamon'],
  placedStickers: [
    { id: 'init-1', stickerId: 'stk-clef', x: 28, y: 35, rotation: -12 },
    { id: 'init-2', stickerId: 'stk-star', x: 65, y: 40, rotation: 15 },
  ],
  gamesPlayed: 4,
  totalNotesPlayed: 42,
};

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_PROGRESS;
  });

  // Global Zoom level (A+ / A- buttons requested by user)
  const [zoomLevel, setZoomLevel] = useState<number>(() => {
    try {
      const savedZoom = localStorage.getItem(ZOOM_STORAGE_KEY);
      if (savedZoom) {
        const val = parseFloat(savedZoom);
        if (!isNaN(val) && val >= 0.75 && val <= 1.4) return val;
      }
    } catch {
      // fallback
    }
    return 1.0;
  });

  // Navigation: 'lessons' | 'posture' | 'tuner' | 'library' | 'games' | 'practice' | 'shop' | 'case'
  const [activeTab, setActiveTab] = useState<'lessons' | 'posture' | 'tuner' | 'library' | 'games' | 'practice' | 'shop' | 'case'>('lessons');

  // Active Mini-Game: null | 'bowing' | 'hunter' | 'ear'
  const [activeGame, setActiveGame] = useState<'bowing' | 'hunter' | 'ear' | null>(null);

  // Active Lesson Modal
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Audio mute state
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Save progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Storage error fallback
    }
  }, [progress]);

  // Save zoom level
  useEffect(() => {
    try {
      localStorage.setItem(ZOOM_STORAGE_KEY, zoomLevel.toString());
    } catch {
      // Storage error fallback
    }
  }, [zoomLevel]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(1.4, +(prev + 0.1).toFixed(2)));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(0.8, +(prev - 0.1).toFixed(2)));
  };

  const handleZoomReset = () => {
    setZoomLevel(1.0);
  };

  const handleUpdateProgress = (updated: Partial<UserProgress>) => {
    setProgress((prev) => ({ ...prev, ...updated }));
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
  };

  const handleCompleteLesson = (lessonId: string, earnedGems: number, earnedStars: number) => {
    const newCompleted = progress.completedLessons.includes(lessonId)
      ? progress.completedLessons
      : [...progress.completedLessons, lessonId];

    handleUpdateProgress({
      gems: progress.gems + earnedGems,
      stars: progress.stars + earnedStars,
      completedLessons: newCompleted,
      streakDays: Math.max(progress.streakDays, 1),
    });
  };

  const handleGameReward = (earnedGems: number, earnedStars: number) => {
    handleUpdateProgress({
      gems: progress.gems + earnedGems,
      stars: progress.stars + earnedStars,
      gamesPlayed: (progress.gamesPlayed || 0) + 1,
    });
  };

  const activeSkin = VIOLIN_SKINS.find((s) => s.id === progress.activeSkinId) || VIOLIN_SKINS[0];

  return (
    <div
      id="violin-app-root"
      style={{
        // Zoom property proportionally scales the entire UI: text, windows, staves, buttons, modals
        zoom: zoomLevel,
      }}
      className="min-h-screen bg-[#F8F8F8] text-[#18181B] flex flex-col antialiased selection:bg-[#FF5F00] selection:text-white font-sans"
    >
      {/* Top Navigation Header in Blanco, Negro & Naranja Pantone 165 C */}
      <header
        id="app-header"
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-black px-4 py-3 shadow-[0_2px_0px_#000000]"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Manga Title - Clickable to return to Lecciones */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('lessons');
              setActiveGame(null);
            }}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-hidden"
            title="Ir a Tu Camino de Virtuosa (Lecciones) - ¡Haz clic aquí en cualquier momento para volver!"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#FF5F00] border-2 border-black flex items-center justify-center text-xl shadow-[3px_3px_0px_#000000] shrink-0 group-hover:scale-105 transition-transform">
              🎻
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-black tracking-tight leading-none group-hover:text-[#FF5F00] transition-colors">
                  Aprende Violín
                </h1>
                <span className="font-manga text-[11px] text-[#FF5F00] hidden xs:inline">
                  「バイオリン・アカデミー」
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-lg bg-[#FF5F00] text-black font-black border border-black shadow-xs">
                  Tu Camino de Virtuosa
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 mt-0.5 font-medium flex items-center gap-1.5">
                <span>Lecciones breves, sonido real y mini-juegos</span>
                <span className="text-[#FF5F00] font-black hidden md:inline">• [Clic = Ir a Lecciones]</span>
              </p>
            </div>
          </button>

          {/* Right Controls: A+ / A- Zoom, Stats, and Audio */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Zoom Controls: A- / Indicator / A+ */}
            <div
              id="zoom-controls-container"
              className="flex items-center bg-white border-2 border-black rounded-2xl p-1 shadow-[2px_2px_0px_#000000]"
              title="Ajuste de zoom general para toda la aplicación"
            >
              <button
                id="zoom-out-btn"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.8}
                className="px-2 py-1 rounded-xl text-xs font-black text-black hover:bg-[#FF5F00] transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                title="Disminuir zoom (A-)"
              >
                A-
              </button>

              <button
                id="zoom-reset-btn"
                onClick={handleZoomReset}
                className="px-1.5 py-0.5 text-[10px] font-mono font-black text-[#FF5F00] hover:underline"
                title="Restablecer zoom al 100%"
              >
                {Math.round(zoomLevel * 100)}%
              </button>

              <button
                id="zoom-in-btn"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 1.4}
                className="px-2 py-1 rounded-xl text-xs font-black text-black hover:bg-[#FF5F00] transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                title="Aumentar zoom (A+)"
              >
                A+
              </button>
            </div>

            {/* Posture Quick Button */}
            <button
              id="header-posture-btn"
              onClick={() => {
                setActiveTab('posture');
                setActiveGame(null);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FF5F00] text-black border-2 border-black text-xs font-black shadow-[2px_2px_0px_#000000] hover:scale-105 transition-all"
              title="Revisar postura y agarre del arco"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Postura</span>
              <span className="font-manga text-[10px]">「姿勢」</span>
            </button>

            {/* Streak */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-white border-2 border-black text-black text-xs font-black shadow-[2px_2px_0px_#000000]"
              title="Días de práctica activa"
            >
              <Flame className="w-4 h-4 text-[#FF5F00] animate-pulse" />
              <span>{progress.streakDays} d</span>
            </div>

            {/* Gems */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-black text-[#FF5F00] text-xs font-black shadow-[2px_2px_0px_#000000] cursor-pointer hover:bg-[#FF5F00] hover:text-black transition-colors"
              onClick={() => setActiveTab('shop')}
              title="Gemas ganadas - Canjéalas en el Taller"
            >
              <span>💎 {progress.gems}</span>
            </div>

            {/* Stars */}
            <div
              className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-black text-black text-xs font-black shadow-[2px_2px_0px_#000000]"
              title="Estrellas de maestría"
            >
              <span>⭐ {progress.stars}</span>
            </div>

            {/* Audio Mute Toggle */}
            <button
              id="audio-mute-toggle"
              onClick={toggleMute}
              className="p-2 rounded-2xl bg-white text-black hover:text-[#FF5F00] border-2 border-black hover:border-[#FF5F00] transition-colors shadow-[2px_2px_0px_#000000]"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-[#FF5F00]" />}
            </button>
          </div>
        </div>
      </header>

      {/* Primary Category Tabs in Manga Style */}
      <nav
        id="main-tabs-navigation"
        className="w-full bg-white border-b-2 border-black px-2 sm:px-4 py-2.5 shadow-xs"
      >
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {/* TAB 1: LECCIONES (Tu Camino de Virtuosa) */}
          <button
            id="nav-tab-lessons"
            onClick={() => {
              setActiveTab('lessons');
              setActiveGame(null);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 border-2 shrink-0 cursor-pointer ${
              activeTab === 'lessons'
                ? 'bg-[#FF5F00] text-black border-black shadow-[3px_3px_0px_#000000] -translate-y-0.5'
                : 'bg-white text-zinc-800 border-black hover:bg-[#FFF2EB] hover:text-black hover:border-black shadow-[1px_1px_0px_#000000]'
            }`}
            title="Tu Camino de Virtuosa (Lecciones organizadas paso a paso)"
          >
            <BookOpen className="w-4 h-4 text-black shrink-0" />
            <span>Lecciones</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-black text-white font-bold tracking-wider">
              Camino
            </span>
          </button>

          {/* TAB 2: POSTURA */}
          <button
            id="nav-tab-posture"
            onClick={() => {
              setActiveTab('posture');
              setActiveGame(null);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 border-2 shrink-0 cursor-pointer ${
              activeTab === 'posture'
                ? 'bg-[#FF5F00] text-black border-black shadow-[3px_3px_0px_#000000] -translate-y-0.5'
                : 'bg-white text-zinc-800 border-black hover:bg-[#FFF2EB] hover:text-black hover:border-black shadow-[1px_1px_0px_#000000]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Postura</span>
          </button>

          {/* TAB 3: AFINADOR */}
          <button
            id="nav-tab-tuner"
            onClick={() => {
              setActiveTab('tuner');
              setActiveGame(null);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 border-2 shrink-0 cursor-pointer ${
              activeTab === 'tuner'
                ? 'bg-[#FF5F00] text-black border-black shadow-[3px_3px_0px_#000000] -translate-y-0.5'
                : 'bg-white text-zinc-800 border-black hover:bg-[#FFF2EB] hover:text-black hover:border-black shadow-[1px_1px_0px_#000000]'
            }`}
          >
            <Radio className="w-4 h-4 shrink-0" />
            <span>Afinador</span>
          </button>

          {/* TAB 4: MATERIAL & GUÍAS */}
          <button
            id="nav-tab-library"
            onClick={() => {
              setActiveTab('library');
              setActiveGame(null);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 border-2 shrink-0 cursor-pointer ${
              activeTab === 'library'
                ? 'bg-[#FF5F00] text-black border-black shadow-[3px_3px_0px_#000000] -translate-y-0.5'
                : 'bg-white text-zinc-800 border-black hover:bg-[#FFF2EB] hover:text-black hover:border-black shadow-[1px_1px_0px_#000000]'
            }`}
          >
            <Library className="w-4 h-4 shrink-0" />
            <span>Material & Guías</span>
          </button>

          {/* TAB 5: MINI-JUEGOS */}
          <button
            id="nav-tab-games"
            onClick={() => {
              setActiveTab('games');
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 border-2 shrink-0 cursor-pointer ${
              activeTab === 'games'
                ? 'bg-[#FF5F00] text-black border-black shadow-[3px_3px_0px_#000000] -translate-y-0.5'
                : 'bg-white text-zinc-800 border-black hover:bg-[#FFF2EB] hover:text-black hover:border-black shadow-[1px_1px_0px_#000000]'
            }`}
          >
            <Gamepad2 className="w-4 h-4 shrink-0" />
            <span>Mini-Juegos</span>
          </button>

          {/* TAB 6: PRÁCTICA LIBRE */}
          <button
            id="nav-tab-practice"
            onClick={() => {
              setActiveTab('practice');
              setActiveGame(null);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 border-2 shrink-0 cursor-pointer ${
              activeTab === 'practice'
                ? 'bg-[#FF5F00] text-black border-black shadow-[3px_3px_0px_#000000] -translate-y-0.5'
                : 'bg-white text-zinc-800 border-black hover:bg-[#FFF2EB] hover:text-black hover:border-black shadow-[1px_1px_0px_#000000]'
            }`}
          >
            <Music className="w-4 h-4 shrink-0" />
            <span>Práctica Libre</span>
          </button>

          {/* TAB 7: TALLER */}
          <button
            id="nav-tab-shop"
            onClick={() => {
              setActiveTab('shop');
              setActiveGame(null);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 border-2 shrink-0 cursor-pointer ${
              activeTab === 'shop'
                ? 'bg-[#FF5F00] text-black border-black shadow-[3px_3px_0px_#000000] -translate-y-0.5'
                : 'bg-white text-zinc-800 border-black hover:bg-[#FFF2EB] hover:text-black hover:border-black shadow-[1px_1px_0px_#000000]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Taller</span>
          </button>

          {/* TAB 8: MI ESTUCHE */}
          <button
            id="nav-tab-case"
            onClick={() => {
              setActiveTab('case');
              setActiveGame(null);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 border-2 shrink-0 cursor-pointer ${
              activeTab === 'case'
                ? 'bg-[#FF5F00] text-black border-black shadow-[3px_3px_0px_#000000] -translate-y-0.5'
                : 'bg-white text-zinc-800 border-black hover:bg-[#FFF2EB] hover:text-black hover:border-black shadow-[1px_1px_0px_#000000]'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Mi Estuche</span>
          </button>
        </div>
      </nav>

      {/* Main Body Content */}
      <main id="main-content-zone" className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col">
        {/* Quick Return to Lecciones bar when exploring any secondary view */}
        {activeTab !== 'lessons' && (
          <div
            id="quick-back-to-lessons-bar"
            className="mb-4 flex items-center justify-between gap-3 p-3 px-4 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0px_#000000] animate-fadeIn"
          >
            <button
              type="button"
              onClick={() => {
                setActiveTab('lessons');
                setActiveGame(null);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FF5F00] text-black font-black text-xs sm:text-sm border-2 border-black hover:bg-white transition-all shadow-[2px_2px_0px_#000000] cursor-pointer active:translate-y-0.5"
              title="Volver a la vista principal de lecciones"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Volver a Tu Camino de Virtuosa (Lecciones)</span>
            </button>
            <span className="text-xs font-bold text-zinc-600 hidden sm:inline">
              Sección actual: <strong className="text-black">{activeTab === 'posture' ? 'Postura' : activeTab === 'tuner' ? 'Afinador' : activeTab === 'library' ? 'Material & Guías' : activeTab === 'games' ? 'Mini-Juegos' : activeTab === 'practice' ? 'Práctica Libre' : activeTab === 'shop' ? 'Taller' : 'Mi Estuche'}</strong>
            </span>
          </div>
        )}
        {/* TAB 1: Structured Bite-Sized Lessons */}
        {activeTab === 'lessons' && (
          <div className="flex flex-col gap-6">
            {/* Encouraging Hero Banner in Blanco, Negro & Naranja Pantone 165 C */}
            <div className="p-5 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#FF5F00] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-black text-[#FF5F00] uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Tu Camino de Virtuosa</span>
                  <span className="font-manga text-[11px] text-black">「バイオリンへの道」</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-black">
                  Lecciones Breves y Claras
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-lg font-medium leading-relaxed">
                  Cada sesión dura de 5 a 8 minutos, con explicaciones directas, sonido real interactivo y ejercicios prácticos en el mástil. ¡Directo al grano!
                </p>
              </div>

              {/* Progress pill */}
              <div className="px-4 py-3 rounded-2xl bg-white border-2 border-black text-center shrink-0 shadow-[3px_3px_0px_#000000]">
                <div className="text-xs text-zinc-600 font-bold">Progreso total</div>
                <div className="text-lg font-black text-[#FF5F00] mt-0.5">
                  {progress.completedLessons.length} / {VIOLIN_LESSONS.length} Lecciones
                </div>
              </div>
            </div>

            {/* Pre-Practice Posture & Bow-Hold Checklist Banner */}
            <div className="p-4 rounded-3xl bg-white border-2 border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[4px_4px_0px_#000000]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF5F00] text-black border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000000]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-black">¿Lista antes de empezar? Revisión de Postura, Arco y Vicios</span>
                    <span className="font-manga text-[10px] text-[#FF5F00]">「姿勢チェック」</span>
                  </div>
                  <p className="text-xs text-zinc-600 font-medium mt-0.5">
                    Guía anime paso a paso (es_ES): agarre de conejito, pantalla completa y sección de vicios comunes (+30 💎).
                  </p>
                </div>
              </div>

              <button
                id="banner-open-posture-btn"
                onClick={() => {
                  setActiveTab('posture');
                  setActiveGame(null);
                }}
                className="px-4 py-2 rounded-2xl bg-[#FF5F00] hover:bg-white text-black font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000000] transition-all shrink-0 self-end sm:self-center flex items-center gap-1.5 active:scale-98"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Revisar Postura</span>
              </button>
            </div>

            {/* Lesson Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {VIOLIN_LESSONS.map((lesson) => {
                const isCompleted = progress.completedLessons.includes(lesson.id);

                return (
                  <div
                    key={lesson.id}
                    id={`lesson-card-${lesson.id}`}
                    className={`relative p-5 rounded-3xl border-2 transition-all flex flex-col justify-between group ${
                      isCompleted
                        ? 'bg-white border-black shadow-[4px_4px_0px_#FF5F00]'
                        : 'bg-white border-black shadow-[4px_4px_0px_#000000] hover:border-[#FF5F00] hover:shadow-[5px_5px_0px_#FF5F00]'
                    }`}
                  >
                    <div>
                      {/* Top Header info */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-7 h-7 rounded-xl bg-[#FF5F00] border-2 border-black text-xs font-black text-black flex items-center justify-center shadow-xs">
                          {lesson.number}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-[11px] text-zinc-600 font-bold">
                            <Clock className="w-3 h-3 text-[#FF5F00]" /> ~{lesson.estimatedMinutes} min
                          </span>
                          {isCompleted && (
                            <span className="flex items-center gap-1 text-[11px] font-black text-black bg-[#FF5F00] px-2 py-0.5 rounded-lg border border-black shadow-xs">
                              <CheckCircle2 className="w-3 h-3" /> Hecha
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-black group-hover:text-[#FF5F00] transition-colors">
                          {lesson.title}
                        </h3>
                      </div>

                      {lesson.japaneseTag && (
                        <div className="font-manga text-[11px] text-[#FF5F00] font-bold mt-0.5">
                          {lesson.japaneseTag}
                        </div>
                      )}

                      <p className="text-xs text-zinc-800 font-bold mt-1">
                        {lesson.subtitle}
                      </p>

                      <p className="text-xs text-zinc-600 mt-2 leading-relaxed font-medium">
                        {lesson.description}
                      </p>
                    </div>

                    {/* Footer Rewards & Play Action */}
                    <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-black">
                        <span className="text-black">⭐ +{lesson.starReward}</span>
                        <span className="text-[#FF5F00]">💎 +{lesson.gemReward}</span>
                      </div>

                      <button
                        id={`start-lesson-btn-${lesson.id}`}
                        onClick={() => setActiveLesson(lesson)}
                        className={`px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all border-2 ${
                          isCompleted
                            ? 'bg-white text-black hover:bg-zinc-100 border-black shadow-[2px_2px_0px_#000000]'
                            : 'bg-[#FF5F00] text-black hover:bg-white border-black shadow-[3px_3px_0px_#000000] active:scale-95'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>{isCompleted ? 'Repasar' : 'Comenzar'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Mini-Games Hub */}
        {activeTab === 'games' && (
          <div className="flex flex-col gap-6">
            {!activeGame ? (
              <>
                <div className="p-5 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#FF5F00]">
                  <div className="flex items-center gap-2 text-xs font-black text-[#FF5F00] uppercase tracking-wider mb-1">
                    <Gamepad2 className="w-4 h-4" />
                    <span>Práctica Gamificada</span>
                    <span className="font-manga text-[11px] text-black">「ミニゲーム」</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-black">
                    Mini-Juegos de Violín
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-lg font-medium">
                    Rondas rápidas de 1 a 2 minutos para afinar tu oído, dominar la dirección del arco y leer notas con agilidad.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Game 1: Bowing Hero */}
                  <div className="p-5 rounded-3xl bg-white border-2 border-black hover:border-[#FF5F00] shadow-[4px_4px_0px_#000000] hover:shadow-[5px_5px_0px_#FF5F00] transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-[#FF5F00] border-2 border-black text-black flex items-center justify-center text-2xl font-black mb-3 shadow-[2px_2px_0px_#000000]">
                        ⊓ ∨
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg bg-orange-100 text-[#FF5F00] border border-[#FF5F00]">
                        Ritmo & Movimiento
                      </span>
                      <h3 className="text-lg font-black text-black mt-2">Ritmo con Arco</h3>
                      <div className="font-manga text-[11px] text-[#FF5F00]">「ボーイング・ゾーン」</div>
                      <p className="text-xs text-zinc-600 mt-1 leading-relaxed font-medium">
                        Entrena el cambio de arco abajo (⊓) y arriba (∨) al ritmo de la música en una pista dinámica.
                      </p>
                    </div>

                    <button
                      id="launch-game-bowing-btn"
                      onClick={() => setActiveGame('bowing')}
                      className="mt-5 w-full py-2.5 rounded-2xl bg-[#FF5F00] hover:bg-white text-black font-black text-xs border-2 border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center gap-2 transition-all active:scale-98"
                    >
                      <Play className="w-4 h-4" />
                      <span>Jugar Ritmo con Arco</span>
                    </button>
                  </div>

                  {/* Game 2: Note Hunter */}
                  <div className="p-5 rounded-3xl bg-white border-2 border-black hover:border-[#FF5F00] shadow-[4px_4px_0px_#000000] hover:shadow-[5px_5px_0px_#FF5F00] transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-white border-2 border-black text-black flex items-center justify-center text-2xl font-black mb-3 shadow-[2px_2px_0px_#FF5F00]">
                        𝄞 ♫
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg bg-zinc-100 text-black border border-black">
                        Lectura de Pentagrama
                      </span>
                      <h3 className="text-lg font-black text-black mt-2">Cazador de Notas</h3>
                      <div className="font-manga text-[11px] text-[#FF5F00]">「音符ハント」</div>
                      <p className="text-xs text-zinc-600 mt-1 leading-relaxed font-medium">
                        Descubre qué nota aparece en la clave de sol y ubícala en la cuerda y dedo correspondiente.
                      </p>
                    </div>

                    <button
                      id="launch-game-hunter-btn"
                      onClick={() => setActiveGame('hunter')}
                      className="mt-5 w-full py-2.5 rounded-2xl bg-[#FF5F00] hover:bg-white text-black font-black text-xs border-2 border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center gap-2 transition-all active:scale-98"
                    >
                      <Play className="w-4 h-4" />
                      <span>Jugar Cazador de Notas</span>
                    </button>
                  </div>

                  {/* Game 3: Pitch Ear Trainer */}
                  <div className="p-5 rounded-3xl bg-white border-2 border-black hover:border-[#FF5F00] shadow-[4px_4px_0px_#000000] hover:shadow-[5px_5px_0px_#FF5F00] transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-[#FF5F00] border-2 border-black text-black flex items-center justify-center text-2xl font-black mb-3 shadow-[2px_2px_0px_#000000]">
                        🎧
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg bg-orange-100 text-[#FF5F00] border border-[#FF5F00]">
                        Entrenamiento Auditivo
                      </span>
                      <h3 className="text-lg font-black text-black mt-2">Oído Maestro</h3>
                      <div className="font-manga text-[11px] text-[#FF5F00]">「聴音トレーニング」</div>
                      <p className="text-xs text-zinc-600 mt-1 leading-relaxed font-medium">
                        Escucha notas de violín reales y detecta si están afinadas, demasiado graves (♭) o demasiado agudas (♯).
                      </p>
                    </div>

                    <button
                      id="launch-game-ear-btn"
                      onClick={() => setActiveGame('ear')}
                      className="mt-5 w-full py-2.5 rounded-2xl bg-[#FF5F00] hover:bg-white text-black font-black text-xs border-2 border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center gap-2 transition-all active:scale-98"
                    >
                      <Play className="w-4 h-4" />
                      <span>Jugar Oído Maestro</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Embedded Active Game View */
              <div>
                {activeGame === 'bowing' && (
                  <BowingHeroGame
                    onGameComplete={handleGameReward}
                    onExit={() => setActiveGame(null)}
                  />
                )}
                {activeGame === 'hunter' && (
                  <NoteHunterGame
                    onGameComplete={handleGameReward}
                    onExit={() => setActiveGame(null)}
                  />
                )}
                {activeGame === 'ear' && (
                  <EarTrainerGame
                    onGameComplete={handleGameReward}
                    onExit={() => setActiveGame(null)}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB: Posture Check */}
        {activeTab === 'posture' && (
          <PostureCheck
            onAwardGems={(gems, stars) => handleGameReward(gems, stars)}
            onStartPlaying={() => setActiveTab('lessons')}
          />
        )}

        {/* TAB: Tuner */}
        {activeTab === 'tuner' && <ViolinTuner />}

        {/* TAB: Didactic Library */}
        {activeTab === 'library' && <DidacticLibrary />}

        {/* TAB 3: Free Practice Lab */}
        {activeTab === 'practice' && (
          <FreePracticeView
            activeSkinColor={activeSkin.bodyColor}
            activeSkinAccent={activeSkin.accentColor}
            onAwardGems={(gems, stars) => handleGameReward(gems, stars)}
          />
        )}

        {/* TAB 4: Rewards & Customization Shop */}
        {activeTab === 'shop' && (
          <RewardShop
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onClose={() => setActiveTab('lessons')}
            onNavigateToCase={() => setActiveTab('case')}
          />
        )}

        {/* TAB 5: Decorated Case */}
        {activeTab === 'case' && (
          <ViolinCaseCustomizer
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onClose={() => setActiveTab('lessons')}
            onNavigateToShop={() => setActiveTab('shop')}
          />
        )}
      </main>

      {/* Interactive Step-by-Step Lesson Modal */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          activeSkinColor={activeSkin.bodyColor}
          activeSkinAccent={activeSkin.accentColor}
          onClose={() => setActiveLesson(null)}
          onComplete={handleCompleteLesson}
        />
      )}
    </div>
  );
}
