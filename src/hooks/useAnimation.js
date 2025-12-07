import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook để xử lý animation cho MST
 */
export const useAnimation = () => {
  const [animationStep, setAnimationStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef(null);

  /**
   * Bắt đầu animation
   */
  const startAnimation = (totalSteps, callback, speed = 500) => {
    setIsPlaying(true);
    setAnimationStep(0);

    let step = 0;
    animationRef.current = setInterval(() => {
      if (step >= totalSteps) {
        stopAnimation();
        return;
      }
      
      callback(step);
      setAnimationStep(step);
      step++;
    }, speed);
  };

  /**
   * Dừng animation
   */
  const stopAnimation = () => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
    setIsPlaying(false);
  };

  /**
   * Reset animation
   */
  const resetAnimation = () => {
    stopAnimation();
    setAnimationStep(0);
  };

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  return {
    animationStep,
    isPlaying,
    startAnimation,
    stopAnimation,
    resetAnimation
  };
};