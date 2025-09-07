import { Quest, QuestChain, Faction } from '@shared/questTypes';

// Main Story Quests
export const mainQuests: Quest[] = [
  {
    id: 'awakening',
    title: 'The Awakening',
    description: 'You have awakened in a fractured reality. Find your way to the first Echo Zone.',
    longDescription: 'The cataclysm has shattered the cosmic order, and you are one of the few who can sense the Echoes of Creation. Your journey begins in the Azure Labyrinth, where the first fragments of order await.',
    type: 'main',
    status: 'active',
    level: 1,
    prerequisites: [],
    conditions: [],
    objectives: [
      {
        id: 'reach-azure-labyrinth',
        type: 'reach',
        description: 'Reach the Azure Labyrinth',
        target: 'azure-labyrinth',
        quantity: 1,
        current: 0,
        optional: false,
        hidden: false
      }
    ],
    rewards: [
      {
        type: 'experience',
        value: 100,
        description: '100 Experience Points'
      },
      {
        type: 'ability',
        value: 1,
        description: 'Unlock first class ability'
      }
    ],
    giver: 'The Voice of Creation',
    zone: 'azure-labyrinth',
    progress: 0,
    flags: {
      isMainQuest: true,
      isUrgent: true,
      isSecret: false,
      affectsStory: true
    }
  },
  {
    id: 'first-echo',
    title: 'The First Echo',
    description: 'Capture your first Echo of Creation to begin restoring order.',
    longDescription: 'The Azure Labyrinth holds the first fragment of cosmic order. You must find and capture it to begin your journey of restoration.',
    type: 'main',
    status: 'locked',
    level: 1,
    prerequisites: ['awakening'],
    conditions: [],
    objectives: [
      {
        id: 'find-echo',
        type: 'discover',
        description: 'Find the first Echo of Creation',
        target: 'echo-fragment',
        quantity: 1,
        current: 0,
        optional: false,
        hidden: false
      },
      {
        id: 'capture-echo',
        type: 'collect',
        description: 'Capture the Echo',
        target: 'echo-fragment',
        quantity: 1,
        current: 0,
        optional: false,
        hidden: false
      }
    ],
    rewards: [
      {
        type: 'experience',
        value: 200,
        description: '200 Experience Points'
      },
      {
        type: 'echoes',
        value: 50,
        description: '50 Echoes'
      },
      {
        type: 'item',
        value: 'echo-ring',
        quantity: 1,
        description: 'Ring of Echoes'
      }
    ],
    giver: 'The Voice of Creation',
    zone: 'azure-labyrinth',
    progress: 0,
    flags: {
      isMainQuest: true,
      isUrgent: true,
      isSecret: false,
      affectsStory: true
    }
  },
  {
    id: 'corrupted-guardian',
    title: 'The Corrupted Guardian',
    description: 'Defeat the Corrupted Oracle to cleanse the Azure Labyrinth.',
    longDescription: 'A powerful entity has been corrupted by the cataclysm and now guards the Echo. You must defeat it to proceed.',
    type: 'main',
    status: 'locked',
    level: 3,
    prerequisites: ['first-echo'],
    conditions: [],
    objectives: [
      {
        id: 'defeat-oracle',
        type: 'kill',
        description: 'Defeat the Corrupted Oracle',
        target: 'corrupted-oracle',
        quantity: 1,
        current: 0,
        optional: false,
        hidden: false
      }
    ],
    rewards: [
      {
        type: 'experience',
        value: 300,
        description: '300 Experience Points'
      },
      {
        type: 'gold',
        value: 100,
        description: '100 Gold'
      },
      {
        type: 'equipment',
        value: 'ancient-sword',
        quantity: 1,
        description: 'Ancient Sword of Echoes'
      }
    ],
    giver: 'The Voice of Creation',
    zone: 'azure-labyrinth',
    progress: 0,
    flags: {
      isMainQuest: true,
      isUrgent: true,
      isSecret: false,
      affectsStory: true
    }
  }
];

