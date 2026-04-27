import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameState } from '@/lib/stores/useGameState';
import { useTacticalCombat } from '@/game/hooks/useTacticalCombat';
import { EnemyRenderer } from './EnemyRenderer';

export function CombatArena() {
  const { gamePhase, inCombat } = useGameState();
  const { combatState, selectEnemy } = useTacticalCombat();
  
  // Only render when in combat
  if (!inCombat || gamePhase !== 'combat') {
    return null;
  }
  
  return (
    <group>
      {/* Ground effect for combat arena */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[10, 32]} />
        <meshStandardMaterial 
          color="#333" 
          emissive="#333"
          emissiveIntensity={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Arena boundary effect */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[9.7, 10, 32]} />
        <meshStandardMaterial 
          color="#f39c12" 
          emissive="#f39c12"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Combat phase indicator in the center */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial 
          color={
            combatState.isPlayerTurn ? "#3498db" : "#e74c3c"
          } 
          emissive={
            combatState.isPlayerTurn ? "#3498db" : "#e74c3c"
          }
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
        />
      </mesh>
      
      {/* Render each enemy */}
      {combatState.enemies.map((enemy) => (
        <EnemyRenderer 
          key={enemy.id}
          enemy={enemy}
          position={enemy.position}
          isSelected={enemy.id === combatState.selectedEnemyId}
          currentHealth={enemy.currentHealth}
          onSelect={selectEnemy}
          effects={(enemy as any).effects || []}
        />
      ))}
      
      {/* Turn indicators */}
      <group position={[0, 0.1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.8, 5, 32, 1, 0, Math.PI * 2 * (combatState.movementPoints / 3)]} />
          <meshBasicMaterial color="#3498db" />
        </mesh>
        
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[5.2, 5.4, 32, 1, 0, Math.PI * 2 * (combatState.actionPoints / 2)]} />
          <meshBasicMaterial color="#e74c3c" />
        </mesh>
      </group>
    </group>
  );
}