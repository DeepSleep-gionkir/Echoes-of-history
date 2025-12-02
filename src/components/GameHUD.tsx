import React from "react";
import { ResourceBar } from "./ResourceBar";
import { useGameStore } from "../store/useGameStore";
import { NewsTicker } from "./NewsTicker";
import { SidePanel } from "./SidePanel";

export const GameHUD: React.FC = () => {
  const { uiState, setUiState } = useGameStore();

  return (
    <>
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full z-10 pointer-events-none">
        <ResourceBar />
      </div>

      {/* Bottom Bar (News Ticker) */}
      <div className="absolute bottom-16 xl:bottom-0 left-0 w-full z-10 pointer-events-none">
        <NewsTicker />
      </div>

      {/* Mobile Bottom Navigation (< 1280px) */}
      <div className="xl:hidden absolute bottom-0 left-0 w-full h-16 bg-slate-900 border-t border-white/10 z-50 flex items-center justify-around pointer-events-auto">
        <button
          onClick={() => setUiState({ mobileTab: "map" })}
          className={`flex flex-col items-center gap-1 p-2 ${
            uiState.mobileTab === "map" ? "text-amber-400" : "text-stone-500"
          }`}
        >
          <span className="text-sm font-bold">지도</span>
        </button>
        <button
          onClick={() => setUiState({ mobileTab: "office" })}
          className={`flex flex-col items-center gap-1 p-2 ${
            uiState.mobileTab === "office" ? "text-amber-400" : "text-stone-500"
          }`}
        >
          <span className="text-sm font-bold">집무실</span>
        </button>
      </div>

      {/* Right Panel - Responsive */}
      <div
        className={`absolute right-0 top-0 h-full z-20 pointer-events-none flex justify-end pt-16 pb-20 xl:pb-8 transition-transform duration-300 ${
          // Desktop: Always visible. Mobile: Visible only if tab is office.
          "xl:translate-x-0 xl:w-auto w-full"
        } ${
          uiState.mobileTab === "office"
            ? "translate-x-0 bg-slate-950/95 pointer-events-auto"
            : "translate-x-full xl:pointer-events-none"
        }`}
      >
        <SidePanel />
      </div>
    </>
  );
};
