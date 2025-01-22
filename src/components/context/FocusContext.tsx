import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import * as THREE from "three";
import gsap from "gsap";

type FocusTransitionType = "CAMERA_TO_OBJECT" | "OBJECT_TO_CAMERA";

interface FocusTransition {
  type: FocusTransitionType;
  targetOffset: THREE.Vector3;
}

interface FocusableConfig {
  id: string;
  object: THREE.Object3D;
  defaultPosition: THREE.Vector3;
  defaultRotation: THREE.Euler;
  transition: FocusTransition;
  canRotate: boolean;
  onFocusStart?: () => void;
  onFocusEnd?: () => void;
  actions?: Map<string, () => void>;
}

interface FocusContextType {
  focusConfig: FocusableConfig | null;
  actions: Map<string, () => void>;
  setCamera: (camera: THREE.Camera) => void;
  cameraEnabled: boolean;
  showOverlay: boolean;
  canInteract: boolean;
  setCanInteract: (canInteract: boolean) => void;
  registerFocusable: (config: FocusableConfig) => void;
  unregisterFocusable: (id: string) => void;
  setFocus: (id: string) => void;
  tooltipContent: string | null;
  showTooltip: (content: string) => void;
  hideTooltip: () => void;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export function FocusProvider({ children }: { children: ReactNode }) {
  const [focusableObjects, setFocusableObjects] = useState<
    Map<string, FocusableConfig>
  >(new Map());
  const [actions, setActions] = useState<Map<string, () => void>>(new Map());
  const [showOverlay, setShowOverlay] = useState(false);
  const [canInteract, setCanInteract] = useState(true);

  const [currentFocus, setCurrentFocus] = useState<{
    config: FocusableConfig;
    previousCameraPosition?: THREE.Vector3;
    previousCameraRotation?: THREE.Euler;
  } | null>(null);

  const [camera, setCamera] = useState<THREE.Camera | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);

  const registerFocusable = (config: FocusableConfig) => {
    setFocusableObjects((prev) => {
      const newMap = new Map(prev);
      newMap.set(config.id, config);
      return newMap;
    });

    //add actions if they contain the word "focus"
    if (config.actions) {
      config.actions.forEach((_, key) => {
        const action = () => setFocus(config.id);
        if (key.includes("focus")) {
          setActions((prev) => {
            const newActions = new Map(prev);
            newActions.set(key, action);
            return newActions;
          });
        }
      });
    }
  };

