import React, { useRef, useEffect, useCallback, useState } from 'react';

interface IconState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speedMultiplier: number;
  opacity: number;
  curveAmplitude: number;
  time: number;
}

export const FloatingEasterEgg: React.FC = () => {
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationRef = useRef<number | null>(null);
  const iconsRef = useRef<IconState[]>([]);
  const clickCountRef = useRef(0);
  const targetSpeedRef = useRef(0.75); // 0.75x slower
  const targetOpacityRef = useRef(0.225);
  const targetCurveAmplitudeRef = useRef(0.8); // Moderate curve
  const curveFrequencyRef = useRef(0.02);
  const iconSize = 80;
  const [prefersReducedMotion] = useState(() => 
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [numIcons, setNumIcons] = useState(1);

  const createIconState = useCallback((): IconState => {
    const maxX = (typeof window !== 'undefined' ? window.innerWidth : 1000) - iconSize;
    const maxY = (typeof window !== 'undefined' ? window.innerHeight : 800) - iconSize;
    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.random() * maxX,
      y: Math.random() * maxY,
      vx: Math.cos(angle) * 0.75, // 0.75x slower
      vy: Math.sin(angle) * 0.75, // 0.75x slower
      speedMultiplier: 0.75, // 0.75x slower
      opacity: 0.225,
      curveAmplitude: 0.8, // Moderate curve
      time: Math.random() * 100
    };
  }, []);

  const boostSpeed = useCallback(() => {
    // Randomize direction for all icons with higher speed
    iconsRef.current.forEach(icon => {
      const angle = Math.random() * Math.PI * 2;
      icon.vx = Math.cos(angle) * 2.25; // 0.75x of 3
      icon.vy = Math.sin(angle) * 2.25; // 0.75x of 3
    });
    
    // Boost speed significantly
    targetSpeedRef.current = 11.25; // 0.75x of 15
    targetOpacityRef.current = 0.7; // More visible during boost
    targetCurveAmplitudeRef.current = 5; // Much more curvy during boost
    
    // Decay back to normal speed after 1 second
    setTimeout(() => {
      targetSpeedRef.current = 0.75; // Back to base speed
      targetOpacityRef.current = 0.225;
      targetCurveAmplitudeRef.current = 0.8; // Back to base curve
    }, 1000);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    boostSpeed();
    
    clickCountRef.current += 1;
    if (clickCountRef.current >= 5) {
      // Spawn 20 additional icons
      const newIcons: IconState[] = [];
      for (let i = 0; i < 20; i++) {
        newIcons.push(createIconState());
      }
      iconsRef.current = [...iconsRef.current, ...newIcons];
      setNumIcons(prev => prev + 20);
      
      // Remove extra icons after 10 seconds
      setTimeout(() => {
        iconsRef.current = iconsRef.current.slice(0, 1);
        setNumIcons(1);
      }, 10000);
      
      clickCountRef.current = 0; // Reset counter
    }
  }, [boostSpeed, createIconState]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    // Initialize with one icon
    iconsRef.current = [createIconState()];
    iconRefs.current = new Array(1).fill(null);

    const animate = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Update each icon
      iconsRef.current.forEach((icon, index) => {
        const iconEl = iconRefs.current[index];
        if (!iconEl) return;

        // Smoothly interpolate speed, opacity, and curve amplitude
        icon.speedMultiplier += (targetSpeedRef.current - icon.speedMultiplier) * 0.05;
        icon.opacity += (targetOpacityRef.current - icon.opacity) * 0.05;
        icon.curveAmplitude += (targetCurveAmplitudeRef.current - icon.curveAmplitude) * 0.05;

        // Update time for wave function
        icon.time += 1;

        // Calculate base position with velocity
        icon.x += icon.vx * icon.speedMultiplier;
        icon.y += icon.vy * icon.speedMultiplier;

        // Add wave/curve motion perpendicular to direction of travel
        const waveOffset = Math.sin(icon.time * curveFrequencyRef.current) * icon.curveAmplitude;
        const perpendicularAngle = Math.atan2(icon.vy, icon.vx) + Math.PI / 2;
        icon.x += Math.cos(perpendicularAngle) * waveOffset;
        icon.y += Math.sin(perpendicularAngle) * waveOffset;

        // Bounce off edges with clamping
        if (icon.x <= 0) {
          icon.x = 0;
          icon.vx *= -1;
        } else if (icon.x >= viewportWidth - iconSize) {
          icon.x = viewportWidth - iconSize;
          icon.vx *= -1;
        }

        if (icon.y <= 0) {
          icon.y = 0;
          icon.vy *= -1;
        } else if (icon.y >= viewportHeight - iconSize) {
          icon.y = viewportHeight - iconSize;
          icon.vy *= -1;
        }

        // Apply transform and opacity
        iconEl.style.transform = `translate3d(${icon.x}px, ${icon.y}px, 0)`;
        iconEl.style.opacity = icon.opacity.toString();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [prefersReducedMotion, createIconState]);

  // Update iconRefs array when numIcons changes
  useEffect(() => {
    const newLength = numIcons;
    const currentLength = iconRefs.current.length;
    
    if (newLength > currentLength) {
      // Add new null refs
      iconRefs.current = [...iconRefs.current, ...new Array(newLength - currentLength).fill(null)];
    } else if (newLength < currentLength) {
      // Remove extra refs
      iconRefs.current = iconRefs.current.slice(0, newLength);
    }
  }, [numIcons]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <>
      {Array.from({ length: numIcons }).map((_, index) => (
        <div
          key={`icon-${index}-${numIcons}`}
          ref={el => { iconRefs.current[index] = el; }}
          onClick={handleClick}
          className="fixed z-50 cursor-pointer"
          style={{
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            opacity: 0.225,
            pointerEvents: 'auto'
          }}
        >
          <img 
            src="/easterEgg.png" 
            alt="FrontEndly Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      ))}
    </>
  );
};
