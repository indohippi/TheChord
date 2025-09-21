import { useState, useEffect } from 'react';
import { CombatActionType } from '@/game/systems/CombatSystem';
import { useCharacter } from '@/lib/stores/useCharacter';
import { useGameState } from '@/lib/stores/useGameState';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface TacticalCombatUIProps {
  onActionSelected: (action: CombatActionType) => void;
  onEndTurn: () => void;
  currentPhase: string;
  isPlayerTurn: boolean;
  currentTurn: number;
  movementPoints: number;
  actionPoints: number;
  combatLog: string[];
}

export function TacticalCombatUI({
  onActionSelected,
  onEndTurn,
  currentPhase,
  isPlayerTurn,
  currentTurn,
  movementPoints,
  actionPoints,
  combatLog
}: TacticalCombatUIProps) {
  const { abilities } = useCharacter();
  const { health, maxHealth, energy, maxEnergy } = useGameState();
  
  // Visible action buttons based on available points
  const canMove = isPlayerTurn && movementPoints > 0;
  const canAttack = isPlayerTurn && actionPoints > 0;
  const canUseAbility = isPlayerTurn && actionPoints > 0 && energy >= 10;

  // Create a dark background for text
  const createTextBackground = () => {
    return new THREE.MeshBasicMaterial({
      color: 'black',
      transparent: true,
      opacity: 0.6,
    });
  };

  return (
    <group position={[0, 0.1, 0]}>
      {/* Combat HUD - Top right - Turn & Phase Info */}
      <group position={[8, 5, -8]}>
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0, -0.01]} scale={[3, 0.5, 0.01]}>
            <planeGeometry />
            <meshBasicMaterial color="black" transparent opacity={0.6} />
          </mesh>
          <Text
            position={[0, 0, 0]}
            fontSize={0.4}
            color="white"
            anchorX="right"
            anchorY="top"
          >
            {`Turn: ${currentTurn} - ${isPlayerTurn ? 'Your Move' : 'Enemy Turn'}`}
          </Text>
        </group>
        
        <group position={[0, -0.5, 0]}>
          <mesh position={[0, 0, -0.01]} scale={[2.5, 0.4, 0.01]}>
            <planeGeometry />
            <meshBasicMaterial color="black" transparent opacity={0.6} />
          </mesh>
          <Text
            position={[0, 0, 0]}
            fontSize={0.3}
            color="white"
            anchorX="right"
            anchorY="top"
          >
            {`Phase: ${currentPhase}`}
          </Text>
        </group>
        
        <group position={[0, -1, 0]}>
          <mesh position={[0, 0, -0.01]} scale={[3.2, 0.4, 0.01]}>
            <planeGeometry />
            <meshBasicMaterial color="black" transparent opacity={0.6} />
          </mesh>
          <Text
            position={[0, 0, 0]}
            fontSize={0.3}
            color="white"
            anchorX="right"
            anchorY="top"
          >
            {`Movement: ${movementPoints} | Actions: ${actionPoints}`}
          </Text>
        </group>
      </group>
      
      {/* Combat Log - Top Left */}
      <group position={[-8, 5, -8]}>
        {combatLog.slice(-5).map((message, index) => (
          <group key={`log-${index}`} position={[0, -index * 0.5, 0]}>
            <mesh position={[3, 0, -0.01]} scale={[7, 0.4, 0.01]}>
              <planeGeometry />
              <meshBasicMaterial color="black" transparent opacity={0.6} />
            </mesh>
            <Text
              position={[0, 0, 0]} 
              fontSize={0.3}
              color="white"
              anchorX="left"
              anchorY="top"
              maxWidth={10}
            >
              {message}
            </Text>
          </group>
        ))}
      </group>
      
      {/* Player Stats - Bottom Left */}
      <group position={[-8, -4, -8]}>
        <group position={[0, 0, 0]}>
          <mesh position={[1.5, 0, -0.01]} scale={[3.5, 0.4, 0.01]}>
            <planeGeometry />
            <meshBasicMaterial color="black" transparent opacity={0.6} />
          </mesh>
          <Text
            position={[0, 0, 0]}
            fontSize={0.3}
            color="white"
            anchorX="left"
            anchorY="bottom"
          >
            {`Health: ${health}/${maxHealth}`}
          </Text>
        </group>
        
        <group position={[0, 0.5, 0]}>
          <mesh position={[1.5, 0, -0.01]} scale={[3.5, 0.4, 0.01]}>
            <planeGeometry />
            <meshBasicMaterial color="black" transparent opacity={0.6} />
          </mesh>
          <Text
            position={[0, 0, 0]}
            fontSize={0.3}
            color="white"
            anchorX="left"
            anchorY="bottom"
          >
            {`Energy: ${energy}/${maxEnergy}`}
          </Text>
        </group>
      </group>
      
      {/* Action Buttons - Bottom Right */}
      {isPlayerTurn && (
        <group position={[8, -4, -8]}>
          {/* Move Button */}
          <group 
            position={[0, 0, 0]} 
            onClick={() => canMove && onActionSelected(CombatActionType.MOVE)}
          >
            <mesh position={[0, 0, 0]} scale={[1.5, 0.5, 0.1]}>
              <boxGeometry />
              <meshStandardMaterial color={canMove ? "#4a9eff" : "#555555"} />
            </mesh>
            <Text
              position={[0, 0, 0.1]}
              fontSize={0.25}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              Move
            </Text>
          </group>
          
          {/* Attack Button */}
          <group 
            position={[0, 0.6, 0]} 
            onClick={() => canAttack && onActionSelected(CombatActionType.ATTACK)}
          >
            <mesh position={[0, 0, 0]} scale={[1.5, 0.5, 0.1]}>
              <boxGeometry />
              <meshStandardMaterial color={canAttack ? "#ff4a4a" : "#555555"} />
            </mesh>
            <Text
              position={[0, 0, 0.1]}
              fontSize={0.25}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              Attack
            </Text>
          </group>
          
          {/* Ability Button */}
          <group 
            position={[0, 1.2, 0]} 
            onClick={() => canUseAbility && onActionSelected(CombatActionType.ABILITY)}
          >
            <mesh position={[0, 0, 0]} scale={[1.5, 0.5, 0.1]}>
              <boxGeometry />
              <meshStandardMaterial color={canUseAbility ? "#9b59b6" : "#555555"} />
            </mesh>
            <Text
              position={[0, 0, 0.1]}
              fontSize={0.25}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              Ability
            </Text>
          </group>
          
          {/* End Turn Button */}
          <group position={[0, 1.8, 0]} onClick={onEndTurn}>
            <mesh position={[0, 0, 0]} scale={[1.5, 0.5, 0.1]}>
              <boxGeometry />
              <meshStandardMaterial color="#2ecc71" />
            </mesh>
            <Text
              position={[0, 0, 0.1]}
              fontSize={0.25}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              End Turn
            </Text>
          </group>
        </group>
      )}
      
      {/* Ability List - Only show when in ability selection mode */}
      {isPlayerTurn && currentPhase === 'ability' && (
        <group position={[0, 0, -5]}>
          <mesh position={[0, 0, 0]} scale={[5, 3, 0.1]}>
            <boxGeometry />
            <meshStandardMaterial color="#00000080" />
          </mesh>
          
          <Text
            position={[0, 1.2, 0.1]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="center"
          >
            Select Ability
          </Text>
          
          {abilities.map((ability, index) => (
            <group 
              key={ability.id} 
              position={[0, 0.6 - index * 0.5, 0.1]}
              onClick={() => {
                // Handle ability selection
                console.log(`Selected ability: ${ability.name}`);
              }}
            >
              <Text
                position={[0, 0, 0]}
                fontSize={0.25}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                {`${ability.name} (Cost: ${ability.energyCost})`}
              </Text>
            </group>
          ))}
        </group>
      )}
    </group>
  );
}