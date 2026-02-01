import { useState, useEffect, useRef, useCallback } from 'react';
import {
  PHASE_DURATION_MS,
  MAX_PENALTY_POINTS,
  POINTS_PER_CATCH,
  WINDOW_CHARACTER_APPEAR_CHANCE,
  WINDOW_CHARACTER_VISIBLE_DURATION_MS,
  MISS_ANIMATION_FRAMES,
  MISS_ANIMATION_FRAME_MS
} from '../constants/gameConfig';
import { createEmptyActiveEggs, calculateNextGameState } from '../utils/gameLogic';
import { useAudio } from './useAudio';
import { useKeyboardControls } from './useKeyboardControls';
import type { CatchPosition, MissSide, ActiveEggs } from '../types/game';

export function useGameLoop() {
  // Game state
  const [score, setScore] = useState(0);
  const [penaltyPoints, setPenaltyPoints] = useState(0);
  const [consecutiveCatches, setConsecutiveCatches] = useState(0);
  const [catchPosition, setCatchPosition] = useState<CatchPosition>('bottom-left');
  const [gameRunning, setGameRunning] = useState(false);
  const [windowCharacterVisible, setWindowCharacterVisible] = useState(false);
  const [missAnimationSide, setMissAnimationSide] = useState<MissSide>(null);
  const [missAnimationFrame, setMissAnimationFrame] = useState(0);
  const [activeEggs, setActiveEggs] = useState<ActiveEggs>(createEmptyActiveEggs);
  
  // Internal state not affecting render directly or needing persistence across renders for calculations
  const eggIdCounterRef = useRef(0);
  
  // Refs for reading current state in intervals
  const activeEggsRef = useRef(activeEggs);
  const catchPositionRef = useRef(catchPosition);
  const consecutiveCatchesRef = useRef(consecutiveCatches);
  const windowCharacterVisibleRef = useRef(windowCharacterVisible);
  const penaltyPointsRef = useRef(penaltyPoints);
  
  // Timer refs
  const windowCharacterTimeoutRef = useRef<number | null>(null);
  const missAnimationIntervalRef = useRef<number | null>(null);

  // Audio
  const { playSound } = useAudio();

  // Keep refs in sync
  useEffect(() => {
    activeEggsRef.current = activeEggs;
    catchPositionRef.current = catchPosition;
    consecutiveCatchesRef.current = consecutiveCatches;
    windowCharacterVisibleRef.current = windowCharacterVisible;
    penaltyPointsRef.current = penaltyPoints;
  }, [activeEggs, catchPosition, consecutiveCatches, windowCharacterVisible, penaltyPoints]);

  // Show window character
  const showWindowCharacter = useCallback(() => {
    if (windowCharacterTimeoutRef.current) {
      clearTimeout(windowCharacterTimeoutRef.current);
    }
    setWindowCharacterVisible(true);
    windowCharacterTimeoutRef.current = window.setTimeout(() => {
      setWindowCharacterVisible(false);
      windowCharacterTimeoutRef.current = null;
    }, WINDOW_CHARACTER_VISIBLE_DURATION_MS);
  }, []);

  // Trigger miss animation
  const triggerMissAnimation = useCallback((side: 'left' | 'right') => {
    if (missAnimationIntervalRef.current) {
      clearInterval(missAnimationIntervalRef.current);
    }

    playSound('chicken');
    setMissAnimationSide(side);
    setMissAnimationFrame(0);

    let frame = 0;
    missAnimationIntervalRef.current = window.setInterval(() => {
      frame++;
      if (frame >= MISS_ANIMATION_FRAMES) {
        clearInterval(missAnimationIntervalRef.current!);
        missAnimationIntervalRef.current = null;
        setMissAnimationSide(null);
        setMissAnimationFrame(0);
      } else {
        setMissAnimationFrame(frame);
      }
    }, MISS_ANIMATION_FRAME_MS);
  }, [playSound]);

  // Keyboard controls
  useKeyboardControls({
    onPositionChange: setCatchPosition,
    onStartGame: useCallback(() => {
      if (!gameRunning) {
        // Reset game state
        setScore(0);
        setPenaltyPoints(0);
        setConsecutiveCatches(0);
        setCatchPosition('bottom-left');
        setActiveEggs(createEmptyActiveEggs());
        setWindowCharacterVisible(false);
        setMissAnimationSide(null);
        eggIdCounterRef.current = 0;
        setGameRunning(true);
      }
    }, [gameRunning]),
    enabled: !gameRunning, // Only enable start game key when not running. Movement keys handled by internal logic of useKeyboardControls
  });

  // Game loop
  useEffect(() => {
    if (!gameRunning || penaltyPoints >= MAX_PENALTY_POINTS || missAnimationSide !== null) {
      return;
    }

    const gameLoop = setInterval(() => {
      const result = calculateNextGameState(
        activeEggsRef.current,
        catchPositionRef.current,
        consecutiveCatchesRef.current,
        eggIdCounterRef.current
      );

      // Play sounds with a slight stagger to prevent overlap/cancellation
      result.sounds.forEach((sound, index) => {
        if (index === 0) {
          playSound(sound);
        } else {
          setTimeout(() => playSound(sound), index * 50);
        }
      });

      // Update basic state
      setActiveEggs(result.newActiveEggs);
      eggIdCounterRef.current = result.nextEggId;

      // Handle catches
      if (result.caughtCount > 0) {
        playSound('catch');
        setScore(s => s + result.caughtCount * POINTS_PER_CATCH);
        setConsecutiveCatches(c => c + result.caughtCount);
      } else if (result.missedCount > 0) {
        // Reset consecutive catches on miss
        setConsecutiveCatches(0);
      }

      // Handle random window character
      if (!windowCharacterVisibleRef.current && Math.random() < WINDOW_CHARACTER_APPEAR_CHANCE) {
        showWindowCharacter();
      }

      // Handle misses
      if (result.missedCount > 0 && result.lastMissedSide) {
        // Clear all eggs immediately on miss
        setActiveEggs(createEmptyActiveEggs());
        
        playSound('miss');
        const penaltyPerMiss = windowCharacterVisibleRef.current ? 0.5 : 1.0;
        const newPenaltyPoints = penaltyPointsRef.current + result.missedCount * penaltyPerMiss;
        setPenaltyPoints(newPenaltyPoints);

        if (newPenaltyPoints >= MAX_PENALTY_POINTS) {
          playSound('gameover');
          setGameRunning(false);
        }

        triggerMissAnimation(result.lastMissedSide);
      }
    }, PHASE_DURATION_MS);

    return () => clearInterval(gameLoop);
  }, [gameRunning, penaltyPoints, missAnimationSide, playSound, showWindowCharacter, triggerMissAnimation]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (windowCharacterTimeoutRef.current) clearTimeout(windowCharacterTimeoutRef.current);
      if (missAnimationIntervalRef.current) clearInterval(missAnimationIntervalRef.current);
    };
  }, []);

  return {
    gameState: {
      score,
      penaltyPoints,
      consecutiveCatches,
      catchPosition,
      gameRunning,
      windowCharacterVisible,
      missAnimationSide,
      missAnimationFrame,
      activeEggs,
    },
  };
}
