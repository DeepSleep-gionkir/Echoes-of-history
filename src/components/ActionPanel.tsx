import React, { useState } from "react";
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
} from "lucide-react";

export const ActionPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"actions" | "council">("actions");
  const [showConstruction, setShowConstruction] = useState(false);
  const { resources, factions, setPendingProposal } = useGameStore();

  // Helper to create proposal
  const handleActionClick = (actionType: string) => {
    if (actionType === "construct") {
      setShowConstruction(true);
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
    setShowConstruction(false);
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
        return <Sword size={24} className="text-red-400" />;
      case "construct":
        return <Hammer size={24} className="text-yellow-400" />;
      case "research":
        return <BookOpen size={24} className="text-blue-400" />;
      case "decree":
        return <Scroll size={24} className="text-purple-400" />;
      default:
        return <Activity size={24} />;
    }
  };

  return (
    <div className="h-full bg-slate-900/90 text-white flex flex-col pointer-events-auto md:w-96 w-full border-l border-slate-700">
      <div className="flex border-b border-slate-700">
        <button
          className={`flex-1 p-4 flex items-center justify-center gap-2 ${
            activeTab === "actions"
              ? "bg-slate-800 text-yellow-400"
              : "hover:bg-slate-800"
          }`}
          onClick={() => {
            setActiveTab("actions");
            setShowConstruction(false);
          }}
        >
          <Gavel size={18} />
          국정 (Actions)
        </button>
        <button
          className={`flex-1 p-4 flex items-center justify-center gap-2 ${
            activeTab === "council"
              ? "bg-slate-800 text-yellow-400"
              : "hover:bg-slate-800"
          }`}
          onClick={() => {
            setActiveTab("council");
            setShowConstruction(false);
          }}
        >
          <Users size={18} />
          회의 (Council)
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === "actions" ? (
          <>
            {showConstruction ? (
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setShowConstruction(false)}
                  className="text-left text-sm text-gray-400 hover:text-white mb-2 flex items-center gap-1"
                >
                  <ArrowLeft size={14} /> Back to Actions
                </button>
                <h3 className="font-bold text-yellow-400 flex items-center gap-2">
                  <Hammer size={18} />
                  건설 (Construction)
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(BUILDING_DEFINITIONS).map(([key, def]) => (
                    <button
                      key={key}
                      onClick={() => handleBuildingClick(key)}
                      className="p-3 bg-slate-800 rounded hover:bg-slate-700 border border-slate-600 flex justify-between items-center"
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-bold">{def.name}</span>
                        <span className="text-xs text-green-400">
                          {Object.entries(def.income)
                            .map(([k, v]) => `+${v} ${k}`)
                            .join(", ")}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {Object.entries(def.cost)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(ACTION_DEFINITIONS)
                  .filter((k) => !["donate", "invest", "suppress"].includes(k))
                  .map((key) => (
                    <button
                      key={key}
                      onClick={() => handleActionClick(key)}
                      className="p-4 bg-slate-800 rounded hover:bg-slate-700 border border-slate-600 flex flex-col items-center gap-2 transition-colors"
                    >
                      {getActionIcon(key)}
                      <span className="font-bold">
                        {ACTION_DEFINITIONS[key].title}
                      </span>
                      <span className="text-xs text-gray-400">
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
          <div className="flex flex-col gap-4">
            {/* Faction Cards */}
            {factions.map((f) => (
              <div
                key={f.id}
                className="bg-slate-800 p-4 rounded border-l-4 border-blue-500 flex flex-col gap-3"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">{f.name}</span>
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-sm font-bold ${
                        f.loyalty < 30 ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      Loyalty: {f.loyalty}
                    </span>
                    <span className="text-xs text-gray-400">
                      Power: {f.power}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  {f.tags.map((t) => `#${t}`).join(" ")}
                </div>

                {/* Interaction Buttons */}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <button
                    onClick={() => handleEntityAction("donate", f.id)}
                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-xs rounded border border-slate-600 flex items-center justify-center gap-1"
                  >
                    <Gift size={12} /> 기부
                  </button>
                  <button
                    onClick={() => handleEntityAction("invest", f.id)}
                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-xs rounded border border-slate-600 flex items-center justify-center gap-1"
                  >
                    <TrendingUp size={12} /> 투자
                  </button>
                  <button
                    onClick={() => handleEntityAction("suppress", f.id)}
                    className="px-2 py-1 bg-red-900/50 hover:bg-red-900 text-xs rounded border border-red-800 text-red-200 flex items-center justify-center gap-1"
                  >
                    <Sword size={12} /> 탄압
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
