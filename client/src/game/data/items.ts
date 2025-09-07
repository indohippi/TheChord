import { 
  Item, 
  Weapon, 
  Armor, 
  Consumable, 
  EquipmentSet,
  CraftingRecipe,
  ItemRarity 
} from "@shared/inventoryTypes";

// Base items database
export const items: Item[] = [
  // Weapons
  {
    id: 'ancient-sword',
    name: 'Ancient Sword of Echoes',
    description: 'A blade forged from the remnants of creation itself.',
    type: 'weapon',
    rarity: 'rare',
    value: 250,
    stackable: false,
    maxStack: 1,
    icon: 'ancient-sword'
  },
  {
    id: 'philosophers-staff',
    name: 'Philosopher\'s Staff',
    description: 'A staff imbued with the wisdom of ages.',
    type: 'weapon',
    rarity: 'epic',
    value: 500,
    stackable: false,
    maxStack: 1,
    icon: 'philosophers-staff'
  },
  {
    id: 'covenant-blade',
    name: 'Covenant Blade',
    description: 'A weapon blessed by divine emanations.',
    type: 'weapon',
    rarity: 'legendary',
    value: 1000,
    stackable: false,
    maxStack: 1,
    icon: 'covenant-blade'
  },
  {
    id: 'dragons-bow',
    name: 'Dragon\'s Breath Bow',
    description: 'A bow that channels elemental energy.',
    type: 'weapon',
    rarity: 'epic',
    value: 750,
    stackable: false,
    maxStack: 1,
    icon: 'dragons-bow'
  },
  {
    id: 'serpents-dagger',
    name: 'Serpent\'s Whisper Dagger',
    description: 'A dagger that strikes with the speed of chaos.',
    type: 'weapon',
    rarity: 'rare',
    value: 300,
    stackable: false,
    maxStack: 1,
    icon: 'serpents-dagger'
  },

  // Armor
  {
    id: 'echo-robe',
    name: 'Robe of Echoes',
    description: 'A mystical robe that resonates with cosmic energy.',
    type: 'armor',
    rarity: 'uncommon',
    value: 150,
    stackable: false,
    maxStack: 1,
    icon: 'echo-robe'
  },
  {
    id: 'philosophers-vestments',
    name: 'Philosopher\'s Vestments',
    description: 'Robes worn by seekers of truth and knowledge.',
    type: 'armor',
    rarity: 'rare',
    value: 400,
    stackable: false,
    maxStack: 1,
    icon: 'philosophers-vestments'
  },
  {
    id: 'covenant-armor',
    name: 'Covenant Armor',
    description: 'Divine protection woven from sacred threads.',
    type: 'armor',
    rarity: 'epic',
    value: 800,
    stackable: false,
    maxStack: 1,
    icon: 'covenant-armor'
  },
  {
    id: 'dragonscale-armor',
    name: 'Dragonscale Armor',
    description: 'Armor forged from the scales of ancient dragons.',
    type: 'armor',
    rarity: 'legendary',
    value: 1500,
    stackable: false,
    maxStack: 1,
    icon: 'dragonscale-armor'
  },

  // Accessories
  {
    id: 'echo-ring',
    name: 'Ring of Echoes',
    description: 'A ring that amplifies the wearer\'s connection to creation.',
    type: 'accessory',
    rarity: 'uncommon',
    value: 100,
    stackable: false,
    maxStack: 1,
    icon: 'echo-ring'
  },
  {
    id: 'wisdom-amulet',
    name: 'Amulet of Wisdom',
    description: 'An amulet that enhances the bearer\'s mental faculties.',
    type: 'accessory',
    rarity: 'rare',
    value: 200,
    stackable: false,
    maxStack: 1,
    icon: 'wisdom-amulet'
  },
  {
    id: 'harmony-crystal',
    name: 'Crystal of Harmony',
    description: 'A crystal that maintains balance between opposing forces.',
    type: 'accessory',
    rarity: 'epic',
    value: 500,
    stackable: false,
    maxStack: 1,
    icon: 'harmony-crystal'
  },

  // Consumables
  {
    id: 'healing-potion',
    name: 'Healing Potion',
    description: 'Restores health over time.',
    type: 'consumable',
    rarity: 'common',
    value: 25,
    stackable: true,
    maxStack: 99,
    icon: 'healing-potion'
  },
  {
    id: 'energy-elixir',
    name: 'Energy Elixir',
    description: 'Restores energy and enhances abilities.',
    type: 'consumable',
    rarity: 'uncommon',
    value: 50,
    stackable: true,
    maxStack: 50,
    icon: 'energy-elixir'
  },
  {
    id: 'echo-essence',
    name: 'Echo Essence',
    description: 'A concentrated form of creation energy.',
    type: 'consumable',
    rarity: 'rare',
    value: 100,
    stackable: true,
    maxStack: 25,
    icon: 'echo-essence'
  },
  {
    id: 'phoenix-feather',
    name: 'Phoenix Feather',
    description: 'Revives the fallen with renewed strength.',
    type: 'consumable',
    rarity: 'epic',
    value: 500,
    stackable: true,
    maxStack: 5,
    icon: 'phoenix-feather'
  },

  // Materials
  {
    id: 'echo-fragment',
    name: 'Echo Fragment',
    description: 'A small piece of creation energy.',
    type: 'material',
    rarity: 'common',
    value: 10,
    stackable: true,
    maxStack: 999,
    icon: 'echo-fragment'
  },
  {
    id: 'ancient-rune',
    name: 'Ancient Rune',
    description: 'A mystical symbol of power.',
    type: 'material',
    rarity: 'uncommon',
    value: 50,
    stackable: true,
    maxStack: 99,
    icon: 'ancient-rune'
  },
  {
    id: 'divine-essence',
    name: 'Divine Essence',
    description: 'The pure essence of divine power.',
    type: 'material',
    rarity: 'rare',
    value: 200,
    stackable: true,
    maxStack: 50,
    icon: 'divine-essence'
  },
  {
    id: 'cosmic-dust',
    name: 'Cosmic Dust',
    description: 'Dust from the birth of the universe.',
    type: 'material',
    rarity: 'epic',
    value: 500,
    stackable: true,
    maxStack: 25,
    icon: 'cosmic-dust'
  }
];

