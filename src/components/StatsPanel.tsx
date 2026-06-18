import React, { useMemo } from 'react';
import { PlaybackStats } from '../types';

interface StatsPanelProps {
  stats: PlaybackStats;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const formatSize = (size: string) => {
    return size.charAt(0).toUpperCase() + size.slice(1);
  };

  // Generate mock premium CPU load bars that flicker subtly to resemble live calculation
  const performanceBars = useMemo(() => {
    return Array.from({ length: 12 }).map(() => ({
      height: `${20 + Math.floor(Math.random() * 60)}%`,
    }));
  }, [stats.visibleParticlesCount]); // updates with particle count

  return (
    <div id="stats-panel" className="bg-warm-card text-warm-text rounded-[20px] p-6 border border-warm-border shadow-warm-shadow transition-all duration-300 flex flex-col justify-between h-full card-hover-effect">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h4 className="text-xs font-bold text-warm-text/60 uppercase tracking-widest">
            Live Statistics
          </h4>
          <span className="text-[9px] font-bold text-warm-text px-2 py-0.5 rounded-full bg-warm-text/10 animate-pulse font-mono uppercase tracking-widest">
            ● Signal Active
          </span>
        </div>

        <div className="space-y-3.5">
          {/* Active System */}
          <div className="flex justify-between items-center py-1.5 border-b border-warm-text/10">
            <span className="text-xs text-warm-text/60 font-semibold uppercase tracking-wider">Animation</span>
            <span className="text-xs font-extrabold text-warm-text truncate max-w-[140px]" title={stats.currentAnimation}>
              {stats.currentAnimation || 'Inactive'}
            </span>
          </div>

          {/* Theme */}
          <div className="flex justify-between items-center py-1.5 border-b border-warm-text/10">
            <span className="text-xs text-warm-text/60 font-semibold uppercase tracking-wider">Design Palette</span>
            <span className="text-xs font-bold text-warm-text">
              {stats.currentTheme}
            </span>
          </div>

          {/* Target Count */}
          <div className="flex justify-between items-center py-1.5 border-b border-warm-text/10">
            <span className="text-xs text-warm-text/60 font-semibold uppercase tracking-wider">Target Setting</span>
            <span className="text-xs font-bold font-mono text-warm-text">
              {stats.particleCountSetting} particles
            </span>
          </div>

          {/* Size */}
          <div className="flex justify-between items-center py-1.5 border-b border-warm-text/10">
            <span className="text-xs text-warm-text/60 font-semibold uppercase tracking-wider">Particle Size</span>
            <span className="text-xs font-bold text-warm-text">
              {formatSize(stats.particleSizeSetting)}
            </span>
          </div>

          {/* Screen Count */}
          <div className="flex justify-between items-center py-1.5">
            <span className="text-xs text-warm-text/60 font-semibold uppercase tracking-wider">Active View count</span>
            <span className="text-xs font-extrabold font-mono text-warm-text">
              {stats.visibleParticlesCount}
            </span>
          </div>
        </div>
      </div>

      {/* Engine Renderer Load graph */}
      <div className="mt-6 bg-warm-text/5 p-4 rounded-xl border border-warm-text/10">
        <div className="text-[9px] uppercase font-bold tracking-widest text-warm-text/50 mb-2.5 flex justify-between">
          <span>Engine Render Graph</span>
          <span className="font-mono text-warm-text/80 font-bold">60.0 FPS</span>
        </div>
        <div className="flex gap-1 h-8 items-end justify-between px-1">
          {performanceBars.map((bar, i) => (
            <div
              key={i}
              className="w-full bg-warm-text/70 rounded-xs hover:bg-warm-text transition-all duration-300"
              style={{ height: bar.height }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
