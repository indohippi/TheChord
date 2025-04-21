import { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { Enemy } from '@shared/types';

interface EnemyRendererProps {
  enemy: Enemy;
  position: [number, number, number];
  isSelected: boolean;
  currentHealth: number;
  onSelect: (enemyId: string) => void;
}

export function EnemyRenderer({ 
  enemy, 
  position, 
  isSelected, 
  currentHealth,
  onSelect
}: EnemyRendererProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Animation properties
  const [bobOffset, setBobOffset] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  
  // Health percentage for the health bar
  const healthPercent = currentHealth / enemy.health;
  
  // Handle hover state
  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => setHovered(false);
  
  // Handle enemy selection
  const handleClick = () => {
    console.log(`Enemy selected: ${enemy.name}`);
    onSelect(enemy.id);
  };
  
  // Simple animation effect
  useFrame((state) => {
    // Bob up and down
    if (groupRef.current) {
      setBobOffset(Math.sin(state.clock.elapsedTime * 2) * 0.1);
      
      // Rotate slightly when selected or hovered
      if (isSelected || hovered) {
        setRotationY(state.clock.elapsedTime);
      }
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
    // Different model based on enemy id patterns
    if (enemy.id.includes('minotaur')) {
      return (
        <group>
          {/* Body */}
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[1.4, 2, 1]} />
            <meshStandardMaterial color={getEnemyColor()} />
          </mesh>
          
          {/* Head with horns */}
          <mesh position={[0, 2.2, 0]}>
            <boxGeometry args={[1, 0.8, 0.8]} />
            <meshStandardMaterial color={getEnemyColor()} />
          </mesh>
          
          {/* Left horn */}
          <mesh position={[-0.6, 2.5, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          
          {/* Right horn */}
          <mesh position={[0.6, 2.5, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        </group>
      );
    } else if (enemy.id.includes('oracle')) {
      return (
        <group>
          {/* Floating orb */}
          <mesh position={[0, 1.5, 0]}>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial 
              color={getEnemyColor()} 
              emissive={getEnemyColor()} 
              emissiveIntensity={0.3} 
            />
          </mesh>
          
          {/* Swirling particles */}
          {[...Array(5)].map((_, i) => (
            <mesh 
              key={`particle-${i}`} 
              position={[
                Math.sin(i * (Math.PI * 2 / 5) + rotationY) * 1.2,
                1.5 + Math.cos(i * (Math.PI * 2 / 5)) * 0.3,
                Math.cos(i * (Math.PI * 2 / 5) + rotationY) * 1.2
              ]}
            >
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
            </mesh>
          ))}
        </group>
      );
    } else {
      // Default enemy representation
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
    }
  };
  
  return (
    <group 
      ref={groupRef} 
      position={[position[0], position[1] + bobOffset, position[2]]} 
      rotation={[0, rotationY * (isSelected ? 0.5 : 0.1), 0]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Enemy model */}
      {renderEnemyModel()}
      
      {/* Selection indicator */}
      {(isSelected || hovered) && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.4, 32]} />
          <meshBasicMaterial color={isSelected ? "#2ecc71" : "#f39c12"} />
        </mesh>
      )}
      
      {/* Background for enemy name */}
      <mesh position={[0, 3, -0.05]} scale={[2, 0.6, 0.01]}>
        <planeGeometry />
        <meshBasicMaterial color="black" transparent opacity={0.6} />
      </mesh>
      
      {/* Enemy name */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {enemy.name}
      </Text>
      
      {/* Health bar background */}
      <mesh position={[0, 2.6, 0]}>
        <planeGeometry args={[1.2, 0.2]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      
      {/* Health bar foreground */}
      <mesh position={[0 - (1.2 * (1 - healthPercent)) / 2, 2.6, 0.01]} scale={[healthPercent, 1, 1]}>
        <planeGeometry args={[1.2, 0.2]} />
        <meshBasicMaterial color={
          healthPercent > 0.6 ? "#2ecc71" : 
          healthPercent > 0.3 ? "#f39c12" : 
          "#e74c3c"
        } />
      </mesh>
    </group>
  );
}