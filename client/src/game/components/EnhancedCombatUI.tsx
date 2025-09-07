import { useState, useEffect } from 'react';
import { useCombat } from '@/lib/stores/useCombat';
import { StatusEffect, DamageType, StatusEffectType } from '@shared/combatTypes';

interface EnhancedCombatUIProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnhancedCombatUI({ isOpen, onClose }: EnhancedCombatUIProps) {
  const {
    combatState,
    processTurn,
    getCurrentEntity,
    getEntity,
    getCombatStats,
    isCombatActive
  } = useCombat();

  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [showStatusEffects, setShowStatusEffects] = useState<string>('');

  // Get status effect color
  const getStatusEffectColor = (type: StatusEffectType): string => {
    switch (type) {
      case 'poison': return '#8b5cf6';
      case 'burn': return '#ef4444';
      case 'freeze': return '#06b6d4';
      case 'stun': return '#f59e0b';
      case 'charm': return '#ec4899';
      case 'fear': return '#6b7280';
      case 'rage': return '#dc2626';
      case 'shield': return '#10b981';
      case 'regeneration': return '#22c55e';
      case 'haste': return '#3b82f6';
      case 'slow': return '#64748b';
      case 'silence': return '#7c2d12';
      case 'blind': return '#374151';
      case 'vulnerable': return '#be123c';
      case 'resistant': return '#059669';
      case 'immune': return '#7c3aed';
      case 'marked': return '#f97316';
      case 'blessed': return '#eab308';
      case 'cursed': return '#991b1b';
      default: return '#6b7280';
    }
  };

  // Get damage type color
  const getDamageTypeColor = (type: DamageType): string => {
    switch (type) {
      case 'physical': return '#6b7280';
      case 'magical': return '#8b5cf6';
      case 'fire': return '#ef4444';
      case 'ice': return '#06b6d4';
      case 'lightning': return '#eab308';
      case 'poison': return '#8b5cf6';
      case 'holy': return '#fbbf24';
      case 'dark': return '#374151';
      case 'chaos': return '#be123c';
      case 'echo': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  // Render status effect
  const renderStatusEffect = (effect: StatusEffect) => {
    return (
      <div
        key={effect.id}
        className="flex items-center gap-2 px-2 py-1 rounded text-xs"
        style={{ backgroundColor: getStatusEffectColor(effect.type) + '20' }}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: getStatusEffectColor(effect.type) }}
        />
        <span className="text-white font-medium">{effect.name}</span>
        {effect.currentStacks > 1 && (
          <span className="text-white bg-black bg-opacity-50 px-1 rounded">
            {effect.currentStacks}
          </span>
        )}
        <span className="text-gray-300">{effect.duration}</span>
      </div>
    );
  };

