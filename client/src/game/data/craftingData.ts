import { CraftingMaterial, CraftingRecipe, CraftingStation, CraftingSkill } from '@shared/craftingTypes';

export const craftingMaterials: CraftingMaterial[] = [
  // Ores
  {
    id: 'iron_ore',
    name: 'Iron Ore',
    description: 'A common metal ore found in rocky areas',
    type: 'ore',
    rarity: 'common',
    value: 5,
    stackSize: 100,
    icon: '⛏️',
    source: 'gathering',
    locations: ['whispering_woods', 'crystal_caverns'],
    dropRate: 0.3,
    requiredLevel: 1
  },
  {
    id: 'copper_ore',
    name: 'Copper Ore',
    description: 'A reddish metal ore with good conductivity',
    type: 'ore',
    rarity: 'common',
    value: 8,
    stackSize: 100,
    icon: '⛏️',
    source: 'gathering',
    locations: ['whispering_woods', 'crystal_caverns'],
    dropRate: 0.25,
    requiredLevel: 1
  },
  {
    id: 'silver_ore',
    name: 'Silver Ore',
    description: 'A precious metal ore with mystical properties',
    type: 'ore',
    rarity: 'uncommon',
    value: 25,
    stackSize: 50,
    icon: '⛏️',
    source: 'gathering',
    locations: ['crystal_caverns', 'shadow_realm'],
    dropRate: 0.15,
    requiredLevel: 10
  },
  {
    id: 'gold_ore',
    name: 'Gold Ore',
    description: 'A rare and valuable metal ore',
    type: 'ore',
    rarity: 'rare',
    value: 50,
    stackSize: 25,
    icon: '⛏️',
    source: 'gathering',
    locations: ['shadow_realm', 'ancient_temple'],
    dropRate: 0.08,
    requiredLevel: 20
  },
  {
    id: 'mithril_ore',
    name: 'Mithril Ore',
    description: 'A legendary metal ore of incredible strength',
    type: 'ore',
    rarity: 'legendary',
    value: 200,
    stackSize: 10,
    icon: '⛏️',
    source: 'gathering',
    locations: ['ancient_temple', 'dragon_lair'],
    dropRate: 0.02,
    requiredLevel: 40
  },

  // Herbs
  {
    id: 'healing_herb',
    name: 'Healing Herb',
    description: 'A common herb with restorative properties',
    type: 'herb',
    rarity: 'common',
    value: 3,
    stackSize: 100,
    icon: '🌿',
    source: 'gathering',
    locations: ['whispering_woods', 'mystic_garden'],
    dropRate: 0.4,
    requiredLevel: 1
  },
  {
    id: 'mana_herb',
    name: 'Mana Herb',
    description: 'A herb that enhances magical energy',
    type: 'herb',
    rarity: 'uncommon',
    value: 12,
    stackSize: 50,
    icon: '🌿',
    source: 'gathering',
    locations: ['mystic_garden', 'enchanted_forest'],
    dropRate: 0.2,
    requiredLevel: 5
  },
  {
    id: 'rare_herb',
    name: 'Rare Herb',
    description: 'A rare herb with powerful alchemical properties',
    type: 'herb',
    rarity: 'rare',
    value: 40,
    stackSize: 25,
    icon: '🌿',
    source: 'gathering',
    locations: ['enchanted_forest', 'shadow_realm'],
    dropRate: 0.1,
    requiredLevel: 15
  },

  // Essences
  {
    id: 'fire_essence',
    name: 'Fire Essence',
    description: 'A concentrated essence of fire energy',
    type: 'essence',
    rarity: 'uncommon',
    value: 20,
    stackSize: 50,
    icon: '🔥',
    source: 'combat',
    locations: ['volcanic_peaks', 'dragon_lair'],
    dropRate: 0.15,
    requiredLevel: 10
  },
  {
    id: 'ice_essence',
    name: 'Ice Essence',
    description: 'A concentrated essence of ice energy',
    type: 'essence',
    rarity: 'uncommon',
    value: 20,
    stackSize: 50,
    icon: '❄️',
    source: 'combat',
    locations: ['frozen_wastes', 'crystal_caverns'],
    dropRate: 0.15,
    requiredLevel: 10
  },
  {
    id: 'lightning_essence',
    name: 'Lightning Essence',
    description: 'A concentrated essence of lightning energy',
    type: 'essence',
    rarity: 'uncommon',
    value: 20,
    stackSize: 50,
    icon: '⚡',
    source: 'combat',
    locations: ['storm_peaks', 'ancient_temple'],
    dropRate: 0.15,
    requiredLevel: 10
  },

  // Components
  {
    id: 'leather_strip',
    name: 'Leather Strip',
    description: 'A strip of processed leather',
    type: 'component',
    rarity: 'common',
    value: 8,
    stackSize: 100,
    icon: '🦌',
    source: 'combat',
    locations: ['whispering_woods', 'enchanted_forest'],
    dropRate: 0.3,
    requiredLevel: 1
  },
  {
    id: 'magic_crystal',
    name: 'Magic Crystal',
    description: 'A crystal infused with magical energy',
    type: 'component',
    rarity: 'rare',
    value: 60,
    stackSize: 25,
    icon: '💎',
    source: 'combat',
    locations: ['crystal_caverns', 'ancient_temple'],
    dropRate: 0.1,
    requiredLevel: 20
  }
];

