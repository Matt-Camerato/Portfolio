import { useState } from "react";
import { useFocus } from "../components/context/FocusContext";

export const useInteraction = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { isFocused, isPulsing } = useFocus();

  const handlePointerOver = () => setIsHovered(true);
  const handlePointerOut = () => setIsHovered(false);

  return {
    isHovered,
    setIsHovered,
    pulseIntensity: isPulsing ? 1 : 0,
    interactionHandlers: !isFocused
      ? {
          onPointerOver: handlePointerOver,
          onPointerOut: handlePointerOut,
        }
      : {},
  };
};
