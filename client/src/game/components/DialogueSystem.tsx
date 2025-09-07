import { useState, useEffect } from 'react';
import { useGameState } from '@/lib/stores/useGameState';
import { DialogueSequence, DialogueNode } from '@shared/dialogueTypes';

interface DialogueSystemProps {
  dialogueSequence: DialogueSequence | null;
}

export function DialogueSystem({ dialogueSequence }: DialogueSystemProps) {
  const { setGamePhase } = useGameState();
  
  // Current dialog node state
  const [currentNodeId, setCurrentNodeId] = useState<string>(dialogueSequence?.startNodeId || '');
  const [currentNode, setCurrentNode] = useState<DialogueNode | null>(null);
  const [isTyping, setIsTyping] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  
  // Typing effect for dialog text
  useEffect(() => {
    if (!currentNode) return;
    
    // Reset typing when node changes
    setIsTyping(true);
    setDisplayedText('');
    setTextIndex(0);
    
    // Text typing effect
    const typingInterval = setInterval(() => {
      if (textIndex < currentNode.text.length) {
        setDisplayedText(prev => prev + currentNode.text[textIndex]);
        setTextIndex(textIndex + 1);
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 30); // Typing speed
    
    return () => clearInterval(typingInterval);
  }, [currentNode]);
  
  // Update current node when ID changes
  useEffect(() => {
    if (currentNodeId === 'end') {
      // End of dialogue
      setGamePhase('gameplay');
      return;
    }
    
    const node = dialogueSequence?.nodes.find(n => n.id === currentNodeId);
    if (node) {
      setCurrentNode(node);
    } else {
      console.error(`Dialog node ${currentNodeId} not found`);
      setGamePhase('gameplay');
    }
  }, [currentNodeId, dialogueSequence]);
  
  // Handle click to continue or complete typing
  const handleContinue = () => {
    if (isTyping) {
      // Skip typing animation
      setDisplayedText(currentNode?.text || '');
      setIsTyping(false);
      setTextIndex(currentNode?.text.length || 0);
      return;
    }
    
    // If there's a next node, go to it
    if (currentNode?.next) {
      setCurrentNodeId(currentNode.next);
    } 
    // If there are no options and no next, end dialogue
    else if (!currentNode?.options) {
      setGamePhase('gameplay');
    }
  };
  
  // Handle option selection
  const handleSelectOption = (nextId: string) => {
    setCurrentNodeId(nextId);
  };
  
  // If dialogue is over or not started
  if (!currentNode) {
    return null;
  }
  
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 border-t-2 border-blue-800 text-white p-4 z-50"
      style={{ boxShadow: '0 -5px 20px rgba(0, 0, 0, 0.5)' }}
    >
      {/* Speaker name */}
      <div className="text-blue-300 font-bold mb-2">
        {currentNode.speaker}
      </div>
      
      {/* Dialog text */}
      <div className="mb-4">
        {displayedText}
        {isTyping && <span className="animate-pulse">▌</span>}
      </div>
      
      {/* Options or continue */}
      {!isTyping && currentNode.options ? (
        <div className="flex flex-col gap-2">
          {currentNode.options.map((option: any, index: number) => (
            <button 
              key={index}
              className="text-left bg-gray-800 hover:bg-gray-700 p-2 text-gray-200 border border-gray-700"
              onClick={() => handleSelectOption(option.nextId)}
            >
              {option.text}
            </button>
          ))}
        </div>
      ) : (
        <div 
          className="cursor-pointer text-gray-400 text-sm flex justify-end items-center"
          onClick={handleContinue}
        >
          {isTyping ? 'Click to skip' : 'Click to continue'} →
        </div>
      )}
    </div>
  );
}
