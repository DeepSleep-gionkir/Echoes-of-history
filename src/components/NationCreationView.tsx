import React, { useState } from "react";
import { useGameStore } from "../store/useGameStore";
import { Crown, ArrowRight } from "lucide-react";

interface NationCreationViewProps {
  onComplete: () => void;
}

export const NationCreationView: React.FC<NationCreationViewProps> = ({
  onComplete,
}) => {
  const [kingdomName, setKingdomName] = useState("");
  const { updateResources } = useGameStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kingdomName.trim()) return;

    // TODO: Save kingdom name to DB (requires DB schema update or metadata field)
    // For now, we just proceed and maybe give some bonus resources
    updateResources({ gold: 1000 }); // Bonus for new players

    onComplete();
  };

  return (
    <div className="relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950 opacity-80" />

      <div className="relative z-10 max-w-md w-full p-8 glass-panel rounded-xl animate-fade-in">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="p-4 bg-amber-500/10 rounded-full border border-amber-500/20">
            <Crown size={48} className="text-amber-400" />
          </div>

          <h2 className="text-3xl font-serif font-bold text-stone-100">
            새로운 시대의 시작
          </h2>

          <p className="text-stone-400">
            위대한 지도자여, 당신이 이끌 제국의 이름을 정해주십시오.
            <br />
            역사는 당신의 선택을 기억할 것입니다.
          </p>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-4 mt-4"
          >
            <div className="flex flex-col gap-2 text-left">
              <label
                htmlFor="kingdomName"
                className="text-xs font-bold text-stone-500 uppercase tracking-wider"
              >
                제국 이름
              </label>
              <input
                id="kingdomName"
                type="text"
                value={kingdomName}
                onChange={(e) => setKingdomName(e.target.value)}
                placeholder="예: 고구려, 로마, 신라..."
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500/50 transition-colors font-serif text-lg"
                autoFocus
                maxLength={20}
              />
            </div>

            <button
              type="submit"
              disabled={!kingdomName.trim()}
              className="mt-4 w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
            >
              <span>건국 선포</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
