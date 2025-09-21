import { useState, useEffect } from 'react';
import { useSkills } from '@/lib/stores/useSkills';
import { useCharacter } from '@/lib/stores/useCharacter';
import { Skill, SkillTree, SkillCategory } from '@shared/skillTypes';

interface SkillTreeUIProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SkillTreeUI({ isOpen, onClose }: SkillTreeUIProps) {
  const {
    skillTrees,
    availableSkillPoints,
    learnSkill,
    upgradeSkill,
    canLearnSkill,
    getSkillById,
    getSkillsByCategory,
    getLearnedSkills,
    getActiveSkillEffects
  } = useSkills();

  const { level, skillPoints } = useCharacter();

  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('combat');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

  // Get current skill tree
  const currentSkillTree = skillTrees.find(tree => tree.category === selectedCategory);

  // Get category color
  const getCategoryColor = (category: SkillCategory): string => {
    switch (category) {
      case 'combat': return '#ef4444';
      case 'magic': return '#8b5cf6';
      case 'survival': return '#10b981';
      case 'social': return '#3b82f6';
      case 'crafting': return '#f59e0b';
      case 'exploration': return '#06b6d4';
      default: return '#6b7280';
    }
  };

  // Get skill type color
  const getSkillTypeColor = (type: string): string => {
    switch (type) {
      case 'passive': return '#10b981';
      case 'active': return '#ef4444';
      case 'aura': return '#8b5cf6';
      case 'toggle': return '#f59e0b';
      case 'triggered': return '#06b6d4';
      default: return '#6b7280';
    }
  };

  // Get skill status
  const getSkillStatus = (skill: Skill): 'locked' | 'available' | 'learned' | 'maxed' => {
    if (skill.level >= skill.maxLevel) return 'maxed';
    if (skill.level > 0) return 'learned';
    if (canLearnSkill(skill.id)) return 'available';
    return 'locked';
  };

  // Get skill status color
  const getSkillStatusColor = (status: string): string => {
    switch (status) {
      case 'available': return '#3b82f6';
      case 'learned': return '#10b981';
      case 'maxed': return '#f59e0b';
      case 'locked': return '#6b7280';
      default: return '#6b7280';
    }
  };

  // Handle skill click
  const handleSkillClick = (skill: Skill) => {
    const status = getSkillStatus(skill);
    
    if (status === 'available') {
      learnSkill(skill.id);
    } else if (status === 'learned') {
      upgradeSkill(skill.id);
    }
  };

  // Render skill node
  const renderSkillNode = (skill: Skill) => {
    const status = getSkillStatus(skill);
    const isSelected = selectedSkill?.id === skill.id;
    const isHovered = hoveredSkill?.id === skill.id;
    
    return (
      <div
        key={skill.id}
        className={`absolute w-16 h-16 rounded-full border-4 cursor-pointer transition-all duration-200 ${
          isSelected ? 'scale-110' : isHovered ? 'scale-105' : ''
        }`}
        style={{
          left: `${skill.position.x * 100 + 200}px`,
          top: `${skill.position.y * 100 + 200}px`,
          borderColor: getSkillStatusColor(status),
          backgroundColor: status === 'locked' ? '#374151' : '#1f2937',
          boxShadow: isSelected ? `0 0 20px ${getSkillStatusColor(status)}` : 'none'
        }}
        onClick={() => handleSkillClick(skill)}
        onMouseEnter={() => setHoveredSkill(skill)}
        onMouseLeave={() => setHoveredSkill(null)}
      >
        <div className="w-full h-full flex items-center justify-center text-white font-bold">
          {skill.level > 0 ? skill.level : '?'}
        </div>
        
        {/* Skill type indicator */}
        <div
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center"
          style={{ backgroundColor: getSkillTypeColor(skill.type) }}
        >
          {skill.type === 'passive' ? 'P' : 
           skill.type === 'active' ? 'A' : 
           skill.type === 'aura' ? 'U' : 
           skill.type === 'toggle' ? 'T' : 'R'}
        </div>
      </div>
    );
  };

