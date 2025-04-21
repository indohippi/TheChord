import { useState } from 'react';
import { Text } from '@react-three/drei';
import { Enemy } from '@shared/types';

interface CombatTriggerProps {
  position: [number, number, number];
  onTrigger: (enemies: Enemy[]) => void;
  enemies: Enemy[];
}

export function CombatTrigger({ position, onTrigger, enemies }: CombatTriggerProps) {
  const [hovered, setHovered] = useState(false);
  
  // Handle mouse interactions
  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => setHovered(false);
  
  // Trigger combat with selected enemies
  const handleClick = () => {
    console.log("Combat trigger activated");
    // Select random enemies if many are available
    const selectedEnemies = enemies.length > 2 
      ? enemies.slice(0, Math.min(enemies.length, 2)) 
      : enemies;
    onTrigger(selectedEnemies);
  };
  
  // Hover animation
  const scale = hovered ? 1.1 : 1.0;
  const hoverColor = hovered ? "#ff0000" : "#990000";
  
  return (
    <group position={position}>
      {/* Base platform */}
      <mesh 
        position={[0, 0.5, 0]} 
        scale={[3, 1, 3]} 
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry />
        <meshStandardMaterial color={hoverColor} emissive="darkred" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Beacon orb */}
      <mesh 
        position={[0, 2, 0]} 
        scale={[scale, scale, scale]}
      >
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="yellow" emissive="orange" emissiveIntensity={0.8} />
      </mesh>
      
      {/* Text background */}
      <mesh position={[0, 3, 0]}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial color="black" transparent opacity={0.7} />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, 3, 0.1]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Combat!
      </Text>
      
      {/* Small details on platform */}
      <mesh position={[-1, 1.2, -1]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="black" />
      </mesh>
      
      <mesh position={[1, 1.2, 1]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="black" />
      </mesh>
      
      {/* Pulsing effect when hovered */}
      {hovered && (
        <mesh position={[0, 0.5, 0]} scale={[3.2, 1.2, 3.2]}>
          <boxGeometry />
          <meshStandardMaterial color="red" transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}