// Side Quests
export const sideQuests: Quest[] = [
  {
    id: 'echo-fragments',
    title: 'Echo Fragments',
    description: 'Collect scattered Echo Fragments throughout the Azure Labyrinth.',
    longDescription: 'The cataclysm has scattered small fragments of creation energy throughout the zone. Collecting them will help you understand the nature of the Echoes.',
    type: 'side',
    status: 'available',
    level: 2,
    prerequisites: [],
    conditions: [],
    objectives: [
      {
        id: 'collect-fragments',
        type: 'collect',
        description: 'Collect Echo Fragments',
        target: 'echo-fragment',
        quantity: 10,
        current: 0,
        optional: false,
        hidden: false
      }
    ],
    rewards: [
      {
        type: 'experience',
        value: 150,
        description: '150 Experience Points'
      },
      {
        type: 'gold',
        value: 50,
        description: '50 Gold'
      }
    ],
    giver: 'Wandering Scholar',
    zone: 'azure-labyrinth',
    progress: 0,
    flags: {
      isMainQuest: false,
      isUrgent: false,
      isSecret: false,
      affectsStory: false
    }
  },
  {
    id: 'philosophers-notes',
    title: 'The Philosopher\'s Notes',
    description: 'Find the lost notes of a great philosopher in the Azure Labyrinth.',
    longDescription: 'A philosopher once studied the nature of reality in this place. Their notes might contain valuable insights about the Echoes.',
    type: 'side',
    status: 'available',
    level: 2,
    prerequisites: [],
    conditions: [],
    objectives: [
      {
        id: 'find-notes',
        type: 'collect',
        description: 'Find the Philosopher\'s Notes',
        target: 'philosophers-notes',
        quantity: 1,
        current: 0,
        optional: false,
        hidden: false
      },
      {
        id: 'deliver-notes',
        type: 'deliver',
        description: 'Deliver the notes to the Wandering Scholar',
        target: 'wandering-scholar',
        quantity: 1,
        current: 0,
        optional: false,
        hidden: false
      }
    ],
    rewards: [
      {
        type: 'experience',
        value: 200,
        description: '200 Experience Points'
      },
      {
        type: 'item',
        value: 'wisdom-amulet',
        quantity: 1,
        description: 'Amulet of Wisdom'
      }
    ],
    giver: 'Wandering Scholar',
    zone: 'azure-labyrinth',
    progress: 0,
    flags: {
      isMainQuest: false,
      isUrgent: false,
      isSecret: false,
      affectsStory: false
    }
  },
  {
    id: 'labyrinth-explorer',
    title: 'Labyrinth Explorer',
    description: 'Explore all areas of the Azure Labyrinth to map its secrets.',
    longDescription: 'The Azure Labyrinth is vast and mysterious. Explore its depths to uncover hidden secrets and valuable resources.',
    type: 'exploration',
    status: 'available',
    level: 1,
    prerequisites: [],
    conditions: [],
    objectives: [
      {
        id: 'explore-north',
        type: 'explore',
        description: 'Explore the Northern Chambers',
        target: 'northern-chambers',
        quantity: 1,
        current: 0,
        optional: false,
        hidden: false
      },
      {
        id: 'explore-south',
        type: 'explore',
        description: 'Explore the Southern Chambers',
        target: 'southern-chambers',
        quantity: 1,
        current: 0,
        optional: false,
        hidden: false
      },
      {
        id: 'explore-east',
        type: 'explore',
        description: 'Explore the Eastern Chambers',
        target: 'eastern-chambers',
        quantity: 1,
        current: 0,
        optional: false,
        hidden: false
      },
      {
        id: 'explore-west',
        type: 'explore',
        description: 'Explore the Western Chambers',
        target: 'western-chambers',
        quantity: 1,
        current: 0,
        hidden: false
      }
    ],
    rewards: [
      {
        type: 'experience',
        value: 250,
        description: '250 Experience Points'
      },
      {
        type: 'gold',
        value: 75,
        description: '75 Gold'
      },
      {
        type: 'skill_point',
        value: 1,
        description: '1 Skill Point'
      }
    ],
    giver: 'Map Keeper',
    zone: 'azure-labyrinth',
    progress: 0,
    flags: {
      isMainQuest: false,
      isUrgent: false,
      isSecret: false,
      affectsStory: false
    }
  }
];

