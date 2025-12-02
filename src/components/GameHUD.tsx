import React from "react";
import { ResourceBar } from "./ResourceBar";
import { NewsTicker } from "./NewsTicker";
import { SidePanel } from "./SidePanel";

export const GameHUD: React.FC = () => {
  return (
    <>
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full z-10 pointer-events-none">
        <ResourceBar />
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
        <NewsTicker />
      </div>

      {/* Right Panel */}
      <div className="absolute right-0 top-0 h-full z-20 pointer-events-none flex justify-end pt-16 pb-8">
        <SidePanel />
      </div>
    </>
  );
};
