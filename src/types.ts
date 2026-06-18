/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ParticleType = 'snowflake' | 'balloon' | 'confetti' | 'bubble' | 'firework_spark' | 'firework_rocket';

export type ParticleSize = 'small' | 'medium' | 'large';

export interface PlaygroundSettings {
  duration: number; // in seconds, 1 to 10
  particleCount: number; // 20 to 100
  particleSize: ParticleSize;
}

export type PlaybackState = 'idle' | 'running' | 'paused' | 'stopped';

export interface Particle {
  id: string;
  type: ParticleType;
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  opacity: number;
  rotation?: number;
  rotationSpeed?: number;
  // Specific to balloons:
  stringLength?: number;
  wobble?: number;
  wobbleSpeed?: number;
  // Specific to bubbles:
  sway?: number;
  swaySpeed?: number;
  // Specific to fireworks:
  life?: number;
  maxLife?: number;
  gravity?: number;
  friction?: number;
}

export type PresetType = 'calm' | 'celebration' | 'winter';

// Status stats displayed on the card
export interface PlaybackStats {
  currentAnimation: string;
  currentTheme: string;
  particleCountSetting: number;
  particleSizeSetting: ParticleSize;
  durationSetting: number;
  visibleParticlesCount: number;
}
