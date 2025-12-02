import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";

interface LandingViewProps {
  onStart: () => void;
}

function RotatingMap() {
  return (
    <group rotation={[0.5, 0, 0]}>
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[4, 4, 0.2, 6]} />
        <meshStandardMaterial color="#1e293b" wireframe />
      </mesh>
      {/* Decorative elements */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshStandardMaterial color="#fab005" />
      </mesh>
    </group>
  );
}

export function LandingView({ onStart }: LandingViewProps) {
  const [text, setText] = useState("");
  const fullText = "당신의 말이 역사가 된다.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 opacity-50">
        <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} />
            <Stars
              radius={100}
              depth={50}
              count={5000}
              factor={4}
              saturation={0}
              fade
              speed={1}
            />
            <RotatingMap />
            <OrbitControls
              autoRotate
              autoRotateSpeed={0.5}
              enableZoom={false}
              enablePan={false}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Content Layer */}
      <div className="z-10 flex flex-col items-center gap-8 p-4">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-stone-100 drop-shadow-2xl tracking-tight">
            Echoes of History
          </h1>
          <p className="text-xl md:text-2xl text-stone-400 font-serif h-8">
            {text}
            <span className="animate-pulse">|</span>
          </p>
        </div>

        <button
          onClick={onStart}
          className="group relative px-8 py-4 bg-stone-100 text-slate-900 font-bold text-lg rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
        >
          <span className="relative z-10">역사 속으로 입장하기</span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity rounded-sm" />
        </button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-stone-600 text-xs font-mono">
        © 2025 Echoes of History: Reforged. 모든 권리 보유. v0.1.0
      </div>
    </div>
  );
}
