import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Volume2,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Heart,
  Award,
  Play,
  X,
  Maximize2,
  ZoomIn,
  ZoomOut,
  AlertTriangle,
  Flame,
  Tag,
  Eye,
  EyeOff,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../services/soundEngine';
import { COMMON_VIOLIN_MISTAKES, CommonMistake } from '../data/commonMistakesData';

// Generated Anime Educational Illustrations with Spanish Diagrams and Annotations
import feetPostureImg from '../assets/images/posture_feet_es_annotated_1789232092776.jpg';
import chinrestHoldImg from '../assets/images/posture_chin_es_annotated_1789232106336.jpg';
import bowHoldRabbitImg from '../assets/images/posture_rabbit_es_annotated_1789232079348.jpg';
import leftHandSlideImg from '../assets/images/posture_hand_es_annotated_1789232117261.jpg';

export interface AnatomicalHotspot {
  id: string;
  label: string;
  desc: string;
  x: number;
  y: number;
}

interface StepGuide {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  japaneseTitle: string;
  imageSrc: string;
  altText: string;
  bulletPoints: string[];
  mangaTip: string;
  warningNotice: string;
  anatomicalLabels: { label: string; desc: string }[];
  hotspots: AnatomicalHotspot[];
}

const POSTURE_STEPS: StepGuide[] = [
  {
    id: 'step-1-feet',
    stepNumber: 1,
    title: 'Pies y Posición de Superheroína',
    subtitle: 'Base firme, peso equilibrado y columna libre',
    japaneseTitle: '「立ち方とバランス」',
    imageSrc: feetPostureImg,
    altText: 'Ilustración anime de postura correcta de pies en V y espalda erguida con texto en español',
    bulletPoints: [
      'Pies separados al ancho de tus hombros para no perder el equilibrio.',
      'Abre las puntas formando una suave "V" (¡como un pingüinito elegante!).',
      'Las rodillas deben estar elásticas y sueltas, nunca bloqueadas hacia atrás.',
      'Siente tu espalda recta y alta, como si un hilo invisible tirara de tu coronilla hacia el cielo.',
    ],
    mangaTip: '¡Haz un pequeño balanceo de lado a lado antes de empezar para sentir tus dos pies bien anclados al suelo!',
    warningNotice: 'Evita cruzar los pies o apoyarte solo en una pierna: eso cansa tu espalda muy rápido.',
    anatomicalLabels: [
      { label: 'Pies en V', desc: 'Separados al ancho de las caderas con peso repartido 50/50.' },
      { label: 'Rodillas Elásticas', desc: 'Flexibles como amortiguadores, nunca rígidas.' },
      { label: 'Espalda Alta', desc: 'Hombros relajados y columna vertebral alineada.' },
    ],
    hotspots: [
      {
        id: 'h1-1',
        label: '1. Espalda y Cabeza Erguida',
        desc: 'Espalda recta y columna alineada, como si un hilo invisible tirara hacia arriba.',
        x: 50,
        y: 18,
      },
      {
        id: 'h1-2',
        label: '2. Hombros Relajados',
        desc: 'Hombros bajos y sueltos, sin encogerse hacia las orejas.',
        x: 32,
        y: 35,
      },
      {
        id: 'h1-3',
        label: '3. Pies en "V"',
        desc: 'Separados al ancho de hombros con puntas ligeramente abiertas.',
        x: 50,
        y: 86,
      },
    ],
  },
  {
    id: 'step-2-chinrest',
    stepNumber: 2,
    title: 'El Violín en la Clavícula & Barbada',
    subtitle: 'El instrumento descansa solo con el peso de tu cabeza',
    japaneseTitle: '「楽器の構え方」',
    imageSrc: chinrestHoldImg,
    altText: 'Ilustración anime de colocación del violín en clavícula y barbada con anotaciones en español',
    bulletPoints: [
      'Coloca la base del violín sobre tu clavícula izquierda (apoyado en la almohadilla).',
      'Deja caer suavemente el lado izquierdo de tu mandíbula sobre la barbada.',
      'Tu nariz debe apuntar en la misma dirección de la voluta del violín.',
      '¡El truco maestro! El violín se sostiene por el peso natural de la cabeza, sin subir el hombro hacia la oreja.',
    ],
    mangaTip: 'Prueba el "Reto de Manos Libres": pon tus manos en la cintura y comprueba que el violín no se cae gracias al peso de tu cabeza.',
    warningNotice: '¡No aprietes con fuerza! No estás mordiendo una manzana, solo descansando la cabeza sobre una almohada suave.',
    anatomicalLabels: [
      { label: 'Barbada', desc: 'Mandíbula descansando con gravedad natural sin morder.' },
      { label: 'Almohadilla', desc: 'Llena el hueco entre la clavícula y el instrumento.' },
      { label: 'Hombro Izquierdo', desc: 'Completamente bajo y suelto, jamás elevado.' },
    ],
    hotspots: [
      {
        id: 'h2-1',
        label: '1. Barbilla en la Barbada',
        desc: 'Mandíbula descansando suavemente por la gravedad de la cabeza, sin apretar.',
        x: 48,
        y: 24,
      },
      {
        id: 'h2-2',
        label: '2. Clavícula & Almohadilla',
        desc: 'El instrumento reposa sobre la clavícula izquierda con su almohadilla suave.',
        x: 42,
        y: 53,
      },
      {
        id: 'h2-3',
        label: '3. Hombro Izquierdo Bajo',
        desc: 'Completamente relajado, jamás elevado para apretar el instrumento.',
        x: 26,
        y: 44,
      },
    ],
  },
  {
    id: 'step-3-bow',
    stepNumber: 3,
    title: 'El Agarre del Arco: "El Conejito"',
    subtitle: 'Dedos redondos, pulgar flexible y meñique de bailarina',
    japaneseTitle: '「うさぎの弓の持ち方」',
    imageSrc: bowHoldRabbitImg,
    altText: 'Ilustración anime macro del agarre de arco estilo conejito con etiquetas en español',
    bulletPoints: [
      'Diente del conejito: La punta del pulgar derecho se apoya curvada en el huequito frente a la nuez.',
      'Hocico del conejito: Los dedos corazón (2) y anular (3) abrazan la madera suavemente.',
      'Oreja izquierda: El dedo índice (1) se acuesta ligeramente hacia adelante para dar peso.',
      'La coronita: El dedo meñique (4) debe estar siempre redondo como una bolita, apoyado en la punta sobre la vara.',
    ],
    mangaTip: 'Si tu meñique se pone tieso o tu pulgar se estira como un plátano, para 2 segundos, sacude la mano como agua y vuelve a formar el conejito.',
    warningNotice: 'El pulgar NUNCA debe estar plano o rígido. Debe mantener su articulación flexionada como un amortiguador.',
    anatomicalLabels: [
      { label: 'Pulgar Curvado', desc: 'Diente de conejito amortiguador apoyado en la nuez.' },
      { label: 'Dedos 2 y 3', desc: 'Hocico suave abrazando el costado de la vara.' },
      { label: 'Meñique Redondo', desc: 'De puntillas sobre la vara, equilibrando la gravedad.' },
    ],
    hotspots: [
      {
        id: 'h3-1',
        label: '1. Pulgar Curvado',
        desc: 'Punta flexionada en la ranura frente a la nuez (el diente del conejo).',
        x: 48,
        y: 63,
      },
      {
        id: 'h3-2',
        label: '2. Meñique Redondo',
        desc: 'De puntillas sobre la vara como una bailarina (la coronita del conejo).',
        x: 74,
        y: 32,
      },
      {
        id: 'h3-3',
        label: '3. Dedos 2 y 3 (Hocico)',
        desc: 'Corazón y anular abrazando el costado de la nuez con suavidad.',
        x: 56,
        y: 38,
      },
      {
        id: 'h3-4',
        label: '4. Dedo Índice Inclinado',
        desc: 'Acostado ligeramente hacia adelante para guiar el peso del brazo.',
        x: 30,
        y: 36,
      },
    ],
  },
  {
    id: 'step-4-left-hand',
    stepNumber: 4,
    title: 'Mano Izquierda: "El Tobogán Ninja"',
    subtitle: 'Muñeca recta y dedos curvados en forma de túnel',
    japaneseTitle: '「左手とすべり台の手首」',
    imageSrc: leftHandSlideImg,
    altText: 'Ilustración anime de la mano izquierda y muñeca tobogán con diagramas en español',
    bulletPoints: [
      'Tu antebrazo y tu muñeca izquierda deben formar una línea recta como un tobogán de parque.',
      '¡Una canica mágica debería poder rodar desde tus nudillos hasta tu codo sin atascarse!',
      'El pulgar izquierdo reposa suavemente frente a la cinta del primer dedo, sin apretar el mástil.',
      'Los dedos se curvan como patas de gato y caen con la punta de la yema perpendicular a la cuerda.',
    ],
    mangaTip: 'Deja un hueco debajo del mástil: ¡debe caber un ratoncito imaginario entre la base de tu mano y el mástil del violín!',
    warningNotice: 'No pegues la palma de tu mano al mástil (el llamado "abrazo de oso"), porque tus dedos perderán agilidad para correr.',
    anatomicalLabels: [
      { label: 'Muñeca Tobogán', desc: 'Línea recta antebrazo-muñeca para máxima velocidad.' },
      { label: 'Túnel del Ratón', desc: 'Espacio libre entre palma y mástil para libre vibrato.' },
      { label: 'Yemas en Garra', desc: 'Dedos curvados pisando en punta sobre las cuerdas.' },
    ],
    hotspots: [
      {
        id: 'h4-1',
        label: '1. Muñeca Recta (Tobogán)',
        desc: 'Línea recta antebrazo-muñeca sin quebrar la articulación.',
        x: 32,
        y: 72,
      },
      {
        id: 'h4-2',
        label: '2. Túnel del Ratón',
        desc: 'Espacio libre entre palma y mástil (¡sin apretar con la palma!).',
        x: 54,
        y: 54,
      },
      {
        id: 'h4-3',
        label: '3. Dedos en Garra',
        desc: 'Yemas curvadas en arco cayendo perpendiculares a las cuerdas.',
        x: 62,
        y: 28,
      },
    ],
  },
];

