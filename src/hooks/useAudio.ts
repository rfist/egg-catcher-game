import { useRef, useCallback, useEffect } from 'react';
import { AUDIO_POOL_SIZE } from '../constants/gameConfig';
import type { SoundKey } from '../types/game';

// Import sound files
import catchSoundSrc from '../assets/sounds/catch.mp3';
import missSoundSrc from '../assets/sounds/miss.mp3';
import chickenSoundSrc from '../assets/sounds/chicken.mp3';
import gameoverSoundSrc from '../assets/sounds/gameover.mp3';
import luSoundSrc from '../assets/sounds/lu.mp3';
import ldSoundSrc from '../assets/sounds/ld.mp3';
import ruSoundSrc from '../assets/sounds/ru.mp3';
import rdSoundSrc from '../assets/sounds/rd.mp3';

// Sound sources mapping
const SOUND_SOURCES: Record<SoundKey, string> = {
  catch: catchSoundSrc,
  miss: missSoundSrc,
  chicken: chickenSoundSrc,
  gameover: gameoverSoundSrc,
  lu: luSoundSrc,
  ld: ldSoundSrc,
  ru: ruSoundSrc,
  rd: rdSoundSrc,
};

// Pool sizes (gameover only needs 1)
const POOL_SIZES: Partial<Record<SoundKey, number>> = {
  gameover: 1,
};

function createAudioPool(src: string, size: number): HTMLAudioElement[] {
  return Array.from({ length: size }, () => new Audio(src));
}

/**
 * Hook for managing game audio with pooling for concurrent playback.
 */
export function useAudio() {
  // Initialize audio pools once
  const poolsRef = useRef<Record<SoundKey, HTMLAudioElement[]> | null>(null);
  const indexRef = useRef<Record<SoundKey, number> | null>(null);

  useEffect(() => {
    if (poolsRef.current === null) {
      poolsRef.current = {} as Record<SoundKey, HTMLAudioElement[]>;
      indexRef.current = {} as Record<SoundKey, number>;

      for (const key of Object.keys(SOUND_SOURCES) as SoundKey[]) {
        const size = POOL_SIZES[key] ?? AUDIO_POOL_SIZE;
        poolsRef.current[key] = createAudioPool(SOUND_SOURCES[key], size);
        indexRef.current[key] = 0;
      }
    }
  }, []);

  const playSound = useCallback((key: SoundKey) => {
    if (!poolsRef.current || !indexRef.current) return;

    const pools = poolsRef.current;
    const indices = indexRef.current;

    const pool = pools[key];
    const index = indices[key];
    const audio = pool[index];

    // Round-robin to next element
    indices[key] = (index + 1) % pool.length;

    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, []);

  return { playSound };
}

// Nest to rolling sound mapping
export const NEST_ROLLING_SOUND: Record<string, SoundKey> = {
  'top-left': 'lu',
  'bottom-left': 'ld',
  'top-right': 'ru',
  'bottom-right': 'rd',
};
