import { EchoZoneData, EchoEntity } from '@shared/types';
import { enemies } from './enemies';

// Helper function to create echoes for a zone
const createEchoes = (zoneType: string, count: number): EchoEntity[] => {
  const echoes: EchoEntity[] = [];
  const alignments: ('balanced' | 'corrupted' | 'purified')[] = ['balanced', 'corrupted', 'purified'];
  
  for (let i = 0; i < count; i++) {
    // Using index-based deterministic values instead of random
    const alignment = alignments[i % alignments.length];
    const power = 10 + (i * 5); // Power increases with index
    
    // Position is set systematically within zone bounds
    const position: [number, number, number] = [
      -40 + (i * 20) % 80,  // x coordinate, wrapped to stay in bounds
      0.5,                  // fixed y height
      -40 + Math.floor(i / 4) * 20 // z coordinate, incremented every 4 echoes
    ];
    
    echoes.push({
      id: `${zoneType}-echo-${i}`,
      name: `${zoneType} Echo ${i + 1}`,
      description: `A fragment of reality reflecting the essence of ${zoneType}`,
      power,
      alignment,
      interactions: ['examine', 'absorb', 'purify'],
      sprite: `echo-${alignment}`,
      position
    });
  }
  
  return echoes;
};

export const echoZones: EchoZoneData[] = [
  {
    type: 'AzureLabyrinth',
    name: 'The Azure Labyrinth',
    description: 'A sprawling, impossibly complex maze constructed from polished marble and crystalline formations. The air vibrates with whispers of ancient prophecies.',
    visualTheme: [
      'Polished white marble structures',
      'Crystalline blue formations',
      'Geometric Greek patterns',
      'Shifting maze passages',
      'Flowing water features'
    ],
    ambientLight: [0.2, 0.3, 0.5], // Blue-tinted light
    fogDensity: 0.05,
    groundTexture: 'stone',
    echoes: createEchoes('azure', 8),
    enemies: enemies.filter(enemy => enemy.name.includes('Oracle') || enemy.name.includes('Minotaur') || enemy.name.includes('Philosopher')),
    boundaries: {
      minX: -50,
      maxX: 50,
      minZ: -50,
      maxZ: 50
    }
  },
  {
    type: 'ObsidianDunes',
    name: 'The Obsidian Dunes',
    description: 'Vast, shifting deserts of black sand, haunted by shimmering mirages and the spectral forms of forgotten Pharaohs.',
    visualTheme: [
      'Black sand dunes',
      'Obsidian obelisks and pyramids',
      'Hieroglyphic engravings',
      'Shimmering heat mirages',
      'Spectral pharaoh forms'
    ],
    ambientLight: [0.4, 0.3, 0.2], // Amber-tinted light
    fogDensity: 0.08,
    groundTexture: 'sand',
    echoes: createEchoes('obsidian', 8),
    enemies: enemies.filter(enemy => enemy.name.includes('Pharaoh') || enemy.name.includes('Serpent') || enemy.name.includes('Anubis')),
    boundaries: {
      minX: -60,
      maxX: 60,
      minZ: -60,
      maxZ: 60
    }
  },
  {
    type: 'JadeCanopy',
    name: 'The Jade Canopy',
    description: 'A towering, bioluminescent jungle where ancient temples are grown into the very trees, and the boundaries between the mortal and spirit realms blur.',
    visualTheme: [
      'Towering jade-colored trees',
      'Bioluminescent flora',
      'Living temple structures',
      'Floating lanterns',
      'Circular Yin-Yang patterns'
    ],
    ambientLight: [0.2, 0.4, 0.3], // Jade-tinted light
    fogDensity: 0.1,
    groundTexture: 'grass',
    echoes: createEchoes('jade', 8),
    enemies: enemies.filter(enemy => enemy.name.includes('Dragon') || enemy.name.includes('Spirit') || enemy.name.includes('Monk')),
    boundaries: {
      minX: -55,
      maxX: 55,
      minZ: -55,
      maxZ: 55
    }
  }
];
