import { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import { useEchoZone } from '@/lib/stores/useEchoZone';
import { useGameState } from '@/lib/stores/useGameState';
import { EchoEntity } from '@shared/types';

interface BabylonEchoZoneProps {
  scene: BABYLON.Scene;
}

export function BabylonEchoZone({ scene }: BabylonEchoZoneProps) {
  const { currentZoneData, currentZoneType, echoes, setCurrentZone, removeEcho } = useEchoZone();
  const { gamePhase, incrementEchoesCaptured, startCombat } = useGameState();
  
  // References to zone elements
  const groundRef = useRef<BABYLON.Mesh | null>(null);
  const zoneElementsRef = useRef<BABYLON.AbstractMesh[]>([]);
  const echoMeshesRef = useRef<Map<string, BABYLON.Mesh>>(new Map());
  const combatTriggersRef = useRef<BABYLON.Mesh[]>([]);
  
  // Set up initial zone
  useEffect(() => {
    if (!scene) return;
    
    // Default to Azure Labyrinth if no zone is selected
    if (!currentZoneType) {
      setCurrentZone('AzureLabyrinth');
    }
  }, [scene]);
  
  // Create or update the zone
  useEffect(() => {
    if (!scene || !currentZoneData) return;
    
    console.log(`Setting up zone: ${currentZoneData.name}`);
    
    // Clean up previous zone elements
    if (groundRef.current) {
      groundRef.current.dispose();
    }
    
    zoneElementsRef.current.forEach(mesh => {
      mesh.dispose();
    });
    zoneElementsRef.current = [];
    
    combatTriggersRef.current.forEach(mesh => {
      mesh.dispose();
    });
    combatTriggersRef.current = [];
    
    // Setup fog in the scene
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogDensity = currentZoneData.fogDensity;
    
    const ambientLight = currentZoneData.ambientLight;
    scene.fogColor = new BABYLON.Color3(
      ambientLight[0],
      ambientLight[1],
      ambientLight[2]
    );
    
    // Create ground
    const width = currentZoneData.boundaries.maxX - currentZoneData.boundaries.minX;
    const depth = currentZoneData.boundaries.maxZ - currentZoneData.boundaries.minZ;
    
    const ground = BABYLON.MeshBuilder.CreateGround(
      "zoneGround", 
      { width, height: depth, subdivisions: 10 }, 
      scene
    );
    
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    
    // Set ground material based on zone type
    switch (currentZoneType) {
      case 'AzureLabyrinth':
        groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.3, 0.6);
        break;
      case 'ObsidianDunes':
        groundMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        break;
      case 'JadeCanopy':
        groundMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.4, 0.2);
        break;
      default:
        groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    }
    
    ground.material = groundMaterial;
    ground.receiveShadows = true;
    
    groundRef.current = ground;
    
    // Create zone-specific decorations
    if (currentZoneType === 'AzureLabyrinth') {
      // Crystal formations
      for (let i = 0; i < 8; i++) {
        const x = ((i % 4) * 10) - 15;
        const z = (Math.floor(i / 4) * 10) - 10;
        const height = 3 + (i % 3);
        
        const crystal = BABYLON.MeshBuilder.CreateBox(
          `crystal-${i}`,
          { width: 2, height, depth: 2 },
          scene
        );
        crystal.position = new BABYLON.Vector3(x, height / 2, z);
        
        const crystalMaterial = new BABYLON.StandardMaterial(`crystalMaterial-${i}`, scene);
        crystalMaterial.diffuseColor = new BABYLON.Color3(0.6, 0.7, 0.9);
        crystalMaterial.alpha = 0.7;
        crystalMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
        crystal.material = crystalMaterial;
        
        zoneElementsRef.current.push(crystal);
      }
    } else if (currentZoneType === 'ObsidianDunes') {
      // Obsidian obelisks
      for (let i = 0; i < 5; i++) {
        const x = ((i % 3) * 15) - 15;
        const z = (Math.floor(i / 3) * 15) - 15;
        const height = 5 + (i % 3) * 2;
        
        const obelisk = BABYLON.MeshBuilder.CreateBox(
          `obelisk-${i}`,
          { width: 2, height, depth: 2 },
          scene
        );
        obelisk.position = new BABYLON.Vector3(x, height / 2, z);
        
        const obeliskMaterial = new BABYLON.StandardMaterial(`obeliskMaterial-${i}`, scene);
        obeliskMaterial.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.05);
        obeliskMaterial.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        obelisk.material = obeliskMaterial;
        
        zoneElementsRef.current.push(obelisk);
      }
    } else if (currentZoneType === 'JadeCanopy') {
      // Trees
      for (let i = 0; i < 6; i++) {
        const x = ((i % 3) * 12) - 12;
        const z = (Math.floor(i / 3) * 12) - 12;
        
        // Tree trunk
        const trunk = BABYLON.MeshBuilder.CreateCylinder(
          `trunk-${i}`,
          { height: 6, diameter: 2 },
          scene
        );
        trunk.position = new BABYLON.Vector3(x, 3, z);
        
        const trunkMaterial = new BABYLON.StandardMaterial(`trunkMaterial-${i}`, scene);
        trunkMaterial.diffuseColor = new BABYLON.Color3(0.24, 0.15, 0.1);
        trunk.material = trunkMaterial;
        
        // Tree foliage
        const foliage = BABYLON.MeshBuilder.CreateBox(
          `foliage-${i}`,
          { width: 4, height: 4, depth: 4 },
          scene
        );
        foliage.position = new BABYLON.Vector3(x, 7, z);
        
        const foliageMaterial = new BABYLON.StandardMaterial(`foliageMaterial-${i}`, scene);
        foliageMaterial.diffuseColor = new BABYLON.Color3(0.18, 0.49, 0.2);
        foliageMaterial.emissiveColor = new BABYLON.Color3(0.05, 0.1, 0.05);
        foliage.material = foliageMaterial;
        
        zoneElementsRef.current.push(trunk);
        zoneElementsRef.current.push(foliage);
      }
    }
    
    // Create combat triggers
    const createCombatTrigger = (position: BABYLON.Vector3) => {
      // Base
      const trigger = BABYLON.MeshBuilder.CreateBox(
        `combatTrigger-${position.toString()}`,
        { width: 3, height: 1, depth: 3 },
        scene
      );
      trigger.position = position;
      
      const triggerMaterial = new BABYLON.StandardMaterial(`triggerMaterial-${position.toString()}`, scene);
      triggerMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.1, 0.1);
      triggerMaterial.emissiveColor = new BABYLON.Color3(0.4, 0.0, 0.0);
      trigger.material = triggerMaterial;
      
      // Indicator
      const indicator = BABYLON.MeshBuilder.CreateSphere(
        `indicator-${position.toString()}`,
        { diameter: 0.8 },
        scene
      );
      indicator.position = new BABYLON.Vector3(
        position.x,
        position.y + 1.5,
        position.z
      );
      
      const indicatorMaterial = new BABYLON.StandardMaterial(`indicatorMaterial-${position.toString()}`, scene);
      indicatorMaterial.diffuseColor = new BABYLON.Color3(1, 0.8, 0.1);
      indicatorMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.4, 0);
      indicator.material = indicatorMaterial;
      
      // Label
      const labelPlane = BABYLON.MeshBuilder.CreatePlane(
        `label-${position.toString()}`,
        { width: 2, height: 1 },
        scene
      );
      labelPlane.position = new BABYLON.Vector3(
        position.x,
        position.y + 2.5,
        position.z
      );
      labelPlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
      
      const labelMaterial = new BABYLON.StandardMaterial(`labelMaterial-${position.toString()}`, scene);
      labelMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
      labelMaterial.alpha = 0.6;
      labelPlane.material = labelMaterial;
      
      // Add dynamic texture for text
      const textTexture = new BABYLON.DynamicTexture(
        `textTexture-${position.toString()}`,
        { width: 256, height: 128 },
        scene
      );
      labelMaterial.diffuseTexture = textTexture;
      textTexture.drawText(
        "Combat!",
        null,
        80,
        "bold 40px Arial",
        "white",
        "transparent"
      );
      
      // Add action manager for click events
      trigger.actionManager = new BABYLON.ActionManager(scene);
      trigger.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPickTrigger,
          () => {
            console.log("Combat trigger activated!");
            // Start combat with random enemies from the zone
            const enemyList = currentZoneData.enemies.slice(0, 2);
            startCombat(enemyList);
          }
        )
      );
      
      // Hover effects
      trigger.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPointerOverTrigger,
          () => {
            triggerMaterial.emissiveColor = new BABYLON.Color3(0.6, 0.1, 0.1);
            indicator.scaling = new BABYLON.Vector3(1.2, 1.2, 1.2);
          }
        )
      );
      
      trigger.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPointerOutTrigger,
          () => {
            triggerMaterial.emissiveColor = new BABYLON.Color3(0.4, 0.0, 0.0);
            indicator.scaling = new BABYLON.Vector3(1, 1, 1);
          }
        )
      );
      
      combatTriggersRef.current.push(trigger);
      combatTriggersRef.current.push(indicator);
      combatTriggersRef.current.push(labelPlane);
    };
    
    // Main combat trigger
    createCombatTrigger(new BABYLON.Vector3(5, 0.5, 5));
    
    // Zone-specific additional combat triggers
    if (currentZoneType === 'ObsidianDunes') {
      createCombatTrigger(new BABYLON.Vector3(-8, 0.5, 8));
    }
    
    if (currentZoneType === 'JadeCanopy') {
      createCombatTrigger(new BABYLON.Vector3(10, 0.5, -5));
    }
    
    return () => {
      // Cleanup handled in the dependency array change
    };
  }, [scene, currentZoneData, currentZoneType]);
  
  // Create and update Echo entities
  useEffect(() => {
    if (!scene || !echoes) return;
    
    // Remove echoes that no longer exist
    const currentEchoIds = new Set(echoes.map(echo => echo.id));
    
    echoMeshesRef.current.forEach((mesh, id) => {
      if (!currentEchoIds.has(id)) {
        mesh.dispose();
        echoMeshesRef.current.delete(id);
      }
    });
    
    // Create or update echoes
    echoes.forEach(echo => {
      let echoMesh = echoMeshesRef.current.get(echo.id);
      
      // Create new echo mesh if needed
      if (!echoMesh) {
        echoMesh = BABYLON.MeshBuilder.CreateSphere(
          `echo-${echo.id}`,
          { diameter: 1 },
          scene
        );
        
        // Position the echo
        echoMesh.position = new BABYLON.Vector3(
          echo.position[0],
          echo.position[1] + 1,
          echo.position[2]
        );
        
        // Create echo material
        const echoMaterial = new BABYLON.StandardMaterial(`echoMaterial-${echo.id}`, scene);
        
        // Set material based on alignment
        switch (echo.alignment) {
          case 'balanced':
            echoMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.2);
            echoMaterial.emissiveColor = new BABYLON.Color3(0.4, 0.4, 0.1);
            break;
          case 'corrupted':
            echoMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.1, 0.5);
            echoMaterial.emissiveColor = new BABYLON.Color3(0.4, 0.05, 0.25);
            break;
          case 'purified':
            echoMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.8, 0.8);
            echoMaterial.emissiveColor = new BABYLON.Color3(0.05, 0.4, 0.4);
            break;
          default:
            echoMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        }
        
        // Add glow effect
        echoMaterial.alpha = 0.85;
        echoMesh.material = echoMaterial;
        
        // Add interaction
        echoMesh.actionManager = new BABYLON.ActionManager(scene);
        echoMesh.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger,
            () => {
              console.log(`Interacting with echo: ${echo.name}`);
              
              // Handle based on alignment
              if (echo.alignment === 'corrupted') {
                // Start combat with enemies
                const enemyList = currentZoneData?.enemies.slice(0, 2) || [];
                startCombat(enemyList);
              } else {
                // Collect the echo
                removeEcho(echo.id);
                incrementEchoesCaptured();
                console.log('Echo collected!');
              }
            }
          )
        );
        
        // Add hover effect
        echoMesh.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOverTrigger,
            () => {
              echoMesh!.scaling = new BABYLON.Vector3(1.2, 1.2, 1.2);
              (echoMesh!.material as BABYLON.StandardMaterial).emissiveColor.scaleToRef(1.5, (echoMesh!.material as BABYLON.StandardMaterial).emissiveColor);
            }
          )
        );
        
        echoMesh.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOutTrigger,
            () => {
              echoMesh!.scaling = new BABYLON.Vector3(1, 1, 1);
              (echoMesh!.material as BABYLON.StandardMaterial).emissiveColor.scaleToRef(0.67, (echoMesh!.material as BABYLON.StandardMaterial).emissiveColor);
            }
          )
        );
        
        // Store the mesh
        echoMeshesRef.current.set(echo.id, echoMesh);
      } else {
        // Update existing echo if needed
        echoMesh.position = new BABYLON.Vector3(
          echo.position[0],
          echo.position[1] + 1,
          echo.position[2]
        );
      }
    });
    
    // Add floating animation
    const floatingAnimation = scene.onBeforeRenderObservable.add(() => {
      const time = scene.getEngine().getDeltaTime() / 1000;
      
      echoMeshesRef.current.forEach((mesh) => {
        // Gentle floating effect
        mesh.position.y += Math.sin(time * 2) * 0.002;
        
        // Slow rotation
        mesh.rotation.y += 0.01;
      });
    });
    
    return () => {
      scene.onBeforeRenderObservable.remove(floatingAnimation);
    };
  }, [scene, echoes, currentZoneData]);
  
  // Nothing to render - this is handled by Babylon.js
  return null;
}