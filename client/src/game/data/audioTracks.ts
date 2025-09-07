import { AudioTrack } from '../../../shared/audioTypes';

export const audioTracks: AudioTrack[] = [
  // Music tracks
  {
    id: 'main_theme',
    name: 'Main Theme',
    url: '/audio/music/main_theme.mp3',
    type: 'music',
    volume: 0.6,
    loop: true,
    fadeIn: 2,
    fadeOut: 2,
    category: 'ambient'
  },
  {
    id: 'combat_theme',
    name: 'Combat Theme',
    url: '/audio/music/combat_theme.mp3',
    type: 'music',
    volume: 0.7,
    loop: true,
    fadeIn: 1,
    fadeOut: 1,
    category: 'combat'
  },
  {
    id: 'victory_theme',
    name: 'Victory Theme',
    url: '/audio/music/victory_theme.mp3',
    type: 'music',
    volume: 0.8,
    loop: false,
    fadeIn: 0.5,
    fadeOut: 2,
    category: 'victory'
  },
  {
    id: 'defeat_theme',
    name: 'Defeat Theme',
    url: '/audio/music/defeat_theme.mp3',
    type: 'music',
    volume: 0.6,
    loop: false,
    fadeIn: 1,
    fadeOut: 3,
    category: 'defeat'
  },
  {
    id: 'exploration_theme',
    name: 'Exploration Theme',
    url: '/audio/music/exploration_theme.mp3',
    type: 'music',
    volume: 0.5,
    loop: true,
    fadeIn: 3,
    fadeOut: 3,
    category: 'exploration'
  },
  {
    id: 'boss_theme',
    name: 'Boss Theme',
    url: '/audio/music/boss_theme.mp3',
    type: 'music',
    volume: 0.8,
    loop: true,
    fadeIn: 1,
    fadeOut: 1,
    category: 'boss'
  },

  // Sound effects
  {
    id: 'button_click',
    name: 'Button Click',
    url: '/audio/sfx/button_click.mp3',
    type: 'sfx',
    volume: 0.8,
    loop: false,
    category: 'ui'
  },
  {
    id: 'button_hover',
    name: 'Button Hover',
    url: '/audio/sfx/button_hover.mp3',
    type: 'sfx',
    volume: 0.6,
    loop: false,
    category: 'ui'
  },
  {
    id: 'attack_sword',
    name: 'Sword Attack',
    url: '/audio/sfx/attack_sword.mp3',
    type: 'sfx',
    volume: 0.9,
    loop: false,
    category: 'combat'
  },
  {
    id: 'attack_magic',
    name: 'Magic Attack',
    url: '/audio/sfx/attack_magic.mp3',
    type: 'sfx',
    volume: 0.8,
    loop: false,
    category: 'combat'
  },
  {
    id: 'damage_taken',
    name: 'Damage Taken',
    url: '/audio/sfx/damage_taken.mp3',
    type: 'sfx',
    volume: 0.7,
    loop: false,
    category: 'combat'
  },
  {
    id: 'heal_spell',
    name: 'Heal Spell',
    url: '/audio/sfx/heal_spell.mp3',
    type: 'sfx',
    volume: 0.8,
    loop: false,
    category: 'combat'
  },
  {
    id: 'level_up',
    name: 'Level Up',
    url: '/audio/sfx/level_up.mp3',
    type: 'sfx',
    volume: 0.9,
    loop: false,
    category: 'progression'
  },
  {
    id: 'item_pickup',
    name: 'Item Pickup',
    url: '/audio/sfx/item_pickup.mp3',
    type: 'sfx',
    volume: 0.7,
    loop: false,
    category: 'inventory'
  },
  {
    id: 'item_equip',
    name: 'Item Equip',
    url: '/audio/sfx/item_equip.mp3',
    type: 'sfx',
    volume: 0.8,
    loop: false,
    category: 'inventory'
  },
  {
    id: 'quest_complete',
    name: 'Quest Complete',
    url: '/audio/sfx/quest_complete.mp3',
    type: 'sfx',
    volume: 0.9,
    loop: false,
    category: 'quest'
  },
  {
    id: 'quest_start',
    name: 'Quest Start',
    url: '/audio/sfx/quest_start.mp3',
    type: 'sfx',
    volume: 0.8,
    loop: false,
    category: 'quest'
  },
  {
    id: 'save_game',
    name: 'Save Game',
    url: '/audio/sfx/save_game.mp3',
    type: 'sfx',
    volume: 0.7,
    loop: false,
    category: 'system'
  },
  {
    id: 'load_game',
    name: 'Load Game',
    url: '/audio/sfx/load_game.mp3',
    type: 'sfx',
    volume: 0.7,
    loop: false,
    category: 'system'
  },
  {
    id: 'dialogue_open',
    name: 'Dialogue Open',
    url: '/audio/sfx/dialogue_open.mp3',
    type: 'sfx',
    volume: 0.6,
    loop: false,
    category: 'dialogue'
  },
  {
    id: 'dialogue_close',
    name: 'Dialogue Close',
    url: '/audio/sfx/dialogue_close.mp3',
    type: 'sfx',
    volume: 0.6,
    loop: false,
    category: 'dialogue'
  },
  {
    id: 'inventory_open',
    name: 'Inventory Open',
    url: '/audio/sfx/inventory_open.mp3',
    type: 'sfx',
    volume: 0.7,
    loop: false,
    category: 'inventory'
  },
  {
    id: 'inventory_close',
    name: 'Inventory Close',
    url: '/audio/sfx/inventory_close.mp3',
    type: 'sfx',
    volume: 0.7,
    loop: false,
    category: 'inventory'
  },
  {
    id: 'skill_learned',
    name: 'Skill Learned',
    url: '/audio/sfx/skill_learned.mp3',
    type: 'sfx',
    volume: 0.8,
    loop: false,
    category: 'progression'
  },
  {
    id: 'zone_enter',
    name: 'Zone Enter',
    url: '/audio/sfx/zone_enter.mp3',
    type: 'sfx',
    volume: 0.6,
    loop: false,
    category: 'world'
  },
  {
    id: 'zone_exit',
    name: 'Zone Exit',
    url: '/audio/sfx/zone_exit.mp3',
    type: 'sfx',
    volume: 0.6,
    loop: false,
    category: 'world'
  },
  {
    id: 'fast_travel',
    name: 'Fast Travel',
    url: '/audio/sfx/fast_travel.mp3',
    type: 'sfx',
    volume: 0.7,
    loop: false,
    category: 'world'
  },
  {
    id: 'echo_collect',
    name: 'Echo Collect',
    url: '/audio/sfx/echo_collect.mp3',
    type: 'sfx',
    volume: 0.8,
    loop: false,
    category: 'progression'
  },
  {
    id: 'gold_collect',
    name: 'Gold Collect',
    url: '/audio/sfx/gold_collect.mp3',
    type: 'sfx',
    volume: 0.7,
    loop: false,
    category: 'inventory'
  },
  {
    id: 'enemy_death',
    name: 'Enemy Death',
    url: '/audio/sfx/enemy_death.mp3',
    type: 'sfx',
    volume: 0.8,
    loop: false,
    category: 'combat'
  },
  {
    id: 'player_death',
    name: 'Player Death',
    url: '/audio/sfx/player_death.mp3',
    type: 'sfx',
    volume: 0.9,
    loop: false,
    category: 'combat'
  },
  {
    id: 'critical_hit',
    name: 'Critical Hit',
    url: '/audio/sfx/critical_hit.mp3',
    type: 'sfx',
    volume: 1.0,
    loop: false,
    category: 'combat'
  },
  {
    id: 'miss',
    name: 'Miss',
    url: '/audio/sfx/miss.mp3',
    type: 'sfx',
    volume: 0.6,
    loop: false,
    category: 'combat'
  },
  {
    id: 'block',
    name: 'Block',
    url: '/audio/sfx/block.mp3',
    type: 'sfx',
    volume: 0.7,
    loop: false,
    category: 'combat'
  },
  {
    id: 'dodge',
    name: 'Dodge',
    url: '/audio/sfx/dodge.mp3',
    type: 'sfx',
    volume: 0.6,
    loop: false,
    category: 'combat'
  },
  {
    id: 'status_effect',
    name: 'Status Effect',
    url: '/audio/sfx/status_effect.mp3',
    type: 'sfx',
    volume: 0.7,
    loop: false,
    category: 'combat'
  },
  {
    id: 'combo_attack',
    name: 'Combo Attack',
    url: '/audio/sfx/combo_attack.mp3',
    type: 'sfx',
    volume: 0.9,
    loop: false,
    category: 'combat'
  },
  {
    id: 'environmental_effect',
    name: 'Environmental Effect',
    url: '/audio/sfx/environmental_effect.mp3',
    type: 'sfx',
    volume: 0.6,
    loop: false,
    category: 'world'
  },

  // Ambient sounds
  {
    id: 'wind_ambient',
    name: 'Wind Ambient',
    url: '/audio/ambient/wind_ambient.mp3',
    type: 'ambient',
    volume: 0.3,
    loop: true,
    category: 'nature'
  },
  {
    id: 'forest_ambient',
    name: 'Forest Ambient',
    url: '/audio/ambient/forest_ambient.mp3',
    type: 'ambient',
    volume: 0.4,
    loop: true,
    category: 'nature'
  },
  {
    id: 'cave_ambient',
    name: 'Cave Ambient',
    url: '/audio/ambient/cave_ambient.mp3',
    type: 'ambient',
    volume: 0.5,
    loop: true,
    category: 'nature'
  },
  {
    id: 'water_ambient',
    name: 'Water Ambient',
    url: '/audio/ambient/water_ambient.mp3',
    type: 'ambient',
    volume: 0.4,
    loop: true,
    category: 'nature'
  },
  {
    id: 'fire_ambient',
    name: 'Fire Ambient',
    url: '/audio/ambient/fire_ambient.mp3',
    type: 'ambient',
    volume: 0.3,
    loop: true,
    category: 'nature'
  },
  {
    id: 'thunder_ambient',
    name: 'Thunder Ambient',
    url: '/audio/ambient/thunder_ambient.mp3',
    type: 'ambient',
    volume: 0.6,
    loop: true,
    category: 'nature'
  },
  {
    id: 'mystical_ambient',
    name: 'Mystical Ambient',
    url: '/audio/ambient/mystical_ambient.mp3',
    type: 'ambient',
    volume: 0.4,
    loop: true,
    category: 'magic'
  },
  {
    id: 'dungeon_ambient',
    name: 'Dungeon Ambient',
    url: '/audio/ambient/dungeon_ambient.mp3',
    type: 'ambient',
    volume: 0.5,
    loop: true,
    category: 'dungeon'
  },
  {
    id: 'city_ambient',
    name: 'City Ambient',
    url: '/audio/ambient/city_ambient.mp3',
    type: 'ambient',
    volume: 0.4,
    loop: true,
    category: 'civilization'
  }
];