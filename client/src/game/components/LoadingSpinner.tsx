import React from 'react';
import { LoadingState } from '../../../shared/uiTypes';

interface LoadingSpinnerProps {
  loading: LoadingState;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ loading }) => {
  if (!loading.isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <div className="flex items-center space-x-4">
          {loading.indeterminate ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          ) : (
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
              <div
                className="absolute inset-0 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"
                style={{
                  transform: `rotate(${(loading.progress || 0) * 3.6}deg)`
                }}
              />
            </div>
          )}
          
          <div>
            {loading.message && (
              <p className="text-gray-900 font-medium">{loading.message}</p>
            )}
            {loading.progress !== undefined && !loading.indeterminate && (
              <p className="text-gray-600 text-sm">{Math.round(loading.progress)}%</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};