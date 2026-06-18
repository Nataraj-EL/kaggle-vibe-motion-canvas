import React from 'react';
import { Snowflake, Circle, PartyPopper, Droplets, Flame } from 'lucide-react';
import { ParticleType } from '../types';

interface AnimationSelectorProps {
  onSelectAnimation: (type: ParticleType | 'fireworks') => void;
  activeTypes: ParticleType[];
  playbackState: 'idle' | 'running' | 'paused' | 'stopped';
}

export const AnimationSelector: React.FC<AnimationSelectorProps> = ({
  onSelectAnimation,
  activeTypes,
}) => {
  const items = [
    {
      id: 'snowflake' as ParticleType,
      label: 'Snowflakes',
      description: 'Smooth, fluffy snow crystal descent',
      icon: Snowflake,
      dotColor: 'bg-sky-400',
    },
    {
      id: 'balloon' as ParticleType,
      label: 'Balloons',
      description: 'Floating colorful balloons with strings',
      icon: Circle,
      dotColor: 'bg-rose-400',
    },
    {
      id: 'confetti' as ParticleType,
      label: 'Confetti',
      description: 'Tumbling paper rain with random scaling',
      icon: PartyPopper,
      dotColor: 'bg-fuchsia-400',
    },
    {
      id: 'bubble' as ParticleType,
      label: 'Bubbles',
      description: 'Slow-rising glowing liquid spheres',
      icon: Droplets,
      dotColor: 'bg-blue-400',
    },
    {
      id: 'fireworks' as ParticleType,
      label: 'Fireworks',
      description: 'Colorful sky explosions of physics sparks',
      icon: Flame,
      dotColor: 'bg-amber-400',
    },
  ];

  return (
    <div id="animation-selector" className="space-y-3">
      <div className="flex items-center mb-1">
        <h3 className="text-xs font-bold text-warm-text/60 uppercase tracking-widest">
          Select Animation Effect
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {items.map((item) => {
          const isSelected = activeTypes.includes(item.id) || 
            ((item.id as string) === 'fireworks' && activeTypes.includes('fireworks' as ParticleType));
          
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`animation-btn-${item.id}`}
              type="button"
              onClick={() => onSelectAnimation(item.id)}
              className={`p-4 rounded-[14px] flex flex-col items-center justify-center text-center border cursor-pointer transition-all duration-300 shadow-sm hover:-translate-y-0.5 ${
                isSelected
                  ? 'bg-warm-text text-warm-bg border-warm-text'
                  : 'bg-warm-card border-warm-border text-warm-text hover:bg-warm-text/5'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                isSelected ? 'bg-warm-bg/10 text-warm-bg' : 'bg-warm-text/5 text-warm-text/70'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs mt-3 tracking-wide flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-warm-bg' : item.dotColor}`}></span>
                {item.label}
              </span>
              <span className={`text-[9px] opacity-75 mt-1 leading-tight hidden lg:block max-w-[120px] select-none ${
                isSelected ? 'text-warm-bg/75' : 'text-warm-text/50'
              }`}>
                {item.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
