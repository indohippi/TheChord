import { useState, useEffect } from 'react';
import { useInventory } from '@/lib/stores/useInventory';
import { useCharacter } from '@/lib/stores/useCharacter';
import { 
  Item, 
  Equipment, 
  Weapon, 
  Armor, 
  Consumable,
  EquipmentSlot,
  ItemRarity
} from '@shared/inventoryTypes';
import { getItemById, getEquipmentById, getConsumableById } from '../data/items';

interface InventoryUIProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InventoryUI({ isOpen, onClose }: InventoryUIProps) {
  const {
    inventory,
    equippedItems,
    gold,
    echoes,
    addItem,
    removeItem,
    equipItem,
    unequipItem,
    getEquippedStats,
    sortInventory
  } = useInventory();

  const { stats } = useCharacter();
  const [selectedTab, setSelectedTab] = useState<'inventory' | 'equipment' | 'crafting'>('inventory');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

  // Get rarity color
  const getRarityColor = (rarity: ItemRarity): string => {
    switch (rarity) {
      case 'common': return '#9ca3af';
      case 'uncommon': return '#10b981';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      case 'mythic': return '#ef4444';
      default: return '#9ca3af';
    }
  };

  // Get rarity border
  const getRarityBorder = (rarity: ItemRarity): string => {
    const color = getRarityColor(rarity);
    return `2px solid ${color}`;
  };

  // Handle item click
  const handleItemClick = (slotIndex: number) => {
    const slot = inventory[slotIndex];
    if (slot.item) {
      setSelectedItem(slot.item);
    }
  };

  // Handle equip item
  const handleEquipItem = (item: Item) => {
    if (item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory') {
      const equipment = getEquipmentById(item.id);
      if (equipment) {
        equipItem(equipment);
        setSelectedItem(null);
      }
    }
  };

  // Handle use consumable
  const handleUseConsumable = (item: Item) => {
    if (item.type === 'consumable') {
      const consumable = getConsumableById(item.id);
      if (consumable) {
        // Apply consumable effect here
        console.log(`Using ${item.name}`);
        removeItem(item.id, 1);
        setSelectedItem(null);
      }
    }
  };

  // Handle unequip
  const handleUnequip = (slot: EquipmentSlot) => {
    unequipItem(slot);
  };

  // Get equipment slot icon
  const getSlotIcon = (slot: EquipmentSlot): string => {
    switch (slot) {
      case 'weapon': return '⚔️';
      case 'helmet': return '⛑️';
      case 'chestplate': return '🛡️';
      case 'leggings': return '👖';
      case 'boots': return '👢';
      case 'accessory1':
      case 'accessory2':
      case 'accessory3': return '💍';
      default: return '❓';
    }
  };

