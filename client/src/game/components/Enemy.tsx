import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Enemy as EnemyType } from '@shared/types';

interface EnemyProps {
  data: EnemyType;
  position: [number, number, number];
  onDefeat: (enemyId: string) => void;
}

export function Enemy({ data, position, onDefeat }: EnemyProps) {
  const enemyRef = useRef<THREE.Group>(null);
  
  // Create a geometry based on enemy type
  const createEnemyGeometry = () => {
    if (data.name.includes('Dragon')) {
      return new THREE.BoxGeometry(1.5, 1.2, 3); // Dragon-like shape
    } else if (data.name.includes('Serpent')) {
      return new THREE.CylinderGeometry(0.5, 0.5, 3, 8); // Serpent-like shape
    } else if (data.name.includes('Spirit')) {
      return new THREE.SphereGeometry(1, 8, 8); // Ghost-like shape
    } else {
      return new THREE.BoxGeometry(1.2, 2, 1.2); // Humanoid shape
    }
  };
  
  // Create material based on enemy type
  const createEnemyMaterial = () => {
    if (data.name.includes('Corrupted')) {
      return new THREE.MeshStandardMaterial({ 
        color: '#ff3d3d', 
        emissive: '#ff3d3d',
        emissiveIntensity: 0.3,
        roughness: 0.7
      });
    } else if (data.name.includes('Oracle') || data.name.includes('Philosopher')) {
      return new THREE.MeshStandardMaterial({ 
        color: '#3d9eff', 
        emissive: '#3d9eff',
        emissiveIntensity: 0.2,
        roughness: 0.6
      });
    } else {
      return new THREE.MeshStandardMaterial({ 
        color: '#9c27b0', 
        emissive: '#9c27b0',
        emissiveIntensity: 0.2,
        roughness: 0.8
      });
    }
  };
  
  // Simple animation for the enemy
  useFrame((_, delta) => {
    if (enemyRef.current) {
      // Hover animation
      enemyRef.current.position.y = position[1] + Math.sin(Date.now() * 0.002) * 0.2;
      
      // Slow rotation for non-humanoid enemies
      if (!data.name.includes('Pharaoh') && !data.name.includes('Monk')) {
        enemyRef.current.rotation.y += delta * 0.3;
      }
    }
  });
  
  // Log when enemy is created
  useEffect(() => {
    console.log(`Enemy spawned: ${data.name} (HP: ${data.health})`);
  }, []);
  
  // Create geometry and material
  const geometry = createEnemyGeometry();
  const material = createEnemyMaterial();
  
  return (
    <group 
      ref={enemyRef} 
      position={position}
      onClick={() => console.log(`Clicked on enemy: ${data.name}`)}
    >
      {/* Main enemy body */}
      <mesh geometry={geometry} material={material} castShadow />
      
      {/* Add eyes (for most enemies) */}
      {!data.name.includes('Spirit') && (
        <>
          <mesh position={[0.3, 0.8, 0.5]} scale={0.2}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[-0.3, 0.8, 0.5]} scale={0.2}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
          </mesh>
        </>
      )}
    </group>
  );
}
