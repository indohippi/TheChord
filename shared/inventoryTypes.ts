// Item types and interfaces for the inventory system

export type ItemType = 
  | 'weapon'
  | 'armor'
  | 'accessory'
  | 'consumable'
  | 'material'
  | 'quest'
  | 'echo';

export type ItemRarity = 
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythic';

export type EquipmentSlot = 
  | 'weapon'
  | 'helmet'
  | 'chestplate'
  | 'leggings'
  | 'boots'
  | 'accessory1'
  | 'accessory2'
  | 'accessory3';

// Base item interface
export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  value: number; // Gold value
  stackable: boolean;
  maxStack: number;
  icon: string; // Path to icon sprite
  flavorText?: string; // Lore text
}

// Equipment item interface
export interface Equipment extends Item {
  type: 'weapon' | 'armor' | 'accessory';
  slot: EquipmentSlot;
  level: number; // Required level to equip
  stats: {
    strength?: number;
    wisdom?: number;
    agility?: number;
    willpower?: number;
    harmony?: number;
    health?: number;
    energy?: number;
    defense?: number;
    resistance?: number;
  };
  durability: number;
  maxDurability: number;
  enchantments?: Enchantment[];
}

// Weapon specific interface
export interface Weapon extends Equipment {
  type: 'weapon';
  damage: number;
  attackSpeed: number;
  range: number;
  weaponType: 'sword' | 'staff' | 'bow' | 'dagger' | 'hammer' | 'spear';
  specialEffects?: WeaponEffect[];
}

// Armor specific interface
export interface Armor extends Equipment {
  type: 'armor';
  defense: number;
  resistance: number;
  armorType: 'light' | 'medium' | 'heavy';
  setBonus?: string; // Name of armor set for set bonuses
}

// Consumable item interface
export interface Consumable extends Item {
  type: 'consumable';
  effect: ConsumableEffect;
  duration?: number; // For temporary effects
  cooldown?: number; // Cooldown between uses
}

// Consumable effect interface
export interface ConsumableEffect {
  type: 'heal' | 'energy' | 'buff' | 'debuff' | 'teleport' | 'reveal';
  value: number;
  stat?: string; // Which stat to affect
  target: 'self' | 'area' | 'enemy';
  area?: number; // Area of effect radius
}

// Enchantment interface
export interface Enchantment {
  id: string;
  name: string;
  description: string;
  level: number;
  effect: {
    type: 'stat_boost' | 'special_ability' | 'resistance' | 'damage_bonus';
    value: number;
    stat?: string;
  };
}

// Weapon effect interface
export interface WeaponEffect {
  id: string;
  name: string;
  description: string;
  trigger: 'on_hit' | 'on_crit' | 'on_kill' | 'passive';
  effect: {
    type: 'damage' | 'heal' | 'buff' | 'debuff' | 'special';
    value: number;
    duration?: number;
  };
  chance: number; // 0-1 probability
}

// Inventory slot interface
export interface InventorySlot {
  item: Item | null;
  quantity: number;
  equipped: boolean;
}

// Equipment set interface
export interface EquipmentSet {
  id: string;
  name: string;
  description: string;
  pieces: string[]; // Item IDs that belong to this set
  bonuses: {
    [pieces: number]: {
      description: string;
      stats?: Record<string, number>;
      specialEffect?: string;
    };
  };
}

// Crafting recipe interface
export interface CraftingRecipe {
  id: string;
  name: string;
  description: string;
  result: {
    itemId: string;
    quantity: number;
  };
  materials: {
    itemId: string;
    quantity: number;
  }[];
  requiredLevel: number;
  requiredSkill?: string;
  craftingTime: number; // In seconds
  category: 'weapon' | 'armor' | 'consumable' | 'accessory' | 'material';
}

// Shop interface
export interface Shop {
  id: string;
  name: string;
  description: string;
  items: {
    itemId: string;
    price: number;
    stock: number;
    restockTime: number; // Hours
  }[];
  currency: 'gold' | 'echoes' | 'materials';
}

// Trade interface
export interface Trade {
  id: string;
  name: string;
  description: string;
  give: {
    itemId: string;
    quantity: number;
  };
  receive: {
    itemId: string;
    quantity: number;
  };
  repeatable: boolean;
  cooldown?: number; // Hours
}