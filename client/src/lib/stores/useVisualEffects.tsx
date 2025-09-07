import { create } from 'zustand';
import { VisualEffect, VisualEffectSystem } from '../../../shared/audioTypes';

interface VisualEffectStore {
  // Visual effect system
  visualEffectSystem: VisualEffectSystem;
  
  // Active effects
  effects: VisualEffect[];
  
  // Actions
  createEffect: (effect: Omit<VisualEffect, 'id'>) => void;
  removeEffect: (id: string) => void;
  clearEffects: () => void;
  updateEffects: (deltaTime: number) => void;
  
  // Screen effects
  createScreenShake: (intensity: number, duration: number) => void;
  createScreenFlash: (color: string, duration: number) => void;
  createScreenFade: (color: string, duration: number, fadeIn: boolean) => void;
  createScreenZoom: (scale: number, duration: number) => void;
  createScreenBlur: (intensity: number, duration: number) => void;
  createScreenGlow: (color: string, intensity: number, duration: number) => void;
  
  // Character effects
  createCharacterFlash: (target: string, color: string, duration: number) => void;
  createCharacterGlow: (target: string, color: string, intensity: number, duration: number) => void;
  
  // UI effects
  createUIFlash: (target: string, color: string, duration: number) => void;
  createUIGlow: (target: string, color: string, intensity: number, duration: number) => void;
  
  // System management
  setMaxEffects: (max: number) => void;
  pauseAllEffects: () => void;
  resumeAllEffects: () => void;
}

export const useVisualEffects = create<VisualEffectStore>((set, get) => ({
  // Initial state
  visualEffectSystem: {
    effects: [],
    maxEffects: 100,
    screenEffects: [],
    uiEffects: []
  },
  
  effects: [],

  // Create effect
  createEffect: (effect: Omit<VisualEffect, 'id'>) => {
    const state = get();
    
    if (state.effects.length >= state.visualEffectSystem.maxEffects) {
      // Remove oldest effect
      state.removeEffect(state.effects[0].id);
    }
    
    const newEffect: VisualEffect = {
      ...effect,
      id: `effect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    set(state => ({
      effects: [...state.effects, newEffect]
    }));
  },

  // Remove effect
  removeEffect: (id: string) => {
    set(state => ({
      effects: state.effects.filter(e => e.id !== id)
    }));
  },

  // Clear all effects
  clearEffects: () => {
    set({ effects: [] });
  },

  // Update effects
  updateEffects: (deltaTime: number) => {
    const state = get();
    const updatedEffects = state.effects.map(effect => {
      effect.duration -= deltaTime;
      return effect;
    }).filter(effect => effect.duration > 0);
    
    set({ effects: updatedEffects });
  },

  // Create screen shake
  createScreenShake: (intensity: number, duration: number) => {
    get().createEffect({
      name: 'screen-shake',
      type: 'screen-shake',
      duration,
      intensity,
      target: 'screen'
    });
  },

  // Create screen flash
  createScreenFlash: (color: string, duration: number) => {
    get().createEffect({
      name: 'screen-flash',
      type: 'flash',
      duration,
      intensity: 1,
      target: 'screen',
      color
    });
  },

  // Create screen fade
  createScreenFade: (color: string, duration: number, fadeIn: boolean) => {
    get().createEffect({
      name: 'screen-fade',
      type: 'fade',
      duration,
      intensity: fadeIn ? 1 : 0,
      target: 'screen',
      color
    });
  },

  // Create screen zoom
  createScreenZoom: (scale: number, duration: number) => {
    get().createEffect({
      name: 'screen-zoom',
      type: 'zoom',
      duration,
      intensity: scale,
      target: 'screen'
    });
  },

  // Create screen blur
  createScreenBlur: (intensity: number, duration: number) => {
    get().createEffect({
      name: 'screen-blur',
      type: 'blur',
      duration,
      intensity,
      target: 'screen'
    });
  },

  // Create screen glow
  createScreenGlow: (color: string, intensity: number, duration: number) => {
    get().createEffect({
      name: 'screen-glow',
      type: 'glow',
      duration,
      intensity,
      target: 'screen',
      color
    });
  },

  // Create character flash
  createCharacterFlash: (target: string, color: string, duration: number) => {
    get().createEffect({
      name: 'character-flash',
      type: 'flash',
      duration,
      intensity: 1,
      target: 'character',
      color
    });
  },

  // Create character glow
  createCharacterGlow: (target: string, color: string, intensity: number, duration: number) => {
    get().createEffect({
      name: 'character-glow',
      type: 'glow',
      duration,
      intensity,
      target: 'character',
      color
    });
  },

  // Create UI flash
  createUIFlash: (target: string, color: string, duration: number) => {
    get().createEffect({
      name: 'ui-flash',
      type: 'flash',
      duration,
      intensity: 1,
      target: 'ui',
      color
    });
  },

  // Create UI glow
  createUIGlow: (target: string, color: string, intensity: number, duration: number) => {
    get().createEffect({
      name: 'ui-glow',
      type: 'glow',
      duration,
      intensity,
      target: 'ui',
      color
    });
  },

  // Set max effects
  setMaxEffects: (max: number) => {
    set(state => ({
      visualEffectSystem: { ...state.visualEffectSystem, maxEffects: max }
    }));
  },

  // Pause all effects
  pauseAllEffects: () => {
    // Effects are time-based, so pausing means not updating duration
    // This would need to be implemented in the update loop
  },

  // Resume all effects
  resumeAllEffects: () => {
    // Effects are time-based, so resuming means continuing to update duration
    // This would need to be implemented in the update loop
  }
}));