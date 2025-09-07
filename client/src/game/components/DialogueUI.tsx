import React, { useEffect, useState } from 'react';
import { useDialogue } from '@/lib/stores/useDialogue';
import { DialogueNode, DialogueOption } from '@shared/dialogueTypes';

interface DialogueUIProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DialogueUI: React.FC<DialogueUIProps> = ({ isOpen, onClose }) => {
  const {
    currentSequence,
    currentNode,
    isDialogueActive,
    selectOption,
    endDialogue,
    checkConditions
  } = useDialogue();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isDialogueActive && !isOpen) {
      setIsVisible(true);
    }
  }, [isDialogueActive, isOpen]);

  if (!isVisible || !currentNode || !currentSequence) {
    return null;
  }

  const handleOptionClick = (option: DialogueOption) => {
    if (option.conditions && !checkConditions(option.conditions)) {
      return; // Option is not available
    }
    selectOption(option.id);
  };

  const handleClose = () => {
    endDialogue();
    onClose();
  };

  const getEmotionIcon = (emotion?: string) => {
    switch (emotion) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'angry': return '😠';
      case 'surprised': return '😲';
      case 'worried': return '😟';
      default: return '😐';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-blue-500 rounded-lg p-6 w-11/12 max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">
            {currentSequence.name}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Dialogue Content */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4 min-h-[200px] max-h-[400px] overflow-y-auto">
          {/* Speaker */}
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3">
              {getEmotionIcon(currentNode.emotion)}
            </span>
            <h3 className="text-xl font-semibold text-blue-400">
              {currentNode.speaker}
            </h3>
          </div>

          {/* Dialogue Text */}
          <div className="text-white text-lg leading-relaxed whitespace-pre-wrap">
            {currentNode.text}
          </div>
        </div>

        {/* Options */}
        {currentNode.options && currentNode.options.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-white font-semibold mb-2">Choose your response:</h4>
            {currentNode.options.map((option) => {
              const isAvailable = !option.conditions || checkConditions(option.conditions);
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option)}
                  disabled={!isAvailable}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    isAvailable
                      ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-2">
                      {isAvailable ? '💬' : '🔒'}
                    </span>
                    <span>{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* No Options - Auto Advance */}
        {(!currentNode.options || currentNode.options.length === 0) && (
          <div className="text-center">
            <button
              onClick={handleClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Continue
            </button>
          </div>
        )}

        {/* Skill Check Indicator */}
        {currentNode.options?.some(option => option.skillCheck) && (
          <div className="mt-4 p-3 bg-yellow-900 border border-yellow-600 rounded-lg">
            <div className="flex items-center">
              <span className="text-yellow-400 mr-2">⚠️</span>
              <span className="text-yellow-200 text-sm">
                Some options may require skill checks
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};