export const craftingRecipes: CraftingRecipe[] = [
  // Weapons
  {
    id: 'iron_sword',
    name: 'Iron Sword',
    description: 'A basic iron sword',
    category: 'weapon',
    subcategory: 'sword',
    result: {
      itemId: 'iron_sword',
      quantity: 1,
      quality: 'normal'
    },
    materials: [
      { materialId: 'iron_ore', quantity: 3, consumed: true },
      { materialId: 'leather_strip', quantity: 1, consumed: true }
    ],
    requirements: {
      level: 1,
      skills: [{ skillId: 'weaponcraft', level: 1 }],
      tools: ['hammer'],
      station: 'forge'
    },
    craftingTime: 30,
    experience: 50,
    difficulty: 'easy',
    successRate: 85,
    criticalSuccessRate: 5,
    failurePenalty: {
      materialLoss: 25,
      toolDamage: 10
    },
    unlockConditions: {
      level: 1
    },
    isDiscoverable: false
  },
  {
    id: 'steel_sword',
    name: 'Steel Sword',
    description: 'A well-crafted steel sword',
    category: 'weapon',
    subcategory: 'sword',
    result: {
      itemId: 'steel_sword',
      quantity: 1,
      quality: 'fine'
    },
    materials: [
      { materialId: 'iron_ore', quantity: 5, consumed: true },
      { materialId: 'copper_ore', quantity: 2, consumed: true },
      { materialId: 'leather_strip', quantity: 2, consumed: true }
    ],
    requirements: {
      level: 10,
      skills: [{ skillId: 'weaponcraft', level: 5 }],
      tools: ['hammer'],
      station: 'forge'
    },
    craftingTime: 60,
    experience: 150,
    difficulty: 'normal',
    successRate: 75,
    criticalSuccessRate: 8,
    failurePenalty: {
      materialLoss: 30,
      toolDamage: 15
    },
    unlockConditions: {
      level: 10
    },
    isDiscoverable: false
  },
  {
    id: 'enchanted_sword',
    name: 'Enchanted Sword',
    description: 'A sword imbued with magical energy',
    category: 'weapon',
    subcategory: 'sword',
    result: {
      itemId: 'enchanted_sword',
      quantity: 1,
      quality: 'superior'
    },
    materials: [
      { materialId: 'silver_ore', quantity: 3, consumed: true },
      { materialId: 'magic_crystal', quantity: 1, consumed: true },
      { materialId: 'fire_essence', quantity: 1, consumed: true }
    ],
    requirements: {
      level: 20,
      skills: [
        { skillId: 'weaponcraft', level: 10 },
        { skillId: 'enchanting', level: 5 }
      ],
      tools: ['hammer', 'enchanting_tools'],
      station: 'forge'
    },
    craftingTime: 120,
    experience: 400,
    difficulty: 'hard',
    successRate: 60,
    criticalSuccessRate: 12,
    failurePenalty: {
      materialLoss: 40,
      toolDamage: 20
    },
    unlockConditions: {
      level: 20
    },
    isDiscoverable: true
  },

  // Armor
  {
    id: 'leather_armor',
    name: 'Leather Armor',
    description: 'Basic leather protection',
    category: 'armor',
    subcategory: 'light',
    result: {
      itemId: 'leather_armor',
      quantity: 1,
      quality: 'normal'
    },
    materials: [
      { materialId: 'leather_strip', quantity: 5, consumed: true }
    ],
    requirements: {
      level: 1,
      skills: [{ skillId: 'tailoring', level: 1 }],
      tools: ['needle'],
      station: 'tailoring'
    },
    craftingTime: 45,
    experience: 75,
    difficulty: 'easy',
    successRate: 80,
    criticalSuccessRate: 5,
    failurePenalty: {
      materialLoss: 20,
      toolDamage: 5
    },
    unlockConditions: {
      level: 1
    },
    isDiscoverable: false
  },
  {
    id: 'chain_mail',
    name: 'Chain Mail',
    description: 'Interlocked metal rings for protection',
    category: 'armor',
    subcategory: 'medium',
    result: {
      itemId: 'chain_mail',
      quantity: 1,
      quality: 'fine'
    },
    materials: [
      { materialId: 'iron_ore', quantity: 8, consumed: true },
      { materialId: 'leather_strip', quantity: 3, consumed: true }
    ],
    requirements: {
      level: 15,
      skills: [{ skillId: 'armorcraft', level: 8 }],
      tools: ['hammer', 'pliers'],
      station: 'forge'
    },
    craftingTime: 90,
    experience: 200,
    difficulty: 'normal',
    successRate: 70,
    criticalSuccessRate: 8,
    failurePenalty: {
      materialLoss: 35,
      toolDamage: 15
    },
    unlockConditions: {
      level: 15
    },
    isDiscoverable: false
  },

  // Consumables
  {
    id: 'health_potion',
    name: 'Health Potion',
    description: 'Restores health when consumed',
    category: 'consumable',
    subcategory: 'potion',
    result: {
      itemId: 'health_potion',
      quantity: 3,
      quality: 'normal'
    },
    materials: [
      { materialId: 'healing_herb', quantity: 2, consumed: true },
      { materialId: 'water', quantity: 1, consumed: true }
    ],
    requirements: {
      level: 1,
      skills: [{ skillId: 'alchemy', level: 1 }],
      tools: ['mortar_pestle'],
      station: 'alchemy'
    },
    craftingTime: 20,
    experience: 30,
    difficulty: 'trivial',
    successRate: 90,
    criticalSuccessRate: 10,
    failurePenalty: {
      materialLoss: 15,
      toolDamage: 5
    },
    unlockConditions: {
      level: 1
    },
    isDiscoverable: false
  },
  {
    id: 'mana_potion',
    name: 'Mana Potion',
    description: 'Restores magical energy when consumed',
    category: 'consumable',
    subcategory: 'potion',
    result: {
      itemId: 'mana_potion',
      quantity: 2,
      quality: 'normal'
    },
    materials: [
      { materialId: 'mana_herb', quantity: 2, consumed: true },
      { materialId: 'water', quantity: 1, consumed: true }
    ],
    requirements: {
      level: 5,
      skills: [{ skillId: 'alchemy', level: 3 }],
      tools: ['mortar_pestle'],
      station: 'alchemy'
    },
    craftingTime: 25,
    experience: 50,
    difficulty: 'easy',
    successRate: 85,
    criticalSuccessRate: 8,
    failurePenalty: {
      materialLoss: 20,
      toolDamage: 5
    },
    unlockConditions: {
      level: 5
    },
    isDiscoverable: false
  }
];

