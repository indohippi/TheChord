import { create } from "zustand";
import { 
  Skill, 
  SkillTree, 
  SkillCategory, 
  SkillEffect, 
  SkillRequirement,
  SkillPointAllocation,
  SkillCooldown,
  SkillActivation,
  SkillExperience,
  SkillMastery
} from "@shared/skillTypes";

interface SkillState {
  // Skill trees
  skillTrees: SkillTree[];
  
  // Skill cooldowns
  skillCooldowns: SkillCooldown[];
  
  // Skill activations
  skillActivations: SkillActivation[];
  
  // Skill experience
  skillExperience: SkillExperience[];
  
  // Skill mastery
  skillMastery: SkillMastery[];
  
  // Skill point allocation history
  skillPointHistory: SkillPointAllocation[];
  
  // Available skill points
  availableSkillPoints: number;
  
  // Actions
  learnSkill: (skillId: string) => boolean;
  upgradeSkill: (skillId: string) => boolean;
  activateSkill: (skillId: string, target?: string, position?: [number, number, number]) => boolean;
  
  // Skill management
  getSkillById: (skillId: string) => Skill | undefined;
  getSkillsByCategory: (category: SkillCategory) => Skill[];
  getLearnedSkills: () => Skill[];
  getAvailableSkills: () => Skill[];
  
  // Skill tree management
  getSkillTree: (category: SkillCategory) => SkillTree | undefined;
  canLearnSkill: (skillId: string) => boolean;
  getSkillCost: (skillId: string) => number;
  
  // Skill effects
  getActiveSkillEffects: () => SkillEffect[];
  getSkillEffectsForSkill: (skillId: string) => SkillEffect[];
  
  // Skill cooldowns
  isSkillOnCooldown: (skillId: string) => boolean;
  getSkillCooldownRemaining: (skillId: string) => number;
  
  // Skill experience
  addSkillExperience: (skillId: string, amount: number) => void;
  getSkillExperience: (skillId: string) => SkillExperience | undefined;
  
  // Skill mastery
  updateSkillMastery: (skillId: string, experience: number) => void;
  getSkillMastery: (skillId: string) => SkillMastery | undefined;
  
  // Utility
  resetSkills: () => void;
  addSkillPoints: (amount: number) => void;
  spendSkillPoints: (amount: number) => boolean;
}

