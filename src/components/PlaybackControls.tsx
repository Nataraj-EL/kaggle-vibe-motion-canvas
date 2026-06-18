import React from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { PlaybackState } from '../types';

interface PlaybackControlsProps {
  playbackState: PlaybackState;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  playbackState,
  onPause,
  onResume,
  onStop,
}) => {
  const isRunning = playbackState === 'running';
  const isPaused = playbackState === 'paused';
  const isStopped = playbackState === 'stopped' || playbackState === 'idle';

  return (
    <div id="playback-controls" className="flex items-center gap-4 justify-center py-2 flex-wrap">
      {/* Resume Button */}
      <button
        id="control-btn-resume"
        type="button"
        onClick={onResume}
        disabled={!isPaused}
        className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-6 py-3 rounded-[14px] font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-sm cursor-pointer ${
          isPaused
            ? 'bg-warm-text text-warm-bg hover:bg-[#3d322c] hover:-translate-y-0.5 active:scale-95 animate-pulse'
            : 'bg-warm-text/10 text-warm-text/25 cursor-not-allowed opacity-50'
        }`}
      >
        <Play className="w-3.5 h-3.5 fill-current" />
        Resume
      </button>

      {/* Pause Button */}
      <button
        id="control-btn-pause"
        type="button"
        onClick={onPause}
        disabled={!isRunning}
        className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-6 py-3 rounded-[14px] font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-sm cursor-pointer ${
          isRunning
            ? 'bg-warm-text text-warm-bg hover:bg-[#3d322c] hover:-translate-y-0.5 active:scale-95'
            : 'bg-warm-text/10 text-warm-text/25 cursor-not-allowed opacity-50'
        }`}
      >
        <Pause className="w-3.5 h-3.5 fill-current" />
        Pause
      </button>

      {/* Stop Button */}
      <button
        id="control-btn-stop"
        type="button"
        onClick={onStop}
        disabled={isStopped}
        className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-6 py-3 rounded-[14px] font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-sm cursor-pointer ${
          !isStopped
            ? 'bg-warm-text text-warm-bg hover:bg-[#3d322c] hover:-translate-y-0.5 active:scale-95'
            : 'bg-warm-text/10 text-warm-text/25 cursor-not-allowed opacity-50'
        }`}
      >
        <Square className="w-3.5 h-3.5 fill-current" />
        Stop
      </button>
    </div>
  );
};