  const unregisterFocusable = (id: string) => {
    setFocusableObjects((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  };

  const handleFocusTransition = (config: FocusableConfig) => {
    setCameraEnabled(false);

    if (config.transition.type === "OBJECT_TO_CAMERA") {
      const targetDistance = config.transition.targetOffset.z;
      const cameraDirection = camera!.getWorldDirection(new THREE.Vector3());
      const targetPosition = new THREE.Vector3().addVectors(
        camera!.position,
        cameraDirection.multiplyScalar(targetDistance)
      );
      const targetRotation = camera!.rotation.clone();

      gsap.to(config.object.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 1,
        ease: "power2.inOut",
      });
      gsap.to(config.object.rotation, {
        x: targetRotation.x,
        y: targetRotation.y,
        z: targetRotation.z,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          setCanInteract(true);
          config.onFocusStart?.();
          setShowOverlay(true);
        },
      });
    } else {
      const targetPosition = config.object.position
        .clone()
        .add(config.transition.targetOffset || new THREE.Vector3());

      gsap.to(camera!.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 1,
        ease: "power2.inOut",
      });

      gsap.to(camera!.rotation, {
        x: config.object.rotation.x,
        y: config.object.rotation.y,
        z: config.object.rotation.z,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          setCanInteract(true);
          config.onFocusStart?.();
          setShowOverlay(true);
        },
      });
    }
  };

  const setFocus = (id: string) => {
    const config = focusableObjects.get(id);
    if (!config) return;

    if (tooltipContent) hideTooltip();

    setCanInteract(false);

    if (currentFocus && currentFocus.config.id !== id) handleClearFocus(config);
    else if (!currentFocus) handleFocusTransition(config);

    if (
      config.transition.type === "CAMERA_TO_OBJECT" &&
      !currentFocus?.previousCameraPosition
    ) {
      const previousCameraPosition = camera!.position.clone();
      const previousCameraRotation = camera!.rotation.clone();
      setCurrentFocus({
        config,
        previousCameraPosition,
        previousCameraRotation,
      });
    } else {
      setCurrentFocus({ ...currentFocus, config });
    }

    if (config.actions) {
      setActions((prev) => {
        const newActions = new Map(prev);
        config.actions!.forEach((value, key) => {
          newActions.set(key, value);
        });
        return newActions;
      });
    }
  };

  const handleClearFocus = (newConfig: FocusableConfig | null = null) => {
    if (!currentFocus) return;
    const { config } = currentFocus;

    config.onFocusEnd?.();
    setShowOverlay(false);

    if (config.actions) {
      setActions((prev) => {
        if (!newConfig) {
          return new Map();
        }

        const newActions = new Map(prev);
        config.actions!.forEach((_, key) => {
          newActions.delete(key);
        });
        return newActions;
      });
    }

    const skipAnimation =
      config.transition.type === "CAMERA_TO_OBJECT" &&
      newConfig?.transition.type === "CAMERA_TO_OBJECT";

    if (config.transition.type === "OBJECT_TO_CAMERA") {
      gsap.to(config.object.position, {
        x: config.defaultPosition.x,
        y: config.defaultPosition.y,
        z: config.defaultPosition.z,
        duration: 1,
        ease: "power2.inOut",
      });

      gsap.to(config.object.rotation, {
        x: config.defaultRotation.x,
        y: config.defaultRotation.y,
        z: config.defaultRotation.z,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          if (!newConfig) {
            setCameraEnabled(true);
          } else if (!skipAnimation) {
            handleFocusTransition(newConfig);
          }
        },
      });
    } else {
      if (
        currentFocus.previousCameraPosition &&
        currentFocus.previousCameraRotation
      ) {
        gsap.to(camera!.position, {
          x: currentFocus.previousCameraPosition.x,
          y: currentFocus.previousCameraPosition.y,
          z: currentFocus.previousCameraPosition.z,
          duration: 1,
          ease: "power2.inOut",
        });

        gsap.to(camera!.rotation, {
          x: currentFocus.previousCameraRotation.x,
          y: currentFocus.previousCameraRotation.y,
          z: currentFocus.previousCameraRotation.z,
          duration: 1,
          ease: "power2.inOut",
          onComplete: () => {
            if (!newConfig) {
              setCameraEnabled(true);
            } else if (!skipAnimation) {
              handleFocusTransition(newConfig);
            }
          },
        });
      }
    }

    if (!newConfig) {
      setCurrentFocus(null);
    } else if (skipAnimation) {
      handleFocusTransition(newConfig);
    }
  };

  const clearFocus = () => handleClearFocus();

  const showTooltip = (content: string) => {
    if (currentFocus) return;

    setTooltipContent(content);
  };

  const hideTooltip = () => {
    setTooltipContent(null);
  };

  useEffect(() => {
    if (currentFocus) {
      setActions((prev) => {
        const newActions = new Map(prev);
        newActions.set("close", () => clearFocus());
        return newActions;
      });
    }

    focusableObjects.forEach((config) => {
      if (config.actions) {
        config.actions.forEach((_, key) => {
          if (key.includes("focus")) {
            const action = () => setFocus(config.id);
            setActions((prev) => {
              const newActions = new Map(prev);
              newActions.set(key, action);
              return newActions;
            });
          }
        });
      }
    });
  }, [currentFocus]);

  return (
    <FocusContext.Provider
      value={{
        focusConfig: currentFocus?.config || null,
        actions,
        setCamera,
        cameraEnabled,
        showOverlay,
        canInteract,
        setCanInteract,
        registerFocusable,
        unregisterFocusable,
        setFocus,
        tooltipContent,
        showTooltip,
        hideTooltip,
      }}
    >
      {children}
    </FocusContext.Provider>
  );
}

export function useFocus() {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error("useFocus must be used within a FocusProvider");
  }
  return context;
}