  // Render skill connections
  const renderSkillConnections = (skill: Skill) => {
    return skill.connections.map(connectionId => {
      const connectedSkill = getSkillById(connectionId);
      if (!connectedSkill) return null;
      
      const startX = skill.position.x * 100 + 200 + 32;
      const startY = skill.position.y * 100 + 200 + 32;
      const endX = connectedSkill.position.x * 100 + 200 + 32;
      const endY = connectedSkill.position.y * 100 + 200 + 32;
      
      return (
        <line
          key={`${skill.id}-${connectionId}`}
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#6b7280"
          strokeWidth="2"
          opacity="0.5"
        />
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-blue-500 rounded-lg p-6 w-11/12 max-w-7xl h-5/6 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-300">Skill Trees</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Available Points: <span className="text-yellow-400 font-bold">{availableSkillPoints}</span>
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
          {/* Skill tree categories */}
          <div className="w-48 border-r border-gray-600 pr-4">
            <h3 className="text-lg font-bold text-blue-300 mb-4">Categories</h3>
            <div className="space-y-2">
              {skillTrees.map((tree) => (
                <button
                  key={tree.id}
                  onClick={() => setSelectedCategory(tree.category)}
                  className={`w-full text-left p-3 rounded border-2 transition-colors ${
                    selectedCategory === tree.category
                      ? 'border-blue-500 bg-blue-900 bg-opacity-30'
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                  style={{
                    borderColor: selectedCategory === tree.category ? getCategoryColor(tree.category) : undefined
                  }}
                >
                  <div className="font-bold text-white">{tree.name}</div>
                  <div className="text-xs text-gray-400">{tree.description}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Points: {tree.currentPoints}/{tree.maxPoints}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Skill tree visualization */}
          <div className="flex-1 relative">
            <h3 className="text-lg font-bold text-blue-300 mb-4">
              {currentSkillTree?.name} Skill Tree
            </h3>
            
            {/* SVG for skill connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {currentSkillTree?.skills.map(skill => renderSkillConnections(skill))}
            </svg>
            
            {/* Skill nodes */}
            <div className="relative w-full h-full">
              {currentSkillTree?.skills.map(skill => renderSkillNode(skill))}
            </div>
          </div>

          {/* Skill details panel */}
          {(selectedSkill || hoveredSkill) && (
            <div className="w-80 border-l border-gray-600 pl-4">
              <div className="space-y-4">
                {(() => {
                  const skill = selectedSkill || hoveredSkill;
                  if (!skill) return null;
                  
                  const status = getSkillStatus(skill);
                  
                  return (
                    <>
                      {/* Skill header */}
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{skill.name}</h3>
                        <div className="flex gap-2 mb-2">
                          <span
                            className="text-xs px-2 py-1 rounded"
                            style={{
                              backgroundColor: getSkillTypeColor(skill.type),
                              color: 'white'
                            }}
                          >
                            {skill.type}
                          </span>
                          <span
                            className="text-xs px-2 py-1 rounded"
                            style={{
                              backgroundColor: getSkillStatusColor(status),
                              color: 'white'
                            }}
                          >
                            {status}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{skill.description}</p>
                        {skill.flavorText && (
                          <p className="text-gray-400 text-xs italic">{skill.flavorText}</p>
                        )}
                      </div>

                      {/* Skill info */}
                      <div className="border border-gray-600 rounded p-3">
                        <h4 className="font-bold text-blue-300 mb-2">Skill Info</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Level:</span>
                            <span>{skill.level}/{skill.maxLevel}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cost:</span>
                            <span>{skill.cost} points</span>
                          </div>
                          {skill.cooldown && (
                            <div className="flex justify-between">
                              <span>Cooldown:</span>
                              <span>{skill.cooldown}s</span>
                            </div>
                          )}
                          {skill.energyCost && (
                            <div className="flex justify-between">
                              <span>Energy Cost:</span>
                              <span>{skill.energyCost}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Skill effects */}
                      <div className="border border-gray-600 rounded p-3">
                        <h4 className="font-bold text-blue-300 mb-2">Effects</h4>
                        <div className="space-y-1">
                          {skill.effects.map((effect, index) => (
                            <div key={index} className="text-sm text-gray-300">
                              <span className="font-bold">{effect.type.replace('_', ' ')}:</span> {effect.value}
                              {effect.target && <span className="text-gray-400"> ({effect.target})</span>}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Requirements */}
                      {skill.requirements.length > 0 && (
                        <div className="border border-gray-600 rounded p-3">
                          <h4 className="font-bold text-blue-300 mb-2">Requirements</h4>
                          <div className="space-y-1">
                            {skill.requirements.map((req, index) => (
                              <div key={index} className="text-sm text-gray-300">
                                {req.description}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Prerequisites */}
                      {skill.prerequisites.length > 0 && (
                        <div className="border border-gray-600 rounded p-3">
                          <h4 className="font-bold text-blue-300 mb-2">Prerequisites</h4>
                          <div className="space-y-1">
                            {skill.prerequisites.map((prereqId) => {
                              const prereqSkill = getSkillById(prereqId);
                              return (
                                <div key={prereqId} className="text-sm text-gray-300">
                                  {prereqSkill?.name || prereqId}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="space-y-2">
                        {status === 'available' && (
                          <button
                            onClick={() => handleSkillClick(skill)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                          >
                            Learn Skill ({skill.cost} points)
                          </button>
                        )}
                        
                        {status === 'learned' && (
                          <button
                            onClick={() => handleSkillClick(skill)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                          >
                            Upgrade Skill ({skill.cost} points)
                          </button>
                        )}
                        
                        <button
                          onClick={() => setSelectedSkill(null)}
                          className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                        >
                          Close
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Bottom info */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-600">
          <div className="text-sm text-gray-400">
            Total Skill Points: {skillPoints} | Available: {availableSkillPoints}
          </div>
          <div className="text-sm text-gray-400">
            Learned Skills: {getLearnedSkills().length}
          </div>
        </div>
      </div>
    </div>
  );
}