interface ChecklistItem {
  id: string;
  title: string;
  detail: string;
  category: 'Cuerpo' | 'Violín' | 'Arco' | 'Mano Izquierda';
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'chk-feet',
    title: 'Pies en V y peso equilibrado',
    detail: 'Al ancho de hombros, rodillas sueltas y espalda erguida.',
    category: 'Cuerpo',
  },
  {
    id: 'chk-violin-horizontal',
    title: 'Violín horizontal en la clavícula',
    detail: 'Descansando en la clavícula, no caído hacia el suelo.',
    category: 'Violín',
  },
  {
    id: 'chk-head-rest',
    title: 'Cabeza relajada en la barbada',
    detail: 'Hombros relajados hacia abajo sin apretar el cuello.',
    category: 'Violín',
  },
  {
    id: 'chk-bow-thumb',
    title: 'Pulgar del arco curvado (¡diente de conejito!)',
    detail: 'Punta del pulgar flexionada en la nuez, cero rigidez.',
    category: 'Arco',
  },
  {
    id: 'chk-bow-pinky',
    title: 'Meñique del arco redondo como una bailarina',
    detail: 'Curvo sobre la vara, listo para equilibrar el peso.',
    category: 'Arco',
  },
  {
    id: 'chk-left-wrist',
    title: 'Muñeca izquierda recta tipo "tobogán"',
    detail: 'Sin tocar el mástil con la palma, hueco para el ratoncito.',
    category: 'Mano Izquierda',
  },
];

