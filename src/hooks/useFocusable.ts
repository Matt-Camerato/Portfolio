import { useEffect, useRef } from "react";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useFocus } from "../components/context/FocusContext";
import { useInteraction } from "./useInteraction";

interface UseFocusableProps {
  id: string;
  defaultPosition: THREE.Vector3;
  defaultRotation: THREE.Euler;
  transition: {
    type: "CAMERA_TO_OBJECT" | "OBJECT_TO_CAMERA";
    targetOffset: THREE.Vector3;
  };
  canRotate?: boolean;
  onFocusStart?: () => void;
  onFocusEnd?: () => void;
  actions?: Map<string, () => void>;
}

export const useFocusable = ({
  id,
  defaultPosition,
  defaultRotation,
  transition,
  canRotate = false,
  onFocusStart,
  onFocusEnd,
  actions,
}: UseFocusableProps) => {
  const objectRef = useRef<THREE.Group>(null);
  const {
    focusConfig,
    registerFocusable,
    unregisterFocusable,
    setFocus,
    cameraEnabled,
  } = useFocus();
  const { isHovered, setIsHovered, pulseIntensity, interactionHandlers } =
    useInteraction();

  useEffect(() => {
    if (!objectRef.current) return;

    registerFocusable({
      id,
      object: objectRef.current,
      defaultPosition,
      defaultRotation,
      transition,
      canRotate,
      onFocusStart,
      onFocusEnd,
      actions,
    });

    const registeredId = id;
    return () => unregisterFocusable(registeredId);
  }, [objectRef.current]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!objectRef.current || !cameraEnabled) return;
    setIsHovered(false);
    setFocus(id);
  };

  const isSelfFocused = focusConfig && focusConfig.object === objectRef.current;

  return {
    objectRef,
    isHovered,
    isSelfFocused,
    pulseIntensity,
    focusableProps: {
      ref: objectRef,
      ...(!focusConfig && { onClick: handleClick }),
      ...interactionHandlers,
    },
  };
};
