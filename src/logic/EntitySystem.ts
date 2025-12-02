export type EntityType = "faction" | "religion" | "corp" | "military";

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  power: number; // 0-100
  loyalty: number; // 0-100
  tags: string[];
}

export interface ActionImpact {
  entityId: string;
  loyaltyChange: number;
  reason: string;
}

// GDD 03: Tag-based Logic
export const checkLoyaltyChange = (
  actionType: string,
  entity: Entity
): ActionImpact | null => {
  let change = 0;
  let reason = "";

  // Example Logic based on GDD
  if (actionType === "conscript") {
    if (entity.tags.includes("poor")) {
      change = -5;
      reason = "징병에 대한 민중의 불만";
    } else if (entity.tags.includes("warlike")) {
      change = +5;
      reason = "군비 증강 지지";
    }
  } else if (actionType === "construct_luxury") {
    if (entity.tags.includes("poor")) {
      change = -10;
      reason = "사치스러운 건축에 분노";
    } else if (entity.tags.includes("greedy")) {
      change = +10;
      reason = "건설 이권 획득";
    }
  } else if (actionType === "research") {
    if (entity.tags.includes("conservative")) {
      change = -5;
      reason = "새로운 기술에 대한 거부감";
    }
  } else if (actionType === "donate") {
    if (entity.tags.includes("religious") || entity.tags.includes("poor")) {
      change = +15;
      reason = "자비로운 기부에 감동";
    } else {
      change = +5;
      reason = "재정 지원 감사";
    }
  } else if (actionType === "invest") {
    if (entity.tags.includes("trade") || entity.tags.includes("greedy")) {
      change = +20;
      reason = "투자 수익 기대";
    }
  } else if (actionType === "suppress") {
    change = -30;
    reason = "무력 탄압에 대한 분노";
  }

  if (change !== 0) {
    return { entityId: entity.id, loyaltyChange: change, reason };
  }
  return null;
};

export const processEntityTurn = (entity: Entity): Entity => {
  let newLoyalty = entity.loyalty;
  let newPower = entity.power;

  // Loyalty Decay: Slowly moves towards 50
  if (newLoyalty > 50) newLoyalty -= 1;
  if (newLoyalty < 50) newLoyalty += 1;

  // Random Power Fluctuation (Simulation)
  if (Math.random() < 0.1) {
    newPower += Math.random() > 0.5 ? 1 : -1;
  }

  return {
    ...entity,
    loyalty: Math.max(0, Math.min(100, newLoyalty)),
    power: Math.max(0, Math.min(100, newPower)),
  };
};

export const ENTITY_ACTIONS = {
  donate: {
    title: "기부 (Donate)",
    baseCost: { gold: 100 },
    description: "파벌에게 자금을 지원하여 충성도를 높입니다.",
  },
  invest: {
    title: "투자 (Invest)",
    baseCost: { gold: 200 },
    description: "파벌의 사업에 투자하여 세력과 충성도를 높입니다.",
  },
  suppress: {
    title: "탄압 (Suppress)",
    baseCost: { man: 50, auth: 20 },
    description:
      "무력으로 파벌을 억누릅니다. 세력이 감소하지만 충성도가 급락합니다.",
  },
};

export const INITIAL_FACTIONS: Entity[] = [
  {
    id: "f1",
    name: "귀족파",
    type: "faction",
    power: 70,
    loyalty: 50,
    tags: ["conservative", "warlike"],
  },
  {
    id: "f2",
    name: "상인파",
    type: "faction",
    power: 60,
    loyalty: 50,
    tags: ["greedy", "trade"],
  },
  {
    id: "f3",
    name: "사제파",
    type: "faction",
    power: 50,
    loyalty: 50,
    tags: ["religious", "conservative"],
  },
  {
    id: "f4",
    name: "민중파",
    type: "faction",
    power: 30,
    loyalty: 50,
    tags: ["populist", "poor"],
  },
];
