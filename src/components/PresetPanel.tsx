import React from 'react';
import { Compass, PartyPopper, CloudSnow } from 'lucide-react';
import { PresetType, PlaygroundSettings, ParticleType } from '../types';

interface PresetPanelProps {
  onApplyPreset: (
    preset: PresetType,
    types: ParticleType[],
    settings: PlaygroundSettings
  ) => void;
  playbackState: 'idle' | 'running' | 'paused' | 'stopped';
}

export const PresetPanel: React.FC<PresetPanelProps> = ({ onApplyPreset }) => {
  const presets = [
    {
      id: 'calm' as PresetType,
      label: 'Calm',
      description: 'Slow, rising bubbles with tiny size settings',
      icon: Compass,
      action: () => {
        onApplyPreset(
          'calm',
          ['bubble'],
          { duration: 8, particleCount: 25, particleSize: 'small' }
        );
      },
    },
    {
      id: 'celebration' as PresetType,
      label: 'Celebration',
      description: 'High count tumbling confetti and fireworks',
      icon: PartyPopper,
      action: () => {
        onApplyPreset(
          'celebration',
          ['confetti', 'fireworks' as ParticleType],
          { duration: 9, particleCount: 80, particleSize: 'medium' }
        );
      },
    },
    {
      id: 'winter' as PresetType,
      label: 'Winter',
      description: 'Falling large snowflakes with gentle speed',
      icon: CloudSnow,
      action: () => {
        onApplyPreset(
          'winter',
          ['snowflake'],
          { duration: 7, particleCount: 45, particleSize: 'large' }
        );
      },
    },
  ];

  return (
    <div id="presets-panel" className="space-y-3">
      <div className="flex items-center mb-1">
        <h3 className="text-xs font-bold text-warm-text/60 uppercase tracking-widest">
          QUICK PRESET SCENES
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {presets.map((preset) => {
          const Icon = preset.icon;
          return (
            <button
              key={preset.id}
              id={`preset-btn-${preset.id}`}
              type="button"
              onClick={preset.action}
              className="p-4 rounded-[14px] border border-warm-border bg-warm-card text-warm-text text-left flex items-start gap-4 transition-all duration-300 shadow-sm cursor-pointer hover:-translate-y-0.5 hover:bg-warm-text/5 hover:border-warm-text/20 active:translate-y-0"
            >
              <div className="p-2 rounded-xl bg-warm-text/5 text-warm-text/80 shrink-0 mt-0.5">
                <Icon className="w-4 h-4 shrink-0" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs tracking-wider uppercase text-warm-text">
                  {preset.label} Preset
                </div>
                <div className="text-[10px] text-warm-text/60 mt-1 leading-snug font-medium line-clamp-2">
                  {preset.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
