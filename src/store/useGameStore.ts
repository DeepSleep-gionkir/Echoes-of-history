import { create } from "zustand";
import { INITIAL_FACTIONS } from "../logic/EntitySystem";
import type { Entity } from "../logic/EntitySystem";
import { GameEngine } from "../logic/GameEngine";
import type { Proposal } from "../logic/GameEngine";
import { DBService } from "../services/db";

interface Resources {
  gold: number;
  food: number;
  mat: number;
  man: number;
  know: number;
  auth: number;
}

interface LogEntry {
  id: number;
  text: string;
  type: "info" | "warning" | "critical";
}

interface GameState {
  resources: Resources;
  factions: Entity[];
  turn: number;
  buildings: string[];
  logs: LogEntry[];
  authorityTier: "ignored" | "normal" | "revered";
  pendingProposal: Proposal | null;
  isLoading: boolean;

  // Actions
  updateResources: (newResources: Partial<Resources>) => void;
  setPendingProposal: (proposal: Proposal | null) => void;
  updateFactions: (newFactions: Entity[]) => void;
  addLog: (text: string, type?: "info" | "warning" | "critical") => void;
  nextTurn: () => void;
  addBuilding: (buildingId: string) => void;

  // Async Actions
  loadGame: () => Promise<void>;
  saveGame: () => Promise<void>;

  // UI State
  uiState: {
    sidePanelTab: "actions" | "council";
    showConstruction: boolean;
  };
  setUiState: (newState: Partial<GameState["uiState"]>) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  resources: {
    gold: 500,
    food: 500,
    mat: 200,
    man: 100,
    know: 0,
    auth: 10,
  },
  factions: INITIAL_FACTIONS,
  turn: 1,
  buildings: [],
  logs: [],
  authorityTier: "ignored",
  pendingProposal: null,
  isLoading: false,

  updateResources: (newResources) => {
    set((state) => ({
      resources: { ...state.resources, ...newResources },
    }));
    get().saveGame(); // Auto-save on change
  },

  setPendingProposal: (proposal) => set({ pendingProposal: proposal }),

  updateFactions: (newFactions) => {
    set({ factions: newFactions });
    get().saveGame(); // Auto-save on change
  },

  addLog: (text, type = "info") =>
    set((state) => ({
      logs: [{ id: Date.now(), text, type }, ...state.logs].slice(0, 50),
    })),

  nextTurn: () => {
    const currentState = {
      resources: get().resources,
      factions: get().factions,
      turn: get().turn,
      buildings: get().buildings,
    };

    const result = GameEngine.processTurn(currentState);

    set(() => ({
      resources: result.resources as Resources,
      turn: result.turn as number,
    }));

    get().addLog(`Turn ${result.turn} started. Income processed.`);
    get().saveGame();
  },

  addBuilding: (buildingId) => {
    set((state) => ({
      buildings: [...state.buildings, buildingId],
    }));
    get().saveGame();
  },

  // UI State
  uiState: {
    sidePanelTab: "actions",
    showConstruction: false,
  },
  setUiState: (newState: Partial<GameState["uiState"]>) =>
    set((state) => ({
      uiState: { ...state.uiState, ...newState },
    })),

  loadGame: async () => {
    set({ isLoading: true });
    try {
      let user = await DBService.getUser();
      if (!user) {
        console.log("No user found, creating new one...");
        user = await DBService.createUser();
      }

      if (user && user.resources) {
        set({ resources: user.resources });
        // Load other state if available
      }
    } catch (e) {
      console.error("Failed to load game", e);
    } finally {
      set({ isLoading: false });
    }
  },

  saveGame: async () => {
    const { resources, factions } = get();
    await DBService.saveState(resources, factions);
  },
}));
