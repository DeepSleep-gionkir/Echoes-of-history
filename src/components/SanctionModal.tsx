import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#f4e4bc] text-black p-8 rounded-sm shadow-2xl max-w-md w-full border-4 border-[#8b5a2b] relative font-serif">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-black pb-2 uppercase tracking-widest text-center">
          {title}
        </h2>

        <div className="mb-6 space-y-4">
          <div className="text-lg leading-relaxed min-h-[100px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-gray-500 animate-pulse">
                📜 Scribes are writing...
              </div>
            ) : (
              flavorText || description
            )}
          </div>

          <div className="bg-[#e6d5aa] p-3 border border-[#c0a060]">
            <p className="font-bold">📉 비용: {cost}</p>
            {risk && (
              <p className="font-bold text-red-700 animate-pulse">
                ⚠️ 경고: {risk}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 border-gray-600 text-gray-800 hover:bg-gray-200 font-bold uppercase"
          >
            반려 (Reject)
          </button>
          <button
            onClick={onSanction}
            className="px-6 py-2 bg-red-800 text-white border-2 border-red-900 hover:bg-red-700 font-bold uppercase shadow-lg transform active:scale-95 transition-transform"
          >
            결재 (Sanction)
          </button>
        </div>

        {/* Decorative Stamp */}
        <div className="absolute top-4 right-4 opacity-20 pointer-events-none rotate-12 border-4 border-red-800 text-red-800 p-2 font-black text-xs uppercase rounded">
          Top Secret
        </div>
      </div>
    </div>
  );
};
