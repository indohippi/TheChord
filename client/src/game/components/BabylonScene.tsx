import React, { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import { useGameState } from '@/lib/stores/useGameState';

interface BabylonSceneProps {
  antialias?: boolean;
}

export function BabylonScene({ antialias = true }: BabylonSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const { gamePhase, currentZone, inCombat } = useGameState();
  
  // Initialize the Babylon scene
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Create engine
    const engine = new BABYLON.Engine(
      canvasRef.current, 
      antialias, 
      { 
        preserveDrawingBuffer: true,
        stencil: true 
      }
    );
    engineRef.current = engine;
    
    // Create the scene
    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;
    
    // Set scene basics
    scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.2, 1);
    
    // Setup basic camera
    const camera = new BABYLON.ArcRotateCamera(
      "mainCamera", 
      -Math.PI / 2, 
      Math.PI / 3, 
      15, 
      new BABYLON.Vector3(0, 0, 0), 
      scene
    );
    camera.attachControl(canvasRef.current, true);
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 50;
    
    // Add basic lights
    const hemisphericLight = new BABYLON.HemisphericLight(
      "hemisphericLight", 
      new BABYLON.Vector3(0, 1, 0), 
      scene
    );
    hemisphericLight.intensity = 0.7;
    
    const directionalLight = new BABYLON.DirectionalLight(
      "directionalLight", 
      new BABYLON.Vector3(0, -1, 1), 
      scene
    );
    directionalLight.intensity = 0.5;
    
    // Create ground
    const ground = BABYLON.MeshBuilder.CreateGround(
      "ground", 
      { width: 50, height: 50 }, 
      scene
    );
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.5, 0.3);
    ground.material = groundMaterial;
    
    // Create a simple player placeholder
    const playerMesh = BABYLON.MeshBuilder.CreateBox(
      "player", 
      { width: 1, height: 2, depth: 1 }, 
      scene
    );
    playerMesh.position.y = 1; // Raise player above ground
    const playerMaterial = new BABYLON.StandardMaterial("playerMaterial", scene);
    playerMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.4, 0.8);
    playerMesh.material = playerMaterial;
    
    // Add combat trigger
    const combatTrigger = BABYLON.MeshBuilder.CreateBox(
      "combatTrigger", 
      { width: 3, height: 1, depth: 3 }, 
      scene
    );
    combatTrigger.position = new BABYLON.Vector3(5, 0.5, 5);
    const triggerMaterial = new BABYLON.StandardMaterial("triggerMaterial", scene);
    triggerMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.1, 0.1);
    triggerMaterial.emissiveColor = new BABYLON.Color3(0.4, 0.0, 0.0);
    combatTrigger.material = triggerMaterial;
    
    // Create indicator on top of combat trigger
    const indicatorSphere = BABYLON.MeshBuilder.CreateSphere(
      "indicatorSphere",
      { diameter: 0.8 },
      scene
    );
    indicatorSphere.position = new BABYLON.Vector3(5, 2, 5);
    const indicatorMaterial = new BABYLON.StandardMaterial("indicatorMaterial", scene);
    indicatorMaterial.diffuseColor = new BABYLON.Color3(1, 0.8, 0.1);
    indicatorMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.4, 0);
    indicatorSphere.material = indicatorMaterial;
    
    // Create GUI for the combat trigger
    const triggerLabel = BABYLON.MeshBuilder.CreatePlane(
      "triggerLabel",
      { width: 2, height: 1 },
      scene
    );
    triggerLabel.position = new BABYLON.Vector3(5, 3, 5);
    triggerLabel.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    
    const triggerLabelMaterial = new BABYLON.StandardMaterial("triggerLabelMaterial", scene);
    triggerLabelMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    triggerLabelMaterial.alpha = 0.6;
    triggerLabel.material = triggerLabelMaterial;
    
    // Setup simple physics/collision
    scene.enablePhysics(
      new BABYLON.Vector3(0, -9.81, 0), 
      new BABYLON.CannonJSPlugin()
    );
    
    // Add shadows
    const shadowGenerator = new BABYLON.ShadowGenerator(1024, directionalLight);
    shadowGenerator.addShadowCaster(playerMesh);
    shadowGenerator.usePoissonSampling = true;
    ground.receiveShadows = true;
    
    // Render loop
    engine.runRenderLoop(() => {
      scene.render();
    });
    
    // Handle window resize
    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener('resize', handleResize);
    
    // Add interaction with combat trigger
    combatTrigger.actionManager = new BABYLON.ActionManager(scene);
    combatTrigger.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPickTrigger,
        () => {
          console.log("Combat trigger activated!");
          // Logic to start combat would go here
        }
      )
    );
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      scene.dispose();
      engine.dispose();
    };
  }, []); // Empty dependency array means it runs once on mount
  
  // Handle game phase changes
  useEffect(() => {
    console.log(`Game phase changed to: ${gamePhase}`);
    
    // Update scene appearance based on game phase
    if (sceneRef.current) {
      const scene = sceneRef.current;
      
      if (gamePhase === 'combat') {
        // Change scene appearance for combat
        scene.clearColor = new BABYLON.Color4(0.2, 0.1, 0.1, 1);
      } else if (gamePhase === 'gameplay') {
        // Reset to normal gameplay appearance
        scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.2, 1);
      }
    }
    
  }, [gamePhase, currentZone, inCombat]);
  
  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        outline: 'none', 
        touchAction: 'none' 
      }} 
    />
  );
}