  // Get total stats including equipment
  const totalStats = { ...stats, ...getEquippedStats() };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-blue-500 rounded-lg p-6 w-11/12 max-w-6xl h-5/6 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-300">Inventory</h2>
          <div className="flex gap-4 text-sm">
            <span className="text-yellow-400">💰 {gold}</span>
            <span className="text-purple-400">✨ {echoes}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(['inventory', 'equipment', 'crafting'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded ${
                selectedTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-4 h-full">
          {/* Main content area */}
          <div className="flex-1">
            {selectedTab === 'inventory' && (
              <div className="grid grid-cols-8 gap-2 h-full overflow-y-auto">
                {inventory.map((slot, index) => (
                  <div
                    key={index}
                    className={`aspect-square border-2 rounded cursor-pointer relative ${
                      slot.item
                        ? 'border-gray-600 hover:border-gray-400'
                        : 'border-gray-700 border-dashed'
                    } ${hoveredSlot === index ? 'ring-2 ring-blue-400' : ''}`}
                    style={slot.item ? { borderColor: getRarityColor(slot.item.rarity) } : {}}
                    onClick={() => handleItemClick(index)}
                    onMouseEnter={() => setHoveredSlot(index)}
                    onMouseLeave={() => setHoveredSlot(null)}
                  >
                    {slot.item && (
                      <>
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          {slot.item.icon || '📦'}
                        </div>
                        {slot.quantity > 1 && (
                          <div className="absolute bottom-0 right-0 bg-black bg-opacity-75 text-white text-xs px-1 rounded-tl">
                            {slot.quantity}
                          </div>
                        )}
                        {slot.equipped && (
                          <div className="absolute top-0 left-0 bg-green-500 text-white text-xs px-1 rounded-br">
                            E
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'equipment' && (
              <div className="space-y-4">
                {/* Equipment slots */}
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(equippedItems).map(([slot, item]) => (
                    <div
                      key={slot}
                      className="border-2 border-gray-600 rounded p-4 text-center"
                    >
                      <div className="text-2xl mb-2">{getSlotIcon(slot as EquipmentSlot)}</div>
                      <div className="text-sm text-gray-400 mb-2 capitalize">
                        {slot.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      {item ? (
                        <div>
                          <div 
                            className="text-sm font-bold mb-1"
                            style={{ color: getRarityColor(item.rarity) }}
                          >
                            {item.name}
                          </div>
                          <button
                            onClick={() => handleUnequip(slot as EquipmentSlot)}
                            className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                          >
                            Unequip
                          </button>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">Empty</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Stats display */}
                <div className="border border-gray-600 rounded p-4">
                  <h3 className="text-lg font-bold mb-2 text-blue-300">Total Stats</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(totalStats).map(([stat, value]) => (
                      <div key={stat} className="flex justify-between">
                        <span className="capitalize">{stat}:</span>
                        <span className="font-bold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'crafting' && (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-4">🔨</div>
                <p>Crafting system coming soon!</p>
              </div>
            )}
          </div>

          {/* Item details panel */}
          {selectedItem && (
            <div className="w-80 border-l border-gray-600 pl-4">
              <div className="space-y-4">
                <div>
                  <h3 
                    className="text-xl font-bold mb-2"
                    style={{ color: getRarityColor(selectedItem.rarity) }}
                  >
                    {selectedItem.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {selectedItem.type} • {selectedItem.rarity}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {selectedItem.description}
                  </p>
                </div>

                {/* Item stats */}
                {selectedItem.type === 'weapon' || selectedItem.type === 'armor' ? (
                  <div>
                    <h4 className="font-bold mb-2 text-blue-300">Stats</h4>
                    <div className="space-y-1 text-sm">
                      {getEquipmentById(selectedItem.id)?.stats && 
                        Object.entries(getEquipmentById(selectedItem.id)!.stats).map(([stat, value]) => (
                          <div key={stat} className="flex justify-between">
                            <span className="capitalize">{stat}:</span>
                            <span className="text-green-400">+{value}</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                ) : null}

                {/* Item effects */}
                {selectedItem.type === 'consumable' && (
                  <div>
                    <h4 className="font-bold mb-2 text-blue-300">Effect</h4>
                    <p className="text-sm text-gray-300">
                      {getConsumableById(selectedItem.id)?.effect.type} - 
                      {getConsumableById(selectedItem.id)?.effect.value}
                    </p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="space-y-2">
                  {(selectedItem.type === 'weapon' || selectedItem.type === 'armor' || selectedItem.type === 'accessory') && (
                    <button
                      onClick={() => handleEquipItem(selectedItem)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    >
                      Equip
                    </button>
                  )}
                  
                  {selectedItem.type === 'consumable' && (
                    <button
                      onClick={() => handleUseConsumable(selectedItem)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                    >
                      Use
                    </button>
                  )}
                  
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-600">
          <button
            onClick={sortInventory}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
          >
            Sort Inventory
          </button>
          
          <div className="text-sm text-gray-400">
            Weight: {inventory.filter(slot => slot.item).length} / 50
          </div>
        </div>
      </div>
    </div>
  );
}