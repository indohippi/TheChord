import { DialogSequence } from '@shared/types';

export const dialogues: { [key: string]: DialogSequence } = {
  // Introduction sequence
  'intro': {
    id: 'intro',
    title: 'The Awakening',
    startNodeId: 'intro-1',
    nodes: {
      'intro-1': {
        id: 'intro-1',
        speaker: 'Mentor',
        text: 'Consciousness returns to you slowly. The world as you knew it is gone, shattered by the cataclysm.',
        next: 'intro-2'
      },
      'intro-2': {
        id: 'intro-2',
        speaker: 'Mentor',
        text: 'The cosmic order has fractured, releasing what we call the "Echoes" - fragments of creation itself.',
        next: 'intro-3'
      },
      'intro-3': {
        id: 'intro-3',
        speaker: 'Mentor',
        text: 'You have been chosen. Your connection to the ancient traditions makes you uniquely capable of gathering these Echoes.',
        next: 'intro-4'
      },
      'intro-4': {
        id: 'intro-4',
        speaker: 'Mentor',
        text: 'What tradition calls to you? Which path will you follow to restore the shattered order?',
        options: [
          {
            text: 'I feel drawn to the divine emanations and sacred geometry.',
            nextId: 'choose-covenant'
          },
          {
            text: 'The pursuit of knowledge and virtue speaks to me.',
            nextId: 'choose-philosopher'
          },
          {
            text: 'I sense the calling of divine warrior spirit within me.',
            nextId: 'choose-chakravarti'
          },
          {
            text: 'The ancient secrets and hidden connections beckon me.',
            nextId: 'choose-serpent'
          },
          {
            text: 'I am drawn to the balance of Yin and Yang, the harmony of nature.',
            nextId: 'choose-jade'
          }
        ]
      },
      'choose-covenant': {
        id: 'choose-covenant',
        speaker: 'Mentor',
        text: 'Ah, the path of the Covenant Weaver calls to you. The Kabbalah\'s Tree of Life will be your guide as you manipulate the very fabric of creation.',
        next: 'class-chosen'
      },
      'choose-philosopher': {
        id: 'choose-philosopher',
        speaker: 'Mentor',
        text: 'The Philosopher-King\'s journey awaits. Through alchemy and wisdom, you will bring order to chaos and light to darkness.',
        next: 'class-chosen'
      },
      'choose-chakravarti': {
        id: 'choose-chakravarti',
        speaker: 'Mentor',
        text: 'The Chakravarti Avatar manifests within you. Divine power flows through your veins, ready to strike down the forces of disorder.',
        next: 'class-chosen'
      },
      'choose-serpent': {
        id: 'choose-serpent',
        speaker: 'Mentor',
        text: 'The Serpent\'s Whisper echoes in your mind. The ancient mysteries of Egypt and the hidden knowledge of the Kabbalah are yours to command.',
        next: 'class-chosen'
      },
      'choose-jade': {
        id: 'choose-jade',
        speaker: 'Mentor',
        text: 'The Jade Dragon\'s spirit resonates with yours. Master the balance of opposing forces and channel the life energy of the cosmos.',
        next: 'class-chosen'
      },
      'class-chosen': {
        id: 'class-chosen',
        speaker: 'Mentor',
        text: 'Your path is chosen. Now you must journey into the fractured realms, gather the Echoes, and restore the shattered cosmic order. The first Echo Zone awaits.',
        next: 'intro-end'
      },
      'intro-end': {
        id: 'intro-end',
        speaker: 'Mentor',
        text: 'Remember, each Echo you encounter is a fragment of the original order. Some are corrupted, others preserved. Your task is to gather, understand, and ultimately reconstruct what was lost.',
        options: [
          {
            text: 'I am ready to begin my journey.',
            nextId: 'start-game'
          },
          {
            text: 'Tell me more about the Echoes first.',
            nextId: 'explain-echoes'
          }
        ]
      },
      'explain-echoes': {
        id: 'explain-echoes',
        speaker: 'Mentor',
        text: 'The Echoes are not just power to be collected. Each represents an aspect of the original cosmic order - a law, a principle, a truth. As you gather them, you will gain insight into the nature of creation itself.',
        next: 'start-game'
      },
      'start-game': {
        id: 'start-game',
        speaker: 'Mentor',
        text: 'Then go forth. Enter the Azure Labyrinth first - its crystalline structures may be the easiest for your newly awakened senses to navigate. The Echoes await.',
        next: 'end'
      }
    }
  },
  
  // Azure Labyrinth introduction
  'azure-intro': {
    id: 'azure-intro',
    title: 'The Azure Labyrinth',
    startNodeId: 'azure-1',
    nodes: {
      'azure-1': {
        id: 'azure-1',
        speaker: 'Narrator',
        text: 'You step into the Azure Labyrinth. Polished marble paths twist impossibly before you, and crystalline structures cast strange blue light across everything.',
        next: 'azure-2'
      },
      'azure-2': {
        id: 'azure-2',
        speaker: 'Narrator',
        text: 'Whispers echo around you - fragments of ancient prophecies, philosophical debates, and cosmic truths.',
        next: 'azure-3'
      },
      'azure-3': {
        id: 'azure-3',
        speaker: 'Echo Fragment',
        text: '...seeker... fragments... reconstruct... beware the distortions...',
        next: 'azure-4'
      },
      'azure-4': {
        id: 'azure-4',
        speaker: 'Narrator',
        text: 'A shimmering blue entity - your first Echo - hovers before you, its form reminiscent of a geometric pattern constantly folding in on itself.',
        options: [
          {
            text: 'Reach out to touch it.',
            nextId: 'azure-touch'
          },
          {
            text: 'Try to communicate with it.',
            nextId: 'azure-communicate'
          },
          {
            text: 'Observe it carefully first.',
            nextId: 'azure-observe'
          }
        ]
      },
      'azure-touch': {
        id: 'azure-touch',
        speaker: 'Narrator',
        text: 'As your hand touches the Echo, knowledge floods into your mind - fragments of wisdom about order, harmony, and the structure of reality itself.',
        next: 'azure-end'
      },
      'azure-communicate': {
        id: 'azure-communicate',
        speaker: 'Echo Fragment',
        text: 'I... am... logic... reason... order... fragment... join... restore...',
        next: 'azure-end'
      },
      'azure-observe': {
        id: 'azure-observe',
        speaker: 'Narrator',
        text: 'You notice that the Echo\'s geometric pattern matches ancient symbols of order and creation. It seems to represent a fundamental law of logic and reason.',
        next: 'azure-end'
      },
      'azure-end': {
        id: 'azure-end',
        speaker: 'Narrator',
        text: 'The Echo gently floats toward you and is absorbed into your being. You feel your connection to the cosmic order strengthen slightly. There are more Echoes to find in this labyrinth.',
        next: 'end'
      }
    }
  },
  
  // Encounter with enemy
  'enemy-encounter': {
    id: 'enemy-encounter',
    title: 'Corrupted Encounter',
    startNodeId: 'enemy-1',
    nodes: {
      'enemy-1': {
        id: 'enemy-1',
        speaker: 'Narrator',
        text: 'The air grows heavy with corruption. Before you, a twisted form materializes - an Echo corrupted by the cataclysm.',
        next: 'enemy-2'
      },
      'enemy-2': {
        id: 'enemy-2',
        speaker: 'Corrupted Echo',
        text: 'FRAGMENTED... BROKEN... YOU WILL JOIN THE CHAOS!',
        options: [
          {
            text: 'Prepare for battle.',
            nextId: 'battle-start'
          },
          {
            text: 'Attempt to communicate with it.',
            nextId: 'enemy-talk'
          },
          {
            text: 'Try to purify it with your abilities.',
            nextId: 'enemy-purify'
          }
        ]
      },
      'enemy-talk': {
        id: 'enemy-talk',
        speaker: 'Narrator',
        text: 'You attempt to reach the fragment of order within the corruption, but the entity is too far gone. It lunges toward you!',
        next: 'battle-start'
      },
      'enemy-purify': {
        id: 'enemy-purify',
        speaker: 'Narrator',
        text: 'You channel your power, attempting to purify the corruption. The entity recoils but then attacks, weakened but still dangerous.',
        next: 'battle-start'
      },
      'battle-start': {
        id: 'battle-start',
        speaker: 'Narrator',
        text: 'The corrupted Echo attacks! Use your abilities to defeat or purify it.',
        next: 'end'
      }
    }
  }
};
