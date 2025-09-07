import React, { useState, useEffect } from 'react';
import { useCrafting } from '@/lib/stores/useCrafting';
import { useUI } from '@/lib/stores/useUI';
import { craftingMaterials, craftingRecipes, craftingStations, craftingSkills } from '../data/craftingData';

interface CraftingUIProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CraftingUI: React.FC<CraftingUIProps> = ({ isOpen, onClose }) => {
  const {
    materials,
    playerMaterials,
    recipes,
    knownRecipes,
    stations,
    unlockedStations,
    skills,
    activeSessions,
    craftingQueue,
    addMaterial,
    addPlayerMaterial,
    learnRecipe,
    unlockStation,
    upgradeStation,
    startCrafting,
    cancelCrafting,
    addToQueue,
    removeFromQueue,
    getPlayerMaterialCount,
    canCraftRecipe,
    getRecipe,
    getStation,
    getSkill,
    calculateCraftingTime,
    calculateSuccessRate
  } = useCrafting();

  const { addNotification } = useUI();

  const [selectedTab, setSelectedTab] = useState<'materials' | 'recipes' | 'stations' | 'skills' | 'crafting' | 'queue'>('materials');
  const [selectedStation, setSelectedStation] = useState<string>('forge');
  const [selectedRecipe, setSelectedRecipe] = useState<string>('');
  const [craftingQuantity, setCraftingQuantity] = useState(1);

  useEffect(() => {
    // Initialize crafting data
    craftingMaterials.forEach(material => addMaterial(material));
    craftingRecipes.forEach(recipe => learnRecipe(recipe.id));
    craftingStations.forEach(station => {
      if (station.isUnlocked) {
        unlockStation(station.id);
      }
    });
    craftingSkills.forEach(skill => {
      // Skills are initialized in the store
    });
  }, [addMaterial, learnRecipe, unlockStation]);

  if (!isOpen) return null;

  const handleStartCrafting = () => {
    if (!selectedRecipe || !selectedStation) return;

    if (canCraftRecipe(selectedRecipe)) {
      startCrafting(selectedRecipe, selectedStation, craftingQuantity);
      addNotification({
        title: 'Crafting Started',
        message: 'Your crafting session has begun',
        type: 'success'
      });
    } else {
      addNotification({
        title: 'Cannot Craft',
        message: 'You don\'t have the required materials or skills',
        type: 'error'
      });
    }
  };

