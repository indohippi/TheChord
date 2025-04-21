import { useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Enemy } from '@shared/types';

interface EnemyStatsDisplayProps {
  enemy: Enemy;
  currentHealth: number;
  isSelected: boolean;
  position: [number, number, number];
}

export function EnemyStatsDisplay({ 
  enemy, 
  currentHealth, 
  isSelected, 
  position 
}: EnemyStatsDisplayProps) {
  // Reference to the container mesh
  const meshRef = useRef<THREE.Group>(null);
  
  // Calculate health percentage
  const healthPercentage = Math.max(0, Math.min(100, (currentHealth / enemy.health) * 100));
  
  // Determine health bar color based on percentage
  const getHealthColor = () => {
    if (healthPercentage > 60) return '#2ecc71'; // Green
    if (healthPercentage > 30) return '#f39c12'; // Orange
    return '#e74c3c'; // Red
  };

  return (
    <group 
      ref={meshRef}
      position={[position[0], position[1] + 2, position[2]]}
      scale={isSelected ? 1.1 : 1}
    >
      {/* Name display */}
      <Html
        position={[0, 0.5, 0]}
        center
        distanceFactor={15}
        occlude
      >
        <div style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.7)', 
          color: 'white',
          padding: '2px 5px',
          borderRadius: '3px',
          fontSize: '12px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          border: isSelected ? '1px solid #f39c12' : 'none'
        }}>
          {enemy.name}
        </div>
      </Html>
      
      {/* Health bar */}
      <Html
        position={[0, 0.3, 0]}
        center
        distanceFactor={15}
        occlude
      >
        <div style={{
          width: '50px',
          height: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '2px',
          overflow: 'hidden',
          pointerEvents: 'none'
        }}>
          <div style={{
            width: `${healthPercentage}%`,
            height: '100%',
            backgroundColor: getHealthColor(),
            transition: 'width 0.3s ease-in-out'
          }} />
        </div>
      </Html>
      
      {/* Display weaknesses and resistances on selection */}
      {isSelected && (
        <Html
          position={[0, 0, 0]}
          center
          distanceFactor={15}
          occlude
        >
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '4px 6px',
            borderRadius: '3px',
            fontSize: '10px',
            lineHeight: '1.2',
            maxWidth: '120px',
            pointerEvents: 'none'
          }}>
            <div style={{ marginBottom: '2px' }}>
              <span style={{ color: '#e74c3c' }}>Weak: </span>
              {enemy.weaknesses.join(', ')}
            </div>
            <div>
              <span style={{ color: '#2ecc71' }}>Resist: </span>
              {enemy.resistances.join(', ')}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}