// Initial skill trees data
const initialSkillTrees: SkillTree[] = [
  {
    id: 'combat',
    name: 'Combat Mastery',
    description: 'Skills focused on physical combat and weapon mastery.',
    category: 'combat',
    skills: [
      {
        id: 'weapon-mastery',
        name: 'Weapon Mastery',
        description: 'Increases damage with all weapons.',
        category: 'combat',
        type: 'passive',
        level: 0,
        maxLevel: 10,
        cost: 1,
        requirements: [],
        effects: [
          {
            type: 'damage_bonus',
            target: 'all_weapons',
            value: 5
          }
        ],
        icon: 'weapon-mastery',
        position: { x: 0, y: 0 },
        connections: ['sword-specialization', 'staff-specialization'],
        prerequisites: []
      },
      {
        id: 'sword-specialization',
        name: 'Sword Specialization',
        description: 'Specialized training with swords.',
        category: 'combat',
        type: 'passive',
        level: 0,
        maxLevel: 5,
        cost: 2,
        requirements: [
          {
            type: 'skill' as const,
            value: 'weapon-mastery',
            description: 'Requires Weapon Mastery level 3'
          }
        ],
        effects: [
          {
            type: 'damage_bonus',
            target: 'sword',
            value: 10
          }
        ],
        icon: 'sword-specialization',
        position: { x: -1, y: 1 },
        connections: ['sword-mastery'],
        prerequisites: ['weapon-mastery']
      },
      {
        id: 'staff-specialization',
        name: 'Staff Specialization',
        description: 'Specialized training with staves.',
        category: 'combat',
        type: 'passive',
        level: 0,
        maxLevel: 5,
        cost: 2,
        requirements: [
          {
            type: 'skill' as const,
            value: 'weapon-mastery',
            description: 'Requires Weapon Mastery level 3'
          }
        ],
        effects: [
          {
            type: 'damage_bonus',
            target: 'staff',
            value: 10
          }
        ],
        icon: 'staff-specialization',
        position: { x: 1, y: 1 },
        connections: ['staff-mastery'],
        prerequisites: ['weapon-mastery']
      }
    ],
    maxPoints: 50,
    currentPoints: 0
  },
  {
    id: 'magic',
    name: 'Arcane Arts',
    description: 'Skills focused on magical abilities and energy manipulation.',
    category: 'magic',
    skills: [
      {
        id: 'energy-mastery',
        name: 'Energy Mastery',
        description: 'Increases maximum energy and energy regeneration.',
        category: 'magic',
        type: 'passive',
        level: 0,
        maxLevel: 10,
        cost: 1,
        requirements: [],
        effects: [
          {
            type: 'stat_boost',
            target: 'maxEnergy',
            value: 10
          }
        ],
        icon: 'energy-mastery',
        position: { x: 0, y: 0 },
        connections: ['spell-efficiency', 'energy-shield'],
        prerequisites: []
      },
      {
        id: 'spell-efficiency',
        name: 'Spell Efficiency',
        description: 'Reduces energy cost of all abilities.',
        category: 'magic',
        type: 'passive',
        level: 0,
        maxLevel: 5,
        cost: 2,
        requirements: [
          {
            type: 'skill' as const,
            value: 'energy-mastery',
            description: 'Requires Energy Mastery level 3'
          }
        ],
        effects: [
          {
            type: 'special_effect',
            target: 'energy_cost_reduction',
            value: 5
          }
        ],
        icon: 'spell-efficiency',
        position: { x: -1, y: 1 },
        connections: ['spell-mastery'],
        prerequisites: ['energy-mastery']
      },
      {
        id: 'energy-shield',
        name: 'Energy Shield',
        description: 'Creates a protective energy barrier.',
        category: 'magic',
        type: 'active',
        level: 0,
        maxLevel: 3,
        cost: 3,
        requirements: [
          {
            type: 'skill' as const,
            value: 'energy-mastery',
            description: 'Requires Energy Mastery level 5'
          }
        ],
        effects: [
          {
            type: 'special_effect',
            target: 'energy_shield',
            value: 25
          }
        ],
        icon: 'energy-shield',
        position: { x: 1, y: 1 },
        connections: ['shield-mastery'],
        prerequisites: ['energy-mastery'],
        cooldown: 30,
        energyCost: 20
      }
    ],
    maxPoints: 50,
    currentPoints: 0
  },
  {
    id: 'survival',
    name: 'Survival Skills',
    description: 'Skills focused on survival, exploration, and utility.',
    category: 'survival',
    skills: [
      {
        id: 'health-mastery',
        name: 'Health Mastery',
        description: 'Increases maximum health and health regeneration.',
        category: 'survival',
        type: 'passive',
        level: 0,
        maxLevel: 10,
        cost: 1,
        requirements: [],
        effects: [
          {
            type: 'stat_boost',
            target: 'maxHealth',
            value: 15
          }
        ],
        icon: 'health-mastery',
        position: { x: 0, y: 0 },
        connections: ['regeneration', 'toughness'],
        prerequisites: []
      },
      {
        id: 'regeneration',
        name: 'Regeneration',
        description: 'Passively regenerates health over time.',
        category: 'survival',
        type: 'passive',
        level: 0,
        maxLevel: 5,
        cost: 2,
        requirements: [
          {
            type: 'skill' as const,
            value: 'health-mastery',
            description: 'Requires Health Mastery level 3'
          }
        ],
        effects: [
          {
            type: 'special_effect',
            target: 'health_regeneration',
            value: 2
          }
        ],
        icon: 'regeneration',
        position: { x: -1, y: 1 },
        connections: ['rapid-healing'],
        prerequisites: ['health-mastery']
      },
      {
        id: 'toughness',
        name: 'Toughness',
        description: 'Reduces incoming damage.',
        category: 'survival',
        type: 'passive',
        level: 0,
        maxLevel: 5,
        cost: 2,
        requirements: [
          {
            type: 'skill' as const,
            value: 'health-mastery',
            description: 'Requires Health Mastery level 3'
          }
        ],
        effects: [
          {
            type: 'resistance',
            target: 'all_damage',
            value: 5
          }
        ],
        icon: 'toughness',
        position: { x: 1, y: 1 },
        connections: ['damage-resistance'],
        prerequisites: ['health-mastery']
      }
    ],
    maxPoints: 50,
    currentPoints: 0
  }
];

