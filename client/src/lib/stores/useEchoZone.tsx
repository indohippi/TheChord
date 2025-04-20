import { create } from "zustand";
import { EchoZoneType, EchoZoneData, EchoEntity } from "@shared/types";
import { echoZones } from "@/game/data/echoZones";

interface EchoZoneState {
  // Current zone
  currentZoneType: EchoZoneType | null;
  currentZoneData: EchoZoneData | null;
  
  // Set the current zone
  setCurrentZone: (zoneType: EchoZoneType) => void;
  
  // Echoes in the current zone
  echoes: EchoEntity[];
  
  // Add/remove echoes
  addEcho: (echo: EchoEntity) => void;
  removeEcho: (echoId: string) => void;
  
  // Zone exploration status (for fog of war or map completion)
  exploredAreas: Set<string>;
  markAreaAsExplored: (areaId: string) => void;
  
  // Environment properties
  ambientLight: [number, number, number]; // RGB
  fogDensity: number;
  
  // Update environment properties
  setAmbientLight: (color: [number, number, number]) => void;
  setFogDensity: (density: number) => void;
  
  // Zone boundaries for collision detection
  boundaries: { minX: number, maxX: number, minZ: number, maxZ: number };
}

export const useEchoZone = create<EchoZoneState>((set) => ({
  // No zone selected initially
  currentZoneType: null,
  currentZoneData: null,
  
  // Set the current zone with all its data
  setCurrentZone: (zoneType) => {
    const zoneData = echoZones.find(zone => zone.type === zoneType);
    if (zoneData) {
      set({
        currentZoneType: zoneType,
        currentZoneData: zoneData,
        echoes: [...zoneData.echoes],
        ambientLight: zoneData.ambientLight,
        fogDensity: zoneData.fogDensity,
        boundaries: zoneData.boundaries,
        exploredAreas: new Set<string>()
      });
      console.log(`Entered Echo Zone: ${zoneData.name}`);
    }
  },
  
  // Initially no echoes
  echoes: [],
  
  // Echo management
  addEcho: (echo) => set((state) => ({
    echoes: [...state.echoes, echo]
  })),
  
  removeEcho: (echoId) => set((state) => ({
    echoes: state.echoes.filter(echo => echo.id !== echoId)
  })),
  
  // Exploration tracking
  exploredAreas: new Set<string>(),
  markAreaAsExplored: (areaId) => set((state) => {
    const newExploredAreas = new Set(state.exploredAreas);
    newExploredAreas.add(areaId);
    return { exploredAreas: newExploredAreas };
  }),
  
  // Default environment settings
  ambientLight: [0.1, 0.1, 0.2], // Dark blue-ish ambient light
  fogDensity: 0.05,
  
  // Environment setters
  setAmbientLight: (color) => set({ ambientLight: color }),
  setFogDensity: (density) => set({ fogDensity: density }),
  
  // Default boundaries (will be overridden when zone is selected)
  boundaries: { minX: -50, maxX: 50, minZ: -50, maxZ: 50 }
}));
