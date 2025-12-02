import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { ResourceManager } from "./components/ResourceManager";
import { ActionPanel } from "./components/ActionPanel";
import { SanctionModal } from "./components/SanctionModal";
import { OrbitControls } from "@react-three/drei";
import { useGameStore } from "./store/useGameStore";
import { GameEngine } from "./logic/GameEngine";

function App() {
  const {
    pendingProposal,
    setPendingProposal,
    resources,
    factions,
    turn,
    updateResources,
    updateFactions,
    addLog,
    logs,
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

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Layer 1: 3D Map */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1, 0.2, 1]} />
              <meshStandardMaterial color="#4ade80" />
            </mesh>
            <gridHelper args={[20, 20]} />
            <OrbitControls makeDefault />
          </Suspense>
        </Canvas>
      </div>

      {/* Layer 2: HUD */}
      <div className="absolute top-0 left-0 w-full z-10 pointer-events-none p-4 flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-white drop-shadow-md">
            Echoes of History: Reforged
          </h1>
          <ResourceManager />

          {/* Log Viewer (Temporary) */}
          <div className="mt-4 w-96 max-h-64 overflow-y-auto bg-black/50 p-2 rounded text-sm text-white pointer-events-auto">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`mb-1 ${
                  log.type === "warning" ? "text-red-400" : "text-gray-200"
                }`}
              >
                - {log.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Layer 3: Panel */}
      <div className="absolute right-0 top-0 h-full z-20 pointer-events-none flex justify-end">
        <ActionPanel />
      </div>

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
