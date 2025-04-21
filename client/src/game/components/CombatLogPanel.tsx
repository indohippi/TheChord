import { useEffect, useRef } from 'react';
import { useTacticalCombat } from '@/game/hooks/useTacticalCombat';

export function CombatLogPanel() {
  const { combatState } = useTacticalCombat();
  const logEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when log updates
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [combatState.combatLog]);
  
  // Message theming based on content
  const getMessageTheme = (message: string) => {
    if (message.toLowerCase().includes('victory') || message.toLowerCase().includes('defeated')) {
      return 'text-green-400';
    } else if (message.toLowerCase().includes('attacks') || message.toLowerCase().includes('damage')) {
      return 'text-red-400';
    } else if (message.toLowerCase().includes('move') || message.toLowerCase().includes('movement')) {
      return 'text-blue-400';
    } else if (message.toLowerCase().includes('turn')) {
      return 'text-yellow-400 font-bold';
    } else if (message.toLowerCase().includes('ability') || message.toLowerCase().includes('used')) {
      return 'text-purple-400';
    } else {
      return 'text-white';
    }
  };
  
  return (
    <div className="fixed top-4 left-4 w-80 max-h-60 overflow-y-auto bg-black/70 rounded-md p-3 z-10">
      <h2 className="text-white font-bold mb-2 text-lg border-b border-gray-700 pb-1">Combat Log</h2>
      <div className="space-y-1">
        {combatState.combatLog.map((message, index) => (
          <div 
            key={`${index}-${message.substring(0, 10)}`} 
            className={`text-sm ${getMessageTheme(message)}`}
          >
            {message}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}