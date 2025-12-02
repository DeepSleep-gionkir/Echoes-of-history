import {
  checkLoyaltyChange,
  processEntityTurn,
  ENTITY_ACTIONS,
} from "./EntitySystem";
import type { Entity, ActionImpact } from "./EntitySystem";

export interface GameState {
  resources: {
    gold: number;
    food: number;
    mat: number;
    man: number;
    know: number;
    auth: number;
  };
  factions: Entity[];
  turn: number;
  buildings: string[]; // List of building IDs
}

export interface Proposal {
  actionType: string;
  title: string;
  description: string;
  cost: Partial<GameState["resources"]>;
  risk?: string;
  impacts: ActionImpact[];
  buildingId?: string; // For construction actions
  targetEntityId?: string; // For entity actions
}

export const BUILDING_DEFINITIONS: Record<
  string,
  {
    name: string;
    cost: Partial<GameState["resources"]>;
    income: Partial<GameState["resources"]>;
  }
> = {
  farm: {
    name: "농장 (Farm)",
    cost: { gold: 100, mat: 50 },
    income: { food: 10 },
  },
  mine: {
    name: "광산 (Mine)",
    cost: { gold: 150, mat: 100 },
    income: { mat: 10 },
  },
  market: {
    name: "시장 (Market)",
    cost: { gold: 200, mat: 150 },
    income: { gold: 20 },
  },
  barracks: {
    name: "병영 (Barracks)",
    cost: { gold: 300, mat: 300 },
    income: { man: 5 },
  },
};

export const ACTION_DEFINITIONS: Record<
  string,
  { title: string; baseCost: Partial<GameState["resources"]> }
> = {
  conscript: {
    title: "징병 (Conscript)",
    baseCost: { gold: 50, food: 100 },
  },
  construct: {
    title: "건설 (Construct)",
    baseCost: { gold: 200, mat: 300 }, // Base cost, overridden by specific building
  },
  research: {
    title: "연구 (Research)",
    baseCost: { gold: 100, know: 50 },
  },
  decree: {
    title: "법안 (Decree)",
    baseCost: { auth: 50 },
  },
  // Entity Actions
  donate: {
    title: ENTITY_ACTIONS.donate.title,
    baseCost: ENTITY_ACTIONS.donate.baseCost,
  },
  invest: {
    title: ENTITY_ACTIONS.invest.title,
    baseCost: ENTITY_ACTIONS.invest.baseCost,
  },
  suppress: {
    title: ENTITY_ACTIONS.suppress.title,
    baseCost: ENTITY_ACTIONS.suppress.baseCost,
  },
};

export const GameEngine = {
  calculateCost: (
    actionType: string,
    state: GameState,
    buildingId?: string
  ): Partial<GameState["resources"]> => {
    if (
      actionType === "construct" &&
      buildingId &&
      BUILDING_DEFINITIONS[buildingId]
    ) {
      return BUILDING_DEFINITIONS[buildingId].cost;
    }

    const def = ACTION_DEFINITIONS[actionType];
    if (!def) return {};

    const cost = { ...def.baseCost };

    // Dynamic Cost Logic
    if (actionType === "conscript" && state.resources.food < 200) {
      cost.gold = (cost.gold || 0) * 2;
    }

    return cost;
  },

  estimateRisk: (actionType: string, state: GameState): string | undefined => {
    if (actionType === "conscript" && state.resources.food < 100) {
      return "식량 부족으로 인한 폭동 가능성 높음";
    }
    if (actionType === "construct" && state.resources.gold < 100) {
      return "국고 파산 위험";
    }
    if (actionType === "suppress") {
      return "대상 파벌의 극심한 반발 예상";
    }
    return undefined;
  },

  createProposal: (
    actionType: string,
    state: GameState,
    buildingId?: string,
    targetEntityId?: string
  ): Proposal => {
    const def = ACTION_DEFINITIONS[actionType];
    const cost = GameEngine.calculateCost(actionType, state, buildingId);
    const risk = GameEngine.estimateRisk(actionType, state);

    const impacts: ActionImpact[] = [];

    // If target entity exists, only check impact for that entity (or all if needed)
    // For now, we check all to see side effects
    state.factions.forEach((faction) => {
      // If action targets specific entity, only apply to them or apply side effects
      if (targetEntityId && faction.id !== targetEntityId) return;

      const impact = checkLoyaltyChange(actionType, faction);
      if (impact) impacts.push(impact);
    });

    let title = `${def.title} 승인 요청`;
    let description = `${def.title}을(를) 실행하시겠습니까?`;

    if (actionType === "construct" && buildingId) {
      const bName = BUILDING_DEFINITIONS[buildingId].name;
      title = `${bName} 건설 승인 요청`;
      description = `${bName}을(를) 건설하시겠습니까?`;
    } else if (targetEntityId) {
      const targetName =
        state.factions.find((f) => f.id === targetEntityId)?.name || "Unknown";
      title = `${targetName}에 대한 ${def.title} 요청`;
      description = `${targetName}에게 ${def.title}을(를) 실행하시겠습니까?`;
    }

    return {
      actionType,
      title,
      description,
      cost,
      risk,
      impacts,
      buildingId,
      targetEntityId,
    };
  },

  executeAction: (proposal: Proposal, state: GameState): Partial<GameState> => {
    const newResources = { ...state.resources };
    const newBuildings = [...state.buildings];

    // Deduct Cost
    Object.entries(proposal.cost).forEach(([key, value]) => {
      const k = key as keyof GameState["resources"];
      newResources[k] -= value || 0;
    });

    // Add Building
    if (proposal.actionType === "construct" && proposal.buildingId) {
      newBuildings.push(proposal.buildingId);
    }

    // Apply Loyalty Changes
    const newFactions = state.factions.map((f) => {
      const impact = proposal.impacts.find((i) => i.entityId === f.id);
      if (impact) {
        return {
          ...f,
          loyalty: Math.max(0, Math.min(100, f.loyalty + impact.loyaltyChange)),
        };
      }
      return f;
    });

    return {
      resources: newResources,
      factions: newFactions,
      buildings: newBuildings,
    };
  },

  processTurn: (state: GameState): Partial<GameState> => {
    const newResources = { ...state.resources };

    // Base Income
    newResources.gold += 10;
    newResources.food += 10;

    // Building Income
    state.buildings.forEach((bId) => {
      const def = BUILDING_DEFINITIONS[bId];
      if (def) {
        Object.entries(def.income).forEach(([key, value]) => {
          const k = key as keyof GameState["resources"];
          newResources[k] += value || 0;
        });
      }
    });

    // Maintenance / Consumption
    newResources.food -= 5; // Basic consumption

    // Process Entities (Loyalty Decay, etc.)
    const newFactions = state.factions.map((f) => processEntityTurn(f));

    return {
      resources: newResources,
      turn: state.turn + 1,
      factions: newFactions,
    };
  },
};
