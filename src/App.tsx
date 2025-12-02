import { useEffect, useState } from "react";
import { GameHUD } from "./components/GameHUD";
import { SanctionModal } from "./components/SanctionModal";
import { LandingView } from "./components/LandingView";
import { GameCanvas } from "./components/GameCanvas";
import { useGameStore } from "./store/useGameStore";
import { GameEngine } from "./logic/GameEngine";

type ViewState = "landing" | "game";

function App() {
  const [view, setView] = useState<ViewState>("landing");
  const {
    pendingProposal,
    setPendingProposal,
    resources,
    factions,
    turn,
    updateResources,
    updateFactions,
    addLog,
    loadGame,
  } = useGameStore();

  useEffect(() => {
    loadGame();
  }, []);

  const handleSanction = () => {
    if (!pendingProposal) return;

    // Execute Logic
    const currentState = { resources, factions, turn, buildings: [] }; // TODO: Pass real buildings
    const result = GameEngine.executeAction(pendingProposal, currentState);

    // Update Store
    if (result.resources) updateResources(result.resources);
    if (result.factions) updateFactions(result.factions);

    // Log
    addLog(`${pendingProposal.title} 승인됨.`);
    pendingProposal.impacts.forEach((impact) => {
      const factionName = factions.find((f) => f.id === impact.entityId)?.name;
      const sign = impact.loyaltyChange > 0 ? "+" : "";
      addLog(
        `[${factionName}] ${impact.reason} (${sign}${impact.loyaltyChange})`,
        impact.loyaltyChange < 0 ? "warning" : "info"
      );
    });

    setPendingProposal(null);
  };

  if (view === "landing") {
    return <LandingView onStart={() => setView("game")} />;
  }

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden">
      {/* Layer 1: 3D Map */}
      <div className="absolute inset-0 z-0">
        <GameCanvas />
      </div>

      {/* Layer 2: HUD */}
      <GameHUD />

      {/* Modals */}
      {pendingProposal && (
        <SanctionModal
          isOpen={true}
          onClose={() => setPendingProposal(null)}
          onSanction={handleSanction}
          title={pendingProposal.title}
          description={pendingProposal.description}
          cost={Object.entries(pendingProposal.cost)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ")}
          risk={pendingProposal.risk}
          actionType={pendingProposal.actionType}
          context={{
            resources,
            authorityTier: "normal", // TODO: Get from store
            factions,
          }}
        />
      )}
    </div>
  );
}

export default App;
