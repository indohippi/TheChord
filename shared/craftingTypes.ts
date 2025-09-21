export interface CraftingMaterial {
  id: string;
  name: string;
  description: string;
  type: 'ore' | 'herb' | 'essence' | 'component' | 'rare' | 'legendary';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  value: number;
  stackSize: number;
  icon: string;
  source: 'gathering' | 'combat' | 'quest' | 'trading' | 'crafting';
  locations: string[];
  dropRate?: number;
  requiredLevel?: number;
  requiredSkill?: string;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  description: string;
  category: 'weapon' | 'armor' | 'accessory' | 'consumable' | 'tool' | 'decoration';
  subcategory: string;
  result: {
    itemId: string;
    quantity: number;
    quality: 'normal' | 'fine' | 'superior' | 'epic' | 'legendary';
  };
  materials: {
    materialId: string;
    quantity: number;
    consumed: boolean;
  }[];
  requirements: {
    level: number;
    skills: {
      skillId: string;
      level: number;
    }[];
    tools?: string[];
    station?: string;
  };
  craftingTime: number; // in seconds
  experience: number;
  difficulty: 'trivial' | 'easy' | 'normal' | 'hard' | 'expert' | 'master';
  successRate: number; // 0-100
  criticalSuccessRate: number; // 0-100
  failurePenalty: {
    materialLoss: number; // percentage of materials lost
    toolDamage: number; // chance of tool damage
  };
  unlockConditions: {
    quest?: string;
    achievement?: string;
    discovery?: string;
    level?: number;
  };
  isDiscoverable: boolean;
  discoveredBy?: string;
  discoveryDate?: Date;
}

export interface CraftingStation {
  id: string;
  name: string;
  description: string;
  type: 'forge' | 'alchemy' | 'enchanting' | 'cooking' | 'tailoring' | 'jewelry' | 'engineering';
  location: string;
  level: number;
  upgrades: {
    level: number;
    name: string;
    description: string;
    cost: {
      gold: number;
      materials: {
        materialId: string;
        quantity: number;
      }[];
    };
    benefits: {
      speedBonus: number;
      successBonus: number;
      qualityBonus: number;
      experienceBonus: number;
    };
  }[];
  currentUpgrade: number;
  isUnlocked: boolean;
  unlockCost?: {
    gold: number;
    materials: {
      materialId: string;
      quantity: number;
    }[];
  };
}

export interface CraftingSkill {
  id: string;
  name: string;
  description: string;
  category: 'weaponcraft' | 'armorcraft' | 'alchemy' | 'enchanting' | 'cooking' | 'tailoring' | 'jewelry' | 'engineering';
  level: number;
  experience: number;
  experienceToNext: number;
  specializations: {
    id: string;
    name: string;
    description: string;
    level: number;
    experience: number;
    bonuses: {
      type: string;
      value: number;
    }[];
  }[];
  perks: {
    id: string;
    name: string;
    description: string;
    level: number;
    unlocked: boolean;
    cost: number;
    effects: {
      type: string;
      value: number;
    }[];
  }[];
}

export interface CraftingSession {
  id: string;
  recipeId: string;
  playerId: string;
  stationId: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  quality: 'normal' | 'fine' | 'superior' | 'epic' | 'legendary';
  materialsUsed: {
    materialId: string;
    quantity: number;
  }[];
  experienceGained: number;
  result?: {
    itemId: string;
    quantity: number;
    quality: string;
  };
  failureReason?: string;
}

export interface CraftingQueue {
  id: string;
  playerId: string;
  stationId: string;
  items: {
    recipeId: string;
    quantity: number;
    priority: number;
    estimatedTime: number;
  }[];
  isActive: boolean;
  currentItem?: string;
  startTime?: Date;
  estimatedCompletion?: Date;
}

export interface CraftingDiscovery {
  id: string;
  playerId: string;
  recipeId: string;
  discoveredAt: Date;
  method: 'experimentation' | 'research' | 'quest' | 'teaching' | 'reverse_engineering';
  materialsUsed: {
    materialId: string;
    quantity: number;
  }[];
  notes?: string;
  shared: boolean;
  sharedWith: string[];
}

export interface CraftingMarket {
  id: string;
  name: string;
  location: string;
  type: 'local' | 'regional' | 'global';
  items: {
    itemId: string;
    sellerId: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
    listedAt: Date;
    expiresAt?: Date;
    isActive: boolean;
  }[];
  materials: {
    materialId: string;
    sellerId: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
    listedAt: Date;
    expiresAt?: Date;
    isActive: boolean;
  }[];
  fees: {
    listingFee: number;
    transactionFee: number;
    premiumFee: number;
  };
  restrictions: {
    levelRequirement: number;
    reputationRequirement: number;
    guildRequirement?: string;
  };
}