export const useSkills = create<SkillState>((set, get) => ({
  // Initial state
  skillTrees: initialSkillTrees,
  skillCooldowns: [],
  skillActivations: [],
  skillExperience: [],
  skillMastery: [],
  skillPointHistory: [],
  availableSkillPoints: 0,
  
  // Learn skill
  learnSkill: (skillId) => {
    const state = get();
    const skill = state.getSkillById(skillId);
    
    if (!skill) {
      console.log(`Skill ${skillId} not found`);
      return false;
    }
    
    if (skill.level > 0) {
      console.log(`Skill ${skillId} already learned`);
      return false;
    }
    
    if (!state.canLearnSkill(skillId)) {
      console.log(`Cannot learn skill ${skillId} - requirements not met`);
      return false;
    }
    
    const cost = state.getSkillCost(skillId);
    if (!state.spendSkillPoints(cost)) {
      console.log(`Not enough skill points to learn ${skillId}`);
      return false;
    }
    
    // Update skill level
    const updatedSkillTrees = state.skillTrees.map(tree => ({
      ...tree,
      skills: tree.skills.map(s => 
        s.id === skillId ? { ...s, level: 1 } : s
      ),
      currentPoints: tree.skills.some(s => s.id === skillId) ? tree.currentPoints + cost : tree.currentPoints
    }));
    
    // Add to skill point history
    const newAllocation: SkillPointAllocation = {
      skillId,
      points: cost,
      timestamp: Date.now()
    };
    
    set({
      skillTrees: updatedSkillTrees,
      skillPointHistory: [...state.skillPointHistory, newAllocation]
    });
    
    console.log(`Learned skill: ${skill.name}`);
    return true;
  },
  
  // Upgrade skill
  upgradeSkill: (skillId) => {
    const state = get();
    const skill = state.getSkillById(skillId);
    
    if (!skill) {
      console.log(`Skill ${skillId} not found`);
      return false;
    }
    
    if (skill.level >= skill.maxLevel) {
      console.log(`Skill ${skillId} is already at maximum level`);
      return false;
    }
    
    const cost = state.getSkillCost(skillId);
    if (!state.spendSkillPoints(cost)) {
      console.log(`Not enough skill points to upgrade ${skillId}`);
      return false;
    }
    
    // Update skill level
    const updatedSkillTrees = state.skillTrees.map(tree => ({
      ...tree,
      skills: tree.skills.map(s => 
        s.id === skillId ? { ...s, level: s.level + 1 } : s
      ),
      currentPoints: tree.skills.some(s => s.id === skillId) ? tree.currentPoints + cost : tree.currentPoints
    }));
    
    // Add to skill point history
    const newAllocation: SkillPointAllocation = {
      skillId,
      points: cost,
      timestamp: Date.now()
    };
    
    set({
      skillTrees: updatedSkillTrees,
      skillPointHistory: [...state.skillPointHistory, newAllocation]
    });
    
    console.log(`Upgraded skill: ${skill.name} to level ${skill.level + 1}`);
    return true;
  },
  
  // Activate skill
  activateSkill: (skillId, target, position) => {
    const state = get();
    const skill = state.getSkillById(skillId);
    
    if (!skill) {
      console.log(`Skill ${skillId} not found`);
      return false;
    }
    
    if (skill.level === 0) {
      console.log(`Skill ${skillId} not learned`);
      return false;
    }
    
    if (skill.type !== 'active' && skill.type !== 'toggle') {
      console.log(`Skill ${skillId} is not an active skill`);
      return false;
    }
    
    if (state.isSkillOnCooldown(skillId)) {
      console.log(`Skill ${skillId} is on cooldown`);
      return false;
    }
    
    // Check energy cost
    if (skill.energyCost && skill.energyCost > 0) {
      // This would integrate with the character's energy system
      console.log(`Activating skill ${skillId} costs ${skill.energyCost} energy`);
    }
    
    // Add cooldown if skill has one
    if (skill.cooldown && skill.cooldown > 0) {
      const cooldown: SkillCooldown = {
        skillId,
        endTime: Date.now() + (skill.cooldown * 1000)
      };
      
      set({
        skillCooldowns: [...state.skillCooldowns.filter(c => c.skillId !== skillId), cooldown]
      });
    }
    
    // Add activation record
    const activation: SkillActivation = {
      skillId,
      target,
      position,
      timestamp: Date.now()
    };
    
    set({
      skillActivations: [...state.skillActivations, activation]
    });
    
    // Update skill mastery
    state.updateSkillMastery(skillId, 1);
    
    console.log(`Activated skill: ${skill.name}`);
    return true;
  },
  
  // Get skill by ID
  getSkillById: (skillId) => {
    const state = get();
    for (const tree of state.skillTrees) {
      const skill = tree.skills.find(s => s.id === skillId);
      if (skill) return skill;
    }
    return undefined;
  },
  
  // Get skills by category
  getSkillsByCategory: (category) => {
    const state = get();
    const tree = state.skillTrees.find(t => t.category === category);
    return tree ? tree.skills : [];
  },
  
  // Get learned skills
  getLearnedSkills: () => {
    const state = get();
    const learnedSkills: Skill[] = [];
    
    for (const tree of state.skillTrees) {
      for (const skill of tree.skills) {
        if (skill.level > 0) {
          learnedSkills.push(skill);
        }
      }
    }
    
    return learnedSkills;
  },
  
  // Get available skills
  getAvailableSkills: () => {
    const state = get();
    const availableSkills: Skill[] = [];
    
    for (const tree of state.skillTrees) {
      for (const skill of tree.skills) {
        if (state.canLearnSkill(skill.id)) {
          availableSkills.push(skill);
        }
      }
    }
    
    return availableSkills;
  },
  
  // Get skill tree
  getSkillTree: (category) => {
    const state = get();
    return state.skillTrees.find(tree => tree.category === category);
  },
  
  // Check if skill can be learned
  canLearnSkill: (skillId) => {
    const state = get();
    const skill = state.getSkillById(skillId);
    
    if (!skill) return false;
    
    // Check if already at max level
    if (skill.level >= skill.maxLevel) return false;
    
    // Check prerequisites
    for (const prereqId of skill.prerequisites) {
      const prereqSkill = state.getSkillById(prereqId);
      if (!prereqSkill || prereqSkill.level === 0) {
        return false;
      }
    }
    
    // Check requirements
    for (const requirement of skill.requirements) {
      // This would integrate with other systems to check level, stats, etc.
      // For now, we'll just check skill requirements
      if (requirement.type === 'skill') {
        const reqSkill = state.getSkillById(requirement.value as string);
        if (!reqSkill || reqSkill.level < 3) { // Assuming level 3 requirement
          return false;
        }
      }
    }
    
    return true;
  },
  
  // Get skill cost
  getSkillCost: (skillId) => {
    const skill = get().getSkillById(skillId);
    return skill ? skill.cost : 0;
  },
  
  // Get active skill effects
  getActiveSkillEffects: () => {
    const state = get();
    const effects: SkillEffect[] = [];
    
    for (const tree of state.skillTrees) {
      for (const skill of tree.skills) {
        if (skill.level > 0) {
          effects.push(...skill.effects);
        }
      }
    }
    
    return effects;
  },
  
  // Get skill effects for specific skill
  getSkillEffectsForSkill: (skillId) => {
    const skill = get().getSkillById(skillId);
    return skill && skill.level > 0 ? skill.effects : [];
  },
  
  // Check if skill is on cooldown
  isSkillOnCooldown: (skillId) => {
    const state = get();
    const cooldown = state.skillCooldowns.find(c => c.skillId === skillId);
    return cooldown ? cooldown.endTime > Date.now() : false;
  },
  
  // Get skill cooldown remaining
  getSkillCooldownRemaining: (skillId) => {
    const state = get();
    const cooldown = state.skillCooldowns.find(c => c.skillId === skillId);
    if (!cooldown) return 0;
    
    const remaining = cooldown.endTime - Date.now();
    return Math.max(0, remaining);
  },
  
  // Add skill experience
  addSkillExperience: (skillId, amount) => {
    const state = get();
    const existingExp = state.skillExperience.find(exp => exp.skillId === skillId);
    
    if (existingExp) {
      existingExp.experience += amount;
      
      // Check for level up
      const skill = state.getSkillById(skillId);
      if (skill && existingExp.experience >= existingExp.experienceToNext) {
        existingExp.level++;
        existingExp.experience -= existingExp.experienceToNext;
        existingExp.experienceToNext = Math.floor(existingExp.experienceToNext * 1.2);
        
        console.log(`Skill ${skillId} leveled up to ${existingExp.level}`);
      }
      
      set({ skillExperience: [...state.skillExperience] });
    } else {
      const newExp: SkillExperience = {
        skillId,
        experience: amount,
        level: 1,
        experienceToNext: 100
      };
      
      set({ skillExperience: [...state.skillExperience, newExp] });
    }
  },
  
  // Get skill experience
  getSkillExperience: (skillId) => {
    const state = get();
    return state.skillExperience.find(exp => exp.skillId === skillId);
  },
  
  // Update skill mastery
  updateSkillMastery: (skillId, experience) => {
    const state = get();
    const existingMastery = state.skillMastery.find(m => m.skillId === skillId);
    
    if (existingMastery) {
      existingMastery.experience += experience;
      existingMastery.uses++;
      existingMastery.lastUsed = Date.now();
      
      // Calculate mastery level (0-100)
      existingMastery.masteryLevel = Math.min(100, Math.floor(existingMastery.experience / 100));
      
      set({ skillMastery: [...state.skillMastery] });
    } else {
      const newMastery: SkillMastery = {
        skillId,
        masteryLevel: 0,
        experience,
        uses: 1,
        lastUsed: Date.now()
      };
      
      set({ skillMastery: [...state.skillMastery, newMastery] });
    }
  },
  
  // Get skill mastery
  getSkillMastery: (skillId) => {
    const state = get();
    return state.skillMastery.find(m => m.skillId === skillId);
  },
  
  // Reset skills
  resetSkills: () => {
    set({
      skillTrees: initialSkillTrees,
      skillCooldowns: [],
      skillActivations: [],
      skillExperience: [],
      skillMastery: [],
      skillPointHistory: [],
      availableSkillPoints: 0
    });
  },
  
  // Add skill points
  addSkillPoints: (amount) => {
    set(state => ({
      availableSkillPoints: state.availableSkillPoints + amount
    }));
  },
  
  // Spend skill points
  spendSkillPoints: (amount) => {
    const state = get();
    if (state.availableSkillPoints >= amount) {
      set({
        availableSkillPoints: state.availableSkillPoints - amount
      });
      return true;
    }
    return false;
  }
}));