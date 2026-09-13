import React from 'react';
import { UserProgress } from '../types/violin';
import { VIOLIN_SKINS, BOW_STYLES, AVAILABLE_STICKERS } from '../data/shopData';
import { soundEngine } from '../services/soundEngine';
import { Sparkles, Plus, Trash2, ArrowLeft, ShoppingBag, HelpCircle } from 'lucide-react';

interface ViolinCaseCustomizerProps {
  progress: UserProgress;
  onUpdateProgress: (updated: Partial<UserProgress>) => void;
  onClose: () => void;
  onNavigateToShop?: () => void;
}

export const ViolinCaseCustomizer: React.FC<ViolinCaseCustomizerProps> = ({
  progress,
  onUpdateProgress,
  onClose,
  onNavigateToShop,
}) => {
  const activeSkin = VIOLIN_SKINS.find((s) => s.id === progress.activeSkinId) || VIOLIN_SKINS[0];
  const activeBow = BOW_STYLES.find((b) => b.id === progress.activeBowId) || BOW_STYLES[0];

  const unlockedStickerItems = AVAILABLE_STICKERS.filter((s) =>
    progress.unlockedStickers.includes(s.id)
  );

  const handleAddStickerToCase = (stickerId: string) => {
    const randomX = Math.floor(18 + Math.random() * 64);
    const randomY = Math.floor(22 + Math.random() * 54);
    const randomRot = Math.floor(-25 + Math.random() * 50);

    const newPlacement = {
      id: `${stickerId}-${Date.now()}`,
      stickerId,
      x: randomX,
      y: randomY,
      rotation: randomRot,
    };

    onUpdateProgress({
      placedStickers: [...(progress.placedStickers || []), newPlacement],
    });

    soundEngine.playRewardChime('small');
  };

  const handleRemoveSticker = (placementId: string) => {
    onUpdateProgress({
      placedStickers: (progress.placedStickers || []).filter((p) => p.id !== placementId),
    });
  };

  const handleClearStickers = () => {
    onUpdateProgress({ placedStickers: [] });
  };

  return (
    <div id="case-customizer-root" className="w-full max-w-4xl mx-auto p-3 sm:p-4 flex flex-col gap-4 select-none">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#FF5F00] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#FF5F00] uppercase tracking-wider">
              Mi Estuche Personal
            </span>
            <span className="font-manga text-[11px] text-black">「マイ・ケース」</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-black">
            Funda & Estuche de Violín
          </h2>
          <p className="text-xs text-zinc-600 font-medium mt-0.5">
            Aquí reposa tu violín <strong className="text-black">{activeSkin.name}</strong> y tu arco <strong className="text-black">{activeBow.name}</strong>. Decora la funda con tus pegatinas coleccionadas.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {onNavigateToShop && (
            <button
              onClick={onNavigateToShop}
              className="px-3.5 py-2 rounded-2xl bg-[#FF5F00] hover:bg-white text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center gap-1.5 transition-all active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Ir al Taller</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-2xl bg-white hover:bg-zinc-100 text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000000] transition-all"
          >
            Volver a Lecciones
          </button>
        </div>
      </div>

      {/* Quick Instruction Banner */}
      <div className="p-3.5 rounded-2xl bg-orange-50 border-2 border-black shadow-[2px_2px_0px_#000000] flex items-center justify-between text-xs text-zinc-800">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#FF5F00] shrink-0" />
          <span>
            <strong>¿Cómo personalizar?</strong> Pulsa sobre cualquier pegatina desbloqueada en la bandeja inferior para pegarla en el estuche. Pasa el cursor por encima para quitarla con la cruz (×).
          </span>
        </div>
      </div>

      {/* The Violin Case Visual Canvas */}
      <div
        id="violin-case-canvas"
        className="relative w-full h-[360px] rounded-3xl p-4 overflow-hidden border-3 border-black shadow-[6px_6px_0px_#000000] flex items-center justify-center bg-zinc-900"
      >
        {/* Soft Interior Lining of the Violin Case */}
        <div className="absolute inset-3 rounded-2xl bg-zinc-950 border-2 border-zinc-700 shadow-inner flex items-center justify-center">
          {/* Violin Outline resting inside plush case */}
          <div className="relative flex flex-col items-center opacity-95 pointer-events-none">
            {/* Scroll */}
            <div
              className="w-7 h-10 rounded-t-full border-2 border-black"
              style={{ backgroundColor: activeSkin.bodyColor }}
            />
            {/* Pegbox */}
            <div className="w-4 h-6 bg-black border-x border-zinc-600 flex justify-between px-0.5 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F00]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F00]" />
            </div>
            {/* Neck */}
            <div className="w-4 h-16 bg-black border-x border-zinc-600" />
            {/* Body */}
            <div
              className="w-36 h-48 rounded-3xl border-2 border-black flex flex-col items-center justify-center relative shadow-2xl"
              style={{
                backgroundColor: activeSkin.bodyColor,
              }}
            >
              {/* Purfling edge */}
              <div
                className="absolute inset-1.5 rounded-2xl border border-dashed opacity-40"
                style={{ borderColor: activeSkin.accentColor }}
              />

              {/* F-holes */}
              <div className="flex items-center justify-between w-24 text-zinc-400 font-serif italic text-lg select-none">
                <span>ƒ</span>
                {/* Bridge */}
                <div className="w-6 h-3 bg-amber-200 border border-black rounded-xs shadow-xs" />
                <span>ƒ</span>
              </div>

              {/* Tailpiece */}
              <div className="w-5 h-8 bg-black rounded-b-md border border-zinc-600 mt-2" />

              <div className="absolute bottom-2 text-[10px] font-black text-black bg-[#FF5F00] px-2 py-0.5 rounded-md border border-black shadow-xs">
                🎻 {activeSkin.name}
              </div>
            </div>
          </div>

          {/* Bow resting in case holder on top */}
          <div className="absolute top-4 left-8 right-8 h-5 flex flex-col justify-center opacity-90 pointer-events-none">
            <div className="text-[9px] font-black text-zinc-400 mb-0.5 text-center">
              Arco de concierto: {activeBow.name}
            </div>
            <div
              className="h-2 w-full rounded-full border border-black/40 shadow-xs"
              style={{ backgroundColor: activeBow.stickColor }}
            />
            <div
              className="h-1.5 w-4/5 mx-auto rounded-full opacity-90 mt-0.5"
              style={{ backgroundColor: activeBow.hairColor }}
            />
          </div>
        </div>

        {/* Placed Stickers on the Case */}
        {(progress.placedStickers || []).map((item) => {
          const stkData = AVAILABLE_STICKERS.find((s) => s.id === item.stickerId);
          if (!stkData) return null;

          return (
            <div
              key={item.id}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: `rotate(${item.rotation}deg)`,
              }}
              className="absolute z-20 group cursor-pointer select-none"
            >
              <div className="text-4xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] filter transition-transform hover:scale-125">
                {stkData.emoji}
              </div>
              <button
                onClick={() => handleRemoveSticker(item.id)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FF5F00] text-black border border-black text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-sm"
                title="Quitar pegatina"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {/* Case Controls & Sticker Tray */}
      <div className="p-5 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_#000000] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-black text-black flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF5F00]" />
            <span>Colección de Pegatinas ({unlockedStickerItems.length} desbloqueadas)</span>
          </div>

          {(progress.placedStickers || []).length > 0 && (
            <button
              onClick={handleClearStickers}
              className="text-[11px] text-zinc-600 hover:text-red-600 flex items-center gap-1 transition-colors font-bold px-2.5 py-1 rounded-lg border border-zinc-300 hover:border-red-500"
            >
              <Trash2 className="w-3 h-3" /> Limpiar estuche
            </button>
          )}
        </div>

        {unlockedStickerItems.length > 0 ? (
          <div className="flex flex-wrap gap-2.5 pt-1">
            {unlockedStickerItems.map((stk) => (
              <button
                key={stk.id}
                onClick={() => handleAddStickerToCase(stk.id)}
                className="px-3.5 py-2 rounded-2xl bg-white hover:bg-[#FF5F00] text-black text-xs font-black flex items-center gap-2 active:scale-95 transition-all border-2 border-black shadow-[2px_2px_0px_#000000]"
                title="Haz clic para pegarla en el estuche"
              >
                <span className="text-xl">{stk.emoji}</span>
                <span>{stk.name}</span>
                <Plus className="w-3.5 h-3.5 text-black" />
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-zinc-50 border border-dashed border-zinc-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
            <span>
              Aún no tienes pegatinas desbloqueadas. ¡Completa lecciones para ganar gemas y consíguelas en el taller!
            </span>
            {onNavigateToShop && (
              <button
                onClick={onNavigateToShop}
                className="px-3.5 py-1.5 rounded-xl bg-[#FF5F00] text-black font-black text-xs border border-black shadow-xs shrink-0"
              >
                Ir a Desbloquear en el Taller ➔
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
