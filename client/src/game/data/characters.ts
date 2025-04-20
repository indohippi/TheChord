import { CharacterData, CharacterClass } from '@shared/types';

export const characters: CharacterData[] = [
  {
    class: 'CovenantWeaver',
    name: 'Covenant Weaver',
    description: 'Masters of interconnectedness who manipulate the fabric of reality through divine emanations. They can disrupt enemy formations and banish corrupted entities.',
    visualCues: [
      'Flowing robes with geometric patterns',
      'Tree of Life symbols',
      'Hebrew script motifs',
      'Blue and white color palette'
    ],
    baseStats: {
      strength: 6,
      wisdom: 14,
      agility: 8,
      willpower: 12,
      harmony: 10
    },
    abilities: [
      {
        id: 'shem-severance',
        name: 'Shem HaMephorash Severance',
        description: 'Disrupts enemy formations based on the negative aspects of creation',
        energyCost: 30,
        cooldown: 8,
        effect: 'Damages and stuns groups of enemies',
        animation: 'blue-energy-wave',
        sprite: 'shem-wave'
      },
      {
        id: 'divine-resonance',
        name: 'Divine Name Resonance',
        description: 'Manipulates reality through the power of the Tetragrammaton',
        energyCost: 40,
        cooldown: 12,
        effect: 'Temporarily alters the environment to the player\'s advantage',
        animation: 'reality-shift',
        sprite: 'tetragrammaton'
      },
      {
        id: 'qliphoth-seal',
        name: 'Qliphoth Seal',
        description: 'Creates a temporary banishment of corrupted entities',
        energyCost: 25,
        cooldown: 10,
        effect: 'Removes weaker enemies from battle and weakens stronger ones',
        animation: 'seal-cast',
        sprite: 'qliphoth-seal'
      }
    ],
    sprite: 'covenant-weaver'
  },
  {
    class: 'PhilosopherKing',
    name: 'Philosopher-King',
    description: 'Seekers of knowledge and virtue who restore cosmic balance through alchemy and strategic foresight.',
    visualCues: [
      'Alchemist robes with golden trim',
      'Philosopher\'s stone emblem',
      'Greek-inspired armor elements',
      'Red and gold color palette'
    ],
    baseStats: {
      strength: 8,
      wisdom: 12,
      agility: 7,
      willpower: 13,
      harmony: 10
    },
    abilities: [
      {
        id: 'stone-transmutation',
        name: 'Philosopher\'s Stone Transmutation',
        description: 'Alchemical transformation based on the four elements',
        energyCost: 35,
        cooldown: 10,
        effect: 'Transforms harmful elements into beneficial ones',
        animation: 'element-shift',
        sprite: 'philosophers-stone'
      },
      {
        id: 'mind-of-zeus',
        name: 'Mind of Zeus',
        description: 'Grants strategic foresight and control over the battlefield',
        energyCost: 30,
        cooldown: 15,
        effect: 'Reveals enemy weaknesses and enhances critical hit chance',
        animation: 'lightning-insight',
        sprite: 'zeus-lightning'
      },
      {
        id: 'golden-age',
        name: 'The Golden Age',
        description: 'Temporarily restores harmony and prosperity to the area',
        energyCost: 50,
        cooldown: 20,
        effect: 'Heals allies and weakens corrupted Echoes',
        animation: 'golden-aura',
        sprite: 'golden-age'
      }
    ],
    sprite: 'philosopher-king'
  },
  {
    class: 'ChakravartiAvatar',
    name: 'Chakravarti Avatar',
    description: 'Divine warriors who embody cosmic order and wield the power of the gods to strike down chaos.',
    visualCues: [
      'Ornate warrior armor with divine motifs',
      'Representations of Hindu deities',
      'Multiple arms in combat stance',
      'Orange and deep blue color palette'
    ],
    baseStats: {
      strength: 14,
      wisdom: 8,
      agility: 10,
      willpower: 8,
      harmony: 10
    },
    abilities: [
      {
        id: 'dharma-shield',
        name: 'Dharma Shield',
        description: 'Manifests a divine barrier that reflects chaos back to its source',
        energyCost: 25,
        cooldown: 8,
        effect: 'Blocks and reflects damage back to attackers',
        animation: 'shield-manifest',
        sprite: 'dharma-shield'
      },
      {
        id: 'cosmic-breath',
        name: 'Cosmic Breath',
        description: 'Channels the breath of creation to purify corrupted Echoes',
        energyCost: 40,
        cooldown: 12,
        effect: 'Area damage with purification effect on Echoes',
        animation: 'breath-wave',
        sprite: 'cosmic-breath'
      },
      {
        id: 'avatars-strike',
        name: 'Avatar\'s Strike',
        description: 'A devastating blow channeling divine power',
        energyCost: 35,
        cooldown: 10,
        effect: 'High single-target damage with stun effect',
        animation: 'divine-strike',
        sprite: 'avatar-strike'
      }
    ],
    sprite: 'chakravarti-avatar'
  },
  {
    class: 'SerpentsWhisper',
    name: 'Serpent\'s Whisper',
    description: 'Masters of ancient secrets who manipulate darkness and chaos while judging the fallen.',
    visualCues: [
      'Serpent motifs on dark robes',
      'Egyptian hieroglyphs and symbols',
      'Scales of Ma\'at emblem',
      'Black and emerald color palette'
    ],
    baseStats: {
      strength: 7,
      wisdom: 13,
      agility: 12,
      willpower: 9,
      harmony: 9
    },
    abilities: [
      {
        id: 'apophis-shadow',
        name: 'Apophis\' Shadow',
        description: 'Manipulation of darkness and chaos against enemies',
        energyCost: 30,
        cooldown: 10,
        effect: 'Creates areas of darkness that damage and confuse enemies',
        animation: 'shadow-spread',
        sprite: 'apophis-shadow'
      },
      {
        id: 'scales-of-maat',
        name: 'The Scales of Ma\'at',
        description: 'Weighs the hearts of enemies against the feather of truth',
        energyCost: 45,
        cooldown: 15,
        effect: 'Instantly defeats weak corrupted entities, damages stronger ones',
        animation: 'scales-judgment',
        sprite: 'scales-maat'
      },
      {
        id: 'serpents-embrace',
        name: 'Serpent\'s Embrace',
        description: 'Envelops the target in corrosive chaos energies',
        energyCost: 25,
        cooldown: 8,
        effect: 'Deals damage over time and reduces enemy defense',
        animation: 'serpent-coil',
        sprite: 'serpent-embrace'
      }
    ],
    sprite: 'serpents-whisper'
  },
  {
    class: 'JadeDragon',
    name: 'Jade Dragon',
    description: 'Masters of balance between Yin and Yang who harness natural forces and spiritual energy.',
    visualCues: [
      'Flowing jade-colored robes',
      'Dragon motifs and circular patterns',
      'Yin-Yang symbols',
      'Green and white color palette'
    ],
    baseStats: {
      strength: 10,
      wisdom: 10,
      agility: 12,
      willpower: 9,
      harmony: 14
    },
    abilities: [
      {
        id: 'dragons-breath',
        name: 'Dragon\'s Breath',
        description: 'Releases a powerful blast of elemental energy',
        energyCost: 35,
        cooldown: 10,
        effect: 'Cone-shaped elemental damage and knockback',
        animation: 'elemental-breath',
        sprite: 'dragon-breath'
      },
      {
        id: 'yin-yang-shift',
        name: 'Yin & Yang Shift',
        description: 'Manipulates the balance of opposing forces',
        energyCost: 30,
        cooldown: 12,
        effect: 'Converts harmful effects to beneficial ones or vice versa',
        animation: 'yin-yang-spin',
        sprite: 'yin-yang'
      },
      {
        id: 'qi-conduit',
        name: 'Qi Conduit',
        description: 'Channels the life force energy of the world',
        energyCost: 40,
        cooldown: 15,
        effect: 'Heals self and allies while creating a zone of harmony',
        animation: 'qi-channel',
        sprite: 'qi-conduit'
      }
    ],
    sprite: 'jade-dragon'
  }
];