// Equipment with stats
export const equipment: (Weapon | Armor)[] = [
  // Weapons
  {
    id: 'ancient-sword',
    name: 'Ancient Sword of Echoes',
    description: 'A blade forged from the remnants of creation itself.',
    type: 'weapon',
    rarity: 'rare',
    value: 250,
    stackable: false,
    maxStack: 1,
    icon: 'ancient-sword',
    slot: 'weapon',
    level: 5,
    stats: {
      strength: 8,
      agility: 3
    },
    durability: 100,
    maxDurability: 100,
    damage: 25,
    attackSpeed: 1.2,
    range: 1,
    weaponType: 'sword',
    specialEffects: [{
      id: 'echo-strike',
      name: 'Echo Strike',
      description: 'Chance to deal additional damage',
      trigger: 'on_hit',
      effect: {
        type: 'damage',
        value: 10
      },
      chance: 0.15
    }]
  },
  {
    id: 'philosophers-staff',
    name: 'Philosopher\'s Staff',
    description: 'A staff imbued with the wisdom of ages.',
    type: 'weapon',
    rarity: 'epic',
    value: 500,
    stackable: false,
    maxStack: 1,
    icon: 'philosophers-staff',
    slot: 'weapon',
    level: 10,
    stats: {
      wisdom: 12,
      willpower: 5
    },
    durability: 120,
    maxDurability: 120,
    damage: 20,
    attackSpeed: 0.8,
    range: 2,
    weaponType: 'staff',
    specialEffects: [{
      id: 'wisdom-blast',
      name: 'Wisdom Blast',
      description: 'Chance to restore energy on hit',
      trigger: 'on_hit',
      effect: {
        type: 'heal',
        value: 5
      },
      chance: 0.2
    }]
  },
  {
    id: 'covenant-blade',
    name: 'Covenant Blade',
    description: 'A weapon blessed by divine emanations.',
    type: 'weapon',
    rarity: 'legendary',
    value: 1000,
    stackable: false,
    maxStack: 1,
    icon: 'covenant-blade',
    slot: 'weapon',
    level: 15,
    stats: {
      strength: 15,
      wisdom: 8,
      harmony: 5
    },
    durability: 150,
    maxDurability: 150,
    damage: 35,
    attackSpeed: 1.0,
    range: 1,
    weaponType: 'sword',
    specialEffects: [{
      id: 'divine-strike',
      name: 'Divine Strike',
      description: 'Chance to banish corrupted enemies',
      trigger: 'on_hit',
      effect: {
        type: 'special',
        value: 1
      },
      chance: 0.1
    }]
  },

  // Armor
  {
    id: 'echo-robe',
    name: 'Robe of Echoes',
    description: 'A mystical robe that resonates with cosmic energy.',
    type: 'armor',
    rarity: 'uncommon',
    value: 150,
    stackable: false,
    maxStack: 1,
    icon: 'echo-robe',
    slot: 'chestplate',
    level: 3,
    stats: {
      wisdom: 4,
      energy: 20
    },
    durability: 80,
    maxDurability: 80,
    defense: 15,
    resistance: 10,
    armorType: 'light'
  },
  {
    id: 'philosophers-vestments',
    name: 'Philosopher\'s Vestments',
    description: 'Robes worn by seekers of truth and knowledge.',
    type: 'armor',
    rarity: 'rare',
    value: 400,
    stackable: false,
    maxStack: 1,
    icon: 'philosophers-vestments',
    slot: 'chestplate',
    level: 8,
    stats: {
      wisdom: 8,
      willpower: 6,
      energy: 30
    },
    durability: 100,
    maxDurability: 100,
    defense: 25,
    resistance: 20,
    armorType: 'light'
  },
  {
    id: 'covenant-armor',
    name: 'Covenant Armor',
    description: 'Divine protection woven from sacred threads.',
    type: 'armor',
    rarity: 'epic',
    value: 800,
    stackable: false,
    maxStack: 1,
    icon: 'covenant-armor',
    slot: 'chestplate',
    level: 12,
    stats: {
      strength: 6,
      wisdom: 10,
      willpower: 8,
      health: 50
    },
    durability: 120,
    maxDurability: 120,
    defense: 40,
    resistance: 35,
    armorType: 'medium'
  }
];

