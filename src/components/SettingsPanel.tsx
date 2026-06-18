import React from 'react';
import { ParticleSize, PlaygroundSettings } from '../types';

interface SettingsPanelProps {
  settings: PlaygroundSettings;
  onChange: (newSettings: PlaygroundSettings) => void;
  disabled?: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onChange,
  disabled = false,
}) => {
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...settings,
      duration: parseInt(e.target.value, 10),
    });
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...settings,
      particleCount: parseInt(e.target.value, 10),
    });
  };

  const handleSizeSelect = (size: ParticleSize) => {
    onChange({
      ...settings,
      particleSize: size,
    });
  };

  const sizes: ParticleSize[] = ['small', 'medium', 'large'];

  return (
    <div id="settings-panel" className="bg-warm-card rounded-[20px] p-6 border border-warm-border shadow-warm-shadow transition-all duration-300 card-hover-effect">
      <div className="mb-5">
        <h3 className="text-xs font-bold text-warm-text/60 uppercase tracking-widest">
          System Settings
        </h3>
      </div>

      <div className="space-y-6">
        {/* Duration Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-warm-text/75">
            <span>Duration Limit</span>
            <span className="font-mono font-bold text-warm-text">
              {settings.duration}.0s
            </span>
          </div>
          <input
            id="duration-slider"
            type="range"
            min="1"
            max="10"
            value={settings.duration}
            onChange={handleDurationChange}
            disabled={disabled}
            className="w-full h-1 bg-warm-text/10 rounded-full appearance-none cursor-pointer disabled:opacity-50 transition-all accent-warm-text"
          />
        </div>

        {/* Particle Count Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-warm-text/75">
            <span>Particle Count</span>
            <span className="font-mono font-bold text-warm-text">
              {settings.particleCount}
            </span>
          </div>
          <input
            id="count-slider"
            type="range"
            min="20"
            max="100"
            value={settings.particleCount}
            onChange={handleCountChange}
            disabled={disabled}
            className="w-full h-1 bg-warm-text/10 rounded-full appearance-none cursor-pointer disabled:opacity-50 transition-all accent-warm-text"
          />
        </div>

        {/* Particle Size Selector */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-warm-text/75 mb-2.5">
            Particle Size
          </div>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => {
              const active = settings.particleSize === size;
              return (
                <button
                  key={size}
                  id={`size-btn-${size}`}
                  type="button"
                  onClick={() => handleSizeSelect(size)}
                  disabled={disabled}
                  className={`py-2 px-3 text-[10px] font-bold rounded-[14px] uppercase transition-all duration-300 cursor-pointer ${
                    active
                      ? 'bg-warm-text text-warm-bg border-none shadow-sm'
                      : 'bg-transparent border border-warm-text/15 text-warm-text/60 hover:bg-warm-text/5 hover:-translate-y-0.5 disabled:opacity-50'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