  // Render entity health bar
  const renderHealthBar = (entity: any) => {
    const healthPercentage = (entity.health / entity.maxHealth) * 100;
    const energyPercentage = (entity.energy / entity.maxEnergy) * 100;
    
    return (
      <div className="space-y-1">
        {/* Health bar */}
        <div className="relative w-full h-4 bg-gray-700 rounded">
          <div
            className="absolute top-0 left-0 h-full bg-red-500 rounded transition-all duration-300"
            style={{ width: `${healthPercentage}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
            {entity.health}/{entity.maxHealth}
          </div>
        </div>
        
        {/* Energy bar */}
        <div className="relative w-full h-3 bg-gray-700 rounded">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 rounded transition-all duration-300"
            style={{ width: `${energyPercentage}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
            {entity.energy}/{entity.maxEnergy}
          </div>
        </div>
      </div>
    );
  };

  // Handle action selection
  const handleActionSelect = (action: string) => {
    setSelectedAction(action);
    setSelectedTarget('');
    setSelectedPosition(null);
  };

  // Handle target selection
  const handleTargetSelect = (targetId: string) => {
    setSelectedTarget(targetId);
  };

  // Handle position selection
  const handlePositionSelect = (position: [number, number]) => {
    setSelectedPosition(position);
  };

  // Execute action
  const executeAction = async () => {
    if (!selectedAction) return;
    
    try {
      const result = await processTurn(selectedAction, selectedTarget, selectedPosition || undefined);
      console.log('Combat result:', result);
      
      // Reset selections
      setSelectedAction('');
      setSelectedTarget('');
      setSelectedPosition(null);
    } catch (error) {
      console.error('Error executing action:', error);
    }
  };

  if (!isOpen || !isCombatActive()) return null;

  const currentEntity = getCurrentEntity();
  const combatStats = getCombatStats();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-red-500 rounded-lg p-6 w-11/12 max-w-7xl h-5/6 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-red-300">Enhanced Combat</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Turn {combatStats.turnNumber} | Active: {currentEntity?.name}
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
          {/* Left panel - Combat actions */}
          <div className="w-80 border-r border-gray-600 pr-4">
            <h3 className="text-lg font-bold text-blue-300 mb-4">Actions</h3>
            
            {/* Action buttons */}
            <div className="space-y-2 mb-4">
              {['attack', 'ability', 'move', 'defend', 'item', 'wait'].map((action) => (
                <button
                  key={action}
                  onClick={() => handleActionSelect(action)}
                  className={`w-full p-3 rounded border-2 transition-colors ${
                    selectedAction === action
                      ? 'border-blue-500 bg-blue-900 bg-opacity-30'
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                >
                  <div className="text-white font-medium capitalize">{action}</div>
                  <div className="text-xs text-gray-400">
                    {action === 'attack' && 'Basic physical attack'}
                    {action === 'ability' && 'Use special ability'}
                    {action === 'move' && 'Move to new position'}
                    {action === 'defend' && 'Take defensive stance'}
                    {action === 'item' && 'Use consumable item'}
                    {action === 'wait' && 'Skip turn'}
                  </div>
                </button>
              ))}
            </div>

            {/* Combo meter */}
            <div className="mb-4">
              <h4 className="text-sm font-bold text-yellow-300 mb-2">Combo Meter</h4>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-yellow-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${combatStats.comboMeter}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {combatStats.comboMeter}/100
              </div>
            </div>

            {/* Execute button */}
            <button
              onClick={executeAction}
              disabled={!selectedAction}
              className={`w-full py-3 px-4 rounded font-bold ${
                selectedAction
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Execute Action
            </button>
          </div>

          {/* Center panel - Combat area */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-blue-300 mb-4">Combat Area</h3>
            
            {/* Combat grid */}
            <div className="grid grid-cols-8 gap-2 h-64 mb-4">
              {Array.from({ length: 64 }, (_, i) => {
                const x = i % 8;
                const y = Math.floor(i / 8);
                const entity = combatState.entities.find(e => 
                  e.position[0] === x && e.position[1] === y
                );
                const isSelected = selectedPosition && selectedPosition[0] === x && selectedPosition[1] === y;
                
                return (
                  <div
                    key={i}
                    className={`aspect-square border-2 rounded cursor-pointer transition-colors ${
                      entity
                        ? entity.type === 'player'
                          ? 'border-blue-500 bg-blue-900 bg-opacity-30'
                          : 'border-red-500 bg-red-900 bg-opacity-30'
                        : isSelected
                        ? 'border-yellow-500 bg-yellow-900 bg-opacity-30'
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                    onClick={() => handlePositionSelect([x, y])}
                  >
                    {entity && (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold">
                        {entity.type === 'player' ? 'P' : 'E'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Environmental objects */}
            {combatState.environmentalObjects.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-bold text-green-300 mb-2">Environmental Objects</h4>
                <div className="flex flex-wrap gap-2">
                  {combatState.environmentalObjects.map((obj) => (
                    <div
                      key={obj.id}
                      className="bg-green-900 bg-opacity-30 border border-green-500 rounded px-2 py-1 text-xs text-green-300"
                    >
                      {obj.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right panel - Entity info */}
          <div className="w-80 border-l border-gray-600 pl-4">
            <h3 className="text-lg font-bold text-blue-300 mb-4">Entities</h3>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {combatState.entities.map((entity) => (
                <div
                  key={entity.id}
                  className={`border-2 rounded p-3 cursor-pointer transition-colors ${
                    selectedTarget === entity.id
                      ? 'border-yellow-500 bg-yellow-900 bg-opacity-30'
                      : entity.id === combatState.activeEntity
                      ? 'border-blue-500 bg-blue-900 bg-opacity-30'
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                  onClick={() => handleTargetSelect(entity.id)}
                >
                  {/* Entity header */}
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-bold">{entity.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      entity.type === 'player' ? 'bg-blue-600' : 'bg-red-600'
                    }`}>
                      {entity.type}
                    </span>
                  </div>
                  
                  {/* Health and energy bars */}
                  {renderHealthBar(entity)}
                  
                  {/* Status effects */}
                  {entity.statusEffects.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-400 mb-1">Status Effects</div>
                      <div className="flex flex-wrap gap-1">
                        {entity.statusEffects.map(renderStatusEffect)}
                      </div>
                    </div>
                  )}
                  
                  {/* Position */}
                  <div className="text-xs text-gray-400 mt-2">
                    Position: [{entity.position[0]}, {entity.position[1]}]
                  </div>
                  
                  {/* Combo count */}
                  {entity.comboCount > 0 && (
                    <div className="text-xs text-yellow-400 mt-1">
                      Combo: {entity.comboCount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom panel - Combat log */}
        <div className="mt-4 pt-4 border-t border-gray-600">
          <h4 className="text-sm font-bold text-blue-300 mb-2">Combat Log</h4>
          <div className="bg-gray-800 rounded p-3 h-24 overflow-y-auto">
            {combatState.turnHistory.slice(-5).map((turn, index) => (
              <div key={index} className="text-sm text-gray-300 mb-1">
                <span className="text-blue-400">Turn {turn.turnNumber}:</span>
                <span className="text-white ml-2">{turn.result.message}</span>
                {turn.result.criticalHit && (
                  <span className="text-yellow-400 ml-2">(Critical!)</span>
                )}
                {turn.result.comboTriggered && (
                  <span className="text-purple-400 ml-2">(Combo!)</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}