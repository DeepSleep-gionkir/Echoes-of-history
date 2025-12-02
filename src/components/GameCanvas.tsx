import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useState, useRef, useEffect } from "react";
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

// Selection Ring Component
function SelectionRing({ position }: { position: [number, number, number] }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (ringRef.current) {
      // Simple bobbing animation
      let start = Date.now();
      const animate = () => {
        if (ringRef.current) {
          const elapsed = (Date.now() - start) / 1000;
          ringRef.current.position.y =
            position[1] + 0.5 + Math.sin(elapsed * 2) * 0.1;
        }
        requestAnimationFrame(animate);
      };
      animate();
    }
  }, [position]);

  return (
    <mesh
      ref={ringRef}
      position={[position[0], position[1] + 0.5, position[2]]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <torusGeometry args={[0.9, 0.05, 16, 6]} /> {/* Hexagonal Torus */}
      <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} />
    </mesh>
  );
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
        color={color}
        emissive={hovered ? "#fbbf24" : "#000000"}
        emissiveIntensity={hovered ? 0.5 : 0}
        roughness={0.8}
        metalness={0.1}
      />
      {/* Border */}
      <lineSegments>
        <edgesGeometry args={[hexGeometry]} />
        <lineBasicMaterial color="#57534e" opacity={0.3} transparent />
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
        // Multiplier 1.0 for seamless packing of radius 1 hexes
        const x = 1.0 * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
        const z = 1.0 * ((3 / 2) * r);

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
      <color attach="background" args={["#1a1b1e"]} />
      <fog attach="fog" args={["#1a1b1e", 10, 40]} />
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
          <>
            <SelectionRing position={selectedTile} />
            <RadialMenu
              position={[selectedTile[0], selectedTile[1] + 1, selectedTile[2]]}
              onClose={() => setSelectedTile(null)}
              onAction={handleMenuAction}
            />
          </>
        )}

        <ControlsWithSpacePan />
      </Suspense>
    </Canvas>
  );
};

function ControlsWithSpacePan() {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && controlsRef.current) {
        controlsRef.current.mouseButtons.LEFT = THREE.MOUSE.PAN;
        controlsRef.current.update();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" && controlsRef.current) {
        controlsRef.current.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
        controlsRef.current.update();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      minDistance={5}
      maxDistance={30}
      maxPolarAngle={Math.PI / 2.5}
      enablePan={true}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      }}
      touches={{
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.PAN,
      }}
      onChange={(e) => {
        if (!e?.target) return;
        const controls = e.target as any;
        // Clamp Pan Area
        const limit = 15;
        const x = THREE.MathUtils.clamp(controls.target.x, -limit, limit);
        const z = THREE.MathUtils.clamp(controls.target.z, -limit, limit);
        controls.target.set(x, 0, z);
      }}
    />
  );
}