  const handleAddToQueue = () => {
    if (!selectedRecipe) return;

    addToQueue(selectedRecipe, craftingQuantity, 1);
    addNotification({
      title: 'Added to Queue',
      message: 'Recipe added to crafting queue',
      type: 'info'
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-blue-500 rounded-lg p-6 w-11/12 max-w-7xl h-5/6 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">
            Crafting System
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-4">
          {(['materials', 'recipes', 'stations', 'skills', 'crafting', 'queue'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto">
          {selectedTab === 'materials' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">Your Materials</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {materials.map((material) => {
                    const count = getPlayerMaterialCount(material.id);
                    return (
                      <div
                        key={material.id}
                        className="bg-gray-700 rounded-lg p-3 border border-gray-600"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{material.icon}</span>
                          <span className="text-white font-semibold">{count}</span>
                        </div>
                        <h4 className="text-white font-semibold text-sm">{material.name}</h4>
                        <p className="text-gray-400 text-xs">{material.description}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-yellow-400 text-xs">{material.rarity}</span>
                          <span className="text-green-400 text-xs">{material.value}g</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'recipes' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">Known Recipes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recipes.filter(recipe => knownRecipes.includes(recipe.id)).map((recipe) => (
                    <div
                      key={recipe.id}
                      className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-semibold">{recipe.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          recipe.difficulty === 'trivial' ? 'bg-green-600' :
                          recipe.difficulty === 'easy' ? 'bg-blue-600' :
                          recipe.difficulty === 'normal' ? 'bg-yellow-600' :
                          recipe.difficulty === 'hard' ? 'bg-orange-600' :
                          'bg-red-600'
                        }`}>
                          {recipe.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{recipe.description}</p>
                      
                      <div className="mb-3">
                        <h5 className="text-white font-semibold text-sm mb-1">Materials Required:</h5>
                        <div className="space-y-1">
                          {recipe.materials.map((material, index) => {
                            const materialData = materials.find(m => m.id === material.materialId);
                            const playerCount = getPlayerMaterialCount(material.materialId);
                            const hasEnough = playerCount >= material.quantity;
                            
                            return (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span className="text-gray-300">
                                  {materialData?.icon} {materialData?.name}
                                </span>
                                <span className={hasEnough ? 'text-green-400' : 'text-red-400'}>
                                  {playerCount}/{material.quantity}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Time: {formatTime(recipe.craftingTime)}</span>
                        <span className="text-gray-400">XP: {recipe.experience}</span>
                        <span className="text-gray-400">Success: {recipe.successRate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'stations' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">Crafting Stations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stations.map((station) => (
                    <div
                      key={station.id}
                      className={`rounded-lg p-4 border ${
                        unlockedStations.includes(station.id)
                          ? 'bg-gray-700 border-green-500'
                          : 'bg-gray-800 border-gray-600'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-semibold">{station.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          unlockedStations.includes(station.id) ? 'bg-green-600' : 'bg-gray-600'
                        }`}>
                          {unlockedStations.includes(station.id) ? 'Unlocked' : 'Locked'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{station.description}</p>
                      
                      {unlockedStations.includes(station.id) && (
                        <div className="mb-3">
                          <h5 className="text-white font-semibold text-sm mb-1">Upgrades:</h5>
                          <div className="space-y-2">
                            {station.upgrades.map((upgrade, index) => (
                              <div key={index} className="bg-gray-600 rounded p-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-white text-sm font-semibold">
                                    {upgrade.name}
                                  </span>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    station.currentUpgrade > index ? 'bg-green-600' : 'bg-gray-500'
                                  }`}>
                                    {station.currentUpgrade > index ? 'Active' : 'Available'}
                                  </span>
                                </div>
                                <p className="text-gray-400 text-xs mt-1">{upgrade.description}</p>
                                {station.currentUpgrade <= index && (
                                  <div className="mt-2">
                                    <button
                                      onClick={() => upgradeStation(station.id, index + 1)}
                                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                                    >
                                      Upgrade ({upgrade.cost.gold}g)
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {!unlockedStations.includes(station.id) && station.unlockCost && (
                        <div className="mt-3">
                          <button
                            onClick={() => unlockStation(station.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Unlock ({station.unlockCost.gold}g)
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'skills' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">Crafting Skills</h3>
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-white font-semibold">{skill.name}</h4>
                        <span className="text-blue-400 font-semibold">Level {skill.level}</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{skill.description}</p>
                      
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white text-sm">Experience</span>
                          <span className="text-gray-400 text-sm">
                            {skill.experience}/{skill.experienceToNext}
                          </span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(skill.experience / skill.experienceToNext) * 100}%` }}
                          />
                        </div>
                      </div>

                      {skill.specializations.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-white font-semibold text-sm mb-2">Specializations:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {skill.specializations.map((spec) => (
                              <div key={spec.id} className="bg-gray-600 rounded p-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-white text-sm font-semibold">
                                    {spec.name}
                                  </span>
                                  <span className="text-blue-400 text-sm">Lv.{spec.level}</span>
                                </div>
                                <p className="text-gray-400 text-xs">{spec.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {skill.perks.length > 0 && (
                        <div>
                          <h5 className="text-white font-semibold text-sm mb-2">Perks:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {skill.perks.map((perk) => (
                              <div key={perk.id} className="bg-gray-600 rounded p-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-white text-sm font-semibold">
                                    {perk.name}
                                  </span>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    perk.unlocked ? 'bg-green-600' : 'bg-gray-500'
                                  }`}>
                                    {perk.unlocked ? 'Unlocked' : `Lv.${perk.level}`}
                                  </span>
                                </div>
                                <p className="text-gray-400 text-xs">{perk.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'crafting' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">Crafting</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recipe Selection */}
                  <div>
                    <h4 className="text-white font-semibold mb-3">Select Recipe</h4>
                    <select
                      value={selectedRecipe}
                      onChange={(e) => setSelectedRecipe(e.target.value)}
                      className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 mb-3"
                    >
                      <option value="">Choose a recipe...</option>
                      {recipes.filter(recipe => knownRecipes.includes(recipe.id)).map((recipe) => (
                        <option key={recipe.id} value={recipe.id}>
                          {recipe.name} ({recipe.difficulty})
                        </option>
                      ))}
                    </select>

                    {selectedRecipe && (
                      <div className="bg-gray-700 rounded-lg p-3 mb-3">
                        {(() => {
                          const recipe = getRecipe(selectedRecipe);
                          if (!recipe) return null;
                          
                          return (
                            <div>
                              <h5 className="text-white font-semibold mb-2">{recipe.name}</h5>
                              <p className="text-gray-400 text-sm mb-2">{recipe.description}</p>
                              <div className="text-sm text-gray-300">
                                <div>Time: {formatTime(recipe.craftingTime)}</div>
                                <div>Experience: {recipe.experience}</div>
                                <div>Success Rate: {recipe.successRate}%</div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Station Selection */}
                  <div>
                    <h4 className="text-white font-semibold mb-3">Select Station</h4>
                    <select
                      value={selectedStation}
                      onChange={(e) => setSelectedStation(e.target.value)}
                      className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 mb-3"
                    >
                      {stations.filter(station => unlockedStations.includes(station.id)).map((station) => (
                        <option key={station.id} value={station.id}>
                          {station.name}
                        </option>
                      ))}
                    </select>

                    <div className="mb-3">
                      <label className="block text-white text-sm mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={craftingQuantity}
                        onChange={(e) => setCraftingQuantity(parseInt(e.target.value) || 1)}
                        className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={handleStartCrafting}
                        disabled={!selectedRecipe || !selectedStation || !canCraftRecipe(selectedRecipe)}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg"
                      >
                        Start Crafting
                      </button>
                      <button
                        onClick={handleAddToQueue}
                        disabled={!selectedRecipe || !canCraftRecipe(selectedRecipe)}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg"
                      >
                        Add to Queue
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Sessions */}
              {activeSessions.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-white mb-4">Active Crafting</h3>
                  <div className="space-y-3">
                    {activeSessions.map((session) => {
                      const recipe = getRecipe(session.recipeId);
                      const station = getStation(session.stationId);
                      
                      return (
                        <div key={session.id} className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-white font-semibold">
                              {recipe?.name} at {station?.name}
                            </h4>
                            <span className={`px-2 py-1 rounded text-xs ${
                              session.status === 'active' ? 'bg-green-600' :
                              session.status === 'completed' ? 'bg-blue-600' :
                              session.status === 'failed' ? 'bg-red-600' :
                              'bg-gray-600'
                            }`}>
                              {session.status}
                            </span>
                          </div>
                          
                          {session.status === 'active' && (
                            <div className="mb-2">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-white text-sm">Progress</span>
                                <span className="text-gray-400 text-sm">{Math.round(session.progress)}%</span>
                              </div>
                              <div className="w-full bg-gray-600 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${session.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">
                              Started: {session.startTime.toLocaleTimeString()}
                            </span>
                            {session.status === 'active' && (
                              <button
                                onClick={() => cancelCrafting(session.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'queue' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">Crafting Queue</h3>
                
                {craftingQueue && craftingQueue.items.length > 0 ? (
                  <div className="space-y-3">
                    {craftingQueue.items.map((item, index) => {
                      const recipe = getRecipe(item.recipeId);
                      
                      return (
                        <div key={index} className="bg-gray-700 rounded-lg p-3 border border-gray-600">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-white font-semibold">
                                {recipe?.name} x{item.quantity}
                              </h4>
                              <p className="text-gray-400 text-sm">
                                Estimated time: {formatTime(item.estimatedTime)}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <span className="text-gray-400 text-sm">#{index + 1}</span>
                              <button
                                onClick={() => removeFromQueue(index)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No items in crafting queue
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};