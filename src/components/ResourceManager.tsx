import React from "react";
import { useGameStore } from "../store/useGameStore";
import { BUILDING_DEFINITIONS } from "../logic/GameEngine";
import { Coins, Wheat, Hammer, Users, Scroll, Crown } from "lucide-react";

const resourceIcons: Record<string, React.ReactNode> = {
  gold: <Coins size={20} className="text-yellow-400" />,
  food: <Wheat size={20} className="text-orange-400" />,
  mat: <Hammer size={20} className="text-stone-400" />,
  man: <Users size={20} className="text-blue-400" />,
  know: <Scroll size={20} className="text-purple-400" />,
  auth: <Crown size={20} className="text-red-500" />,
};

export const ResourceManager: React.FC = () => {
  const { resources, buildings, turn, nextTurn } = useGameStore();

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
    <div className="flex flex-col gap-2 pointer-events-auto">
      <div className="flex gap-4 bg-black/50 p-2 rounded-lg backdrop-blur-md">
        {Object.entries(resources).map(([key, value]) => {
          const income = getIncome(key);
          return (
            <div key={key} className="flex items-center gap-2 text-white">
              <span>{resourceIcons[key]}</span>
              <div className="flex flex-col">
                <span className="font-mono font-bold">{value}</span>
                <span
                  className={`text-[10px] ${
                    income >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {income >= 0 ? "+" : ""}
                  {income}/t
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center bg-black/50 p-2 rounded-lg backdrop-blur-md text-white">
        <span className="font-bold">Turn {turn}</span>
        <button
          onClick={nextTurn}
          className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-xs font-bold uppercase"
        >
          Next Turn
        </button>
      </div>
    </div>
  );
};