// Daily Quests
export const dailyQuests: Quest[] = [
  {
    id: 'daily-echo-hunt',
    title: 'Daily Echo Hunt',
    description: 'Hunt for Echo Fragments in the Azure Labyrinth.',
    longDescription: 'A daily task to collect Echo Fragments and maintain your connection to the cosmic order.',
    type: 'daily',
    status: 'available',
    level: 1,
    prerequisites: [],
    conditions: [],
    objectives: [
      {
        id: 'collect-daily-fragments',
        type: 'collect',
        description: 'Collect 5 Echo Fragments',
        target: 'echo-fragment',
        quantity: 5,
        current: 0,
        optional: false,
        hidden: false
      }
    ],
    rewards: [
      {
        type: 'experience',
        value: 100,
        description: '100 Experience Points'
      },
      {
        type: 'gold',
        value: 25,
        description: '25 Gold'
      }
    ],
    giver: 'Echo Keeper',
    zone: 'azure-labyrinth',
    repeatable: true,
    cooldown: 86400, // 24 hours
    progress: 0,
    flags: {
      isMainQuest: false,
      isUrgent: false,
      isSecret: false,
      affectsStory: false
    }
  },
  {
    id: 'daily-combat',
    title: 'Daily Combat Training',
    description: 'Defeat enemies to improve your combat skills.',
    longDescription: 'Practice makes perfect. Engage in combat to hone your abilities.',
    type: 'daily',
    status: 'available',
    level: 1,
    prerequisites: [],
    conditions: [],
    objectives: [
      {
        id: 'defeat-enemies',
        type: 'kill',
        description: 'Defeat 3 enemies',
        target: 'any-enemy',
        quantity: 3,
        current: 0,
        optional: false,
        hidden: false
      }
    ],
    rewards: [
      {
        type: 'experience',
        value: 75,
        description: '75 Experience Points'
      },
      {
        type: 'gold',
        value: 20,
        description: '20 Gold'
      }
    ],
    giver: 'Combat Instructor',
    zone: 'azure-labyrinth',
    repeatable: true,
    cooldown: 86400, // 24 hours
    progress: 0,
    flags: {
      isMainQuest: false,
      isUrgent: false,
      isSecret: false,
      affectsStory: false
    }
  }
];

// Quest Chains
export const questChains: QuestChain[] = [
  {
    id: 'echo-mastery',
    name: 'Echo Mastery',
    description: 'Master the art of working with Echoes of Creation.',
    quests: ['first-echo', 'echo-fragments', 'philosophers-notes'],
    currentQuest: 0,
    completed: false,
    rewards: [
      {
        type: 'experience',
        value: 500,
        description: '500 Experience Points'
      },
      {
        type: 'ability',
        value: 1,
        description: 'Unlock Echo Mastery ability'
      }
    ]
  },
  {
    id: 'labyrinth-master',
    name: 'Labyrinth Master',
    description: 'Become a master of the Azure Labyrinth.',
    quests: ['labyrinth-explorer', 'corrupted-guardian'],
    currentQuest: 0,
    completed: false,
    rewards: [
      {
        type: 'experience',
        value: 400,
        description: '400 Experience Points'
      },
      {
        type: 'equipment',
        value: 'philosophers-staff',
        quantity: 1,
        description: 'Philosopher\'s Staff'
      }
    ]
  }
];

// Factions
export const factions: Faction[] = [
  {
    id: 'echo-keepers',
    name: 'Echo Keepers',
    description: 'Guardians of the cosmic order who seek to restore balance.',
    reputation: 0,
    level: 0,
    quests: ['echo-fragments', 'daily-echo-hunt'],
    rewards: [
      {
        type: 'equipment',
        value: 'echo-robe',
        quantity: 1,
        description: 'Robe of Echoes'
      }
    ]
  },
  {
    id: 'philosophers-guild',
    name: 'Philosophers Guild',
    description: 'Scholars who study the nature of reality and the Echoes.',
    reputation: 0,
    level: 0,
    quests: ['philosophers-notes'],
    rewards: [
      {
        type: 'equipment',
        value: 'philosophers-vestments',
        quantity: 1,
        description: 'Philosopher\'s Vestments'
      }
    ]
  },
  {
    id: 'labyrinth-explorers',
    name: 'Labyrinth Explorers',
    description: 'Adventurers who map and explore the mysterious zones.',
    reputation: 0,
    level: 0,
    quests: ['labyrinth-explorer'],
    rewards: [
      {
        type: 'equipment',
        value: 'explorers-gear',
        quantity: 1,
        description: 'Explorer\'s Gear'
      }
    ]
  }
];

// All quests combined
export const allQuests: Quest[] = [
  ...mainQuests,
  ...sideQuests,
  ...dailyQuests
];

// Helper functions
export const getQuestById = (id: string): Quest | undefined => {
  return allQuests.find(quest => quest.id === id);
};

export const getQuestsByType = (type: string): Quest[] => {
  return allQuests.filter(quest => quest.type === type);
};

export const getQuestsByZone = (zone: string): Quest[] => {
  return allQuests.filter(quest => quest.zone === zone);
};

export const getQuestsByGiver = (giver: string): Quest[] => {
  return allQuests.filter(quest => quest.giver === giver);
};

export const getQuestChainById = (id: string): QuestChain | undefined => {
  return questChains.find(chain => chain.id === id);
};

export const getFactionById = (id: string): Faction | undefined => {
  return factions.find(faction => faction.id === id);
};