export const craftingStations: CraftingStation[] = [
  {
    id: 'forge',
    name: 'Blacksmith Forge',
    description: 'A traditional forge for metalworking',
    type: 'forge',
    location: 'whispering_woods',
    level: 1,
    upgrades: [
      {
        level: 1,
        name: 'Improved Bellows',
        description: 'Better airflow for hotter fires',
        cost: {
          gold: 100,
          materials: [
            { materialId: 'iron_ore', quantity: 5 }
          ]
        },
        benefits: {
          speedBonus: 0.1,
          successBonus: 5,
          qualityBonus: 0.05,
          experienceBonus: 0.1
        }
      },
      {
        level: 2,
        name: 'Masterwork Tools',
        description: 'High-quality tools for precision work',
        cost: {
          gold: 500,
          materials: [
            { materialId: 'silver_ore', quantity: 3 },
            { materialId: 'magic_crystal', quantity: 1 }
          ]
        },
        benefits: {
          speedBonus: 0.2,
          successBonus: 10,
          qualityBonus: 0.1,
          experienceBonus: 0.2
        }
      }
    ],
    currentUpgrade: 0,
    isUnlocked: true
  },
  {
    id: 'alchemy',
    name: 'Alchemy Station',
    description: 'A station for brewing potions and elixirs',
    type: 'alchemy',
    location: 'mystic_garden',
    level: 1,
    upgrades: [
      {
        level: 1,
        name: 'Precision Scales',
        description: 'Accurate measurement for better results',
        cost: {
          gold: 150,
          materials: [
            { materialId: 'copper_ore', quantity: 3 }
          ]
        },
        benefits: {
          speedBonus: 0.15,
          successBonus: 8,
          qualityBonus: 0.08,
          experienceBonus: 0.15
        }
      }
    ],
    currentUpgrade: 0,
    isUnlocked: true
  },
  {
    id: 'enchanting',
    name: 'Enchanting Table',
    description: 'A mystical table for imbuing items with magic',
    type: 'enchanting',
    location: 'ancient_temple',
    level: 1,
    upgrades: [
      {
        level: 1,
        name: 'Crystal Focus',
        description: 'Enhanced magical focus for better enchantments',
        cost: {
          gold: 1000,
          materials: [
            { materialId: 'magic_crystal', quantity: 5 },
            { materialId: 'gold_ore', quantity: 2 }
          ]
        },
        benefits: {
          speedBonus: 0.25,
          successBonus: 15,
          qualityBonus: 0.15,
          experienceBonus: 0.25
        }
      }
    ],
    currentUpgrade: 0,
    isUnlocked: false,
    unlockCost: {
      gold: 500,
      materials: [
        { materialId: 'magic_crystal', quantity: 3 }
      ]
    }
  }
];

