import { create } from "zustand";
import { 
  Item, 
  Equipment, 
  Weapon, 
  Armor, 
  Consumable, 
  InventorySlot, 
  EquipmentSlot,
  EquipmentSet,
  CraftingRecipe,
  ItemRarity
} from "@shared/inventoryTypes";

interface InventoryState {
  // Inventory management
  inventory: InventorySlot[];
  maxSlots: number;
  
  // Equipment
  equippedItems: Record<EquipmentSlot, Equipment | null>;
  
  // Currency
  gold: number;
  echoes: number;
  
  // Crafting
  knownRecipes: string[];
  craftingMaterials: Record<string, number>;
  
  // Actions
  addItem: (item: Item, quantity?: number) => boolean;
  removeItem: (itemId: string, quantity?: number) => boolean;
  hasItem: (itemId: string, quantity?: number) => boolean;
  getItemQuantity: (itemId: string) => number;
  
  // Equipment actions
  equipItem: (item: Equipment) => boolean;
  unequipItem: (slot: EquipmentSlot) => boolean;
  getEquippedStats: () => Record<string, number>;
  
  // Currency actions
  addGold: (amount: number) => void;
  removeGold: (amount: number) => boolean;
  addEchoes: (amount: number) => void;
  removeEchoes: (amount: number) => boolean;
  
  // Crafting actions
  learnRecipe: (recipeId: string) => void;
  canCraft: (recipe: CraftingRecipe) => boolean;
  craftItem: (recipe: CraftingRecipe) => boolean;
  
  // Utility
  getInventoryWeight: () => number;
  getMaxWeight: () => number;
  sortInventory: () => void;
  clearInventory: () => void;
}

const DEFAULT_MAX_SLOTS = 50;
const DEFAULT_MAX_WEIGHT = 1000;