// Consumables with effects
export const consumables: Consumable[] = [
  {
    id: 'healing-potion',
    name: 'Healing Potion',
    description: 'Restores health over time.',
    type: 'consumable',
    rarity: 'common',
    value: 25,
    stackable: true,
    maxStack: 99,
    icon: 'healing-potion',
    effect: {
      type: 'heal',
      value: 50,
      target: 'self'
    },
    cooldown: 5
  },
  {
    id: 'energy-elixir',
    name: 'Energy Elixir',
    description: 'Restores energy and enhances abilities.',
    type: 'consumable',
    rarity: 'uncommon',
    value: 50,
    stackable: true,
    maxStack: 50,
    icon: 'energy-elixir',
    effect: {
      type: 'energy',
      value: 30,
      target: 'self'
    },
    cooldown: 10
  },
  {
    id: 'echo-essence',
    name: 'Echo Essence',
    description: 'A concentrated form of creation energy.',
    type: 'consumable',
    rarity: 'rare',
    value: 100,
    stackable: true,
    maxStack: 25,
    icon: 'echo-essence',
    effect: {
      type: 'buff',
      value: 10,
      stat: 'harmony',
      target: 'self',
      duration: 300
    },
    cooldown: 30
  },
  {
    id: 'phoenix-feather',
    name: 'Phoenix Feather',
    description: 'Revives the fallen with renewed strength.',
    type: 'consumable',
    rarity: 'epic',
    value: 500,
    stackable: true,
    maxStack: 5,
    icon: 'phoenix-feather',
    effect: {
      type: 'heal',
      value: 100,
      target: 'self'
    },
    cooldown: 60
  }
];

