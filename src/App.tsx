import { useState } from "react";
import { GameHUD } from "./components/GameHUD";
import { SanctionModal } from "./components/SanctionModal";
import { LandingView } from "./components/LandingView";
import { GameCanvas } from "./components/GameCanvas";
import { NationCreationView } from "./components/NationCreationView";
import { useGameStore } from "./store/useGameStore";
import { GameEngine } from "./logic/GameEngine";
import { DBService } from "./services/db";

type ViewState = "landing" | "creation" | "game";

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
    user,
  } = useGameStore();

  // Handle View Transition based on User State
  const handleStart = async () => {
    if (!user) return;

    // Check if user has data
    const dbUser = await DBService.getUser(user.id);
    if (dbUser) {
      // User exists, load game and go to game view
      await loadGame();
      setView("game");
    } else {
      // New user, go to creation view
      setView("creation");
    }
  };

  const handleCreationComplete = async () => {
    // Create user in DB is handled inside NationCreationView or here
    // For now, assume creation view did the basics or we do it here
    if (user) {
      await DBService.createUser(
        user.id,
        user.user_metadata?.full_name || "New Kingdom"
      );
      await loadGame();
      setView("game");
    }
  };

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
    return <LandingView onStart={handleStart} />;
  }

  if (view === "creation") {
    return <NationCreationView onComplete={handleCreationComplete} />;
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
