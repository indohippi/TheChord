import { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import { useGameState } from '@/lib/stores/useGameState';
import { useTacticalCombat } from '@/game/hooks/useTacticalCombat';
import { useCharacter } from '@/lib/stores/useCharacter';
import { useAudio } from '@/lib/stores/useAudio';

interface BabylonCombatProps {
  scene: BABYLON.Scene;
}

export function BabylonCombat({ scene }: BabylonCombatProps) {
  const { gamePhase, inCombat } = useGameState();
  const { combatState, selectEnemy, executeAttack } = useTacticalCombat();
  const { position } = useCharacter();
  const { playHit, playSuccess } = useAudio();
  
  // References to combat elements
  const arenaRef = useRef<BABYLON.Mesh | null>(null);
  const gridRef = useRef<BABYLON.Mesh | null>(null);
  const enemyMeshesRef = useRef<Map<string, BABYLON.Mesh>>(new Map());
  
  // Create or update combat elements when combat starts
  useEffect(() => {
    if (!scene) return;
    
    // Only create combat elements when in combat
    if (gamePhase === 'combat' && inCombat) {
      console.log('Creating combat arena');
      
      // Create combat arena floor
      const arena = BABYLON.MeshBuilder.CreateGround(
        'combatArena',
        { width: 20, height: 20, subdivisions: 10 },
        scene
      );
      
      // Make it slightly elevated to avoid z-fighting with regular ground
      arena.position.y = 0.02;
      
      // Arena material
      const arenaMaterial = new BABYLON.StandardMaterial('arenaMaterial', scene);
      arenaMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      arenaMaterial.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
      arena.material = arenaMaterial;
      
      // Add arena boundary
      const boundary = BABYLON.MeshBuilder.CreateTorus(
        'arenaBoundary',
        { diameter: 19, thickness: 0.5 },
        scene
      );
      boundary.position.y = 0.1;
      
      const boundaryMaterial = new BABYLON.StandardMaterial('boundaryMaterial', scene);
      boundaryMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.6, 0.1);
      boundaryMaterial.emissiveColor = new BABYLON.Color3(0.4, 0.3, 0.05);
      boundary.material = boundaryMaterial;
      
      // Create center indicator
      const centerIndicator = BABYLON.MeshBuilder.CreateDisc(
        'centerIndicator',
        { radius: 2 },
        scene
      );
      centerIndicator.rotation.x = Math.PI / 2;
      centerIndicator.position.y = 0.05;
      
      const centerMaterial = new BABYLON.StandardMaterial('centerMaterial', scene);
      centerMaterial.diffuseColor = combatState.isPlayerTurn ? 
        new BABYLON.Color3(0.2, 0.4, 0.8) : new BABYLON.Color3(0.8, 0.2, 0.2);
      centerMaterial.alpha = 0.5;
      centerIndicator.material = centerMaterial;
      
      // Store reference
      arenaRef.current = arena;
      
      // Create grid lines
      const gridSize = 20;
      const gridDivisions = 20;
      const gridLines: BABYLON.Mesh[] = [];
      
      // Create horizontal lines
      for (let i = 0; i <= gridDivisions; i++) {
        const posZ = (i / gridDivisions) * gridSize - gridSize / 2;
        
        const line = BABYLON.MeshBuilder.CreateLines(
          `gridLineH-${i}`,
          { 
            points: [
              new BABYLON.Vector3(-gridSize / 2, 0.05, posZ),
              new BABYLON.Vector3(gridSize / 2, 0.05, posZ)
            ]
          },
          scene
        );
        
        line.color = new BABYLON.Color3(0.3, 0.3, 0.3);
        gridLines.push(line);
      }
      
      // Create vertical lines
      for (let i = 0; i <= gridDivisions; i++) {
        const posX = (i / gridDivisions) * gridSize - gridSize / 2;
        
        const line = BABYLON.MeshBuilder.CreateLines(
          `gridLineV-${i}`,
          { 
            points: [
              new BABYLON.Vector3(posX, 0.05, -gridSize / 2),
              new BABYLON.Vector3(posX, 0.05, gridSize / 2)
            ]
          },
          scene
        );
        
        line.color = new BABYLON.Color3(0.3, 0.3, 0.3);
        gridLines.push(line);
      }
      
      // Create enemies
      combatState.enemies.forEach((enemy) => {
        // Create enemy mesh
        const enemyMesh = createEnemyMesh(enemy.id, enemy.name, scene);
        
        // Position the enemy
        enemyMesh.position = new BABYLON.Vector3(
          enemy.position[0],
          enemy.position[1] + 1, // Raise above ground
          enemy.position[2]
        );
        
        // Add interaction
        enemyMesh.actionManager = new BABYLON.ActionManager(scene);
        enemyMesh.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger,
            () => {
              console.log(`Enemy selected: ${enemy.name}`);
              selectEnemy(enemy.id);
              
              // If in attack phase, directly attack the enemy
              if (combatState.currentPhase === 'action') {
                executeAttack(enemy.id);
              }
            }
          )
        );
        
        // Add hover effect
        enemyMesh.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOverTrigger,
            () => {
              enemyMesh.scaling = new BABYLON.Vector3(1.1, 1.1, 1.1);
            }
          )
        );
        
        enemyMesh.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOutTrigger,
            () => {
              enemyMesh.scaling = new BABYLON.Vector3(1, 1, 1);
            }
          )
        );
        
        // Store reference
        enemyMeshesRef.current.set(enemy.id, enemyMesh);
      });
      
      // Update enemy meshes on combat state changes
      const updateEnemies = () => {
        combatState.enemies.forEach((enemy) => {
          const mesh = enemyMeshesRef.current.get(enemy.id);
          if (!mesh) return;
          
          // Update health indicator
          const healthRatio = enemy.currentHealth / enemy.health;
          
          // Find children
          const healthBar = mesh.getChildMeshes().find(m => m.name.includes('healthBar'));
          const healthBarFill = mesh.getChildMeshes().find(m => m.name.includes('healthBarFill'));
          
          if (healthBarFill) {
            healthBarFill.scaling.x = healthRatio;
            
            // Update color based on health
            const material = healthBarFill.material as BABYLON.StandardMaterial;
            if (healthRatio > 0.6) {
              material.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.2);
            } else if (healthRatio > 0.3) {
              material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.2);
            } else {
              material.diffuseColor = new BABYLON.Color3(0.8, 0.2, 0.2);
            }
          }
          
          // Update selection indicator
          const isSelected = enemy.id === combatState.selectedEnemyId;
          const selectionIndicator = mesh.getChildMeshes().find(m => m.name.includes('selection'));
          
          if (selectionIndicator) {
            selectionIndicator.visibility = isSelected ? 1 : 0;
          }
        });
      };
      
      // Observer for enemy updates
      const observer = scene.onBeforeRenderObservable.add(updateEnemies);
      
      // Cleanup
      return () => {
        console.log('Cleaning up combat arena');
        
        scene.onBeforeRenderObservable.remove(observer);
        
        if (arenaRef.current) {
          arenaRef.current.dispose();
          arenaRef.current = null;
        }
        
        // Dispose grid lines
        gridLines.forEach(line => line.dispose());
        
        // Dispose center indicator
        centerIndicator.dispose();
        
        // Dispose boundary
        boundary.dispose();
        
        // Dispose enemy meshes
        enemyMeshesRef.current.forEach(mesh => mesh.dispose());
        enemyMeshesRef.current.clear();
      };
    }
  }, [scene, gamePhase, inCombat]);
  
  // Helper function to create enemy mesh
  const createEnemyMesh = (id: string, name: string, scene: BABYLON.Scene) => {
    const root = new BABYLON.Mesh(`enemy-${id}`, scene);
    
    // Base entity type determines appearance
    const isMirrored = id.includes('minotaur');
    const isOracle = id.includes('oracle');
    const isCorrupted = id.includes('corrupted');
    
    if (isOracle) {
      // Floating orb for oracles
      const orb = BABYLON.MeshBuilder.CreateSphere(
        `enemy-orb-${id}`,
        { diameter: 1.6 },
        scene
      );
      orb.parent = root;
      orb.position.y = 1.5;
      
      const orbMaterial = new BABYLON.StandardMaterial(`enemy-orb-material-${id}`, scene);
      orbMaterial.diffuseColor = isCorrupted ?
        new BABYLON.Color3(0.8, 0.2, 0.8) : new BABYLON.Color3(0.2, 0.6, 0.8);
      orbMaterial.emissiveColor = isCorrupted ?
        new BABYLON.Color3(0.4, 0.1, 0.4) : new BABYLON.Color3(0.1, 0.3, 0.4);
      orbMaterial.alpha = 0.9;
      orb.material = orbMaterial;
      
      // Swirling particles
      for (let i = 0; i < 5; i++) {
        const particle = BABYLON.MeshBuilder.CreateSphere(
          `enemy-particle-${id}-${i}`,
          { diameter: 0.3 },
          scene
        );
        particle.parent = root;
        
        // Position in a circle around the orb
        const angle = (i / 5) * Math.PI * 2;
        particle.position.x = Math.cos(angle) * 1.2;
        particle.position.z = Math.sin(angle) * 1.2;
        particle.position.y = 1.5;
        
        const particleMaterial = new BABYLON.StandardMaterial(`enemy-particle-material-${id}-${i}`, scene);
        particleMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
        particleMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        particle.material = particleMaterial;
        
        // Animate in render loop
        scene.onBeforeRenderObservable.add(() => {
          const time = scene.getEngine().getDeltaTime() / 1000;
          const orbit = (time + i) * 0.5;
          
          particle.position.x = Math.cos(orbit) * 1.2;
          particle.position.z = Math.sin(orbit) * 1.2;
          particle.position.y = 1.5 + Math.sin(orbit * 2) * 0.3;
        });
      }
    } else if (isMirrored) {
      // Minotaur body
      const body = BABYLON.MeshBuilder.CreateBox(
        `enemy-body-${id}`,
        { width: 1.4, height: 2, depth: 1 },
        scene
      );
      body.parent = root;
      body.position.y = 1;
      
      // Minotaur head
      const head = BABYLON.MeshBuilder.CreateBox(
        `enemy-head-${id}`,
        { width: 1, height: 0.8, depth: 0.8 },
        scene
      );
      head.parent = root;
      head.position.y = 2.2;
      
      // Left horn
      const leftHorn = BABYLON.MeshBuilder.CreateCylinder(
        `enemy-leftHorn-${id}`,
        { height: 0.8, diameter: 0.2 },
        scene
      );
      leftHorn.parent = root;
      leftHorn.position = new BABYLON.Vector3(-0.6, 2.5, 0);
      leftHorn.rotation.z = Math.PI / 4;
      
      // Right horn
      const rightHorn = BABYLON.MeshBuilder.CreateCylinder(
        `enemy-rightHorn-${id}`,
        { height: 0.8, diameter: 0.2 },
        scene
      );
      rightHorn.parent = root;
      rightHorn.position = new BABYLON.Vector3(0.6, 2.5, 0);
      rightHorn.rotation.z = -Math.PI / 4;
      
      // Materials
      const bodyMaterial = new BABYLON.StandardMaterial(`enemy-body-material-${id}`, scene);
      bodyMaterial.diffuseColor = isCorrupted ?
        new BABYLON.Color3(0.6, 0.1, 0.3) : new BABYLON.Color3(0.3, 0.2, 0.6);
      body.material = bodyMaterial;
      head.material = bodyMaterial;
      
      const hornMaterial = new BABYLON.StandardMaterial(`enemy-horn-material-${id}`, scene);
      hornMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
      leftHorn.material = hornMaterial;
      rightHorn.material = hornMaterial;
    } else {
      // Default enemy
      const body = BABYLON.MeshBuilder.CreateBox(
        `enemy-body-${id}`,
        { width: 1, height: 2, depth: 1 },
        scene
      );
      body.parent = root;
      body.position.y = 1;
      
      const head = BABYLON.MeshBuilder.CreateSphere(
        `enemy-head-${id}`,
        { diameter: 1 },
        scene
      );
      head.parent = root;
      head.position.y = 2.2;
      
      const bodyMaterial = new BABYLON.StandardMaterial(`enemy-body-material-${id}`, scene);
      bodyMaterial.diffuseColor = isCorrupted ?
        new BABYLON.Color3(0.5, 0.1, 0.1) : new BABYLON.Color3(0.1, 0.3, 0.5);
      body.material = bodyMaterial;
      head.material = bodyMaterial;
    }
    
    // Add name label
    const labelPlane = BABYLON.MeshBuilder.CreatePlane(
      `enemy-label-${id}`,
      { width: 3, height: 0.8 },
      scene
    );
    labelPlane.parent = root;
    labelPlane.position.y = 3;
    labelPlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    
    const labelMaterial = new BABYLON.StandardMaterial(`enemy-label-material-${id}`, scene);
    labelMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    labelMaterial.alpha = 0.6;
    labelPlane.material = labelMaterial;
    
    // Add dynamic texture for text
    const labelTexture = new BABYLON.DynamicTexture(
      `enemy-label-texture-${id}`,
      { width: 256, height: 64 },
      scene
    );
    labelMaterial.diffuseTexture = labelTexture;
    labelTexture.drawText(name, null, 40, "bold 32px Arial", "white", "transparent");
    
    // Add health bar background
    const healthBar = BABYLON.MeshBuilder.CreatePlane(
      `enemy-healthBar-${id}`,
      { width: 2, height: 0.3 },
      scene
    );
    healthBar.parent = root;
    healthBar.position.y = 2.6;
    healthBar.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;
    
    const healthBarMaterial = new BABYLON.StandardMaterial(`enemy-healthBar-material-${id}`, scene);
    healthBarMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    healthBar.material = healthBarMaterial;
    
    // Add health bar fill
    const healthBarFill = BABYLON.MeshBuilder.CreatePlane(
      `enemy-healthBarFill-${id}`,
      { width: 2, height: 0.3 },
      scene
    );
    healthBarFill.parent = root;
    healthBarFill.position.y = 2.6;
    healthBarFill.position.z = 0.01;
    healthBarFill.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;
    
    const healthBarFillMaterial = new BABYLON.StandardMaterial(`enemy-healthBarFill-material-${id}`, scene);
    healthBarFillMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.2);
    healthBarFill.material = healthBarFillMaterial;
    
    // Add selection indicator
    const selectionIndicator = BABYLON.MeshBuilder.CreateGround(
      `enemy-selection-${id}`,
      { width: 3, height: 3 },
      scene
    );
    selectionIndicator.parent = root;
    selectionIndicator.position.y = 0.05;
    selectionIndicator.rotation.y = Math.PI / 4;
    selectionIndicator.visibility = 0; // Hidden by default
    
    const selectionMaterial = new BABYLON.StandardMaterial(`enemy-selection-material-${id}`, scene);
    selectionMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.2);
    selectionMaterial.alpha = 0.3;
    selectionIndicator.material = selectionMaterial;
    
    return root;
  };
  
  // Nothing to render - this is handled by Babylon.js
  return null;
}