// Equipment sets
export const equipmentSets: EquipmentSet[] = [
  {
    id: 'echo-set',
    name: 'Echo Walker Set',
    description: 'Armor that resonates with the echoes of creation.',
    pieces: ['echo-robe', 'echo-ring', 'echo-helmet'],
    bonuses: {
      2: {
        description: 'Echo Resonance: +10% energy regeneration',
        stats: {
          energy: 20
        }
      },
      3: {
        description: 'Echo Mastery: Abilities cost 15% less energy',
        specialEffect: 'energy_reduction'
      }
    }
  },
  {
    id: 'philosopher-set',
    name: 'Philosopher\'s Set',
    description: 'The complete attire of a seeker of truth.',
    pieces: ['philosophers-vestments', 'philosophers-staff', 'wisdom-amulet'],
    bonuses: {
      2: {
        description: 'Wisdom\'s Light: +15% experience gain',
        stats: {
          wisdom: 5
        }
      },
      3: {
        description: 'Truth Seeker: Reveals enemy weaknesses',
        specialEffect: 'weakness_reveal'
      }
    }
  },
  {
    id: 'covenant-set',
    name: 'Covenant Set',
    description: 'Divine protection and power.',
    pieces: ['covenant-armor', 'covenant-blade', 'harmony-crystal'],
    bonuses: {
      2: {
        description: 'Divine Protection: +25% resistance to corruption',
        stats: {
          resistance: 15
        }
      },
      3: {
        description: 'Divine Wrath: Critical hits have a chance to banish enemies',
        specialEffect: 'banish_crit'
      }
    }
  }
];

// Crafting recipes
export const craftingRecipes: CraftingRecipe[] = [
  {
    id: 'craft-healing-potion',
    name: 'Healing Potion',
    description: 'A basic healing potion.',
    result: {
      itemId: 'healing-potion',
      quantity: 3
    },
    materials: [
      { itemId: 'echo-fragment', quantity: 5 },
      { itemId: 'ancient-rune', quantity: 1 }
    ],
    requiredLevel: 1,
    craftingTime: 30,
    category: 'consumable'
  },
  {
    id: 'craft-energy-elixir',
    name: 'Energy Elixir',
    description: 'An elixir that restores energy.',
    result: {
      itemId: 'energy-elixir',
      quantity: 2
    },
    materials: [
      { itemId: 'echo-fragment', quantity: 10 },
      { itemId: 'ancient-rune', quantity: 2 }
    ],
    requiredLevel: 3,
    craftingTime: 60,
    category: 'consumable'
  },
  {
    id: 'craft-echo-ring',
    name: 'Ring of Echoes',
    description: 'A ring that amplifies echo energy.',
    result: {
      itemId: 'echo-ring',
      quantity: 1
    },
    materials: [
      { itemId: 'echo-fragment', quantity: 20 },
      { itemId: 'ancient-rune', quantity: 3 },
      { itemId: 'divine-essence', quantity: 1 }
    ],
    requiredLevel: 5,
    craftingTime: 120,
    category: 'accessory'
  },
  {
    id: 'craft-ancient-sword',
    name: 'Ancient Sword of Echoes',
    description: 'A powerful sword forged from echo fragments.',
    result: {
      itemId: 'ancient-sword',
      quantity: 1
    },
    materials: [
      { itemId: 'echo-fragment', quantity: 50 },
      { itemId: 'ancient-rune', quantity: 10 },
      { itemId: 'divine-essence', quantity: 3 },
      { itemId: 'cosmic-dust', quantity: 1 }
    ],
    requiredLevel: 10,
    craftingTime: 300,
    category: 'weapon'
  }
];

// Helper functions
export const getItemById = (id: string): Item | undefined => {
  return items.find(item => item.id === id);
};

export const getEquipmentById = (id: string): (Weapon | Armor) | undefined => {
  return equipment.find(item => item.id === id);
};

export const getConsumableById = (id: string): Consumable | undefined => {
  return consumables.find(item => item.id === id);
};

export const getRecipeById = (id: string): CraftingRecipe | undefined => {
  return craftingRecipes.find(recipe => recipe.id === id);
};

export const getItemsByType = (type: string): Item[] => {
  return items.filter(item => item.type === type);
};

export const getItemsByRarity = (rarity: ItemRarity): Item[] => {
  return items.filter(item => item.rarity === rarity);
};