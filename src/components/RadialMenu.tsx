import { Html } from "@react-three/drei";
import { Hammer, Info, Sword, X } from "lucide-react";
import React from "react";

interface RadialMenuProps {
  position: [number, number, number];
  onClose: () => void;
  onAction: (action: string) => void;
}

export const RadialMenu: React.FC<RadialMenuProps> = ({
  position,
  onClose,
  onAction,
}) => {
  return (
    <Html position={position} center zIndexRange={[100, 0]}>
      <div className="relative w-32 h-32 flex items-center justify-center pointer-events-none">
        {/* Center Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute z-20 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white shadow-lg border border-white/20 hover:bg-slate-700 pointer-events-auto transition-transform active:scale-95"
        >
          <X size={20} />
        </button>

        {/* Radial Buttons */}
        {/* Top: Construct */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAction("construct");
          }}
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white hover:bg-amber-400 pointer-events-auto transition-all hover:scale-110 animate-fade-in"
          title="건설"
        >
          <Hammer size={20} />
        </button>

        {/* Right: Info */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAction("info");
          }}
          className="absolute top-1/2 -right-12 -translate-y-1/2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white hover:bg-blue-400 pointer-events-auto transition-all hover:scale-110 animate-fade-in delay-75"
          title="정보"
        >
          <Info size={20} />
        </button>

        {/* Left: Move/Attack */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAction("move");
          }}
          className="absolute top-1/2 -left-12 -translate-y-1/2 w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white hover:bg-rose-400 pointer-events-auto transition-all hover:scale-110 animate-fade-in delay-100"
          title="이동/공격"
        >
          <Sword size={20} />
        </button>
      </div>
    </Html>
  );
};
