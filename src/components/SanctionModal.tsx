import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { X } from "lucide-react";

// Singleton socket connection (in a real app, move to a context or store)
const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
const socket = io(socketUrl);

interface SanctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSanction: () => void;
  title: string;
  description: string; // Fallback description
  cost: string;
  risk?: string;
  actionType?: string; // Added to identify action for AI
  context?: any; // Context for AI
}

export const SanctionModal: React.FC<SanctionModalProps> = ({
  isOpen,
  onClose,
  onSanction,
  title,
  description,
  cost,
  risk,
  actionType,
  context,
}) => {
  const [flavorText, setFlavorText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStamping, setIsStamping] = useState(false);

  useEffect(() => {
    if (isOpen && actionType) {
      setIsLoading(true);
      setFlavorText(""); // Reset

      // Request flavor text from server
      socket.emit("request_sanction_flavor", { actionType, title, context });

      const handleResponse = (data: { text: string }) => {
        setFlavorText(data.text);
        setIsLoading(false);
      };

      socket.on("sanction_flavor_response", handleResponse);

      return () => {
        socket.off("sanction_flavor_response", handleResponse);
      };
    }
  }, [isOpen, actionType, title, context]);

  const handleSanctionClick = () => {
    setIsStamping(true);
    // Delay actual sanction to show animation
    setTimeout(() => {
      onSanction();
      setIsStamping(false);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Paper Container */}
      <div className="relative bg-stone-100 text-stone-900 p-8 md:p-12 max-w-lg w-full paper-shadow rotate-1 transition-transform duration-500 hover:rotate-0">
        {/* Header */}
        <div className="mb-6 border-b-2 border-stone-800 pb-4 relative">
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 p-2 text-stone-400 hover:text-stone-800 transition-colors"
            title="닫기"
          >
            <X size={24} />
          </button>
          <h2 className="text-3xl font-serif font-bold text-center text-stone-900">
            {title}
          </h2>
          <div className="text-center text-xs font-mono text-stone-500 mt-1 uppercase tracking-widest">
            공식 칙령 요청
          </div>
        </div>

        {/* Content */}
        <div className="mb-8 space-y-6">
          {/* AI Flavor Text / Description */}
          <div className="min-h-[120px] font-serif text-lg leading-relaxed text-stone-800">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-stone-400 animate-pulse italic">
                서기관이 기록을 작성 중입니다...
              </div>
            ) : (
              flavorText || description
            )}
          </div>

          {/* Data Section */}
          <div className="bg-stone-200/50 p-4 border border-stone-300 rounded-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-stone-600 text-sm uppercase">
                소모 자원
              </span>
              <span className="font-mono font-bold text-rose-700">{cost}</span>
            </div>
            {risk && (
              <div className="flex justify-between items-center">
                <span className="font-bold text-stone-600 text-sm uppercase">
                  위험 요소
                </span>
                <span className="font-bold text-amber-600 animate-pulse text-sm">
                  ⚠️ {risk}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-stone-300">
          <button
            onClick={onClose}
            className="px-6 py-2 text-stone-500 hover:text-stone-900 font-serif font-bold hover:underline decoration-2 underline-offset-4 transition-all"
          >
            반려
          </button>

          <div className="relative">
            <button
              onClick={handleSanctionClick}
              disabled={isStamping}
              className="px-8 py-3 bg-rose-900 text-stone-100 font-serif font-bold text-lg shadow-lg hover:bg-rose-800 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              결재
            </button>

            {/* Stamp Animation Overlay */}
            {isStamping && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-rose-700 rounded-full flex items-center justify-center text-rose-700 font-black text-xl uppercase rotate-[-15deg] opacity-80 animate-stamp-drop pointer-events-none z-10 mix-blend-multiply">
                <div className="border-2 border-rose-700 w-[90%] h-[90%] rounded-full flex items-center justify-center">
                  승인
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
          <div className="w-16 h-16 rounded-full border-4 border-stone-900"></div>
        </div>
      </div>
    </div>
  );
};
