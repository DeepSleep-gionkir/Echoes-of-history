import React from "react";
import { useGameStore } from "../store/useGameStore";
import {
  GameEngine,
  ACTION_DEFINITIONS,
  BUILDING_DEFINITIONS,
} from "../logic/GameEngine";
import {
  Activity,
  Users,
  Hammer,
  ArrowLeft,
  Gift,
  TrendingUp,
  Sword,
  Gavel,
  BookOpen,
  Scroll,
  Send,
} from "lucide-react";

export const SidePanel: React.FC = () => {
  const { resources, factions, setPendingProposal, uiState, setUiState } =
    useGameStore();
  const { sidePanelTab: activeTab, showConstruction } = uiState;

  // Helper to create proposal
  const handleActionClick = (actionType: string) => {
    if (actionType === "construct") {
      setUiState({ showConstruction: true });
      return;
    }

    const currentState = { resources, factions, turn: 0, buildings: [] };
    const proposal = GameEngine.createProposal(actionType, currentState);
    setPendingProposal(proposal);
  };

  const handleBuildingClick = (buildingId: string) => {
    const currentState = { resources, factions, turn: 0, buildings: [] };
    const proposal = GameEngine.createProposal(
      "construct",
      currentState,
      buildingId
    );
    setPendingProposal(proposal);
    setUiState({ showConstruction: false });
  };

  const handleEntityAction = (actionType: string, entityId: string) => {
    const currentState = { resources, factions, turn: 0, buildings: [] };
    const proposal = GameEngine.createProposal(
      actionType,
      currentState,
      undefined,
      entityId
    );
    setPendingProposal(proposal);
  };

  const getActionIcon = (key: string) => {
    switch (key) {
      case "conscript":
        return <Sword size={24} className="text-rose-400" />;
      case "construct":
        return <Hammer size={24} className="text-amber-400" />;
      case "research":
        return <BookOpen size={24} className="text-blue-400" />;
      case "decree":
        return <Scroll size={24} className="text-purple-400" />;
      default:
        return <Activity size={24} />;
    }
  };

  return (
    <div className="h-full w-full md:w-96 glass-panel flex flex-col pointer-events-auto border-l border-white/10 bg-slate-900/90 backdrop-blur-xl">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          className={`flex-1 p-4 flex items-center justify-center gap-2 transition-colors ${
            activeTab === "actions"
              ? "bg-white/5 text-amber-400 border-b-2 border-amber-400"
              : "text-stone-400 hover:bg-white/5 hover:text-stone-200"
          }`}
          onClick={() => {
            setUiState({ sidePanelTab: "actions", showConstruction: false });
          }}
        >
          <Gavel size={18} />
          <span className="font-serif font-bold">집무실</span>
        </button>
        <button
          className={`flex-1 p-4 flex items-center justify-center gap-2 transition-colors ${
            activeTab === "council"
              ? "bg-white/5 text-amber-400 border-b-2 border-amber-400"
              : "text-stone-400 hover:bg-white/5 hover:text-stone-200"
          }`}
          onClick={() => {
            setUiState({ sidePanelTab: "council", showConstruction: false });
          }}
        >
          <Users size={18} />
          <span className="font-serif font-bold">알현실</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {activeTab === "actions" ? (
          <>
            {showConstruction ? (
              <div className="flex flex-col gap-4 animate-fade-in">
                <button
                  onClick={() => setUiState({ showConstruction: false })}
                  className="text-left text-sm text-stone-400 hover:text-white mb-2 flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft size={14} /> 돌아가기
                </button>
                <h3 className="font-serif font-bold text-amber-400 flex items-center gap-2 text-xl">
                  <Hammer size={20} />
                  건설
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(BUILDING_DEFINITIONS).map(([key, def]) => (
                    <button
                      key={key}
                      onClick={() => handleBuildingClick(key)}
                      className="p-3 bg-white/5 rounded-lg hover:bg-white/10 border border-white/5 flex justify-between items-center transition-all active:scale-95"
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-bold text-stone-200">
                          {def.name}
                        </span>
                        <span className="text-xs text-emerald-400">
                          {Object.entries(def.income)
                            .map(([k, v]) => `+${v} ${k}`)
                            .join(", ")}
                        </span>
                      </div>
                      <span className="text-xs text-stone-500">
                        {Object.entries(def.cost)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 animate-fade-in">
                {Object.keys(ACTION_DEFINITIONS)
                  .filter((k) => !["donate", "invest", "suppress"].includes(k))
                  .map((key) => (
                    <button
                      key={key}
                      onClick={() => handleActionClick(key)}
                      className="p-4 bg-white/5 rounded-xl hover:bg-white/10 border border-white/5 flex flex-col items-center gap-3 transition-all hover:-translate-y-1 shadow-lg"
                    >
                      <div className="p-3 bg-slate-950 rounded-full shadow-inner">
                        {getActionIcon(key)}
                      </div>
                      <span className="font-bold text-stone-200">
                        {ACTION_DEFINITIONS[key].title}
                      </span>
                      <span className="text-xs text-stone-500">
                        {Object.entries(ACTION_DEFINITIONS[key].baseCost)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")}
                      </span>
                    </button>
                  ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* Faction Cards */}
            {factions.map((f) => (
              <div
                key={f.id}
                className="bg-white/5 p-4 rounded-xl border-l-4 border-blue-500 flex flex-col gap-3 shadow-md"
              >
                <div className="flex justify-between items-center">
                  <span className="font-serif font-bold text-lg text-stone-200">
                    {f.name}
                  </span>
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-sm font-bold ${
                        f.loyalty < 30 ? "text-rose-400" : "text-emerald-400"
                      }`}
                    >
                      충성도: {f.loyalty}
                    </span>
                    <span className="text-xs text-stone-500">
                      세력: {f.power}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-stone-500 flex gap-1">
                  {f.tags.map((t) => (
                    <span key={t} className="px-1.5 py-0.5 bg-black/30 rounded">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Interaction Buttons */}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <button
                    onClick={() => handleEntityAction("donate", f.id)}
                    className="px-2 py-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg border border-white/5 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Gift size={14} className="text-emerald-400" /> 기부
                  </button>
                  <button
                    onClick={() => handleEntityAction("invest", f.id)}
                    className="px-2 py-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg border border-white/5 flex items-center justify-center gap-1 transition-colors"
                  >
                    <TrendingUp size={14} className="text-blue-400" /> 투자
                  </button>
                  <button
                    onClick={() => handleEntityAction("suppress", f.id)}
                    className="px-2 py-2 bg-rose-950/30 hover:bg-rose-900/50 text-xs rounded-lg border border-rose-900/50 text-rose-200 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Sword size={14} /> 탄압
                  </button>
                </div>
              </div>
            ))}

            {/* Chat Input Placeholder */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="relative">
                <input
                  type="text"
                  placeholder="사절에게 지시를 내리세요..."
                  className="w-full bg-slate-950/50 border border-white/10 rounded-lg py-3 px-4 text-sm text-stone-200 focus:outline-none focus:border-amber-400/50 transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-stone-400 hover:text-amber-400 transition-colors">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
