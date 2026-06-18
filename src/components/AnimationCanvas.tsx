import React, { useEffect, useRef, useState } from 'react';
import { Particle, ParticleSize, PlaybackState, ParticleType, PlaygroundSettings } from '../types';

interface AnimationCanvasProps {
  activeAnimations: ParticleType[];
  settings: PlaygroundSettings;
  playbackState: PlaybackState;
  onVisibleParticlesChange: (count: number) => void;
  theme: 'light' | 'dark';
}

export const AnimationCanvas: React.FC<AnimationCanvasProps> = ({
  activeAnimations,
  settings,
  playbackState,
  onVisibleParticlesChange,
  theme,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number | null>(null);
  
  // Keep refs of settings and playbackState to prevent re-initializing canvas loop on every slider change
  const settingsRef = useRef(settings);
  const playbackStateRef = useRef(playbackState);
  const activeAnimationsRef = useRef(activeAnimations);
  const themeRef = useRef(theme);
  
  // Track continuous frame calculation and update intervals
  const fireworkTimerRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Sync refs to avoid re-triggering useEffect
  useEffect(() => { settingsRef.current = settings; }, [settings]);
  useEffect(() => { playbackStateRef.current = playbackState; }, [playbackState]);
  useEffect(() => { activeAnimationsRef.current = activeAnimations; }, [activeAnimations]);
  useEffect(() => { themeRef.current = theme; }, [theme]);

  // Periodic statistics update (once every 150ms to maintain great rendering performance)
  useEffect(() => {
    const statsInterval = setInterval(() => {
      if (playbackStateRef.current === 'stopped') {
        onVisibleParticlesChange(0);
      } else {
        onVisibleParticlesChange(particlesRef.current.length);
      }
    }, 150);
    return () => clearInterval(statsInterval);
  }, [onVisibleParticlesChange]);

  // Helper: Get scale values based on particle size setting
  const getParticleSizeConfig = (type: ParticleType, sizeSetting: ParticleSize) => {
    let base = 8;
    switch (type) {
      case 'snowflake':
        base = sizeSetting === 'small' ? 3 : sizeSetting === 'medium' ? 6 : 12;
        break;
      case 'balloon':
        base = sizeSetting === 'small' ? 14 : sizeSetting === 'medium' ? 24 : 36;
        break;
      case 'confetti':
        base = sizeSetting === 'small' ? 5 : sizeSetting === 'medium' ? 9 : 14;
        break;
      case 'bubble':
        base = sizeSetting === 'small' ? 6 : sizeSetting === 'medium' ? 14 : 26;
        break;
      case 'firework_spark':
        base = sizeSetting === 'small' ? 2 : sizeSetting === 'medium' ? 4 : 7;
        break;
      default:
        base = 8;
    }
    // Add minor randomness wrapper
    return base;
  };

  // Helper: Create a single particle
  const createParticleInstance = (
    type: ParticleType, 
    width: number, 
    height: number, 
    isInit: boolean = false,
    customX?: number,
    customY?: number
  ): Particle => {
    const sizeSetting = settingsRef.current.particleSize;
    const baseSize = getParticleSizeConfig(type, sizeSetting);
    const size = baseSize * (0.8 + Math.random() * 0.4);
    const id = `${type}-${Math.random().toString(36).substring(2, 9)}`;

    const balloonColors = [
      '#ef4444', // Red
      '#3b82f6', // Blue
      '#10b981', // Green
      '#f59e0b', // Amber/Yellow
      '#8b5cf6', // Indigo
      '#ec4899', // Pink
      '#06b6d4', // Cyan
    ];

    const confettiColors = [
      '#ff2a6d', '#05d9e8', '#01012b', '#f5a623', '#7ed321', '#f8e71c', '#b8e986', '#bd10e0'
    ];

    const fireworkColors = [
      '#fffa00', '#ff003c', '#00f6ff', '#00ff1a', '#ff00ff', '#ffffff', '#ff9c00', '#7a00ff'
    ];

    switch (type) {
      case 'snowflake': {
        return {
          id,
          type,
          x: Math.random() * width,
          y: isInit ? Math.random() * height : -20,
          size,
          color: themeRef.current === 'dark' 
            ? `rgba(224, 242, 254, ${0.4 + Math.random() * 0.6})` // Bright sky blue/white
            : `rgba(100, 116, 139, ${0.5 + Math.random() * 0.4})`, // Soft dark slate 
          speedX: (Math.random() - 0.5) * 1.5,
          speedY: (1 + Math.random() * 2) * (sizeSetting === 'small' ? 0.75 : sizeSetting === 'medium' ? 1 : 1.3),
          opacity: 0.5 + Math.random() * 0.5,
          sway: Math.random() * Math.PI * 2,
          swaySpeed: 0.01 + Math.random() * 0.02,
        };
      }
      case 'balloon': {
        return {
          id,
          type,
          x: Math.random() * width,
          y: isInit ? (Math.random() * (height * 0.8) + height * 0.2) : height + 40,
          size,
          color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
          speedX: (Math.random() - 0.5) * 1.0,
          speedY: -(0.8 + Math.random() * 1.5) * (sizeSetting === 'small' ? 0.8 : sizeSetting === 'medium' ? 1 : 1.2),
          opacity: 0.85 + Math.random() * 0.15,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.01 + Math.random() * 0.02,
          stringLength: size * 1.5 + Math.random() * 10,
        };
      }
      case 'confetti': {
        return {
          id,
          type,
          x: Math.random() * width,
          y: isInit ? Math.random() * height - 20 : -20,
          size,
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          speedX: (Math.random() - 0.5) * 4,
          speedY: (2 + Math.random() * 3) * (sizeSetting === 'small' ? 0.8 : sizeSetting === 'medium' ? 1 : 1.2),
          opacity: 0.8 + Math.random() * 0.2,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 8,
          sway: Math.random() * 10,
          swaySpeed: 0.02 + Math.random() * 0.04,
        };
      }
      case 'bubble': {
        return {
          id,
          type,
          x: Math.random() * width,
          y: isInit ? Math.random() * height : height + 30,
          size,
          color: `rgba(38, 30, 26, 0.45)`,
          speedX: (Math.random() - 0.5) * 0.8,
          speedY: -(0.5 + Math.random() * 1.2) * (sizeSetting === 'small' ? 0.75 : sizeSetting === 'medium' ? 1 : 1.25),
          opacity: 0.75 + Math.random() * 0.25,
          sway: Math.random() * Math.PI * 2,
          swaySpeed: 0.005 + Math.random() * 0.015,
        };
      }
      case 'firework_spark': {
        const angle = Math.random() * Math.PI * 2;
        const speed = (2 + Math.random() * 6) * (sizeSetting === 'small' ? 0.7 : sizeSetting === 'medium' ? 1 : 1.3);
        const maxLife = 30 + Math.floor(Math.random() * 40);
        return {
          id,
          type,
          x: customX ?? (width / 2),
          y: customY ?? (height / 3),
          size,
          color: fireworkColors[Math.floor(Math.random() * fireworkColors.length)],
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed,
          opacity: 1.0,
          life: maxLife,
          maxLife,
          gravity: 0.08,
          friction: 0.94,
        };
      }
      default:
        return {
          id,
          type: 'snowflake',
          x: Math.random() * width,
          y: -10,
          size: 5,
          color: '#fff',
          speedX: 0,
          speedY: 1,
          opacity: 1,
        };
    }
  };

  // Trigger a full firework explosion at a random layout spot
  const triggerFireworkExplosion = (width: number, height: number, densityMultiplier: number) => {
    const startX = width * 0.15 + Math.random() * (width * 0.7);
    const startY = height * 0.15 + Math.random() * (height * 0.45);
    
    // Choose sparkles count using settings count.
    const baseCount = Math.floor(settingsRef.current.particleCount * densityMultiplier);
    const sparksArray: Particle[] = [];
    
    for (let i = 0; i < baseCount; i++) {
      sparksArray.push(
        createParticleInstance('firework_spark', width, height, false, startX, startY)
      );
    }
    
    // Append the firework sparks to current particles pool
    particlesRef.current = [...particlesRef.current, ...sparksArray];
  };

  // Main Canvas animation Frame update
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle initial resize sizing
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Populate initial particles if starting up
    const initializeParticlesPool = () => {
      const activeTypes = activeAnimationsRef.current;
      if (activeTypes.length === 0 || playbackStateRef.current !== 'running') {
        particlesRef.current = [];
        return;
      }

      const totalTargetCount = settingsRef.current.particleCount;
      const typeShare = Math.floor(totalTargetCount / activeTypes.length);
      const generatedList: Particle[] = [];

      activeTypes.forEach((type) => {
        // We do not pre-spawn full explosions for fireworks on init; they will explode dynamically.
        if (type === 'firework_rocket' || type === 'firework_spark' || type === 'fireworks') {
          return;
        }
        // Fill share space
        for (let i = 0; i < typeShare; i++) {
          generatedList.push(
            createParticleInstance(type as ParticleType, canvas.width, canvas.height, true)
          );
        }
      });
      particlesRef.current = generatedList;
    };

    // Re-fill on state or animation changes
    initializeParticlesPool();

    const renderLoop = (time: number) => {
      const width = canvas.width;
      const height = canvas.height;

      // Handle pause freezing: if paused, simply draw the static picture, don't update coordinates
      const isPaused = playbackStateRef.current === 'paused';
      const isRunning = playbackStateRef.current === 'running';
      const isStopped = playbackStateRef.current === 'stopped';

      if (isStopped) {
        ctx.clearRect(0, 0, width, height);
        particlesRef.current = [];
        requestRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      // Smooth clear
      ctx.clearRect(0, 0, width, height);

      // Fetch dynamic active types list
      const activeTypes = activeAnimationsRef.current;
      const hasFireworksActive = activeTypes.includes('fireworks' as ParticleType);

      // Continuous spawning when active state is RUNNING
      if (isRunning && activeTypes.length > 0) {
        // Let's filter out existing sparks count to monitor standard particles
        const standardParticles = particlesRef.current.filter(p => p.type !== 'firework_spark');
        const targetShare = Math.floor(settingsRef.current.particleCount / activeTypes.length);

        activeTypes.forEach((type) => {
          if (type === ('fireworks' as ParticleType)) {
            // Fireworks are spawned as bursts rather than a steady count wrapper.
            // Spawning burst handled below via timer.
            return;
          }

          const currentTypeCount = standardParticles.filter(p => p.type === type).length;
          if (currentTypeCount < targetShare && Math.random() < 0.2) {
            particlesRef.current.push(
              createParticleInstance(type as ParticleType, width, height, false)
            );
          }
        });

        // Firework logic
        if (hasFireworksActive) {
          // Firework timer tick (time delta or simplified counter)
          fireworkTimerRef.current += 1;
          // Trigger explosion roughly every 65 frames (around 1.1s)
          if (fireworkTimerRef.current >= 65) {
            fireworkTimerRef.current = 0;
            // Celebration triggers Fireworks + Confetti, so reduce sparks ratio slightly for performance
            const isCelebrationMode = activeTypes.includes('confetti');
            const density = isCelebrationMode ? 0.6 : 0.9;
            triggerFireworkExplosion(width, height, density);
          }
        }
      }

      // Process and render particles
      const updatedParticles: Particle[] = [];

      particlesRef.current.forEach((p) => {
        // Render
        ctx.save();

        if (p.type === 'snowflake') {
          // Draw a fluffy layered snowflake
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();

          // Move if running
          if (isRunning) {
            p.sway = (p.sway ?? 0) + (p.swaySpeed ?? 0.02);
            p.x += Math.sin(p.sway) * 0.4 + p.speedX;
            p.y += p.speedY;

            // Stay active / Wrap if we are still running, else let fall off
            const isFinished = p.y > height + 10;
            if (isFinished) {
              if (isRunning && activeTypes.includes('snowflake')) {
                // Re-spawn at top
                const fresh = createParticleInstance('snowflake', width, height, false);
                updatedParticles.push(fresh);
              }
              // If not running active snowflake, do not push back (graceful fade/fall off)
            } else {
              updatedParticles.push(p);
            }
          } else {
            // Paused or static
            updatedParticles.push(p);
          }
        } 
        
        else if (p.type === 'balloon') {
          // Draw balloon
          const r = p.size;
          ctx.translate(p.x, p.y);
          
          // Balloon main body (stretched vertical ellipse)
          ctx.beginPath();
          ctx.ellipse(0, 0, r * 0.8, r, 0, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();

          // Highlights to make it shiny/3D
          ctx.beginPath();
          ctx.ellipse(-r * 0.28, -r * 0.35, r * 0.18, r * 0.28, Math.PI / 10, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
          ctx.fill();

          // Triangle tie-knot at bottom
          ctx.beginPath();
          ctx.moveTo(-r * 0.12, r * 0.95);
          ctx.lineTo(r * 0.12, r * 0.95);
          ctx.lineTo(0, r * 1.15);
          ctx.closePath();
          ctx.fillStyle = p.color;
          ctx.fill();

          // Ribbon String at bottom
          ctx.beginPath();
          ctx.moveTo(0, r * 1.15);
          // Drawing string as a tiny sine wave
          const waveAmp = r * 0.25;
          const strLen = p.stringLength ?? 30;
          ctx.quadraticCurveTo(
            Math.sin((p.wobble ?? 0) * 8) * waveAmp, 
            r * 1.15 + (strLen * 0.5), 
            Math.cos((p.wobble ?? 0) * 8) * (waveAmp * 0.5), 
            r * 1.15 + strLen
          );
          ctx.strokeStyle = themeRef.current === 'dark' ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.18)';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Move if running
          if (isRunning) {
            p.wobble = (p.wobble ?? 0) + (p.wobbleSpeed ?? 0.02);
            p.x += Math.sin(p.wobble) * 0.8 + p.speedX;
            p.y += p.speedY;

            const isFinished = p.y < -r * 2.5;
            if (isFinished) {
              if (isRunning && activeTypes.includes('balloon')) {
                // Re-spawn at bottom
                const fresh = createParticleInstance('balloon', width, height, false);
                updatedParticles.push(fresh);
              }
            } else {
              updatedParticles.push(p);
            }
          } else {
            updatedParticles.push(p);
          }
        } 
        
        else if (p.type === 'confetti') {
          // Draw rotated rectangular slice
          ctx.translate(p.x, p.y);
          ctx.rotate(((p.rotation ?? 0) * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;

          // Draw the piece
          const halfSize = p.size / 2;
          // Randomize shape aspect to look like tumbling 3D pieces
          const scaleOffset = Math.sin((p.sway ?? 0) * 1.5);
          ctx.fillRect(-halfSize, -halfSize * scaleOffset, p.size, p.size * scaleOffset);

          // Move if running
          if (isRunning) {
            p.sway = (p.sway ?? 0) + (p.swaySpeed ?? 0.05);
            p.rotation = (p.rotation ?? 0) + (p.rotationSpeed ?? 3);
            p.x += Math.sin(p.sway * 0.5) * 1.2 + p.speedX * 0.15;
            p.y += p.speedY;

            const isFinished = p.y > height + p.size;
            if (isFinished) {
              if (isRunning && activeTypes.includes('confetti')) {
                const fresh = createParticleInstance('confetti', width, height, false);
                updatedParticles.push(fresh);
              }
            } else {
              updatedParticles.push(p);
            }
          } else {
            updatedParticles.push(p);
          }
        } 
        
        else if (p.type === 'bubble') {
          // Draw glass sphere bubble
          ctx.translate(p.x, p.y);
          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.strokeStyle = p.color; // Semi transparent outline
          ctx.lineWidth = p.size < 10 ? 1.5 : 2.5;
          ctx.stroke();

          // Highlight shine inside the glass sphere
          ctx.beginPath();
          ctx.arc(-p.size * 0.35, -p.size * 0.35, p.size * 0.16, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fill();

          // Soft ambient shine
          ctx.beginPath();
          ctx.ellipse(p.size * 0.3, p.size * 0.3, p.size * 0.3, p.size * 0.15, Math.PI / 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(38, 30, 26, 0.12)';
          ctx.fill();

          // Move if running
          if (isRunning) {
            p.sway = (p.sway ?? 0) + (p.swaySpeed ?? 0.015);
            p.x += Math.sin(p.sway) * 0.3 + p.speedX;
            p.y += p.speedY;

            const isFinished = p.y < -p.size * 1.5;
            if (isFinished) {
              if (isRunning && activeTypes.includes('bubble')) {
                const fresh = createParticleInstance('bubble', width, height, false);
                updatedParticles.push(fresh);
              }
            } else {
              updatedParticles.push(p);
            }
          } else {
            updatedParticles.push(p);
          }
        } 
        
        else if (p.type === 'firework_spark') {
          // Draw sparkling star or circles
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          // Apply fading opacity
          const lifePercent = (p.life ?? 10) / (p.maxLife ?? 50);
          ctx.globalAlpha = p.opacity * Math.min(1, lifePercent * 1.5);
          ctx.fill();

          // Sparkle highlight sparkle
          if (Math.random() > 0.6) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(p.x - 1, p.y - 1, p.size + 1, p.size + 1);
          }

          // Move if running
          if (isRunning) {
            p.speedX *= p.friction ?? 0.95;
            p.speedY *= p.friction ?? 0.95;
            p.speedY += p.gravity ?? 0.12;
            p.x += p.speedX;
            p.y += p.speedY;
            p.life = (p.life ?? 1) - 1;

            const isAlive = p.life > 0;
            if (isAlive) {
              updatedParticles.push(p);
            }
          } else {
            updatedParticles.push(p);
          }
        }

        ctx.restore();
      });

      // Save the updated list to ref
      particlesRef.current = updatedParticles;

      requestRef.current = requestAnimationFrame(renderLoop);
    };

    requestRef.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <canvas
      id="playground-canvas"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-35 block"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
};
