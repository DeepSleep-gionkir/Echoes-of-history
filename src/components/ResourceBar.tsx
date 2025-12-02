import React from "react";
import { useGameStore } from "../store/useGameStore";
import { BUILDING_DEFINITIONS } from "../logic/GameEngine";
import {
  Coins,
  Wheat,
  Hammer,
  Users,
  Scroll,
  Crown,
  Settings,
  Flag,
} from "lucide-react";

const resourceIcons: Record<string, React.ReactNode> = {
  gold: <Coins size={16} className="text-amber-400" />,
  food: <Wheat size={16} className="text-emerald-400" />,
  mat: <Hammer size={16} className="text-stone-400" />,
  man: <Users size={16} className="text-blue-400" />,
  know: <Scroll size={16} className="text-purple-400" />,
  auth: <Crown size={16} className="text-rose-500" />,
};

export const ResourceBar: React.FC = () => {
  const { resources, buildings, turn } = useGameStore();

  // Calculate Income Rates
  const getIncome = (resKey: string) => {
    let income = 0;
    if (resKey === "gold") income += 10;
    if (resKey === "food") income += 10 - 5; // Base +10, Consumption -5

    buildings.forEach((bId) => {
      const def = BUILDING_DEFINITIONS[bId];
      if (def && def.income[resKey as keyof typeof def.income]) {
        income += def.income[resKey as keyof typeof def.income] || 0;
      }
    });
    return income;
  };

  return (
    <div className="w-full h-14 xl:h-16 glass-panel flex items-center justify-between px-4 z-50 pointer-events-auto">
      {/* Left: Nation Info */}
      <div className="flex items-center gap-3 min-w-fit">
        <div className="w-8 h-8 xl:w-10 xl:h-10 bg-slate-700 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
          <Flag size={18} className="text-stone-300" />
        </div>
        <div className="hidden xl:flex flex-col">
          <span className="text-sm font-bold text-stone-100 leading-tight">
            제국
          </span>
          <span className="text-xs text-amber-400 font-serif">권위: 보통</span>
        </div>
      </div>

      {/* Center: Resources (Scrollable on Mobile) */}
      <div className="flex-1 mx-2 xl:mx-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3 xl:gap-8 min-w-max px-2">
          {Object.entries(resources).map(([key, value]) => {
            const income = getIncome(key);
            return (
              <div
                key={key}
                className="flex items-center gap-1.5 xl:gap-2 group cursor-help"
              >
                <div className="p-1 xl:p-1.5 bg-slate-900/50 rounded-md ring-1 ring-white/5 group-hover:ring-white/20 transition-all">
                  {resourceIcons[key]}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs xl:text-sm font-bold text-stone-100 font-mono leading-none">
                    {value.toLocaleString()}
                  </span>
                  {/* Hide income on very small screens unless expanded/hovered, or just keep it small */}
                  <span
                    className={`text-[9px] xl:text-[10px] font-mono ${
                      income >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {income >= 0 ? "+" : ""}
                    {income}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Turn & Settings */}
      <div className="flex items-center gap-4 min-w-fit pl-4 border-l border-white/10">
        <div className="flex flex-col items-end">
          <span className="text-xs text-stone-400 uppercase tracking-wider">
            서기
          </span>
          <span className="text-lg font-serif font-bold text-stone-100 leading-none">
            {1024 + turn}년
          </span>
        </div>

        <button
          onClick={() => console.log("Settings clicked")}
          className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95"
          title="설정"
        >
          <Settings size={20} className="text-stone-400" />
        </button>
      </div>
    </div>
  );
};
