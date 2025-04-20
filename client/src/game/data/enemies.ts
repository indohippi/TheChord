import { Enemy } from '@shared/types';

export const enemies: Enemy[] = [
  // Azure Labyrinth Enemies (Greek Echo)
  {
    id: 'corrupted-oracle',
    name: 'Corrupted Oracle',
    description: 'Once a vessel of prophecy, now twisted by the cataclysm into a distorted echo of knowledge.',
    health: 80,
    damage: 15,
    weaknesses: ['light', 'truth'],
    resistances: ['confusion', 'illusion'],
    abilities: ['Prophecy of Doom', 'Mind Fracture', 'Reality Twist'],
    sprite: 'corrupted-oracle',
    dropChance: 0.4
  },
  {
    id: 'echo-minotaur',
    name: 'Echo Minotaur',
    description: 'A labyrinthine guardian formed from shattered fragments of cosmic order.',
    health: 150,
    damage: 25,
    weaknesses: ['wisdom', 'light'],
    resistances: ['physical', 'confusion'],
    abilities: ['Labyrinth Charge', 'Echoing Roar', 'Axe Sweep'],
    sprite: 'echo-minotaur',
    dropChance: 0.6
  },
  {
    id: 'forgotten-philosopher',
    name: 'Forgotten Philosopher',
    description: 'The remnant of a great thinker, now endlessly repeating corrupted logic.',
    health: 65,
    damage: 18,
    weaknesses: ['harmony', 'chaos'],
    resistances: ['order', 'wisdom'],
    abilities: ['Paradox Loop', 'Syllogism Trap', 'Memory Drain'],
    sprite: 'forgotten-philosopher',
    dropChance: 0.35
  },
  
  // Obsidian Dunes Enemies (Egyptian Echo)
  {
    id: 'restless-pharaoh',
    name: 'Restless Pharaoh',
    description: 'A once-mighty ruler whose divine right has been corrupted into tyrannical energy.',
    health: 120,
    damage: 22,
    weaknesses: ['truth', 'light'],
    resistances: ['darkness', 'illusion'],
    abilities: ['Royal Command', 'Soul Drain', 'Desert Storm'],
    sprite: 'restless-pharaoh',
    dropChance: 0.5
  },
  {
    id: 'chaos-serpent',
    name: 'Chaos Serpent',
    description: 'A manifestation of Apophis, seeking to devour order and return all to primordial chaos.',
    health: 90,
    damage: 30,
    weaknesses: ['order', 'light'],
    resistances: ['chaos', 'corruption'],
    abilities: ['Chaos Bite', 'Venom of Disorder', 'Coil of Destruction'],
    sprite: 'chaos-serpent',
    dropChance: 0.45
  },
  {
    id: 'corrupted-anubis',
    name: 'Corrupted Anubis',
    description: 'A twisted version of the jackal-headed guide to the afterlife, now leading souls astray.',
    health: 100,
    damage: 25,
    weaknesses: ['harmony', 'truth'],
    resistances: ['death', 'corruption'],
    abilities: ['False Judgment', 'Soul Theft', 'Jackal Strike'],
    sprite: 'corrupted-anubis',
    dropChance: 0.55
  },
  
  // Jade Canopy Enemies (Chinese Echo)
  {
    id: 'twisted-dragon',
    name: 'Twisted Dragon',
    description: 'Once a symbol of fortune and power, now corrupted into a force of imbalance.',
    health: 140,
    damage: 28,
    weaknesses: ['harmony', 'balance'],
    resistances: ['elements', 'chaos'],
    abilities: ['Disharmony Breath', 'Scale Storm', 'Corrupt Luck'],
    sprite: 'twisted-dragon',
    dropChance: 0.65
  },
  {
    id: 'vengeful-spirit',
    name: 'Vengeful Spirit',
    description: 'A soul that refused to pass on, now feeding on the disrupted cosmic order.',
    health: 60,
    damage: 35,
    weaknesses: ['light', 'harmony'],
    resistances: ['physical', 'cold'],
    abilities: ['Spirit Drain', 'Haunting Wail', 'Possession'],
    sprite: 'vengeful-spirit',
    dropChance: 0.4
  },
  {
    id: 'fallen-monk',
    name: 'Fallen Monk',
    description: 'Once a master of balance, now consumed by the very forces they sought to control.',
    health: 80,
    damage: 22,
    weaknesses: ['truth', 'order'],
    resistances: ['physical', 'mental'],
    abilities: ['Corrupt Chi Strike', 'Broken Meditation', 'Path of Destruction'],
    sprite: 'fallen-monk',
    dropChance: 0.5
  }
];
