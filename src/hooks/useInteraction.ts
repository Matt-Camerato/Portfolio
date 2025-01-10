import { useRef, useState } from "react";
import { useFocus } from "../components/context/FocusContext";
import { useFrame } from "@react-three/fiber";

export const useInteraction = () => {
  const { focusConfig } = useFocus();

  const pulseTimerRef = useRef(1000);
  const pulseIntervalRef = useRef(window.innerWidth < 768 ? 1800 : 3600);

  const [isHovered, setIsHovered] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  const handlePointerOver = () => setIsHovered(true);
  const handlePointerOut = () => setIsHovered(false);

  //pulse all interactable objects every pulse interval
  useFrame(() => {
    if (focusConfig) {
      if (isPulsing) setIsPulsing(false);
      return;
    }

    pulseTimerRef.current--;
    if (isPulsing && pulseTimerRef.current <= 0) {
      setIsPulsing(false);
      pulseTimerRef.current = pulseIntervalRef.current;
    } else if (!isPulsing && pulseTimerRef.current <= 0) {
      setIsPulsing(true);
      pulseTimerRef.current = 180;
    }
  });

  return {
    isHovered,
    setIsHovered,
    pulseIntensity: isPulsing ? 1 : 0,
    interactionHandlers: !focusConfig
      ? {
          onPointerOver: handlePointerOver,
          onPointerOut: handlePointerOut,
        }
      : {},
  };
};
