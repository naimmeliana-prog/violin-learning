import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ViolinSkin, BowStyle, CaseSticker, UserProgress } from '../types/violin';
import { VIOLIN_SKINS, BOW_STYLES, AVAILABLE_STICKERS } from '../data/shopData';
import { soundEngine } from '../services/soundEngine';
import {
  Sparkles,
  Check,
  Lock,
  ShoppingBag,
  Palette,
  Wand2,
  Smile,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Music,
  Gamepad2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface RewardShopProps {
  progress: UserProgress;
  onUpdateProgress: (updated: Partial<UserProgress>) => void;
  onClose?: () => void;
  onNavigateToCase?: () => void;
}

export const RewardShop: React.FC<RewardShopProps> = ({
  progress,
  onUpdateProgress,
  onClose,
  onNavigateToCase,
}) => {
  const [activeTab, setActiveTab] = useState<'skins' | 'bows' | 'stickers' | 'guide'>('skins');
  const [isGuideExpanded, setIsGuideExpanded] = useState<boolean>(true);

  const activeSkin = VIOLIN_SKINS.find((s) => s.id === progress.activeSkinId) || VIOLIN_SKINS[0];
  const activeBow = BOW_STYLES.find((b) => b.id === progress.activeBowId) || BOW_STYLES[0];

  const handleBuySkin = (skin: ViolinSkin) => {
    if (progress.gems < skin.gemCost) {
      soundEngine.playRhythmClick('miss');
      return;
    }

    const newGems = progress.gems - skin.gemCost;
    const newUnlocked = [...progress.unlockedSkins, skin.id];

    onUpdateProgress({
      gems: newGems,
      unlockedSkins: newUnlocked,
      activeSkinId: skin.id,
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    soundEngine.playRewardChime('major');
  };

  const handleSelectSkin = (skinId: string) => {
    onUpdateProgress({ activeSkinId: skinId });
    soundEngine.playRewardChime('small');
  };

  const handleBuyBow = (bow: BowStyle) => {
    if (progress.gems < bow.gemCost) {
      soundEngine.playRhythmClick('miss');
      return;
    }

    const newGems = progress.gems - bow.gemCost;
    const newUnlocked = [...progress.unlockedBows, bow.id];

    onUpdateProgress({
      gems: newGems,
      unlockedBows: newUnlocked,
      activeBowId: bow.id,
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    soundEngine.playRewardChime('major');
  };

  const handleSelectBow = (bowId: string) => {
    onUpdateProgress({ activeBowId: bowId });
    soundEngine.playRewardChime('small');
  };

  const handleBuySticker = (stickerId: string, cost: number) => {
    if (progress.gems < cost) {
      soundEngine.playRhythmClick('miss');
      return;
    }

    const newGems = progress.gems - cost;
    const newUnlocked = [...progress.unlockedStickers, stickerId];

    onUpdateProgress({
      gems: newGems,
      unlockedStickers: newUnlocked,
    });

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
    });
    soundEngine.playRewardChime('small');
  };

  return (
    <div id="reward-shop-root" className="w-full max-w-4xl mx-auto p-3 sm:p-4 flex flex-col gap-5 select-none">
      {/* Top Banner with Gem & Star Balance in Blanco, Negro y Naranja Pantone 165 C */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#FF5F00] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5F00] border-2 border-black flex items-center justify-center text-black font-black shadow-[3px_3px_0px_#000000] shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#FF5F00] uppercase tracking-wider">
                Luthier & Colección
              </span>
              <span className="font-manga text-[11px] text-black">「工房・ショップ＆報酬」</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-black">
              Taller de Recompensas
            </h2>
            <p className="text-xs text-zinc-600 font-medium mt-0.5">
              Canjea las gemas que ganas tocando por barnices, arcos de concierto y pegatinas exclusivas.
            </p>
          </div>
        </div>

        {/* Currency & Actions */}
        <div className="flex items-center gap-3 self-end md:self-center">
          <div
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white border-2 border-black text-[#FF5F00] font-black text-sm shadow-[3px_3px_0px_#000000]"
            title="Tus gemas acumuladas"
          >
            <span>💎 {progress.gems}</span>
            <span className="text-[10px] text-zinc-500 font-medium">Gemas</span>
          </div>

          <div
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white border-2 border-black text-black font-black text-sm shadow-[3px_3px_0px_#000000]"
            title="Tus estrellas de maestría"
          >
            <span>⭐ {progress.stars}</span>
            <span className="text-[10px] text-zinc-500 font-medium">Estrellas</span>
          </div>
        </div>
      </div>

      {/* EXPLANATORY SYSTEM GUIDE: "¿Cómo funciona el Taller y Recompensas?" */}
      <div className="p-5 rounded-3xl bg-zinc-50 border-2 border-black shadow-[4px_4px_0px_#000000] flex flex-col gap-3">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsGuideExpanded(!isGuideExpanded)}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#FF5F00] text-black font-black text-xs flex items-center justify-center border border-black shadow-xs">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-black flex items-center gap-1.5">
                ¿Cómo funciona el Taller y Recompensas?
                <span className="text-[10px] text-[#FF5F00] font-bold">(Guía Rápida en 3 Pasos)</span>
              </h3>
              <p className="text-[11px] text-zinc-600 font-medium">
                Aprende cómo ganar gemas, desbloquear objetos y personalizar tu violín.
              </p>
            </div>
          </div>

          <button
            className="p-1.5 rounded-xl bg-white border border-black text-black hover:bg-zinc-200 transition-colors"
            title={isGuideExpanded ? 'Plegar guía' : 'Desplegar guía'}
          >
            {isGuideExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {isGuideExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-zinc-200 animate-in fade-in duration-200">
            {/* Step 1 */}
            <div className="p-3.5 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_#000000] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#FF5F00] text-black border border-black">
                    Paso 1
                  </span>
                  <span className="text-base">💎</span>
                </div>
                <h4 className="text-xs font-black text-black">1. Gana Gemas Tocando</h4>
                <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed">
                  Consigues gemas de tres formas:
                </p>
                <ul className="text-[10px] text-zinc-700 mt-1 space-y-1 font-medium">
                  <li>• <strong>Lecciones:</strong> +15 a +20 💎 por lección terminada.</li>
                  <li>• <strong>Mini-Juegos:</strong> +5 a +15 💎 por partida afinada.</li>
                  <li>• <strong>Postura Diaria:</strong> +30 💎 por revisar tu agarre.</li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_#000000] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#FF5F00] text-black border border-black">
                    Paso 2
                  </span>
                  <span className="text-base">🔓</span>
                </div>
                <h4 className="text-xs font-black text-black">2. Desbloquea en el Taller</h4>
                <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed">
                  Explora las pestañas de abajo y pulsa el botón naranja <strong>«Desbloquear por X 💎»</strong>.
                </p>
                <p className="text-[10px] text-zinc-500 mt-1.5 font-medium">
                  💡 Una vez desbloqueado, el artículo es <strong>tuyo para siempre</strong>. No tienes que volver a pagar por él.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_#000000] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#FF5F00] text-black border border-black">
                    Paso 3
                  </span>
                  <span className="text-base">🎻</span>
                </div>
                <h4 className="text-xs font-black text-black">3. Equipa y Disfruta</h4>
                <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed">
                  Pulsa <strong>«Equipar»</strong> para cambiar tu violín o arco al instante.
                </p>
                <div className="mt-2 pt-2 border-t border-zinc-200">
                  <p className="text-[10px] text-zinc-700 font-bold">
                    ¿Y las pegatinas?
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    Se pegan y colocan en la pestaña <strong>«Estuche»</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LIVE PREVIEW CARD: "Tu Equipamiento Actual" */}
      <div className="p-4 rounded-3xl bg-white border-2 border-black shadow-[3px_3px_0px_#FF5F00] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Violin color chip */}
          <div
            className="w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center text-xl shrink-0 shadow-[2px_2px_0px_#000000]"
            style={{ backgroundColor: activeSkin.bodyColor }}
          >
            🎻
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#FF5F00] uppercase tracking-wider">
              En Uso Actualmente
            </span>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-black">
                Violín: {activeSkin.name}
              </h3>
              <span className="text-xs text-zinc-500">•</span>
              <span className="text-xs text-zinc-700 font-bold">
                Arco: {activeBow.name}
              </span>
            </div>
            <p className="text-[11px] text-zinc-600">
              Acabado {activeSkin.colorName}. Visible en Práctica Libre, Lecciones y Diapasón.
            </p>
          </div>
        </div>

        {/* Quick jump to case button */}
        {onNavigateToCase && (
          <button
            onClick={onNavigateToCase}
            className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-zinc-100 hover:bg-[#FF5F00] text-black font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center gap-1.5 transition-all shrink-0 active:scale-98"
          >
            <span>🎨 Ver / Decorar Mi Estuche</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* SHOP CATEGORY TABS */}
      <div className="flex items-center gap-2 bg-zinc-100 p-1.5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000000]">
        <button
          id="shop-tab-skins"
          onClick={() => setActiveTab('skins')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 border-2 ${
            activeTab === 'skins'
              ? 'bg-[#FF5F00] text-black border-black shadow-[2px_2px_0px_#000000]'
              : 'bg-white text-zinc-700 border-transparent hover:text-black hover:border-black'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Violines & Barnices ({VIOLIN_SKINS.length})</span>
        </button>

        <button
          id="shop-tab-bows"
          onClick={() => setActiveTab('bows')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 border-2 ${
            activeTab === 'bows'
              ? 'bg-[#FF5F00] text-black border-black shadow-[2px_2px_0px_#000000]'
              : 'bg-white text-zinc-700 border-transparent hover:text-black hover:border-black'
          }`}
        >
          <Wand2 className="w-4 h-4" />
          <span>Arcos Artesanales ({BOW_STYLES.length})</span>
        </button>

        <button
          id="shop-tab-stickers"
          onClick={() => setActiveTab('stickers')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 border-2 ${
            activeTab === 'stickers'
              ? 'bg-[#FF5F00] text-black border-black shadow-[2px_2px_0px_#000000]'
              : 'bg-white text-zinc-700 border-transparent hover:text-black hover:border-black'
          }`}
        >
          <Smile className="w-4 h-4" />
          <span>Pegatinas de Estuche ({AVAILABLE_STICKERS.length})</span>
        </button>
      </div>

      {/* TAB 1: VIOLIN SKINS */}
      {activeTab === 'skins' && (
        <div className="flex flex-col gap-3">
          <div className="p-3 rounded-2xl bg-white border-2 border-black flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-700">
              Elige el barniz y personalidad de tu violín. Al pulsar <strong>«Equipar»</strong> cambiará tu instrumento en todas las lecciones y prácticas.
            </span>
            <span className="text-[11px] font-black text-[#FF5F00] shrink-0 ml-2">
              {progress.unlockedSkins.length} de {VIOLIN_SKINS.length} Desbloqueados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VIOLIN_SKINS.map((skin) => {
              const isUnlocked = progress.unlockedSkins.includes(skin.id);
              const isEquipped = progress.activeSkinId === skin.id;
              const canAfford = progress.gems >= skin.gemCost;

              return (
                <div
                  key={skin.id}
                  className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                    isEquipped
                      ? 'bg-white border-[#FF5F00] shadow-[4px_4px_0px_#FF5F00] ring-2 ring-black'
                      : isUnlocked
                      ? 'bg-white border-black shadow-[3px_3px_0px_#000000]'
                      : 'bg-zinc-50 border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg bg-black text-[#FF5F00]">
                        {skin.tag}
                      </span>
                      {isEquipped ? (
                        <span className="text-[11px] font-black text-black bg-[#FF5F00] px-2.5 py-0.5 rounded-xl border border-black flex items-center gap-1 shadow-xs">
                          <Check className="w-3.5 h-3.5" /> Equipado
                        </span>
                      ) : isUnlocked ? (
                        <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-lg border border-zinc-300">
                          Desbloqueado
                        </span>
                      ) : (
                        <span className="text-[11px] font-black text-zinc-600 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> {skin.gemCost} 💎
                        </span>
                      )}
                    </div>

                    {/* Visual Color Preview Orb */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center text-xl shrink-0 shadow-[2px_2px_0px_#000000]"
                        style={{
                          backgroundColor: skin.bodyColor,
                          borderColor: skin.accentColor,
                        }}
                      >
                        🎻
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-black">{skin.name}</h3>
                        <p className="text-xs text-[#FF5F00] font-bold">{skin.colorName}</p>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-600 leading-relaxed mb-4 font-medium">
                      {skin.description}
                    </p>
                  </div>

                  {/* Action button */}
                  <div>
                    {isEquipped ? (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl bg-zinc-100 border-2 border-black text-black text-xs font-black cursor-default flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5F00]" />
                        <span>En Uso Actualmente</span>
                      </button>
                    ) : isUnlocked ? (
                      <button
                        id={`equip-skin-${skin.id}`}
                        onClick={() => handleSelectSkin(skin.id)}
                        className="w-full py-2.5 rounded-xl bg-white hover:bg-[#FF5F00] text-black text-xs font-black border-2 border-black transition-all shadow-[2px_2px_0px_#000000] active:scale-98"
                      >
                        Equipar Este Violín ➔
                      </button>
                    ) : (
                      <button
                        id={`buy-skin-${skin.id}`}
                        onClick={() => handleBuySkin(skin)}
                        disabled={!canAfford}
                        className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 border-2 ${
                          canAfford
                            ? 'bg-[#FF5F00] text-black border-black shadow-[3px_3px_0px_#000000] hover:bg-white active:scale-98'
                            : 'bg-zinc-200 text-zinc-500 border-zinc-300 cursor-not-allowed'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>
                          {canAfford
                            ? `Desbloquear por ${skin.gemCost} 💎`
                            : `Te faltan ${skin.gemCost - progress.gems} 💎`}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: BOW STYLES */}
      {activeTab === 'bows' && (
        <div className="flex flex-col gap-3">
          <div className="p-3 rounded-2xl bg-white border-2 border-black flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-700">
              Elige el arco con el que frotas las cuerdas. Cambia la madera de la vara y el tono de las cerdas de crin.
            </span>
            <span className="text-[11px] font-black text-[#FF5F00] shrink-0 ml-2">
              {progress.unlockedBows.length} de {BOW_STYLES.length} Desbloqueados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BOW_STYLES.map((bow) => {
              const isUnlocked = progress.unlockedBows.includes(bow.id);
              const isEquipped = progress.activeBowId === bow.id;
              const canAfford = progress.gems >= bow.gemCost;

              return (
                <div
                  key={bow.id}
                  className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                    isEquipped
                      ? 'bg-white border-[#FF5F00] shadow-[4px_4px_0px_#FF5F00] ring-2 ring-black'
                      : isUnlocked
                      ? 'bg-white border-black shadow-[3px_3px_0px_#000000]'
                      : 'bg-zinc-50 border-zinc-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-black text-black">{bow.name}</h3>
                      {isEquipped ? (
                        <span className="text-[11px] font-black text-black bg-[#FF5F00] px-2.5 py-0.5 rounded-xl border border-black flex items-center gap-1 shadow-xs">
                          <Check className="w-3.5 h-3.5" /> En uso
                        </span>
                      ) : isUnlocked ? (
                        <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-lg border border-zinc-300">
                          Desbloqueado
                        </span>
                      ) : (
                        <span className="text-[11px] font-black text-zinc-600 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> {bow.gemCost} 💎
                        </span>
                      )}
                    </div>

                    {/* Bow Stick visual representation */}
                    <div className="relative w-full h-10 bg-zinc-100 rounded-xl p-2.5 flex flex-col justify-center gap-1 mb-4 border border-zinc-300">
                      <div className="flex items-center justify-between text-[9px] text-zinc-500 font-bold mb-0.5">
                        <span>Vara de madera</span>
                        <span>Cerdas de crin</span>
                      </div>
                      <div
                        className="w-full h-2 rounded-full border border-black/20"
                        style={{ backgroundColor: bow.stickColor }}
                      />
                      <div
                        className="w-full h-1.5 rounded-full opacity-90 border border-black/20"
                        style={{ backgroundColor: bow.hairColor }}
                      />
                    </div>
                  </div>

                  <div>
                    {isEquipped ? (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl bg-zinc-100 border-2 border-black text-black text-xs font-black cursor-default flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5F00]" />
                        <span>Arco Activo</span>
                      </button>
                    ) : isUnlocked ? (
                      <button
                        id={`equip-bow-${bow.id}`}
                        onClick={() => handleSelectBow(bow.id)}
                        className="w-full py-2.5 rounded-xl bg-white hover:bg-[#FF5F00] text-black text-xs font-black border-2 border-black transition-all shadow-[2px_2px_0px_#000000] active:scale-98"
                      >
                        Equipar Este Arco ➔
                      </button>
                    ) : (
                      <button
                        id={`buy-bow-${bow.id}`}
                        onClick={() => handleBuyBow(bow)}
                        disabled={!canAfford}
                        className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 border-2 ${
                          canAfford
                            ? 'bg-[#FF5F00] text-black border-black shadow-[3px_3px_0px_#000000] hover:bg-white active:scale-98'
                            : 'bg-zinc-200 text-zinc-500 border-zinc-300 cursor-not-allowed'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>
                          {canAfford
                            ? `Desbloquear por ${bow.gemCost} 💎`
                            : `Te faltan ${bow.gemCost - progress.gems} 💎`}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: STICKERS FOR CASE */}
      {activeTab === 'stickers' && (
        <div className="flex flex-col gap-4">
          {/* Direct call to action banner for case */}
          <div className="p-4 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#FF5F00] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-black text-black flex items-center gap-2">
                <span>🎒 ¿Dónde se colocan estas pegatinas?</span>
              </h4>
              <p className="text-xs text-zinc-600 mt-0.5">
                Las pegatinas que compras aquí se usan para personalizar la funda de tu violín en la pestaña <strong>«Estuche»</strong>.
              </p>
            </div>

            {onNavigateToCase && (
              <button
                onClick={onNavigateToCase}
                className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-[#FF5F00] hover:bg-white text-black font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center justify-center gap-1.5 transition-all shrink-0 active:scale-98"
              >
                <span>Ir a Decorar Mi Estuche ➔</span>
              </button>
            )}
          </div>

          {/* Stickers Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {AVAILABLE_STICKERS.map((stk) => {
              const isUnlocked = progress.unlockedStickers.includes(stk.id);
              const canAfford = progress.gems >= stk.gemCost;

              return (
                <div
                  key={stk.id}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center text-center justify-between gap-2.5 transition-all ${
                    isUnlocked
                      ? 'bg-white border-black shadow-[3px_3px_0px_#FF5F00]'
                      : 'bg-zinc-50 border-zinc-300 opacity-80'
                  }`}
                >
                  <div className="text-3xl py-1 transform hover:scale-125 transition-transform select-none">
                    {stk.emoji}
                  </div>
                  <div className="text-[11px] font-black text-black leading-tight">
                    {stk.name}
                  </div>

                  {isUnlocked ? (
                    <span className="text-[10px] font-black text-black bg-[#FF5F00] px-2 py-0.5 rounded-lg border border-black flex items-center gap-0.5 shadow-xs">
                      <Check className="w-3 h-3" /> Desbloqueada
                    </span>
                  ) : (
                    <button
                      id={`buy-sticker-${stk.id}`}
                      onClick={() => handleBuySticker(stk.id, stk.gemCost)}
                      disabled={!canAfford}
                      className={`w-full py-1.5 px-2 rounded-xl text-[10px] font-black border-2 transition-all ${
                        canAfford
                          ? 'bg-[#FF5F00] text-black border-black shadow-xs hover:bg-white'
                          : 'bg-zinc-200 text-zinc-500 border-zinc-300 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? `${stk.gemCost} 💎` : `Faltan ${stk.gemCost - progress.gems} 💎`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
