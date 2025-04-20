import { useState, useEffect } from 'react';
import { characters } from '../data/characters';
import { CharacterClass } from '@shared/types';
import { useCharacter } from '@/lib/stores/useCharacter';
import { useGameState } from '@/lib/stores/useGameState';
import { useAudio } from '@/lib/stores/useAudio';

export function CharacterSelection() {
  const { setSelectedClass } = useCharacter();
  const { setGamePhase } = useGameState();
  const { playSuccess } = useAudio();
  
  const [hoveredClass, setHoveredClass] = useState<CharacterClass | null>(null);
  const [selectedCard, setSelectedCard] = useState<CharacterClass | null>(null);
  
  // Handle character selection
  const handleSelectCharacter = (characterClass: CharacterClass) => {
    setSelectedCard(characterClass);
    
    // Play sound effect
    playSuccess();
    
    // Apply selection after a short delay for animation
    setTimeout(() => {
      setSelectedClass(characterClass);
      setGamePhase('gameplay');
      console.log(`Selected character: ${characterClass}`);
    }, 800);
  };
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 text-white z-50 p-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-300 uppercase tracking-wider">
        Choose Your Path
      </h1>
      
      <p className="text-lg text-center mb-8 max-w-2xl">
        Select the tradition that calls to you. Each path represents a different approach to reconstructing the fractured cosmic order.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl">
        {characters.map((character) => (
          <div 
            key={character.class}
            className={`character-card relative border-4 cursor-pointer transition-all duration-300 p-4 h-96
              ${hoveredClass === character.class ? 'border-blue-400 scale-105' : 'border-gray-700'}
              ${selectedCard === character.class ? 'border-yellow-400 scale-110' : ''}
              ${selectedCard && selectedCard !== character.class ? 'opacity-50 scale-95' : ''}
            `}
            style={{ 
              background: 'rgba(10, 25, 47, 0.8)',
              boxShadow: hoveredClass === character.class ? '0 0 20px rgba(66, 153, 225, 0.5)' : 'none',
            }}
            onMouseEnter={() => setHoveredClass(character.class)}
            onMouseLeave={() => setHoveredClass(null)}
            onClick={() => handleSelectCharacter(character.class)}
          >
            {/* Character pixel art representation - using CSS shapes for 8-bit style */}
            <div className="flex justify-center mb-4 h-32 items-center">
              <div 
                className="w-20 h-24"
                style={{ 
                  background: character.class === 'CovenantWeaver' ? '#3498db' : 
                             character.class === 'PhilosopherKing' ? '#e74c3c' :
                             character.class === 'ChakravartiAvatar' ? '#f39c12' :
                             character.class === 'SerpentsWhisper' ? '#2ecc71' :
                             '#9b59b6', // Jade Dragon
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
                  clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)',
                }}
              />
            </div>

            <h2 className="text-xl font-bold mb-2 text-center">{character.name}</h2>
            
            <p className="text-sm mb-3 h-24 overflow-hidden">
              {character.description}
            </p>
            
            {/* Stats indicators */}
            <div className="grid grid-cols-5 gap-1 mt-auto">
              {Object.entries(character.baseStats).map(([stat, value]) => (
                <div key={stat} className="flex flex-col items-center">
                  <div className="text-xs text-gray-400 capitalize">{stat.slice(0, 3)}</div>
                  <div 
                    className="w-full bg-gray-700 h-16"
                    style={{ 
                      clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)',
                      background: 'transparent',
                      position: 'relative',
                    }}
                  >
                    <div 
                      style={{ 
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: `${(value / 15) * 100}%`,
                        background: character.class === 'CovenantWeaver' ? '#3498db' : 
                                   character.class === 'PhilosopherKing' ? '#e74c3c' :
                                   character.class === 'ChakravartiAvatar' ? '#f39c12' :
                                   character.class === 'SerpentsWhisper' ? '#2ecc71' :
                                   '#9b59b6', // Jade Dragon
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
