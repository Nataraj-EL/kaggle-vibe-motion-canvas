import { useState, useEffect } from 'react';
import { ParticleType, PlaygroundSettings, PlaybackState, PresetType, PlaybackStats } from './types';
import { SettingsPanel } from './components/SettingsPanel';
import { AnimationSelector } from './components/AnimationSelector';
import { PlaybackControls } from './components/PlaybackControls';
import { PresetPanel } from './components/PresetPanel';
import { StatsPanel } from './components/StatsPanel';
import { AnimationCanvas } from './components/AnimationCanvas';

export default function App() {
  // Main animation and particle configuration states
  const [activeAnimations, setActiveAnimations] = useState<ParticleType[]>([]);
  const [settings, setSettings] = useState<PlaygroundSettings>({
    duration: 5,
    particleCount: 50,
    particleSize: 'medium',
  });
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [visibleParticlesCount, setVisibleParticlesCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Keep tracking the countdown timing of the active animation limits
  useEffect(() => {
    let timerId: number | null = null;
    
    if (playbackState === 'running' && timeLeft > 0) {
      timerId = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Reached duration limit, stop injecting and clear playground
            setPlaybackState('stopped');
            setActiveAnimations([]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerId) window.clearInterval(timerId);
    };
  }, [playbackState, timeLeft]);

  // Input Handlers for single buttons selection
  const handleSelectAnimation = (type: ParticleType | 'fireworks') => {
    // If selecting, stop current state and reset
    setPlaybackState('stopped');
    setTimeout(() => {
      const finalType = type === 'fireworks' ? ('fireworks' as ParticleType) : type;
      setActiveAnimations([finalType]);
      setTimeLeft(settings.duration);
      setPlaybackState('running');
    }, 50);
  };

  // Applying Pre-Configured Presets
  const handleApplyPreset = (
    preset: PresetType,
    types: ParticleType[],
    presetSettings: PlaygroundSettings
  ) => {
    setPlaybackState('stopped');
    setTimeout(() => {
      setSettings(presetSettings);
      setActiveAnimations(types);
      setTimeLeft(presetSettings.duration);
      setPlaybackState('running');
    }, 50);
  };

  // Playback State Mutators
  const handlePause = () => {
    if (playbackState === 'running') {
      setPlaybackState('paused');
    }
  };

  // Resume Handler
  const handleResume = () => {
    if (playbackState === 'paused') {
      setPlaybackState('running');
    }
  };

  // Stop Handler
  const handleStop = () => {
    setPlaybackState('stopped');
    setActiveAnimations([]);
    setTimeLeft(0);
  };

  // Helper formatting for labels in stats card
  const formatActiveSystemLabel = () => {
    if (activeAnimations.length === 0) return 'None (Idle)';
    if (activeAnimations.length > 1) {
      return activeAnimations
        .map((t) => t.charAt(0).toUpperCase() + t.slice(1).replace('_', ' '))
        .join(' + ');
    }
    const singleType = activeAnimations[0];
    return singleType.charAt(0).toUpperCase() + singleType.slice(1).replace('_', ' ');
  };

  // Structure cumulative rendering properties
  const stats: PlaybackStats = {
    currentAnimation: formatActiveSystemLabel(),
    currentTheme: 'Warm Minimalist',
    particleCountSetting: settings.particleCount,
    particleSizeSetting: settings.particleSize,
    durationSetting: settings.duration,
    visibleParticlesCount: activeAnimations.length > 0 ? visibleParticlesCount : 0,
  };

  // Check fraction for timing indicator bar
  const isCapped = timeLeft > 0 && activeAnimations.length > 0;
  const progressRatio = isCapped ? (timeLeft / settings.duration) * 100 : 0;

  return (
    <div id="app-root" className="relative min-h-screen w-full flex flex-col justify-between items-center py-12 px-4 md:px-8 select-none bg-warm-bg text-warm-text font-sans overflow-x-hidden">
      
      {/* 1. Canvas Background Graphics Renderer Engine positioned on z-35 (fully on top overlay) */}
      <div className="fixed inset-0 pointer-events-none z-35">
        <AnimationCanvas
          activeAnimations={activeAnimations}
          settings={settings}
          playbackState={playbackState}
          onVisibleParticlesChange={(count) => setVisibleParticlesCount(count)}
          theme="light"
        />
      </div>

      {/* 2. Top Header section with premium editorial look */}
      <header className="w-full max-w-4xl text-center mb-8 z-10 relative">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-widest uppercase text-warm-text/95">
          Ambient Motion Studio
        </h1>
        <p className="text-[11px] font-mono tracking-widest text-warm-text/50 uppercase mt-2">
          A handcrafted physical particle simulation sandbox
        </p>
      </header>

      {/* 3. Primary Workspace Control Card positioned on z-10 */}
      <main id="main-content-card" className="w-full max-w-4xl bg-warm-card rounded-[20px] border border-warm-border shadow-warm-shadow z-10 relative overflow-hidden card-hover-effect transition-all duration-300 my-auto">
        
        {/* Dynamic visual progress loading bar showing remaining duration */}
        <div className="w-full h-1 bg-warm-text/10 relative">
          <div
            id="playground-progressbar"
            className="h-full bg-warm-text transition-all duration-1000 ease-linear rounded-r-full"
            style={{ width: `${progressRatio}%` }}
          />
        </div>

        {/* Inner Card Section spacing padding */}
        <div className="p-8 md:p-10 space-y-8 z-11 relative">
          
          {/* Section 1: Selector buttons widget */}
          <AnimationSelector
            onSelectAnimation={handleSelectAnimation}
            activeTypes={activeAnimations}
            playbackState={playbackState}
          />

          <hr className="border-warm-border" />

          {/* Section 2: Preset Scene Pills */}
          <PresetPanel
            onApplyPreset={handleApplyPreset}
            playbackState={playbackState}
          />

          <hr className="border-warm-border" />

          {/* Section 3: Settings Grid Box split panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SettingsPanel
              settings={settings}
              onChange={setSettings}
              disabled={playbackState === 'paused'}
            />
            
            <StatsPanel stats={stats} />
          </div>

          <hr className="border-warm-border" />

          {/* Section 4: Live Controls Actions bar (Pause, Resume, Stop) */}
          <div className="space-y-4">
            <PlaybackControls
              playbackState={playbackState}
              onPause={handlePause}
              onResume={handleResume}
              onStop={handleStop}
            />
            
            {/* Countdown stats and indicators */}
            {playbackState === 'running' && timeLeft > 0 && (
              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-[#261e1a]/60 animate-pulse">
                Animation Active — Left remaining:{' '}
                <span className="font-mono text-xs font-black text-warm-text decoration-warm-text/25 underline decoration-2 underline-offset-4">
                  {timeLeft}.0s
                </span>
              </p>
            )}

            {playbackState === 'paused' && (
              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-warm-text/60 animate-pulse">
                System state suspended. Resume or stop to proceed.
              </p>
            )}

            {playbackState === 'stopped' && (
              <p className="text-center text-[9px] uppercase tracking-widest text-warm-text/40 font-bold select-none">
                Renderer idle. Select an animation mode above.
              </p>
            )}
          </div>

        </div>
      </main>

      {/* 4. Handcrafted Editorial Footer layout centered horizontally */}
      <footer className="w-full text-center py-6 mt-12 z-10 relative">
        <p className="text-sm font-medium opacity-70" style={{ color: '#261e1a' }}>
          © 2026 Nataraj EL. All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
