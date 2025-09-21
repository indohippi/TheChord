import { useState, useEffect } from 'react';
import { useSaveSystem } from '@/lib/stores/useSaveSystem';
import { SaveSlot, SaveMetadata } from '@shared/saveTypes';

interface SaveLoadUIProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'save' | 'load';
}

export function SaveLoadUI({ isOpen, onClose, mode }: SaveLoadUIProps) {
  const {
    saveSlots,
    saveGame,
    loadGame,
    deleteSave,
    getSaveMetadata,
    getSaveSize,
    isSaveCorrupted,
    initializeSaveSystem
  } = useSaveSystem();

  const [selectedSlot, setSelectedSlot] = useState<SaveSlot | null>(null);
  const [characterName, setCharacterName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<SaveSlot | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize save system on mount
  useEffect(() => {
    if (isOpen) {
      initializeSaveSystem();
    }
  }, [isOpen, initializeSaveSystem]);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  // Format play time
  const formatPlayTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Handle save/load
  const handleSaveLoad = async () => {
    if (!selectedSlot) return;

    setLoading(true);
    try {
      if (mode === 'save') {
        await saveGame(selectedSlot, characterName || undefined);
      } else {
        await loadGame(selectedSlot);
      }
      onClose();
    } catch (error) {
      console.error(`${mode} failed:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (slot: SaveSlot) => {
    setLoading(true);
    try {
      await deleteSave(slot);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-blue-500 rounded-lg p-6 w-11/12 max-w-4xl h-5/6 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-300">
            {mode === 'save' ? 'Save Game' : 'Load Game'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Character name input for save mode */}
        {mode === 'save' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Character Name (Optional)
            </label>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter character name..."
            />
          </div>
        )}

        {/* Save slots */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-96 overflow-y-auto">
          {saveSlots.map((slotInfo) => {
            const metadata = getSaveMetadata(slotInfo.slot);
            const size = getSaveSize(slotInfo.slot);
            const corrupted = isSaveCorrupted(slotInfo.slot);
            const isSelected = selectedSlot === slotInfo.slot;

            return (
              <div
                key={slotInfo.slot}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-900 bg-opacity-30'
                    : 'border-gray-600 hover:border-gray-400'
                } ${corrupted ? 'border-red-500 bg-red-900 bg-opacity-20' : ''}`}
                onClick={() => setSelectedSlot(slotInfo.slot)}
              >
                {/* Slot header */}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-white">
                    Slot {slotInfo.slot}
                  </h3>
                  {corrupted && (
                    <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                      Corrupted
                    </span>
                  )}
                </div>

                {/* Slot content */}
                {slotInfo.exists && metadata ? (
                  <div className="space-y-2">
                    <div className="text-sm">
                      <div className="text-white font-medium">{metadata.characterName}</div>
                      <div className="text-gray-400">{metadata.characterClass}</div>
                    </div>
                    
                    <div className="text-xs text-gray-400 space-y-1">
                      <div>Level {metadata.level}</div>
                      <div>Zone: {metadata.currentZone}</div>
                      <div>Play Time: {formatPlayTime(metadata.playTime)}</div>
                      <div>Last Saved: {formatDate(metadata.lastSaved)}</div>
                      <div>Size: {formatFileSize(size)}</div>
                    </div>

                    {/* Story progress */}
                    <div className="mt-2">
                      <div className="text-xs text-gray-400 mb-1">Story Progress</div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${metadata.storyProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    <div className="text-4xl mb-2">💾</div>
                    <div>Empty Slot</div>
                  </div>
                )}

                {/* Action buttons */}
                {slotInfo.exists && !corrupted && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(slotInfo.slot);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-600">
          <div className="text-sm text-gray-400">
            {selectedSlot ? `Selected: Slot ${selectedSlot}` : 'Select a slot'}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSaveLoad}
              disabled={!selectedSlot || loading}
              className={`py-2 px-4 rounded text-white ${
                selectedSlot && !loading
                  ? mode === 'save'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Processing...' : mode === 'save' ? 'Save' : 'Load'}
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
          <div className="bg-gray-900 border-2 border-red-500 rounded-lg p-6 max-w-md">
            <h3 className="text-xl font-bold text-red-400 mb-4">Confirm Delete</h3>
            <p className="text-white mb-6">
              Are you sure you want to delete the save in Slot {showDeleteConfirm}? 
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}