interface PostureCheckProps {
  onClose?: () => void;
  onAwardGems?: (gems: number, stars: number) => void;
  onStartPlaying?: () => void;
}

export const PostureCheck: React.FC<PostureCheckProps> = ({
  onClose,
  onAwardGems,
  onStartPlaying,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});
  const [hasClaimedBonus, setHasClaimedBonus] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'checklist' | 'mistakes'>('guide');

  // Fullscreen image lightbox modal
  const [fullscreenStepIdx, setFullscreenStepIdx] = useState<number | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  // Close lightbox on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFullscreenStepIdx(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentStep = POSTURE_STEPS[currentStepIdx];
  const totalCheckItems = CHECKLIST_ITEMS.length;
  const completedCount = Object.values(checkedIds).filter(Boolean).length;
  const isAllChecked = completedCount === totalCheckItems;
  const progressPercent = Math.round((completedCount / totalCheckItems) * 100);

  const toggleCheck = (id: string) => {
    soundEngine.playRewardChime('small');
    const newState = !checkedIds[id];
    const updated = { ...checkedIds, [id]: newState };
    setCheckedIds(updated);

    const nowComplete = Object.values(updated).filter(Boolean).length === totalCheckItems;
    if (nowComplete && !isAllChecked) {
      soundEngine.playRewardChime('major');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleMarkAll = () => {
    const all: Record<string, boolean> = {};
    CHECKLIST_ITEMS.forEach((item) => {
      all[item.id] = true;
    });
    setCheckedIds(all);
    soundEngine.playRewardChime('major');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleResetChecklist = () => {
    setCheckedIds({});
    setHasClaimedBonus(false);
  };

  const handleClaimReward = () => {
    if (hasClaimedBonus) return;
    setHasClaimedBonus(true);
    soundEngine.playRewardChime('major');
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
    });
    if (onAwardGems) {
      onAwardGems(30, 1);
    }
  };

  return (
    <div id="posture-check-container" className="w-full max-w-4xl mx-auto flex flex-col gap-5 select-none">
      {/* Header Banner - White canvas, Black text, Orange titles */}
      <div className="p-5 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#FF5F00] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5F00] text-black border-2 border-black flex items-center justify-center font-black shadow-[3px_3px_0px_#000000] shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#FF5F00] uppercase tracking-wider">
                Manga Maestro de Violín
              </span>
              <span className="font-manga text-[11px] text-[#FF5F00]">「姿勢チェック」</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-black">
              Revisión de Postura, Agarre y Vicios
            </h2>
            <p className="text-xs text-zinc-600 font-medium">
              Aprende en Español (es_ES) cómo sujetar el violín y el arco con libertad total.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="flex rounded-2xl bg-zinc-100 p-1 border-2 border-black">
            <button
              id="posture-tab-guide"
              onClick={() => setActiveTab('guide')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'guide'
                  ? 'bg-[#FF5F00] text-black shadow-[2px_2px_0px_#000000]'
                  : 'text-zinc-700 hover:text-black'
              }`}
            >
              Ilustraciones Paso a Paso
            </button>

            <button
              id="posture-tab-mistakes"
              onClick={() => setActiveTab('mistakes')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                activeTab === 'mistakes'
                  ? 'bg-[#FF5F00] text-black shadow-[2px_2px_0px_#000000]'
                  : 'text-zinc-700 hover:text-black'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#FF5F00]" />
              <span>Vicios Comunes</span>
            </button>

            <button
              id="posture-tab-checklist"
              onClick={() => setActiveTab('checklist')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'checklist'
                  ? 'bg-[#FF5F00] text-black shadow-[2px_2px_0px_#000000]'
                  : 'text-zinc-700 hover:text-black'
              }`}
            >
              <span>Checklist</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black text-white text-[10px] font-mono font-bold">
                {completedCount}/{totalCheckItems}
              </span>
            </button>
          </div>

          {onStartPlaying && (
            <button
              onClick={onStartPlaying}
              className="px-3.5 py-1.5 rounded-2xl bg-black text-white hover:bg-[#FF5F00] hover:text-black border-2 border-black font-black text-xs shadow-[2px_2px_0px_#FF5F00] transition-all flex items-center gap-1.5 shrink-0"
              title="Volver a Tu Camino de Virtuosa (Lecciones)"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ir a Lecciones</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white text-zinc-600 hover:text-black border-2 border-black hover:bg-zinc-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: Step by Step Manga Guide */}
      {activeTab === 'guide' && (
        <div className="flex flex-col gap-4">
          {/* Step Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {POSTURE_STEPS.map((step, idx) => {
              const isSelected = idx === currentStepIdx;
              return (
                <button
                  key={step.id}
                  id={`step-pill-${idx}`}
                  onClick={() => {
                    setCurrentStepIdx(idx);
                    soundEngine.playRewardChime('small');
                  }}
                  className={`p-3 rounded-2xl text-left border-2 transition-all flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-white text-black border-[#FF5F00] shadow-[4px_4px_0px_#FF5F00] scale-102'
                      : 'bg-white text-zinc-700 border-black hover:border-[#FF5F00] hover:text-black'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-[#FF5F00] text-black' : 'bg-zinc-200 text-black'
                      }`}
                    >
                      Paso {step.stepNumber}
                    </span>
                    <span className="font-manga text-[9px] text-[#FF5F00]">{step.japaneseTitle}</span>
                  </div>
                  <span className="text-xs font-black truncate text-black mt-0.5">
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Step Showcase Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#000000] flex flex-col md:flex-row gap-6 items-center">
            {/* Manga Illustration with Fullscreen trigger */}
            <div className="w-full md:w-5/12 flex flex-col items-center gap-2 shrink-0">
              <div
                onClick={() => {
                  setFullscreenStepIdx(currentStepIdx);
                  setLightboxZoom(1);
                  soundEngine.playRewardChime('small');
                }}
                className="group relative rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_#FF5F00] w-full max-w-[340px] aspect-4/3 bg-zinc-100 cursor-pointer"
                title="Haz clic para ver la ilustración a pantalla completa"
              >
                <img
                  src={currentStep.imageSrc}
                  alt={currentStep.altText}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Spanish Diagram Hotspots / Callout Tags */}
                {showAnnotations && currentStep.hotspots.map((spot, idx) => {
                  const isSelected = activeHotspotId === spot.id;
                  return (
                    <div
                      key={spot.id}
                      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspotId(isSelected ? null : spot.id);
                        soundEngine.playRewardChime('small');
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/spot cursor-pointer"
                    >
                      {/* Pulse circle */}
                      <div className="relative flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-[#FF5F00] opacity-75" />
                        <span className="relative flex items-center justify-center rounded-full w-5 h-5 bg-[#FF5F00] text-black font-black text-[10px] border-2 border-white shadow-md">
                          {idx + 1}
                        </span>
                      </div>

                      {/* Label Badge with Spanish text */}
                      <div className={`mt-1 px-2 py-0.5 rounded-lg border text-[10px] font-black whitespace-nowrap shadow-lg transition-all ${
                        isSelected
                          ? 'bg-[#FF5F00] text-black border-white ring-2 ring-black scale-105'
                          : 'bg-black/95 text-white border-[#FF5F00] group-hover/spot:bg-[#FF5F00] group-hover/spot:text-black group-hover/spot:border-black'
                      }`}>
                        {spot.label}
                      </div>

                      {/* Detail tooltip on click or hover */}
                      <div className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-48 p-2 rounded-xl bg-zinc-950 border-2 border-[#FF5F00] text-white shadow-2xl z-30 pointer-events-none transition-all ${
                        isSelected ? 'block' : 'hidden group-hover/spot:block'
                      }`}>
                        <span className="text-[11px] font-black text-[#FF5F00] block">{spot.label}</span>
                        <span className="text-[10px] text-zinc-300 font-medium leading-tight block mt-0.5">{spot.desc}</span>
                      </div>
                    </div>
                  );
                })}

                <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-lg bg-black/85 backdrop-blur text-white text-[11px] font-black border border-white/40">
                  Paso {currentStep.stepNumber} de 4
                </div>

                {/* Fullscreen Overlay Button */}
                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-xl bg-black/85 backdrop-blur text-white text-[11px] font-black flex items-center gap-1.5 border border-white/30 group-hover:bg-[#FF5F00] group-hover:text-black group-hover:border-black transition-colors shadow-sm">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>🔍 Pantalla Completa</span>
                </div>
              </div>

              {/* Controls under illustration */}
              <div className="w-full max-w-[340px] flex items-center justify-between px-1 text-[11px]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAnnotations(!showAnnotations);
                    soundEngine.playRewardChime('small');
                  }}
                  className="font-black text-black hover:text-[#FF5F00] flex items-center gap-1.5 transition-colors"
                  title="Activar o desactivar las etiquetas en español sobre la ilustración"
                >
                  {showAnnotations ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-[#FF5F00]" />
                      <span>Etiquetas en Español: Activas</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Mostrar Etiquetas</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFullscreenStepIdx(currentStepIdx);
                    setLightboxZoom(1);
                  }}
                  className="text-[#FF5F00] font-black hover:underline flex items-center gap-1"
                >
                  <span>Ampliar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Content & Rules */}
            <div className="w-full md:w-7/12 flex flex-col gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-black text-[#FF5F00]">
                  <span>PASO {currentStep.stepNumber}</span>
                  <span className="font-manga text-[10px] text-black">{currentStep.japaneseTitle}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-black mt-0.5">
                  {currentStep.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-700 font-bold mt-0.5">
                  {currentStep.subtitle}
                </p>
              </div>

              {/* Bullet Points */}
              <div className="flex flex-col gap-2 my-1">
                {currentStep.bulletPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-900">
                    <div className="w-5 h-5 rounded-full bg-[#FF5F00] text-black font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border border-black shadow-xs">
                      ✓
                    </div>
                    <span className="font-medium leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>

              {/* Manga Secret Tip */}
              <div className="p-3 rounded-2xl bg-orange-50/70 border-2 border-[#FF5F00]/60 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#FF5F00] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-black text-[#FF5F00] mr-1">Truco Manga:</span>
                  <span className="text-zinc-900 font-medium">{currentStep.mangaTip}</span>
                </div>
              </div>

              {/* Warning box */}
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-400 text-red-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span className="font-medium">{currentStep.warningNotice}</span>
              </div>

              {/* Prev / Next Navigation */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-200 mt-2">
                <button
                  onClick={() => {
                    if (currentStepIdx > 0) {
                      setCurrentStepIdx(currentStepIdx - 1);
                      soundEngine.playRewardChime('small');
                    }
                  }}
                  disabled={currentStepIdx === 0}
                  className="px-3.5 py-1.5 rounded-xl border-2 border-black text-black hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-transparent text-xs font-black flex items-center gap-1 shadow-xs"
                >
                  <ChevronLeft className="w-4 h-4" /> Anterior
                </button>

                {currentStepIdx < POSTURE_STEPS.length - 1 ? (
                  <button
                    onClick={() => {
                      setCurrentStepIdx(currentStepIdx + 1);
                      soundEngine.playRewardChime('small');
                    }}
                    className="px-4 py-1.5 rounded-xl bg-[#FF5F00] text-black border-2 border-black font-black text-xs flex items-center gap-1 shadow-[2px_2px_0px_#000000] hover:translate-x-0.5 transition-all"
                  >
                    Siguiente <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setActiveTab('mistakes');
                      soundEngine.playRewardChime('major');
                    }}
                    className="px-4 py-1.5 rounded-xl bg-[#FF5F00] text-black border-2 border-black font-black text-xs flex items-center gap-1 shadow-[2px_2px_0px_#000000] hover:scale-102 transition-all"
                  >
                    <span>Ver Vicios Comunes y Soluciones</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Vicios Comunes y Cómo Evitarlos (es_ES) */}
      {activeTab === 'mistakes' && (
        <div className="flex flex-col gap-4">
          <div className="p-5 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#000000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-black text-[#FF5F00] uppercase">
                <AlertTriangle className="w-4 h-4 text-[#FF5F00]" />
                <span>Pedagogía Oficial de Violín (es_ES)</span>
              </div>
              <h3 className="text-xl font-black text-black mt-0.5">
                Vicios Comunes en Principiantes y Cómo Evitarlos
              </h3>
              <p className="text-xs text-zinc-600 font-medium">
                Detecta y corrige a tiempo las trampas de tensión muscular para tocar siempre con sonido puro.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('checklist')}
              className="px-4 py-2 rounded-2xl bg-[#FF5F00] text-black border-2 border-black font-black text-xs shadow-[2px_2px_0px_#000000] hover:translate-x-0.5 transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>Ir a la Lista de Verificación</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMMON_VIOLIN_MISTAKES.map((mistake) => (
              <div
                key={mistake.id}
                className="p-5 rounded-3xl bg-white border-2 border-black shadow-[3px_3px_0px_#000000] hover:border-[#FF5F00] transition-all flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-lg bg-orange-100 text-[#FF5F00] border border-[#FF5F00] text-[10px] font-black uppercase">
                      {mistake.category}
                    </span>
                    <span className="font-manga text-[10px] text-[#FF5F00]">
                      {mistake.japaneseName}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-black">
                    {mistake.name}
                  </h4>

                  {/* Symptom */}
                  <div className="mt-2 text-xs text-zinc-800 leading-relaxed font-medium">
                    <span className="font-black text-red-600 mr-1">⚠️ El vicio:</span>
                    {mistake.symptom}
                  </div>

                  {/* Why Bad */}
                  <div className="mt-1.5 text-xs text-zinc-600 leading-relaxed">
                    <span className="font-black text-zinc-900 mr-1">¿Por qué es malo?:</span>
                    {mistake.whyBad}
                  </div>

                  {/* Quick Fix */}
                  <div className="mt-3 p-3 rounded-2xl bg-orange-50 border-2 border-[#FF5F00]/40 text-xs text-zinc-900 leading-relaxed">
                    <div className="font-black text-[#FF5F00] mb-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Solución Exprés (Truco Maestro):</span>
                    </div>
                    <span>{mistake.quickFix}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] italic text-[#FF5F00] font-black">
                  <span>{mistake.mangaMotto}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: Interactive Pre-Playing Checklist */}
      {activeTab === 'checklist' && (
        <div className="flex flex-col gap-4">
          {/* Progress and status box */}
          <div className="p-5 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#000000] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative w-14 h-14 rounded-2xl bg-[#FF5F00] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000000]">
                <span className="text-base font-black text-black font-mono">
                  {progressPercent}%
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-black">
                  Lista de Verificación Pre-Práctica
                </h3>
                <p className="text-xs text-zinc-600 font-medium">
                  Marca cada punto para asegurarte de que tu cuerpo y violín están listos.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleMarkAll}
                className="px-3.5 py-1.5 rounded-xl bg-white text-black border-2 border-black hover:bg-zinc-100 text-xs font-black shadow-xs"
              >
                Marcar Todo
              </button>
              <button
                onClick={handleResetChecklist}
                className="p-2 rounded-xl bg-white text-zinc-600 hover:text-black border-2 border-black hover:bg-zinc-100 shadow-xs"
                title="Reiniciar lista"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Checklist interactive cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CHECKLIST_ITEMS.map((item) => {
              const isChecked = !!checkedIds[item.id];
              return (
                <div
                  key={item.id}
                  id={`chk-item-${item.id}`}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isChecked
                      ? 'bg-orange-50/60 border-[#FF5F00] shadow-[3px_3px_0px_#FF5F00]'
                      : 'bg-white border-black hover:border-[#FF5F00] shadow-[2px_2px_0px_#000000]'
                  }`}
                >
                  <button
                    type="button"
                    className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                      isChecked
                        ? 'bg-[#FF5F00] text-black border-black shadow-xs'
                        : 'bg-white border-black text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-zinc-100 text-black border border-black/30 uppercase">
                        {item.category}
                      </span>
                    </div>
                    <h4
                      className={`text-sm font-black mt-1 transition-all ${
                        isChecked ? 'text-zinc-500 line-through' : 'text-black'
                      }`}
                    >
                      {item.title}
                    </h4>
                    <p className="text-xs text-zinc-600 mt-0.5 font-medium leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Completion celebratory card */}
          {isAllChecked && (
            <div className="p-6 rounded-3xl bg-white border-3 border-[#FF5F00] shadow-[6px_6px_0px_#000000] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FF5F00] text-black border-2 border-black flex items-center justify-center shrink-0 shadow-[3px_3px_0px_#000000]">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#FF5F00] uppercase">
                      ¡Postura Perfecta!
                    </span>
                    <span className="font-manga text-[11px] text-black">「準備完了！」</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-black">
                    ¡Estás 100% lista para tocar con sonido de oro!
                  </h3>
                  <p className="text-xs text-zinc-600 font-medium">
                    Tus músculos están relajados y tu violín en la posición óptima.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!hasClaimedBonus ? (
                  <button
                    onClick={handleClaimReward}
                    className="px-4 py-2.5 rounded-2xl bg-[#FF5F00] text-black font-black text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0px_#000000] hover:scale-105 transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Reclamar +30 Gemas</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-green-50 border-2 border-green-600 text-green-700 text-xs font-black flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    ¡Gemas Reclamadas!
                  </span>
                )}

                {onStartPlaying && (
                  <button
                    onClick={onStartPlaying}
                    className="px-4 py-2.5 rounded-2xl bg-black text-white font-black text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0px_#FF5F00] hover:scale-105 transition-all flex items-center gap-1.5"
                  >
                    <Play className="w-4 h-4 fill-[#FF5F00] text-[#FF5F00]" />
                    <span>¡A Tocar!</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {fullscreenStepIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={() => setFullscreenStepIdx(null)}
        >
          {/* Top Bar of Lightbox */}
          <div
            className="w-full max-w-5xl flex items-center justify-between text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-[#FF5F00] text-black font-black text-xs border border-white">
                Paso {POSTURE_STEPS[fullscreenStepIdx].stepNumber} de 4
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                {POSTURE_STEPS[fullscreenStepIdx].title}
              </h3>
              <span className="hidden md:inline font-manga text-xs text-[#FF5F00]">
                {POSTURE_STEPS[fullscreenStepIdx].japaneseTitle}
              </span>
            </div>

            {/* Zoom, Toggle & Close Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAnnotations(!showAnnotations)}
                className="px-3 py-1.5 rounded-xl bg-black border border-white/40 text-xs font-black text-white hover:bg-zinc-800 flex items-center gap-1.5 transition-colors"
                title="Mostrar u ocultar anotaciones en español"
              >
                <Tag className="w-3.5 h-3.5 text-[#FF5F00]" />
                <span className="hidden sm:inline">
                  {showAnnotations ? 'Etiquetas: Visibles' : 'Mostrar Etiquetas'}
                </span>
              </button>

              {/* Zoom Controls */}
              <button
                onClick={() => setLightboxZoom((z) => Math.min(2.0, z + 0.25))}
                className="p-2 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 border border-white/30"
                title="Acercar (Zoom +)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLightboxZoom((z) => Math.max(0.75, z - 0.25))}
                className="p-2 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 border border-white/30"
                title="Alejar (Zoom -)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLightboxZoom(1)}
                className="px-2.5 py-1 text-xs font-mono font-bold text-white bg-zinc-800 rounded-xl border border-white/30"
              >
                {Math.round(lightboxZoom * 100)}%
              </button>

              <button
                onClick={() => setFullscreenStepIdx(null)}
                className="p-2 rounded-xl bg-[#FF5F00] text-black font-black border-2 border-white hover:scale-105 transition-all shadow-md ml-2"
                title="Cerrar pantalla completa (Escape)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Central Fullscreen Image Stage */}
          <div
            className="flex-1 w-full max-w-5xl flex items-center justify-center overflow-hidden my-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative transition-transform duration-200 ease-out max-h-[72vh] flex items-center justify-center rounded-3xl overflow-hidden border-3 border-white shadow-[0px_0px_40px_rgba(255,95,0,0.5)]"
              style={{ transform: `scale(${lightboxZoom})` }}
            >
              <img
                src={POSTURE_STEPS[fullscreenStepIdx].imageSrc}
                alt={POSTURE_STEPS[fullscreenStepIdx].altText}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto object-contain select-none"
              />

              {/* Lightbox Hotspots in Spanish */}
              {showAnnotations && POSTURE_STEPS[fullscreenStepIdx].hotspots.map((spot, idx) => {
                const isSelected = activeHotspotId === spot.id;
                return (
                  <div
                    key={spot.id}
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspotId(isSelected ? null : spot.id);
                      soundEngine.playRewardChime('small');
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/spot cursor-pointer"
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-[#FF5F00] opacity-80" />
                      <span className="relative flex items-center justify-center rounded-full w-6 h-6 bg-[#FF5F00] text-black font-black text-xs border-2 border-white shadow-md">
                        {idx + 1}
                      </span>
                    </div>

                    <div className={`mt-1.5 px-2.5 py-1 rounded-xl border text-xs font-black whitespace-nowrap shadow-xl transition-all ${
                      isSelected
                        ? 'bg-[#FF5F00] text-black border-white ring-2 ring-black scale-105'
                        : 'bg-black/95 text-white border-[#FF5F00] group-hover/spot:bg-[#FF5F00] group-hover/spot:text-black'
                    }`}>
                      {spot.label}
                    </div>

                    <div className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 p-2.5 rounded-2xl bg-zinc-950 border-2 border-[#FF5F00] text-white shadow-2xl z-30 transition-all pointer-events-none ${
                      isSelected ? 'block' : 'hidden group-hover/spot:block'
                    }`}>
                      <span className="text-xs font-black text-[#FF5F00] block">{spot.label}</span>
                      <span className="text-[11px] text-zinc-200 font-medium leading-relaxed block mt-0.5">{spot.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Anatomical Annotations Strip (es_ES) & Step Navigation */}
          <div
            className="w-full max-w-5xl bg-zinc-950 border-2 border-white/50 p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Anatomical Checkpoints in Spanish */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto">
              {POSTURE_STEPS[fullscreenStepIdx].anatomicalLabels.map((lbl, idx) => (
                <div key={idx} className="px-3 py-1.5 rounded-xl bg-black border border-white/20 text-left">
                  <span className="text-[11px] font-black text-[#FF5F00] block">{lbl.label}</span>
                  <span className="text-[10px] text-zinc-300 font-medium leading-tight block">{lbl.desc}</span>
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setFullscreenStepIdx((idx) => (idx !== null && idx > 0 ? idx - 1 : POSTURE_STEPS.length - 1));
                  setLightboxZoom(1);
                  soundEngine.playRewardChime('small');
                }}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 border border-white/40 text-xs font-black flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>

              <button
                onClick={() => {
                  setFullscreenStepIdx((idx) => (idx !== null && idx < POSTURE_STEPS.length - 1 ? idx + 1 : 0));
                  setLightboxZoom(1);
                  soundEngine.playRewardChime('small');
                }}
                className="px-4 py-2 rounded-xl bg-[#FF5F00] text-black font-black text-xs border-2 border-white flex items-center gap-1 shadow-[2px_2px_0px_#FFFFFF] hover:scale-105 transition-all"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
