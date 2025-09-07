import React, { useEffect, useRef, useState } from 'react';
import { Tooltip as TooltipType } from '@shared/uiTypes';

interface TooltipProps {
  tooltip: TooltipType;
  onClose: () => void;
}

export const Tooltip: React.FC<TooltipProps> = ({ tooltip, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tooltip.visible) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, tooltip.delay || 0);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [tooltip.visible, tooltip.delay]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible, onClose]);

  if (!tooltip.visible || !isVisible) {
    return null;
  }

  const getThemeClasses = (theme?: string) => {
    switch (theme) {
      case 'light':
        return 'bg-white text-gray-900 border-gray-200';
      case 'info':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-900 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-900 border-red-200';
      case 'success':
        return 'bg-green-100 text-green-900 border-green-200';
      default:
        return 'bg-gray-900 text-white border-gray-700';
    }
  };

  const getPlacementClasses = (placement?: string) => {
    switch (placement) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
    }
  };

  return (
    <div
      ref={tooltipRef}
      className={`fixed z-50 px-3 py-2 text-sm rounded-lg border shadow-lg max-w-xs ${getThemeClasses(tooltip.theme)} ${getPlacementClasses(tooltip.placement)}`}
      style={{
        left: tooltip.position.x,
        top: tooltip.position.y,
        maxWidth: tooltip.maxWidth || 300
      }}
    >
      <div className="whitespace-pre-wrap">{tooltip.content}</div>
      
      {/* Arrow */}
      <div className={`absolute w-2 h-2 transform rotate-45 ${getThemeClasses(tooltip.theme).split(' ')[0]} ${
        tooltip.placement === 'top' ? 'top-full left-1/2 transform -translate-x-1/2 -mt-1' :
        tooltip.placement === 'bottom' ? 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1' :
        tooltip.placement === 'left' ? 'left-full top-1/2 transform -translate-y-1/2 -ml-1' :
        tooltip.placement === 'right' ? 'right-full top-1/2 transform -translate-y-1/2 -mr-1' :
        'top-full left-1/2 transform -translate-x-1/2 -mt-1'
      }`} />
    </div>
  );
};