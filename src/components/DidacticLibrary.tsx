import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  Sparkles,
  CheckSquare,
  Square,
  HelpCircle,
  ShieldAlert,
  Feather,
  Music,
  ChevronRight,
  ChevronDown,
  Info,
  CheckCircle2,
  Volume2,
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface WarmupItem {
  id: string;
  title: string;
  minutes: string;
  desc: string;
  done: boolean;
}

export const DidacticLibrary: React.FC = () => {
  // Active Section: 'intervals' | 'posture' | 'anatomy' | 'care' | 'warmup' | 'fingers'
  const [activeSection, setActiveSection] = useState<'intervals' | 'posture' | 'anatomy' | 'care' | 'warmup' | 'fingers'>('intervals');

  // Interval audio demonstration state
  const [playingIntervalName, setPlayingIntervalName] = useState<string | null>(null);

  const playIntervalDemo = (name: string, f1: number, f2: number) => {
    setPlayingIntervalName(name);
    soundEngine.playInterval(f1, f2, 2.4);
    setTimeout(() => {
      setPlayingIntervalName((curr) => (curr === name ? null : curr));
    }, 2400);
  };

  // Selected Anatomy Part
  const [selectedViolinPart, setSelectedViolinPart] = useState<string>('cuerpo');
  const [selectedBowPart, setSelectedBowPart] = useState<string>('talon');

  // Daily Warm-Up checklist
  const [warmupTasks, setWarmupTasks] = useState<WarmupItem[]>([
    {
      id: 'w1',
      title: 'Desperezo y Hombros Relajados',
      minutes: '1 min',
      desc: '3 círculos lentos hacia atrás con los hombros. Siente cómo caen sin tensión.',
      done: false,
    },
    {
      id: 'w2',
      title: 'El Conejito Limpiaparabrisas',
      minutes: '1 min',
      desc: 'Forma el agarre del conejito en el arco. Mueve el arco suavemente de izquierda a derecha como el parabrisas de un coche manteniendo el meñique curvado.',
      done: false,
    },
    {
      id: 'w3',
      title: 'Arco Entero en Cuerdas al Aire',
      minutes: '1.5 min',
      desc: 'Toca 2 arcos abajo (⊓) y 2 arcos arriba (∨) en cada cuerda: Sol, Re, La y Mi. Sonido largo, parejo y cantable.',
      done: false,
    },
    {
      id: 'w4',
      title: 'Pisadas de Gato (Dedos 1, 2, 3)',
      minutes: '1 min',
      desc: 'En cuerda La: coloca dedo 1 (Si), luego dedo 2 (Do#) y dedo 3 (Re) como patitas acolchadas de gato.',
      done: false,
    },
    {
      id: 'w5',
      title: '¡Canción del Corazón!',
      minutes: '0.5 min',
      desc: 'Toca tu canción favorita una vez entera con una gran sonrisa.',
      done: false,
    },
  ]);

  const toggleWarmupTask = (id: string) => {
    setWarmupTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.done;
          if (nextState) {
            soundEngine.playRewardChime('small');
          }
          return { ...t, done: nextState };
        }
        return t;
      })
    );
  };

  const completedCount = warmupTasks.filter((t) => t.done).length;

  return (
    <div id="didactic-library-container" className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#FF5F00] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-[#FF5F00] uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Biblioteca y Enciclopedia Didáctica</span>
            <span className="font-manga text-[11px] text-black">「バイオリン大百科」</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-black">
            Material de Estudio y Secretos del Violín
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-xl font-medium leading-relaxed">
            Todo lo que necesitas para tocar cómoda, relajada y con técnica impecable: anatomía, el agarre del conejito, cuidado del instrumento y rutina diaria.
          </p>
        </div>

        {/* Quick progress pill */}
        <div className="px-4 py-2.5 rounded-2xl bg-orange-50 border-2 border-black text-center shrink-0 shadow-[3px_3px_0px_#000000]">
          <div className="text-[11px] text-zinc-600 font-bold">Calentamiento hoy</div>
          <div className="text-sm font-black text-[#FF5F00] mt-0.5">
            {completedCount} / {warmupTasks.length} Pasos
          </div>
        </div>
      </div>

      {/* Sub-Navigation Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveSection('intervals')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all whitespace-nowrap border-2 ${
            activeSection === 'intervals'
              ? 'bg-[#FF5F00] text-black border-black shadow-[3px_3px_0px_#000000]'
              : 'bg-white text-zinc-800 border-black/40 hover:border-black'
          }`}
        >
          🎵 Intervalos y Quintas
        </button>

        <button
          onClick={() => setActiveSection('posture')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all whitespace-nowrap border-2 ${
            activeSection === 'posture'
              ? 'bg-[#FF5F00] text-black border-black shadow-[3px_3px_0px_#000000]'
              : 'bg-white text-zinc-800 border-black/40 hover:border-black'
          }`}
        >
          🐰 Agarre del Conejito y Postura
        </button>

        <button
          onClick={() => setActiveSection('anatomy')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all whitespace-nowrap border-2 ${
            activeSection === 'anatomy'
              ? 'bg-[#FF5F00] text-black border-black shadow-[3px_3px_0px_#000000]'
              : 'bg-white text-zinc-800 border-black/40 hover:border-black'
          }`}
        >
          🎻 Anatomía del Violín y Arco
        </button>

        <button
          onClick={() => setActiveSection('warmup')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all whitespace-nowrap border-2 ${
            activeSection === 'warmup'
              ? 'bg-[#FF5F00] text-black border-black shadow-[3px_3px_0px_#000000]'
              : 'bg-white text-zinc-800 border-black/40 hover:border-black'
          }`}
        >
          ⏱️ Calentamiento Diario (5 min)
        </button>

        <button
          onClick={() => setActiveSection('care')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all whitespace-nowrap border-2 ${
            activeSection === 'care'
              ? 'bg-[#FF5F00] text-black border-black shadow-[3px_3px_0px_#000000]'
              : 'bg-white text-zinc-800 border-black/40 hover:border-black'
          }`}
        >
          ✨ Cuidado y Resina
        </button>

        <button
          onClick={() => setActiveSection('fingers')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all whitespace-nowrap border-2 ${
            activeSection === 'fingers'
              ? 'bg-[#FF5F00] text-black border-black shadow-[3px_3px_0px_#000000]'
              : 'bg-white text-zinc-800 border-black/40 hover:border-black'
          }`}
        >
          📏 Tabla de Cintas y Dedos
        </button>
      </div>

      {/* SECTION: INTERVALOS Y AFINACIÓN POR QUINTAS */}
      {activeSection === 'intervals' && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Main Concept Card */}
          <div className="p-6 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#FF5F00] flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-black text-[#FF5F00] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Fundamento Maestro • Desde Cero</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-black">
              ¿Qué es un Intervalo y cómo medirlo con tus Dedos?
            </h3>

            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-medium">
              Imagina que las notas musicales son escalones: <em>Do, Re, Mi, Fa, Sol, La, Si...</em> Cuando subes o bajas de un escalón a otro, la distancia que hay entre ambos se llama <strong>INTERVALO</strong>.
              En lugar de medir en centímetros, <strong>¡en música contamos notas con los dedos de la mano!</strong> La primera nota de donde sales siempre cuenta como el número 1.
            </p>

            {/* Interactive Intervals Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {/* 1ª Unísono */}
              <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-black flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-black bg-[#FF5F00] px-2 py-0.5 rounded-lg border border-black">1ª</span>
                    <span className="text-[11px] text-zinc-500 font-bold">1 dedo</span>
                  </div>
                  <h4 className="text-base font-black text-black mt-2">Primera (Unísono)</h4>
                  <p className="text-xs text-zinc-600 mt-1">
                    Es la misma nota repetida dos veces (ejemplo: Sol con Sol). Suenan gemelas y exactamente iguales.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => playIntervalDemo('1st', 196.0, 196.0)}
                  className={`px-3 py-2 rounded-xl text-xs font-black border-2 border-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    playingIntervalName === '1st'
                      ? 'bg-[#FF5F00] text-black shadow-none'
                      : 'bg-white text-black hover:bg-[#FF5F00] shadow-[2px_2px_0px_#000000]'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{playingIntervalName === '1st' ? 'Sonando...' : 'Escuchar 1ª'}</span>
                </button>
              </div>

              {/* 2ª Segunda */}
              <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-black flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-black bg-[#FF5F00] px-2 py-0.5 rounded-lg border border-black">2ª</span>
                    <span className="text-[11px] text-zinc-500 font-bold">2 dedos</span>
                  </div>
                  <h4 className="text-base font-black text-black mt-2">Segunda</h4>
                  <p className="text-xs text-zinc-600 mt-1">
                    Dos notas vecinas pegaditas (ejemplo: Do a Re, o Sol a La). Cuentas 2 dedos: 1(Do) y 2(Re). ¡Como dar un paso al caminar!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => playIntervalDemo('2nd', 196.0, 220.0)}
                  className={`px-3 py-2 rounded-xl text-xs font-black border-2 border-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    playingIntervalName === '2nd'
                      ? 'bg-[#FF5F00] text-black shadow-none'
                      : 'bg-white text-black hover:bg-[#FF5F00] shadow-[2px_2px_0px_#000000]'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{playingIntervalName === '2nd' ? 'Sonando...' : 'Escuchar 2ª'}</span>
                </button>
              </div>

              {/* 3ª Tercera */}
              <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-black flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-black bg-[#FF5F00] px-2 py-0.5 rounded-lg border border-black">3ª</span>
                    <span className="text-[11px] text-zinc-500 font-bold">3 dedos</span>
                  </div>
                  <h4 className="text-base font-black text-black mt-2">Tercera</h4>
                  <p className="text-xs text-zinc-600 mt-1">
                    Salto de 3 notas: 1(Do) - 2(Re) - 3(Mi). Las terceras suenan dulces, cálidas y alegres, como el canto de un pajarito.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => playIntervalDemo('3rd', 196.0, 246.94)}
                  className={`px-3 py-2 rounded-xl text-xs font-black border-2 border-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    playingIntervalName === '3rd'
                      ? 'bg-[#FF5F00] text-black shadow-none'
                      : 'bg-white text-black hover:bg-[#FF5F00] shadow-[2px_2px_0px_#000000]'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{playingIntervalName === '3rd' ? 'Sonando...' : 'Escuchar 3ª'}</span>
                </button>
              </div>

              {/* 4ª Cuarta */}
              <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-black flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-black bg-[#FF5F00] px-2 py-0.5 rounded-lg border border-black">4ª</span>
                    <span className="text-[11px] text-zinc-500 font-bold">4 dedos</span>
                  </div>
                  <h4 className="text-base font-black text-black mt-2">Cuarta</h4>
                  <p className="text-xs text-zinc-600 mt-1">
                    Salto de 4 notas: 1(Do) - 2(Re) - 3(Mi) - 4(Fa). Suena firme, solemne y decidida, como clarines de un castillo real.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => playIntervalDemo('4th', 196.0, 261.63)}
                  className={`px-3 py-2 rounded-xl text-xs font-black border-2 border-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    playingIntervalName === '4th'
                      ? 'bg-[#FF5F00] text-black shadow-none'
                      : 'bg-white text-black hover:bg-[#FF5F00] shadow-[2px_2px_0px_#000000]'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{playingIntervalName === '4th' ? 'Sonando...' : 'Escuchar 4ª'}</span>
                </button>
              </div>

              {/* 5ª Quinta Justa - FEATURED */}
              <div className="p-4 rounded-2xl bg-orange-50 border-2 border-[#FF5F00] flex flex-col justify-between gap-3 shadow-[3px_3px_0px_#000000]">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white bg-black px-2.5 py-0.5 rounded-lg border border-black">⭐ 5ª REINA</span>
                    <span className="text-[11px] text-[#FF5F00] font-black">5 dedos completos</span>
                  </div>
                  <h4 className="text-base font-black text-black mt-2">Quinta Justa (5ª)</h4>
                  <p className="text-xs text-zinc-700 mt-1 font-medium">
                    ¡Abre toda tu mano!: 1(Sol) - 2(La) - 3(Si) - 4(Do) - 5(Re). Suena abierta, pura y brillante. <strong>¡Es la distancia exacta del violín!</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => playIntervalDemo('5th', 196.0, 293.66)}
                  className={`px-3 py-2 rounded-xl text-xs font-black border-2 border-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    playingIntervalName === '5th'
                      ? 'bg-[#FF5F00] text-black shadow-none'
                      : 'bg-black text-white hover:bg-[#FF5F00] hover:text-black shadow-[2px_2px_0px_#000000]'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#FF5F00]" />
                  <span>{playingIntervalName === '5th' ? 'Sonando...' : 'Escuchar 5ª Justa'}</span>
                </button>
              </div>

              {/* 8ª Octava */}
              <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-black flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-black bg-[#FF5F00] px-2 py-0.5 rounded-lg border border-black">8ª</span>
                    <span className="text-[11px] text-zinc-500 font-bold">8 peldaños</span>
                  </div>
                  <h4 className="text-base font-black text-black mt-2">Octava (8ª)</h4>
                  <p className="text-xs text-zinc-600 mt-1">
                    Es la misma nota pero un ciclo completo más aguda (ejemplo: Sol grave a Sol medio). Como cantar la misma canción un niño y un adulto juntos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => playIntervalDemo('8th', 196.0, 392.0)}
                  className={`px-3 py-2 rounded-xl text-xs font-black border-2 border-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    playingIntervalName === '8th'
                      ? 'bg-[#FF5F00] text-black shadow-none'
                      : 'bg-white text-black hover:bg-[#FF5F00] shadow-[2px_2px_0px_#000000]'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{playingIntervalName === '8th' ? 'Sonando...' : 'Escuchar 8ª'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Deep Dive: Por qué se afina por quintas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Card: Anatomía y Dedos */}
            <div className="p-6 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#000000] flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-black text-black uppercase tracking-wider">
                <span className="w-6 h-6 rounded-xl bg-[#FF5F00] text-black font-black flex items-center justify-center text-xs border border-black">🎻</span>
                <span>¿Por qué por quintas y no por cuartas?</span>
              </div>

              <h4 className="text-lg font-black text-black">
                El Secreto de la Mano Humana
              </h4>

              <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                En el violín no hay trastes metálicos como en la guitarra. Cuando colocas tu mano en el mástil:
              </p>

              <ul className="text-xs text-zinc-700 space-y-2 font-medium bg-zinc-50 p-4 rounded-2xl border border-black">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5F00] font-black">•</span>
                  <span>Tus 4 dedos (1, 2, 3 y 4) cubren cómodamente <strong>4 notas</strong> a lo largo de una sola cuerda sin tener que mover la muñeca.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5F00] font-black">•</span>
                  <span>Al afinar la siguiente cuerda exactamente en la <strong>5ª nota (Quinta Justa)</strong>, ¡el 4º dedo coincide a la perfección con la siguiente cuerda al aire!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF5F00] font-black">•</span>
                  <span>Esto significa que <strong>no queda ningún hueco vacío ni notas perdidas</strong> en todo el violín: ¡es un diseño geométrico perfecto!</span>
                </li>
              </ul>
            </div>

            {/* Right Card: Las 4 Cuerdas del Violín y su Conexión */}
            <div className="p-6 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#FF5F00] flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-black text-[#FF5F00] uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Mapa de las 4 Cuerdas</span>
                </div>

                <h4 className="text-lg font-black text-black">
                  Sol (G) → Re (D) → La (A) → Mi (E)
                </h4>

                <p className="text-xs text-zinc-700 leading-relaxed font-medium mt-1">
                  Cada salto de una cuerda a la siguiente es exactamente de 5 notas:
                </p>

                <div className="flex flex-col gap-2 mt-3 font-mono text-xs font-bold">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-between">
                    <span>Cuerda Sol a Cuerda Re:</span>
                    <span className="font-extrabold text-emerald-700">5ª Justa (+5 notas)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-300 text-blue-950 flex items-center justify-between">
                    <span>Cuerda Re a Cuerda La:</span>
                    <span className="font-extrabold text-blue-700">5ª Justa (+5 notas)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-300 text-pink-950 flex items-center justify-between">
                    <span>Cuerda La a Cuerda Mi:</span>
                    <span className="font-extrabold text-pink-700">5ª Justa (+5 notas)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-orange-50 rounded-2xl border border-black text-xs text-zinc-800 font-medium">
                <strong>💡 Frase Mnemotécnica:</strong> Para acordarte siempre del orden de las 4 cuerdas de gruesa a fina, repite: <em>«SOLo REzo LAs MIsas»</em>.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: POSTURA Y AGARRE DEL CONEJITO */}
      {activeSection === 'posture' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Rabbit Bow Hold */}
          <div className="p-6 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#FF5F00] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-black text-[#FF5F00] uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Técnica Secreta Suzuki & Clásica</span>
              </div>
              <h3 className="text-xl font-black text-black">
                El Agarre del Conejito (Mano Derecha)
              </h3>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                El arco no se agarra como un palo o una espada. Se sostiene con la mano relajada como si fuera la cabecita de un simpático conejito blanco:
              </p>

              <div className="mt-4 space-y-3">
                <div className="p-3.5 rounded-2xl bg-zinc-50 border-2 border-black flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FF5F00] text-black font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border border-black">
                    1
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-black">El Diente Curvado (Pulgar)</h4>
                    <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
                      El pulgar de tu mano derecha se apoya <strong>redondeado y flexible</strong> en la ranura entre la nuez (talón) y el cuero de la vara. ¡Nunca rígido ni hacia adentro!
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border-2 border-black flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FF5F00] text-black font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border border-black">
                    2
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-black">El Hocico (Dedos Medio y Anular)</h4>
                    <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
                      Los dedos 2 y 3 caen abrazando suavemente el lateral de la nuez. El dedo medio queda justo enfrente de la yema del pulgar.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border-2 border-black flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FF5F00] text-black font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border border-black">
                    3
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-black">La Oreja Delantera (Índice)</h4>
                    <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
                      El dedo índice se apoya inclinado sobre la vara a la altura de su segunda falange. Es el timón que transmite el peso natural del brazo a las cuerdas.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border-2 border-black flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FF5F00] text-black font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border border-black">
                    4
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-black">La Coronita (El Meñique Curvado)</h4>
                    <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
                      ¡La clave de oro del violín! El meñique se apoya <strong>de puntillas como una bailarina</strong> sobre la parte superior de la vara. Si el meñique está curvado, todo el brazo estará relajado.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-2xl bg-orange-50 border-2 border-[#FF5F00] text-xs text-black flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF5F00] shrink-0" />
              <span><strong>Truco del lápiz:</strong> Antes de coger el arco, practica este conejito con un lápiz redondo hasta que te salga automático.</span>
            </div>
          </div>

          {/* Card 2: Violin Hold & Body Posture */}
          <div className="p-6 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#000000] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-black text-[#FF5F00] uppercase tracking-wider mb-2">
                <Feather className="w-4 h-4 text-[#FF5F00]" />
                <span>Equilibrio Natural y Sin Dolor</span>
              </div>
              <h3 className="text-xl font-black text-black">
                Cómo Sostener el Violín
              </h3>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                El violín no se aprieta con fuerza ni se levanta con el hombro tenso. Descansa por puro equilibrio:
              </p>

              <div className="mt-4 space-y-3">
                <div className="p-3.5 rounded-2xl bg-zinc-50 border-2 border-black">
                  <h4 className="text-sm font-black text-black flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF5F00]" />
                    <span>Los Pies en "V" de Violinista</span>
                  </h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Pies separados al ancho de los hombros. El pie izquierdo ligeramente adelantado hacia la música. Peso del cuerpo bien distribuido y rodillas elásticas.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border-2 border-black">
                  <h4 className="text-sm font-black text-black flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF5F00]" />
                    <span>El Violín sobre la Clavícula</span>
                  </h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Coloca la almohadilla del violín sobre tu clavícula izquierda. El instrumento apunta a unos 45º hacia la izquierda (en la dirección de tu pie izquierdo).
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border-2 border-black">
                  <h4 className="text-sm font-black text-black flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF5F00]" />
                    <span>La Cabeza: Peso Suave en la Barbada</span>
                  </h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Gira la cabeza suavemente hacia la izquierda y déjala caer con su propio peso en la barbada. <strong>¡No subas el hombro izquierdo para alcanzar el violín!</strong> Si queda espacio, ajusta la altura de la almohadilla.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border-2 border-black">
                  <h4 className="text-sm font-black text-black flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF5F00]" />
                    <span>Mano Izquierda: El Tobogán Libre</span>
                  </h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    La muñeca izquierda debe estar recta, continuando la línea del antebrazo (¡nada de muñeca "chupete" apoyada en el mástil!). Debe quedar un hueco por el que podría pasar un ratoncito.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-2xl bg-zinc-100 border-2 border-black text-xs text-zinc-800 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#FF5F00] shrink-0" />
              <span><strong>Prueba del violinista:</strong> Con el violín colocado, debes poder soltar la mano izquierda y decir "¡Hola!" sin que el violín se caiga.</span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: ANATOMÍA DEL VIOLÍN Y ARCO */}
      {activeSection === 'anatomy' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Violin Anatomy */}
          <div className="p-6 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#FF5F00]">
            <h3 className="text-xl font-black text-black mb-2">
              Partes del Violín
            </h3>
            <p className="text-xs text-zinc-600 mb-4">
              Haz clic en cualquier pieza para descubrir su misión acústica:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {[
                { id: 'voluta', name: 'Voluta (Caracol)' },
                { id: 'clavijas', name: 'Clavijas' },
                { id: 'diapason', name: 'Diapasón' },
                { id: 'puente', name: 'Puente' },
                { id: 'efes', name: 'Oídos en "f"' },
                { id: 'cordal', name: 'Cordal' },
                { id: 'micro', name: 'Microafinadores' },
                { id: 'barbada', name: 'Barbada' },
                { id: 'alma', name: 'El Alma (Secreta)' },
              ].map((part) => (
                <button
                  key={part.id}
                  onClick={() => setSelectedViolinPart(part.id)}
                  className={`p-2.5 rounded-xl text-xs font-black border-2 transition-all text-left ${
                    selectedViolinPart === part.id
                      ? 'bg-[#FF5F00] text-black border-black shadow-[2px_2px_0px_#000000]'
                      : 'bg-zinc-50 text-zinc-800 border-black/30 hover:border-black'
                  }`}
                >
                  {part.name}
                </button>
              ))}
            </div>

            {/* Explanation card */}
            <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-black">
              {selectedViolinPart === 'voluta' && (
                <div>
                  <h4 className="text-sm font-black text-[#FF5F00]">La Voluta o Caracol</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Es la preciosa escultura tallada en espiral al final del mástil. Además de ser la firma de arte del luthier, añade masa al extremo para equilibrar las vibraciones.
                  </p>
                </div>
              )}
              {selectedViolinPart === 'clavijas' && (
                <div>
                  <h4 className="text-sm font-black text-[#FF5F00]">Las Clavijas (Afinación Gruesa)</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Cuatro piezas cónicas de madera de ébano o palisandro. Al girarlas tensan o aflojan las cuerdas. Siempre se empujan suavemente hacia adentro mientras se giran para que no se resbalen.
                  </p>
                </div>
              )}
              {selectedViolinPart === 'diapason' && (
                <div>
                  <h4 className="text-sm font-black text-[#FF5F00]">El Diapasón de Ébano</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    La franja de madera negra sobre la que pisamos con los dedos. No tiene trastes metálicos para permitir afinación perfecta, glissandos y vibrato expresivo.
                  </p>
                </div>
              )}
              {selectedViolinPart === 'puente' && (
                <div>
                  <h4 className="text-sm font-black text-[#FF5F00]">El Puente de Arce</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    ¡No está pegado con cola! Se mantiene de pie exclusivamente por la tensión de las 4 cuerdas. Es el transmisor vital: recibe las ondas del arco y las transmite a la madera de la tapa.
                  </p>
                </div>
              )}
              {selectedViolinPart === 'efes' && (
                <div>
                  <h4 className="text-sm font-black text-[#FF5F00]">Los Oídos en "f"</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Las dos aberturas laterales en forma de "f" caligráfica. Permiten que la tapa vibre libremente como un tambor y dejan salir el aire con el sonido desde el interior de la caja.
                  </p>
                </div>
              )}
              {selectedViolinPart === 'cordal' && (
                <div>
                  <h4 className="text-sm font-black text-[#FF5F00]">El Cordal</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    La pieza negra triangular que sujeta las 4 cuerdas por la parte inferior. Va anclado al botón del violín con una tira resistente llamada tiracordal.
                  </p>
                </div>
              )}
              {selectedViolinPart === 'micro' && (
                <div>
                  <h4 className="text-sm font-black text-[#FF5F00]">Los Microafinadores</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Tornillos de precisión integrados en el cordal. Permiten afinar con una precisión milimétrica sin peligro de romper las cuerdas.
                  </p>
                </div>
              )}
              {selectedViolinPart === 'barbada' && (
                <div>
                  <h4 className="text-sm font-black text-[#FF5F00]">La Barbada (Soporte de Mentón)</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Pieza de madera con forma cóncava inventada por Louis Spohr en el siglo XIX. Protege la madera del violín del sudor y permite sujetar el instrumento cómodamente con la mandíbula.
                  </p>
                </div>
              )}
              {selectedViolinPart === 'alma' && (
                <div>
                  <h4 className="text-sm font-black text-[#FF5F00]">El Alma (Pilar Secreto de Sonido)</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    ¡El secreto mejor guardado! Es un cilindro de madera de abeto situado dentro del violín justo debajo del pie derecho del puente. Los luthiers lo llaman "Alma" porque si se cae, el violín pierde su voz y suena apagado.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bow Anatomy */}
          <div className="p-6 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#000000]">
            <h3 className="text-xl font-black text-black mb-2">
              Partes del Arco
            </h3>
            <p className="text-xs text-zinc-600 mb-4">
              El arco es la voz del violín. Conoce sus 5 partes fundamentales:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {[
                { id: 'talon', name: 'Talón (Nuez)' },
                { id: 'vara', name: 'Vara (Madera)' },
                { id: 'crin', name: 'Cerdas (Crin)' },
                { id: 'punta', name: 'La Punta' },
                { id: 'tornillo', name: 'Tornillo Tensor' },
              ].map((part) => (
                <button
                  key={part.id}
                  onClick={() => setSelectedBowPart(part.id)}
                  className={`p-2.5 rounded-xl text-xs font-black border-2 transition-all text-left ${
                    selectedBowPart === part.id
                      ? 'bg-[#FF5F00] text-black border-black shadow-[2px_2px_0px_#000000]'
                      : 'bg-zinc-50 text-zinc-800 border-black/30 hover:border-black'
                  }`}
                >
                  {part.name}
                </button>
              ))}
            </div>

            {/* Bow explanation card */}
            <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-black">
              {selectedBowPart === 'talon' && (
                <div>
                  <h4 className="text-sm font-black text-[#FF5F00]">El Talón o Nuez (Soporte de Mano)</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Bloque de ébano donde colocamos la mano derecha (el agarre del conejito). Tiene un peso mayor que la punta, por lo que los ataques cerca del talón suenan con más fuerza y cuerpo.
                  </p>
                </div>
              )}
              {selectedBowPart === 'vara' && (
                <div>
                  <h4 className="text-sm font-black text-[#FF5F00]">La Vara (Pernambuco o Fibra de Carbono)</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Vara curvada con una elasticidad perfecta. Diseñada por François Tourte a finales del siglo XVIII. Debe mantener siempre su curvatura natural hacia abajo.
                  </p>
                </div>
              )}
              {selectedBowPart === 'crin' && (
                <div>
                  <h4 className="text-sm font-black text-[#FF5F00]">Las Cerdas (Crin de Caballo)</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Unas 150 a 200 crines naturales de caballo de regiones frías (como Mongolia). Tienen micro-escamas microscópicas que atrapan la resina para frotar las cuerdas. <strong>¡Nunca toques las cerdas con los dedos grasos!</strong>
                  </p>
                </div>
              )}
              {selectedBowPart === 'punta' && (
                <div>
                  <h4 className="text-sm font-black text-[#FF5F00]">La Punta</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    El extremo más fino y ligero del arco. Aquí los sonidos son más delicados, sutiles y ágiles.
                  </p>
                </div>
              )}
              {selectedBowPart === 'tornillo' && (
                <div>
                  <h4 className="text-sm font-black text-[#FF5F00]">El Tornillo Tensor</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    Tornillo en la base para tensar antes de tocar (la distancia entre la vara y las cerdas debe ser del grosor de tu meñique) y aflojar SIEMPRE al terminar de practicar.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: CALENTAMIENTO DIARIO EN 5 MINUTOS */}
      {activeSection === 'warmup' && (
        <div className="p-6 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#FF5F00] flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-4">
            <div>
              <h3 className="text-xl font-black text-black">
                Rutina Diaria de 5 Minutos
              </h3>
              <p className="text-xs text-zinc-600 mt-0.5">
                Calentar antes de tocar despierta los músculos de tus dedos y evita cualquier molestia. ¡Marca cada paso!
              </p>
            </div>

            <button
              onClick={() =>
                setWarmupTasks((prev) => prev.map((t) => ({ ...t, done: false })))
              }
              className="px-3 py-1.5 rounded-xl bg-zinc-100 border border-black text-xs font-bold text-zinc-800 hover:bg-zinc-200"
            >
              Reiniciar rutina diaria
            </button>
          </div>

          <div className="space-y-3">
            {warmupTasks.map((task, idx) => (
              <div
                key={task.id}
                onClick={() => toggleWarmupTask(task.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  task.done
                    ? 'bg-orange-50 border-[#FF5F00] shadow-[3px_3px_0px_#FF5F00]'
                    : 'bg-zinc-50 border-black/40 hover:border-black'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-[#FF5F00]">
                    {task.done ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5 text-zinc-400" />
                    )}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-zinc-500">
                        Paso {idx + 1}
                      </span>
                      <span className="text-sm font-black text-black">
                        {task.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-white border border-black text-[10px] font-bold text-[#FF5F00]">
                        {task.minutes}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                      {task.desc}
                    </p>
                  </div>
                </div>

                {task.done && (
                  <span className="px-2 py-1 rounded-xl bg-[#FF5F00] text-black font-black text-xs shrink-0">
                    ¡Hecho!
                  </span>
                )}
              </div>
            ))}
          </div>

          {completedCount === warmupTasks.length && (
            <div className="p-4 rounded-2xl bg-[#FF5F00] text-black font-black text-center text-sm border-2 border-black shadow-[4px_4px_0px_#000000] animate-pulse">
              🎉 ¡Rutina completa! Tus dedos y tu arco están listos para brillar en el escenario.
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: CUIDADO Y RESINA */}
      {activeSection === 'care' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#FF5F00]">
            <h3 className="text-lg font-black text-black flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#FF5F00]" />
              <span>El Arte de la Resina (Colofonia)</span>
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed mb-4">
              La resina de pino es lo que permite que el pelo del arco agarre la cuerda metálica. Sin resina, el arco resbala en silencio como si fuera hielo:
            </p>

            <div className="space-y-3 text-xs text-zinc-700">
              <div className="p-3 rounded-2xl bg-zinc-50 border border-black/40">
                <strong className="text-black block mb-0.5">¿Cuántas pasadas poner?</strong>
                Solo de 3 a 5 pasadas suaves de talón a punta cada 2 o 3 días. Si tocas a diario, una pasada suave es suficiente.
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 border border-black/40">
                <strong className="text-black block mb-0.5">¿Cómo saber si te has pasado?</strong>
                Si sale una nube blanca de polvo sobre el violín o si el sonido raspa demasiado ("crujido"), te has pasado de resina.
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 border border-black/40">
                <strong className="text-black block mb-0.5">¡Cuidado con las caídas!</strong>
                La pastilla de resina es cristal de savia endurecida y se rompe como cristal si cae al suelo. Guarda siempre tu cajita cerrada en el bolsillo del estuche.
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#000000]">
            <h3 className="text-lg font-black text-black flex items-center gap-2 mb-2">
              <ShieldAlert className="w-5 h-5 text-[#FF5F00]" />
              <span>Las 4 Reglas Sagradas del Violín</span>
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed mb-4">
              Para que tu violín dure décadas con sonido brillante y dulce:
            </p>

            <div className="space-y-3 text-xs text-zinc-700">
              <div className="p-3 rounded-2xl bg-zinc-50 border border-black/40">
                <strong className="text-black block mb-0.5">1. Aflojar siempre el arco</strong>
                Gira el tornillo unas 3 vueltas hacia la izquierda antes de cerrar el estuche. Si se guarda tenso, la vara pierde su curvatura y se vuelve débil.
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 border border-black/40">
                <strong className="text-black block mb-0.5">2. El pañuelo de microfibra mágico</strong>
                Limpia siempre las cuerdas y la tapa de madera con un pañito suave y seco después de tocar. ¡Nunca uses agua ni productos de limpieza de muebles!
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 border border-black/40">
                <strong className="text-black block mb-0.5">3. Evita cambios bruscos de temperatura</strong>
                El violín está hecho de maderas vivas (arce y abeto). Nunca lo dejes cerca de un radiador, al sol o en el maletero de un coche en verano.
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 border border-black/40">
                <strong className="text-black block mb-0.5">4. Cierra bien las cremalleras del estuche</strong>
                Antes de levantar el estuche por el asa, ¡comprueba que la cremallera o el cierre están cerrados! Es la causa nº1 de accidentes en violinistas principiantes.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: TABLA DE CINTAS Y DEDOS */}
      {activeSection === 'fingers' && (
        <div className="p-6 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#FF5F00] flex flex-col gap-4">
          <div>
            <h3 className="text-xl font-black text-black">
              Guía de Cintas y Dedos (1ª Posición)
            </h3>
            <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
              En el violín las notas se descubren acortando la cuerda con los 4 dedos de la mano izquierda. Aquí tienes el mapa maestro de todas las notas en 1ª posición:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
            {/* String E */}
            <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-black shadow-[3px_3px_0px_#EC4899]">
              <div className="text-sm font-black text-pink-600 mb-2">
                1ª Cuerda: Mi (Aguda)
              </div>
              <ul className="text-xs text-zinc-700 space-y-1.5">
                <li>• <strong>0 (Al aire):</strong> Mi</li>
                <li>• <strong>1 (Cinta 1):</strong> Fa# (1 tono)</li>
                <li>• <strong>2 (Cinta 2 alta):</strong> Sol#</li>
                <li>• <strong>3 (Cinta 3):</strong> La (¡Pegado al 2!)</li>
                <li>• <strong>4 (Meñique):</strong> Si</li>
              </ul>
            </div>

            {/* String A */}
            <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-black shadow-[3px_3px_0px_#FF5F00]">
              <div className="text-sm font-black text-[#FF5F00] mb-2">
                2ª Cuerda: La (Referencia)
              </div>
              <ul className="text-xs text-zinc-700 space-y-1.5">
                <li>• <strong>0 (Al aire):</strong> La (440 Hz)</li>
                <li>• <strong>1 (Cinta 1):</strong> Si (1 tono)</li>
                <li>• <strong>2 (Cinta 2 alta):</strong> Do#</li>
                <li>• <strong>3 (Cinta 3):</strong> Re (¡Pegado al 2!)</li>
                <li>• <strong>4 (Meñique):</strong> Mi (Unísono de Mi0)</li>
              </ul>
            </div>

            {/* String D */}
            <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-black shadow-[3px_3px_0px_#3B82F6]">
              <div className="text-sm font-black text-blue-600 mb-2">
                3ª Cuerda: Re (Media)
              </div>
              <ul className="text-xs text-zinc-700 space-y-1.5">
                <li>• <strong>0 (Al aire):</strong> Re</li>
                <li>• <strong>1 (Cinta 1):</strong> Mi (1 tono)</li>
                <li>• <strong>2 (Cinta 2 alta):</strong> Fa#</li>
                <li>• <strong>3 (Cinta 3):</strong> Sol (¡Pegado al 2!)</li>
                <li>• <strong>4 (Meñique):</strong> La (Unísono de La0)</li>
              </ul>
            </div>

            {/* String G */}
            <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-black shadow-[3px_3px_0px_#10B981]">
              <div className="text-sm font-black text-emerald-600 mb-2">
                4ª Cuerda: Sol (Grave)
              </div>
              <ul className="text-xs text-zinc-700 space-y-1.5">
                <li>• <strong>0 (Al aire):</strong> Sol</li>
                <li>• <strong>1 (Cinta 1):</strong> La (1 tono)</li>
                <li>• <strong>2 (Cinta 2 alta):</strong> Si</li>
                <li>• <strong>3 (Cinta 3):</strong> Do (¡Pegado al 2!)</li>
                <li>• <strong>4 (Meñique):</strong> Re (Unísono de Re0)</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50 border-2 border-black text-xs text-zinc-800 mt-2">
            <strong className="text-black block mb-1">💡 El Secreto de los Dedos Amigos (Semitonos):</strong>
            En la tonalidad de La Mayor y Re Mayor (las primeras del método Suzuki), el <strong>dedo 2 y el dedo 3 van siempre pegaditos</strong> tocándose la piel. El dedo 1 va separado del dedo 2. ¡Recuérdalo siempre como "dedos 2 y 3 inseparables"!
          </div>
        </div>
      )}
    </div>
  );
};
