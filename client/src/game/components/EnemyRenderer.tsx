import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { Enemy } from '@shared/types';

interface StatusEffect {
  id: string;
  type: 'dot' | 'stun' | 'weaken';
  duration: number;
  magnitude: number;
}

interface EnemyRendererProps {
  enemy: Enemy;
  position: [number, number, number];
  isSelected: boolean;
  currentHealth: number;
  onSelect: (enemyId: string) => void;
  effects?: StatusEffect[];
}

export function EnemyRenderer({ 
  enemy, 
  position, 
  isSelected, 
  currentHealth,
  onSelect,
  effects = []
}: EnemyRendererProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Health percentage for the health bar
  const healthPercent = currentHealth / enemy.health;
  
  // Handle hover state
  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => setHovered(false);
  
  // Handle enemy selection
  const handleClick = () => {
    onSelect(enemy.id);
  };
  
  // Simple animation effect
  useFrame((state) => {
    if (!groupRef.current) return;
    // Rotate slightly when selected or hovered
    if (isSelected || hovered) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    } else {
      groupRef.current.rotation.y = 0;
    }
  });
  
  // Color based on enemy type and state
  const getEnemyColor = () => {
    if (enemy.id.includes('corrupted')) {
      return '#9b59b6'; // Purple for corrupted enemies
    } else if (enemy.id.includes('shadow')) {
      return '#2c3e50'; // Dark blue for shadow enemies
    } else if (enemy.id.includes('echo')) {
      return '#3498db'; // Blue for echo-based enemies
    } else {
      return '#e74c3c'; // Red for other enemies
    }
  };
  
  // Different visual representation based on enemy type
  const renderEnemyModel = () => {
    return (
      <group>
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color={getEnemyColor()} />
        </mesh>
        <mesh position={[0, 2.2, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color={getEnemyColor()} />
        </mesh>
      </group>
    );
  };
  
  return (
    <group 
      ref={groupRef} 
      position={[position[0], position[1], position[2]]} 
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Enemy model */}
      {renderEnemyModel()}
      
      {/* Name and health UI */}
      <mesh position={[0, 3, -0.05]} scale={[2, 0.7, 0.01]}>
        <planeGeometry />
        <meshBasicMaterial color="black" transparent opacity={0.6} />
      </mesh>
      <Text position={[0, 3.15, 0]} fontSize={0.35} color="white" anchorX="center" anchorY="middle">
        {enemy.name}
      </Text>
      
      {/* Health bar background */}
      <mesh position={[0, 2.7, 0]}>
        <planeGeometry args={[1.4, 0.2]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      
      {/* Health bar foreground */}
      <mesh position={[0 - (1.4 * (1 - healthPercent)) / 2, 2.7, 0.01]} scale={[healthPercent, 1, 1]}>
        <planeGeometry args={[1.4, 0.2]} />
        <meshBasicMaterial color={
          healthPercent > 0.6 ? "#2ecc71" : 
          healthPercent > 0.3 ? "#f39c12" : 
          "#e74c3c"
        } />
      </mesh>
      
      {/* Status effects badges */}
      {effects.length > 0 && (
        <group position={[0, 2.35, 0]}>
          {effects.map((e, idx) => (
            <Text
              key={`${e.id}-${idx}`}
              position={[-0.7 + idx * 0.35, 0, 0]}
              fontSize={0.22}
              color={e.type === 'dot' ? '#9b59b6' : e.type === 'stun' ? '#f1c40f' : '#95a5a6'}
              anchorX="center"
              anchorY="middle"
            >
              {e.type.toUpperCase()[0]}{e.duration}
            </Text>
          ))}
        </group>
      )}
    </group>
  );
}