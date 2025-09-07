import { DialogueSequence } from '../../../shared/dialogueTypes';

export const dialogueSequences: DialogueSequence[] = [
  {
    id: 'tutorial_guard',
    name: 'Tutorial Guard',
    startNodeId: 'guard_greeting',
    isRepeatable: false,
    nodes: [
      {
        id: 'guard_greeting',
        speaker: 'Guard',
        text: 'Welcome to the Echo Realm, traveler. I see you\'re new here. Let me explain the basics of survival in this place.',
        emotion: 'neutral',
        options: [
          {
            id: 'listen',
            text: 'I\'m listening. Please tell me more.',
            nextNodeId: 'guard_explanation'
          },
          {
            id: 'impatient',
            text: 'I don\'t have time for this. Just let me through.',
            nextNodeId: 'guard_warning'
          }
        ]
      },
      {
        id: 'guard_explanation',
        speaker: 'Guard',
        text: 'Good. The Echo Realm is dangerous, but knowledge is your greatest weapon. Here are some essential tips:\n\n1. Watch your health and energy carefully\n2. Use your abilities strategically in combat\n3. Collect echoes to power your skills\n4. Complete quests to progress the story',
        emotion: 'neutral',
        options: [
          {
            id: 'thank_guard',
            text: 'Thank you for the advice. I\'ll be careful.',
            nextNodeId: 'guard_blessing',
            effects: [
              { type: 'relationship', value: 'guard', operation: 'add' },
              { type: 'experience', value: 50, operation: 'add' }
            ]
          },
          {
            id: 'ask_questions',
            text: 'Do you have any specific advice about the dangers ahead?',
            nextNodeId: 'guard_detailed_advice'
          }
        ]
      },
      {
        id: 'guard_warning',
        speaker: 'Guard',
        text: 'Foolish! Many have died with that attitude. The Echo Realm doesn\'t forgive arrogance. You\'ll learn the hard way, I suppose.',
        emotion: 'angry',
        options: [
          {
            id: 'apologize',
            text: 'I apologize. You\'re right, I should listen.',
            nextNodeId: 'guard_explanation'
          },
          {
            id: 'defiant',
            text: 'I\'ll prove you wrong.',
            nextNodeId: 'guard_dismissal'
          }
        ]
      },
      {
        id: 'guard_detailed_advice',
        speaker: 'Guard',
        text: 'The creatures here are not like those in your world. They\'re echoes of ancient beings, twisted by time and corruption. Each zone has its own dangers and rewards. Start with the Whispering Woods - it\'s the safest area for beginners.',
        emotion: 'neutral',
        options: [
          {
            id: 'ask_about_woods',
            text: 'Tell me more about the Whispering Woods.',
            nextNodeId: 'guard_woods_info'
          },
          {
            id: 'ask_about_echoes',
            text: 'What exactly are these echoes you mentioned?',
            nextNodeId: 'guard_echoes_info'
          }
        ]
      },
      {
        id: 'guard_woods_info',
        speaker: 'Guard',
        text: 'The Whispering Woods is where many travelers begin their journey. The echoes there are weaker, but the forest itself can be disorienting. Follow the glowing mushrooms - they\'ll guide you to safety and important locations.',
        emotion: 'neutral',
        options: [
          {
            id: 'continue_woods',
            text: 'I\'ll head to the Whispering Woods then.',
            nextNodeId: 'guard_final_advice'
          }
        ]
      },
      {
        id: 'guard_echoes_info',
        speaker: 'Guard',
        text: 'Echoes are fragments of the ancient power that created this realm. When you defeat creatures, they sometimes leave behind these echoes. Collect them to enhance your abilities and unlock new skills. They\'re also used as currency in some places.',
        emotion: 'neutral',
        options: [
          {
            id: 'continue_echoes',
            text: 'That\'s fascinating. How do I use them?',
            nextNodeId: 'guard_echo_usage'
          }
        ]
      },
      {
        id: 'guard_echo_usage',
        speaker: 'Guard',
        text: 'You can spend echoes at skill trees to learn new abilities, or use them to purchase items from merchants. Some powerful equipment requires echoes to craft. The more you collect, the stronger you become.',
        emotion: 'neutral',
        options: [
          {
            id: 'final_questions',
            text: 'Is there anything else I should know?',
            nextNodeId: 'guard_final_advice'
          }
        ]
      },
      {
        id: 'guard_final_advice',
        speaker: 'Guard',
        text: 'Remember: this realm tests not just your strength, but your wisdom. Choose your battles carefully, help those in need, and always be prepared for the unexpected. Good luck, traveler.',
        emotion: 'neutral',
        options: [
          {
            id: 'thank_final',
            text: 'Thank you for everything. I\'ll make you proud.',
            nextNodeId: 'guard_blessing'
          }
        ]
      },
      {
        id: 'guard_blessing',
        speaker: 'Guard',
        text: 'May the ancient echoes guide your path. Now go, and may you find what you seek in this realm.',
        emotion: 'happy',
        effects: [
          { type: 'quest', value: 'tutorial_complete', operation: 'complete' },
          { type: 'experience', value: 100, operation: 'add' },
          { type: 'gold', value: 50, operation: 'add' }
        ]
      },
      {
        id: 'guard_dismissal',
        speaker: 'Guard',
        text: 'Very well. Don\'t say I didn\'t warn you. The path ahead is treacherous, and your pride won\'t save you from the dangers that await.',
        emotion: 'angry',
        effects: [
          { type: 'relationship', value: 'guard', operation: 'add' },
          { type: 'flag', value: 'guard_displeased', operation: 'set' }
        ]
      }
    ]
  },
  {
    id: 'mysterious_merchant',
    name: 'Mysterious Merchant',
    startNodeId: 'merchant_greeting',
    isRepeatable: true,
    cooldown: 30, // 30 minutes
    nodes: [
      {
        id: 'merchant_greeting',
        speaker: 'Mysterious Merchant',
        text: 'Ah, another traveler drawn to my wares. I have items that might interest you... for the right price.',
        emotion: 'neutral',
        options: [
          {
            id: 'browse_items',
            text: 'What do you have for sale?',
            nextNodeId: 'merchant_items'
          },
          {
            id: 'ask_about_merchant',
            text: 'Who are you, and how did you get here?',
            nextNodeId: 'merchant_backstory'
          },
          {
            id: 'leave',
            text: 'I\'m not interested right now.',
            nextNodeId: 'merchant_farewell'
          }
        ]
      },
      {
        id: 'merchant_items',
        speaker: 'Mysterious Merchant',
        text: 'I have various potions, enchanted equipment, and rare materials. My prices are fair, but I only accept echoes as payment. What catches your eye?',
        emotion: 'neutral',
        options: [
          {
            id: 'buy_potion',
            text: 'I\'d like to buy a health potion.',
            nextNodeId: 'merchant_potion_sale',
            conditions: [
              { type: 'item', value: 'echoes', operator: 'has' }
            ]
          },
          {
            id: 'buy_equipment',
            text: 'Do you have any weapons or armor?',
            nextNodeId: 'merchant_equipment'
          },
          {
            id: 'no_money',
            text: 'I don\'t have enough echoes right now.',
            nextNodeId: 'merchant_no_money'
          }
        ]
      },
      {
        id: 'merchant_backstory',
        speaker: 'Mysterious Merchant',
        text: 'I\'ve been traveling these realms for longer than you can imagine. I collect rare items and sell them to worthy adventurers. The echoes I gather help me maintain my... unique position in this world.',
        emotion: 'neutral',
        options: [
          {
            id: 'ask_more',
            text: 'What do you mean by "unique position"?',
            nextNodeId: 'merchant_secret'
          },
          {
            id: 'back_to_business',
            text: 'That\'s interesting. Now, about those items...',
            nextNodeId: 'merchant_items'
          }
        ]
      },
      {
        id: 'merchant_secret',
        speaker: 'Mysterious Merchant',
        text: 'Let\'s just say I have ways of moving between realms that others don\'t. But that\'s a story for another time. For now, let\'s focus on business.',
        emotion: 'neutral',
        options: [
          {
            id: 'respect_secret',
            text: 'I understand. Let\'s talk about your wares.',
            nextNodeId: 'merchant_items',
            effects: [
              { type: 'relationship', value: 'merchant', operation: 'add' }
            ]
          }
        ]
      },
      {
        id: 'merchant_potion_sale',
        speaker: 'Mysterious Merchant',
        text: 'A health potion will cost you 25 echoes. It\'s a fair price for something that could save your life.',
        emotion: 'neutral',
        options: [
          {
            id: 'buy_potion_yes',
            text: 'I\'ll take it.',
            nextNodeId: 'merchant_sale_complete',
            effects: [
              { type: 'item', value: 'health_potion', operation: 'add' },
              { type: 'echoes', value: 25, operation: 'remove' }
            ]
          },
          {
            id: 'buy_potion_no',
            text: 'That\'s too expensive for me right now.',
            nextNodeId: 'merchant_no_sale'
          }
        ]
      },
      {
        id: 'merchant_equipment',
        speaker: 'Mysterious Merchant',
        text: 'I have a few pieces of equipment, but they\'re quite expensive. A basic enchanted sword costs 100 echoes, and light armor costs 75 echoes.',
        emotion: 'neutral',
        options: [
          {
            id: 'buy_sword',
            text: 'I\'ll take the sword.',
            nextNodeId: 'merchant_sword_sale',
            conditions: [
              { type: 'item', value: 'echoes', operator: 'has' }
            ]
          },
          {
            id: 'buy_armor',
            text: 'I\'ll take the armor.',
            nextNodeId: 'merchant_armor_sale',
            conditions: [
              { type: 'item', value: 'echoes', operator: 'has' }
            ]
          },
          {
            id: 'too_expensive',
            text: 'That\'s too expensive for me.',
            nextNodeId: 'merchant_no_sale'
          }
        ]
      },
      {
        id: 'merchant_sword_sale',
        speaker: 'Mysterious Merchant',
        text: 'Excellent choice. This sword has been blessed with ancient magic. It will serve you well in battle.',
        emotion: 'happy',
        effects: [
          { type: 'item', value: 'enchanted_sword', operation: 'add' },
          { type: 'echoes', value: 100, operation: 'remove' }
        ]
      },
      {
        id: 'merchant_armor_sale',
        speaker: 'Mysterious Merchant',
        text: 'Good choice. This armor will protect you from many of the dangers in this realm.',
        emotion: 'happy',
        effects: [
          { type: 'item', value: 'light_armor', operation: 'add' },
          { type: 'echoes', value: 75, operation: 'remove' }
        ]
      },
      {
        id: 'merchant_sale_complete',
        speaker: 'Mysterious Merchant',
        text: 'Pleasure doing business with you. Come back anytime - I always have new items in stock.',
        emotion: 'happy',
        effects: [
          { type: 'relationship', value: 'merchant', operation: 'add' }
        ]
      },
      {
        id: 'merchant_no_sale',
        speaker: 'Mysterious Merchant',
        text: 'No problem. Come back when you have more echoes. I\'ll be here.',
        emotion: 'neutral'
      },
      {
        id: 'merchant_no_money',
        speaker: 'Mysterious Merchant',
        text: 'Echoes are the currency of this realm. Defeat creatures and complete quests to earn them. I\'ll be here when you\'re ready to buy.',
        emotion: 'neutral'
      },
      {
        id: 'merchant_farewell',
        speaker: 'Mysterious Merchant',
        text: 'Very well. Safe travels, and remember - I\'m always here if you need anything.',
        emotion: 'neutral'
      }
    ]
  },
  {
    id: 'wise_elder',
    name: 'Wise Elder',
    startNodeId: 'elder_greeting',
    isRepeatable: false,
    nodes: [
      {
        id: 'elder_greeting',
        speaker: 'Wise Elder',
        text: 'Ah, a new face in our realm. I sense great potential in you, traveler. Come, sit with me for a while.',
        emotion: 'neutral',
        options: [
          {
            id: 'sit_with_elder',
            text: 'I\'d be honored to sit with you.',
            nextNodeId: 'elder_wisdom'
          },
          {
            id: 'ask_about_elder',
            text: 'Who are you, and what do you know about this place?',
            nextNodeId: 'elder_backstory'
          }
        ]
      },
      {
        id: 'elder_wisdom',
        speaker: 'Wise Elder',
        text: 'The Echo Realm is a place of both danger and opportunity. Those who approach it with wisdom and respect often find what they seek. Those who come with only greed or anger... well, they rarely last long.',
        emotion: 'neutral',
        options: [
          {
            id: 'ask_about_wisdom',
            text: 'What kind of wisdom should I seek here?',
            nextNodeId: 'elder_philosophy'
          },
          {
            id: 'ask_about_dangers',
            text: 'What are the greatest dangers I should be aware of?',
            nextNodeId: 'elder_warnings'
          }
        ]
      },
      {
        id: 'elder_backstory',
        speaker: 'Wise Elder',
        text: 'I have lived in this realm for many years, watching travelers come and go. Some find what they seek, others become lost in the echoes of their own desires. I try to guide those who are willing to listen.',
        emotion: 'neutral',
        options: [
          {
            id: 'ask_about_guidance',
            text: 'I\'m willing to listen. What guidance can you offer?',
            nextNodeId: 'elder_guidance'
          },
          {
            id: 'ask_about_echoes',
            text: 'What can you tell me about the echoes in this realm?',
            nextNodeId: 'elder_echoes'
          }
        ]
      },
      {
        id: 'elder_philosophy',
        speaker: 'Wise Elder',
        text: 'True wisdom comes from understanding yourself and your place in the world. The echoes you collect are not just power - they are fragments of understanding. Use them wisely, and they will guide you to your true purpose.',
        emotion: 'neutral',
        options: [
          {
            id: 'ask_about_purpose',
            text: 'How do I find my true purpose?',
            nextNodeId: 'elder_purpose'
          },
          {
            id: 'thank_philosophy',
            text: 'That\'s profound. Thank you for sharing.',
            nextNodeId: 'elder_blessing'
          }
        ]
      },
      {
        id: 'elder_warnings',
        speaker: 'Wise Elder',
        text: 'The greatest danger is not the creatures you face, but the darkness within yourself. Greed, pride, and fear can corrupt even the strongest soul. Stay true to your values, and you will find the strength to overcome any obstacle.',
        emotion: 'neutral',
        options: [
          {
            id: 'ask_about_corruption',
            text: 'How can I avoid this corruption?',
            nextNodeId: 'elder_protection'
          },
          {
            id: 'thank_warnings',
            text: 'I\'ll remember your warnings.',
            nextNodeId: 'elder_blessing'
          }
        ]
      },
      {
        id: 'elder_guidance',
        speaker: 'Wise Elder',
        text: 'Listen to your heart, but also to the wisdom of others. Every creature you meet, every challenge you face, has something to teach you. The key is to remain open to learning, even when the lesson is difficult.',
        emotion: 'neutral',
        options: [
          {
            id: 'ask_about_learning',
            text: 'What should I be learning from my experiences?',
            nextNodeId: 'elder_lessons'
          },
          {
            id: 'thank_guidance',
            text: 'I\'ll try to remain open to learning.',
            nextNodeId: 'elder_blessing'
          }
        ]
      },
      {
        id: 'elder_echoes',
        speaker: 'Wise Elder',
        text: 'Echoes are the remnants of ancient beings who once walked this realm. They contain not just power, but memories and wisdom. When you collect them, you\'re not just gaining strength - you\'re connecting with the history of this place.',
        emotion: 'neutral',
        options: [
          {
            id: 'ask_about_history',
            text: 'What can you tell me about this realm\'s history?',
            nextNodeId: 'elder_history'
          },
          {
            id: 'thank_echoes',
            text: 'That\'s a beautiful way to think about it.',
            nextNodeId: 'elder_blessing'
          }
        ]
      },
      {
        id: 'elder_purpose',
        speaker: 'Wise Elder',
        text: 'Your purpose will reveal itself as you journey through this realm. It\'s not something you find at the end of your quest - it\'s something you discover in every step you take. Trust in yourself, and trust in the path you\'re walking.',
        emotion: 'neutral',
        options: [
          {
            id: 'thank_purpose',
            text: 'That gives me hope. Thank you.',
            nextNodeId: 'elder_blessing'
          }
        ]
      },
      {
        id: 'elder_protection',
        speaker: 'Wise Elder',
        text: 'Stay connected to what matters most to you. Remember your values, your loved ones, and your dreams. These connections will anchor you when the darkness tries to pull you away from your true self.',
        emotion: 'neutral',
        options: [
          {
            id: 'thank_protection',
            text: 'I\'ll hold onto what matters most.',
            nextNodeId: 'elder_blessing'
          }
        ]
      },
      {
        id: 'elder_lessons',
        speaker: 'Wise Elder',
        text: 'Every challenge teaches you about your own strength. Every creature you meet shows you something about the nature of existence. Every choice you make reveals your character. Pay attention to these lessons, and you will grow in ways you never imagined.',
        emotion: 'neutral',
        options: [
          {
            id: 'thank_lessons',
            text: 'I\'ll pay attention to the lessons around me.',
            nextNodeId: 'elder_blessing'
          }
        ]
      },
      {
        id: 'elder_history',
        speaker: 'Wise Elder',
        text: 'This realm was once a place of great beauty and harmony. But as with all things, change came. The echoes you collect are the last remnants of that golden age. Perhaps, through your actions, you can help restore some of that lost beauty.',
        emotion: 'neutral',
        options: [
          {
            id: 'ask_about_restoration',
            text: 'How can I help restore this realm?',
            nextNodeId: 'elder_restoration'
          },
          {
            id: 'thank_history',
            text: 'That\'s a noble goal. I\'ll do my best.',
            nextNodeId: 'elder_blessing'
          }
        ]
      },
      {
        id: 'elder_restoration',
        speaker: 'Wise Elder',
        text: 'By choosing wisdom over power, compassion over cruelty, and understanding over judgment. The realm responds to the energy you bring to it. Bring light, and you will find light. Bring darkness, and darkness will find you.',
        emotion: 'neutral',
        options: [
          {
            id: 'thank_restoration',
            text: 'I\'ll strive to bring light to this realm.',
            nextNodeId: 'elder_blessing'
          }
        ]
      },
      {
        id: 'elder_blessing',
        speaker: 'Wise Elder',
        text: 'May your journey be filled with wisdom, courage, and compassion. Remember what we\'ve discussed, and trust in your own strength. The realm is waiting for you to discover its secrets.',
        emotion: 'happy',
        effects: [
          { type: 'experience', value: 200, operation: 'add' },
          { type: 'relationship', value: 'elder', operation: 'add' },
          { type: 'quest', value: 'elder_wisdom', operation: 'complete' }
        ]
      }
    ]
  }
];