export const useInventory = create<InventoryState>((set, get) => ({
  // Initial state
  inventory: Array(DEFAULT_MAX_SLOTS).fill(null).map(() => ({ item: null, quantity: 0, equipped: false })),
  maxSlots: DEFAULT_MAX_SLOTS,
  
  equippedItems: {
    weapon: null,
    helmet: null,
    chestplate: null,
    leggings: null,
    boots: null,
    accessory1: null,
    accessory2: null,
    accessory3: null,
  },
  
  gold: 100, // Starting gold
  echoes: 0,
  
  knownRecipes: [],
  craftingMaterials: {},
  
  // Add item to inventory
  addItem: (item, quantity = 1) => {
    const state = get();
    
    // Check if item is stackable and already exists
    if (item.stackable) {
      const existingSlot = state.inventory.find(slot => 
        slot.item?.id === item.id && slot.quantity < item.maxStack
      );
      
      if (existingSlot) {
        const canAdd = Math.min(quantity, item.maxStack - existingSlot.quantity);
        existingSlot.quantity += canAdd;
        
        if (canAdd < quantity) {
          // Try to add remaining to new slots
          return state.addItem(item, quantity - canAdd);
        }
        
        set({ inventory: [...state.inventory] });
        return true;
      }
    }
    
    // Find empty slot
    const emptySlot = state.inventory.find(slot => slot.item === null);
    if (!emptySlot) {
      console.log("Inventory full!");
      return false;
    }
    
    // Add to empty slot
    const addQuantity = item.stackable ? Math.min(quantity, item.maxStack) : 1;
    emptySlot.item = item;
    emptySlot.quantity = addQuantity;
    
    set({ inventory: [...state.inventory] });
    
    // If we couldn't add all items, try again
    if (item.stackable && addQuantity < quantity) {
      return state.addItem(item, quantity - addQuantity);
    }
    
    return true;
  },
  
  // Remove item from inventory
  removeItem: (itemId, quantity = 1) => {
    const state = get();
    let remaining = quantity;
    
    for (const slot of state.inventory) {
      if (slot.item?.id === itemId && slot.quantity > 0) {
        const removeFromSlot = Math.min(remaining, slot.quantity);
        slot.quantity -= removeFromSlot;
        remaining -= removeFromSlot;
        
        if (slot.quantity === 0) {
          slot.item = null;
        }
        
        if (remaining === 0) {
          set({ inventory: [...state.inventory] });
          return true;
        }
      }
    }
    
    set({ inventory: [...state.inventory] });
    return remaining === 0;
  },
  
  // Check if player has item
  hasItem: (itemId, quantity = 1) => {
    const state = get();
    let totalQuantity = 0;
    
    for (const slot of state.inventory) {
      if (slot.item?.id === itemId) {
        totalQuantity += slot.quantity;
      }
    }
    
    return totalQuantity >= quantity;
  },
  
  // Get item quantity
  getItemQuantity: (itemId) => {
    const state = get();
    let totalQuantity = 0;
    
    for (const slot of state.inventory) {
      if (slot.item?.id === itemId) {
        totalQuantity += slot.quantity;
      }
    }
    
    return totalQuantity;
  },
  
  // Equip item
  equipItem: (item) => {
    const state = get();
    
    // Check if item is already equipped
    if (state.equippedItems[item.slot]?.id === item.id) {
      return true;
    }
    
    // Unequip current item in slot if any
    if (state.equippedItems[item.slot]) {
      state.unequipItem(item.slot);
    }
    
    // Remove item from inventory
    if (!state.removeItem(item.id, 1)) {
      return false;
    }
    
    // Equip the item
    set({
      equippedItems: {
        ...state.equippedItems,
        [item.slot]: item
      }
    });
    
    return true;
  },
  
  // Unequip item
  unequipItem: (slot) => {
    const state = get();
    const item = state.equippedItems[slot];
    
    if (!item) {
      return false;
    }
    
    // Try to add back to inventory
    if (state.addItem(item, 1)) {
      set({
        equippedItems: {
          ...state.equippedItems,
          [slot]: null
        }
      });
      return true;
    }
    
    return false;
  },
  
  // Get total equipped stats
  getEquippedStats: () => {
    const state = get();
    const stats: Record<string, number> = {};
    
    Object.values(state.equippedItems).forEach(item => {
      if (item && item.stats) {
        Object.entries(item.stats).forEach(([stat, value]) => {
          stats[stat] = (stats[stat] || 0) + (value || 0);
        });
      }
    });
    
    return stats;
  },
  
  // Add gold
  addGold: (amount) => {
    set(state => ({ gold: state.gold + amount }));
  },
  
  // Remove gold
  removeGold: (amount) => {
    const state = get();
    if (state.gold >= amount) {
      set({ gold: state.gold - amount });
      return true;
    }
    return false;
  },
  
  // Add echoes
  addEchoes: (amount) => {
    set(state => ({ echoes: state.echoes + amount }));
  },
  
  // Remove echoes
  removeEchoes: (amount) => {
    const state = get();
    if (state.echoes >= amount) {
      set({ echoes: state.echoes - amount });
      return true;
    }
    return false;
  },
  
  // Learn recipe
  learnRecipe: (recipeId) => {
    set(state => ({
      knownRecipes: state.knownRecipes.includes(recipeId) 
        ? state.knownRecipes 
        : [...state.knownRecipes, recipeId]
    }));
  },
  
  // Check if can craft
  canCraft: (recipe) => {
    const state = get();
    
    // Check if recipe is known
    if (!state.knownRecipes.includes(recipe.id)) {
      return false;
    }
    
    // Check materials
    for (const material of recipe.materials) {
      if (!state.hasItem(material.itemId, material.quantity)) {
        return false;
      }
    }
    
    return true;
  },
  
  // Craft item
  craftItem: (recipe) => {
    const state = get();
    
    if (!state.canCraft(recipe)) {
      return false;
    }
    
    // Remove materials
    for (const material of recipe.materials) {
      if (!state.removeItem(material.itemId, material.quantity)) {
        return false;
      }
    }
    
    // Add result item
    return state.addItem({ 
      id: recipe.result.itemId,
      name: recipe.name,
      description: recipe.description,
      type: 'weapon', // This would be determined by the recipe
      rarity: 'common',
      value: 0,
      stackable: false,
      maxStack: 1,
      icon: ''
    } as Item, recipe.result.quantity);
  },
  
  // Get inventory weight
  getInventoryWeight: () => {
    const state = get();
    let weight = 0;
    
    state.inventory.forEach(slot => {
      if (slot.item) {
        // Each item has a base weight of 1, equipment weighs more
        const itemWeight = slot.item.type === 'weapon' || slot.item.type === 'armor' ? 2 : 1;
        weight += itemWeight * slot.quantity;
      }
    });
    
    return weight;
  },
  
  // Get max weight
  getMaxWeight: () => {
    return DEFAULT_MAX_WEIGHT;
  },
  
  // Sort inventory
  sortInventory: () => {
    const state = get();
    const sortedSlots = [...state.inventory]
      .filter(slot => slot.item !== null)
      .sort((a, b) => {
        if (!a.item || !b.item) return 0;
        
        // Sort by type first
        const typeOrder = ['weapon', 'armor', 'accessory', 'consumable', 'material', 'quest', 'echo'];
        const aTypeIndex = typeOrder.indexOf(a.item.type);
        const bTypeIndex = typeOrder.indexOf(b.item.type);
        
        if (aTypeIndex !== bTypeIndex) {
          return aTypeIndex - bTypeIndex;
        }
        
        // Then by rarity
        const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
        const aRarityIndex = rarityOrder.indexOf(a.item.rarity);
        const bRarityIndex = rarityOrder.indexOf(b.item.rarity);
        
        if (aRarityIndex !== bRarityIndex) {
          return bRarityIndex - aRarityIndex; // Higher rarity first
        }
        
        // Finally by name
        return a.item.name.localeCompare(b.item.name);
      });
    
    // Clear inventory and add sorted items
    const newInventory = Array(DEFAULT_MAX_SLOTS).fill(null).map(() => ({ item: null, quantity: 0, equipped: false }));
    sortedSlots.forEach((slot, index) => {
      if (index < DEFAULT_MAX_SLOTS) {
        newInventory[index] = slot;
      }
    });
    
    set({ inventory: newInventory });
  },
  
  // Clear inventory
  clearInventory: () => {
    set({
      inventory: Array(DEFAULT_MAX_SLOTS).fill(null).map(() => ({ item: null, quantity: 0, equipped: false })),
      equippedItems: {
        weapon: null,
        helmet: null,
        chestplate: null,
        leggings: null,
        boots: null,
        accessory1: null,
        accessory2: null,
        accessory3: null,
      },
      gold: 100,
      echoes: 0,
      knownRecipes: [],
      craftingMaterials: {}
    });
  }
}));