export const craftingSkills: CraftingSkill[] = [
  {
    id: 'weaponcraft',
    name: 'Weaponcraft',
    description: 'The art of forging weapons',
    category: 'weaponcraft',
    level: 1,
    experience: 0,
    experienceToNext: 1000,
    specializations: [
      {
        id: 'sword_specialization',
        name: 'Sword Specialization',
        description: 'Expertise in crafting swords',
        level: 1,
        experience: 0,
        bonuses: [
          { type: 'sword_quality', value: 0.1 },
          { type: 'sword_speed', value: 0.05 }
        ]
      },
      {
        id: 'axe_specialization',
        name: 'Axe Specialization',
        description: 'Expertise in crafting axes',
        level: 1,
        experience: 0,
        bonuses: [
          { type: 'axe_quality', value: 0.1 },
          { type: 'axe_speed', value: 0.05 }
        ]
      }
    ],
    perks: [
      {
        id: 'master_smith',
        name: 'Master Smith',
        description: 'Reduces crafting time by 20%',
        level: 10,
        unlocked: false,
        cost: 5,
        effects: [
          { type: 'crafting_speed', value: 0.2 }
        ]
      },
      {
        id: 'quality_control',
        name: 'Quality Control',
        description: 'Increases success rate by 15%',
        level: 15,
        unlocked: false,
        cost: 8,
        effects: [
          { type: 'success_rate', value: 15 }
        ]
      }
    ]
  },
  {
    id: 'alchemy',
    name: 'Alchemy',
    description: 'The art of brewing potions and elixirs',
    category: 'alchemy',
    level: 1,
    experience: 0,
    experienceToNext: 1000,
    specializations: [
      {
        id: 'potion_specialization',
        name: 'Potion Specialization',
        description: 'Expertise in brewing potions',
        level: 1,
        experience: 0,
        bonuses: [
          { type: 'potion_quality', value: 0.1 },
          { type: 'potion_quantity', value: 0.05 }
        ]
      }
    ],
    perks: [
      {
        id: 'efficient_brewing',
        name: 'Efficient Brewing',
        description: 'Reduces material costs by 10%',
        level: 8,
        unlocked: false,
        cost: 6,
        effects: [
          { type: 'material_efficiency', value: 0.1 }
        ]
      }
    ]
  }
];