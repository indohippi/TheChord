import { useState, useEffect } from 'react';
import { useWorld } from '@/lib/stores/useWorld';
import { useCharacter } from '@/lib/stores/useCharacter';
import { Zone, ZoneStatus, FastTravelPoint } from '@shared/worldTypes';

interface WorldMapUIProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorldMapUI({ isOpen, onClose }: WorldMapUIProps) {
  const {
    zones,
    currentZone,
    fastTravelPoints,
    unlockedFastTravel,
    worldState,
    changeZone,
    fastTravel,
    unlockZone,
    getZone,
    getFastTravelPoints,
    canFastTravel,
    getExplorationProgress,
    getWorldStats
  } = useWorld();

  const { level } = useCharacter();

  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [showFastTravel, setShowFastTravel] = useState(false);
  const [hoveredZone, setHoveredZone] = useState<Zone | null>(null);

  // Initialize world on mount
  useEffect(() => {
    if (isOpen) {
      // This would initialize the world if needed
    }
  }, [isOpen]);

  // Get zone status color
  const getZoneStatusColor = (status: ZoneStatus): string => {
    switch (status) {
      case 'locked': return '#6b7280';
      case 'available': return '#3b82f6';
      case 'explored': return '#10b981';
      case 'completed': return '#f59e0b';
      case 'corrupted': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Get zone status text
  const getZoneStatusText = (status: ZoneStatus): string => {
    switch (status) {
      case 'locked': return 'Locked';
      case 'available': return 'Available';
      case 'explored': return 'Explored';
      case 'completed': return 'Completed';
      case 'corrupted': return 'Corrupted';
      default: return 'Unknown';
    }
  };

  // Handle zone selection
  const handleZoneSelect = (zone: Zone) => {
    if (zone.status === 'locked') {
      setSelectedZone(zone);
    } else {
      // Try to change to this zone
      changeZone(zone.id);
    }
  };

  // Handle fast travel
  const handleFastTravel = async (point: FastTravelPoint) => {
    if (canFastTravel(point.id)) {
      const success = await fastTravel(point.id);
      if (success) {
        onClose();
      }
    }
  };

  // Render zone on map
  const renderZone = (zone: Zone, position: { x: number; y: number }) => {
    const isCurrentZone = currentZone?.id === zone.id;
    const isHovered = hoveredZone?.id === zone.id;
    const isSelected = selectedZone?.id === zone.id;
    const explorationProgress = getExplorationProgress(zone.id);
    
    return (
      <div
        key={zone.id}
        className={`absolute w-24 h-24 rounded-lg border-4 cursor-pointer transition-all duration-200 ${
          isCurrentZone
            ? 'border-yellow-500 bg-yellow-900 bg-opacity-30 scale-110'
            : isHovered
            ? 'border-blue-400 bg-blue-900 bg-opacity-20 scale-105'
            : isSelected
            ? 'border-purple-500 bg-purple-900 bg-opacity-30'
            : 'border-gray-600 hover:border-gray-400'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          borderColor: getZoneStatusColor(zone.status),
          backgroundColor: getZoneStatusColor(zone.status) + '20'
        }}
        onClick={() => handleZoneSelect(zone)}
        onMouseEnter={() => setHoveredZone(zone)}
        onMouseLeave={() => setHoveredZone(null)}
      >
        {/* Zone icon */}
        <div className="w-full h-full flex items-center justify-center text-2xl">
          {zone.type === 'labyrinth' && '🏛️'}
          {zone.type === 'wilderness' && '🏜️'}
          {zone.type === 'garden' && '🌳'}
          {zone.type === 'dungeon' && '🏰'}
          {zone.type === 'city' && '🏙️'}
          {zone.type === 'temple' && '⛩️'}
          {zone.type === 'ruins' && '🏺'}
          {zone.type === 'cave' && '🕳️'}
          {zone.type === 'tower' && '🗼'}
          {zone.type === 'void' && '🌌'}
        </div>
        
        {/* Zone name */}
        <div className="absolute -bottom-6 left-0 right-0 text-center">
          <div className="text-xs font-bold text-white bg-black bg-opacity-75 px-1 rounded">
            {zone.name}
          </div>
        </div>
        
        {/* Exploration progress */}
        {zone.status !== 'locked' && (
          <div className="absolute -top-2 left-0 right-0">
            <div className="w-full bg-gray-700 rounded-full h-1">
              <div
                className="bg-green-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${explorationProgress}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Level requirement */}
        {zone.level > level && (
          <div className="absolute -top-6 left-0 right-0 text-center">
            <div className="text-xs text-red-400 bg-black bg-opacity-75 px-1 rounded">
              Lv.{zone.level}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render fast travel point
  const renderFastTravelPoint = (point: FastTravelPoint, zone: Zone) => {
    const isUnlocked = unlockedFastTravel.includes(point.id);
    const canUse = canFastTravel(point.id);
    
    return (
      <div
        key={point.id}
        className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${
          canUse
            ? 'border-green-500 bg-green-900 bg-opacity-20 hover:bg-green-900 bg-opacity-30'
            : isUnlocked
            ? 'border-yellow-500 bg-yellow-900 bg-opacity-20'
            : 'border-gray-600 bg-gray-800'
        }`}
        onClick={() => canUse && handleFastTravel(point)}
      >
        <div className="text-lg">
          {point.type === 'portal' && '🌀'}
          {point.type === 'shrine' && '⛩️'}
          {point.type === 'waypoint' && '📍'}
          {point.type === 'gate' && '🚪'}
          {point.type === 'teleporter' && '⚡'}
          {point.type === 'path' && '🛤️'}
          {point.type === 'bridge' && '🌉'}
          {point.type === 'tunnel' && '🚇'}
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-white">{point.name}</div>
          <div className="text-xs text-gray-400">{zone.name}</div>
          {point.cost && (
            <div className="text-xs text-yellow-400">
              Cost: {point.cost.amount} {point.cost.type}
            </div>
          )}
        </div>
        {!isUnlocked && (
          <div className="text-xs text-gray-500">Locked</div>
        )}
        {isUnlocked && !canUse && (
          <div className="text-xs text-yellow-400">Cooldown</div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  const worldStats = getWorldStats();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-blue-500 rounded-lg p-6 w-11/12 max-w-6xl h-5/6 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-300">World Map</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              {worldStats.discoveredZones}/{worldStats.totalZones} Zones | 
              {worldStats.unlockedFastTravel}/{worldStats.totalFastTravel} Fast Travel
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex gap-4 h-full">
          {/* Map area */}
          <div className="flex-1 relative">
            <h3 className="text-lg font-bold text-blue-300 mb-4">Zones</h3>
            
            {/* World map */}
            <div className="relative w-full h-96 bg-gray-800 rounded border border-gray-600 overflow-hidden">
              {/* Render zones at different positions */}
              {zones.map((zone, index) => {
                const positions = [
                  { x: 50, y: 50 },   // Azure Labyrinth (center)
                  { x: 200, y: 100 }, // Obsidian Dunes (right)
                  { x: 50, y: 200 },  // Jade Canopy (bottom)
                  { x: 300, y: 150 }, // Future zones
                  { x: 150, y: 300 }
                ];
                
                return renderZone(zone, positions[index] || { x: 100, y: 100 });
              })}
              
              {/* Zone connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {zones.flatMap(zone => 
                  zone.connections.map(connection => {
                    const fromZone = zones.find(z => z.id === connection.fromZone);
                    const toZone = zones.find(z => z.id === connection.toZone);
                    
                    if (fromZone && toZone) {
                      // Draw connection line
                      const fromIndex = zones.indexOf(fromZone);
                      const toIndex = zones.indexOf(toZone);
                      const fromPos = [
                        { x: 50, y: 50 },
                        { x: 200, y: 100 },
                        { x: 50, y: 200 },
                        { x: 300, y: 150 },
                        { x: 150, y: 300 }
                      ][fromIndex] || { x: 100, y: 100 };
                      const toPos = [
                        { x: 50, y: 50 },
                        { x: 200, y: 100 },
                        { x: 50, y: 200 },
                        { x: 300, y: 150 },
                        { x: 150, y: 300 }
                      ][toIndex] || { x: 100, y: 100 };
                      
                      return (
                        <line
                          key={`${connection.fromZone}-${connection.toZone}`}
                          x1={fromPos.x + 48}
                          y1={fromPos.y + 48}
                          x2={toPos.x + 48}
                          y2={toPos.y + 48}
                          stroke={connection.locked ? "#6b7280" : "#3b82f6"}
                          strokeWidth="2"
                          strokeDasharray={connection.locked ? "5,5" : "0"}
                        />
                      );
                    }
                    return null;
                  })
                )}
              </svg>
            </div>
            
            {/* Map legend */}
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-bold text-blue-300 mb-2">Zone Status</h4>
                <div className="space-y-1">
                  {(['locked', 'available', 'explored', 'completed', 'corrupted'] as ZoneStatus[]).map(status => (
                    <div key={status} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border-2"
                        style={{ borderColor: getZoneStatusColor(status) }}
                      />
                      <span className="text-gray-300">{getZoneStatusText(status)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-blue-300 mb-2">Zone Types</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span>🏛️</span>
                    <span className="text-gray-300">Labyrinth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🏜️</span>
                    <span className="text-gray-300">Wilderness</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🌳</span>
                    <span className="text-gray-300">Garden</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🏰</span>
                    <span className="text-gray-300">Dungeon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="w-80 border-l border-gray-600 pl-4">
            {/* Zone details */}
            {(selectedZone || hoveredZone) && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-blue-300 mb-4">Zone Details</h3>
                {(() => {
                  const zone = selectedZone || hoveredZone;
                  if (!zone) return null;
                  
                  return (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-bold text-white">{zone.name}</h4>
                        <p className="text-sm text-gray-300">{zone.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-400">Type:</span>
                          <span className="text-white ml-1 capitalize">{zone.type}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Level:</span>
                          <span className="text-white ml-1">{zone.level}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Difficulty:</span>
                          <span className="text-white ml-1">{zone.difficulty}/10</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Status:</span>
                          <span className="text-white ml-1">{getZoneStatusText(zone.status)}</span>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-gray-400 text-sm">Exploration:</span>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getExplorationProgress(zone.id)}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {getExplorationProgress(zone.id)}% explored
                        </div>
                      </div>
                      
                      {zone.status === 'locked' && (
                        <div className="text-sm text-red-400">
                          This zone is locked. Complete the required quests to unlock it.
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Fast travel */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-blue-300">Fast Travel</h3>
                <button
                  onClick={() => setShowFastTravel(!showFastTravel)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  {showFastTravel ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showFastTravel && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {fastTravelPoints.map(point => {
                    const zone = getZone(point.zone);
                    if (!zone) return null;
                    return renderFastTravelPoint(point, zone);
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom info */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-600">
          <div className="text-sm text-gray-400">
            Current Zone: {currentZone?.name || 'None'} | 
            Time: {worldStats.timeOfDay} | 
            Weather: {worldStats.weather}
          </div>
          <div className="text-sm text-gray-400">
            Total Exploration: {Math.round(worldStats.totalExploration)}%
          </div>
        </div>
      </div>
    </div>
  );
}