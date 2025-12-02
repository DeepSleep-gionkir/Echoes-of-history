import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useState } from "react";
import { RadialMenu } from "./RadialMenu";
import * as THREE from "three";
import { useGameStore } from "../store/useGameStore";

// Hexagon Geometry Helper
const hexGeometry = new THREE.CylinderGeometry(1, 1, 0.2, 6);

interface HexTileProps {
  position: [number, number, number];
  color: string;
  onClick: (pos: [number, number, number]) => void;
}

function HexTile({ position, color, onClick }: HexTileProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      position={position}
      geometry={hexGeometry}
      onClick={(e) => {
        e.stopPropagation();
        onClick(position);
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial
        color={hovered ? "#fbbf24" : color} // Amber-400 on hover
        roughness={0.8}
        metalness={0.1}
      />
      {/* Border */}
      <lineSegments>
        <edgesGeometry args={[hexGeometry]} />
        <lineBasicMaterial color="#ffffff" opacity={0.2} transparent />
      </lineSegments>
    </mesh>
  );
}

function HexGrid({
  onTileClick,
}: {
  onTileClick: (pos: [number, number, number]) => void;
}) {
  const tiles = [];
  const size = 5; // Grid radius

  for (let q = -size; q <= size; q++) {
    for (let r = -size; r <= size; r++) {
      if (Math.abs(q + r) <= size) {
        // Hex to Pixel conversion (Pointy topped)
        const x = size * 0.4 * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
        const z = size * 0.4 * ((3 / 2) * r);

        // Simple terrain generation based on position
        let color = "#10b981"; // Grass (Emerald-500)
        if (Math.random() > 0.8) color = "#64748b"; // Mountain (Slate-500)
        if (Math.random() > 0.9) color = "#3b82f6"; // Water (Blue-500)

        tiles.push(
          <HexTile
            key={`${q}-${r}`}
            position={[x, 0, z]}
            color={color}
            onClick={onTileClick}
          />
        );
      }
    }
  }

  return <group>{tiles}</group>;
}

export const GameCanvas = () => {
  const [selectedTile, setSelectedTile] = useState<
    [number, number, number] | null
  >(null);
  const { setUiState } = useGameStore();

  const handleTileClick = (pos: [number, number, number]) => {
    setSelectedTile(pos);
  };

  const handleMenuAction = (action: string) => {
    console.log("Action:", action, "on tile:", selectedTile);

    if (action === "construct") {
      setUiState({ sidePanelTab: "actions", showConstruction: true });
    }
    // Add other actions as needed

    setSelectedTile(null);
  };

  return (
    <Canvas camera={{ position: [10, 10, 10], fov: 45 }} shadows>
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 20, 10]} intensity={1} castShadow />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        <HexGrid onTileClick={handleTileClick} />

        {selectedTile && (
          <RadialMenu
            position={[selectedTile[0], selectedTile[1] + 1, selectedTile[2]]}
            onClose={() => setSelectedTile(null)}
            onAction={handleMenuAction}
          />
        )}

        <OrbitControls
          makeDefault
          minDistance={5}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2.5} // Prevent going below ground
        />
      </Suspense>
    </Canvas>
  );
};
