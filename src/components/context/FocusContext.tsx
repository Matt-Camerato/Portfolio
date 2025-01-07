import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { useCamera } from "./CameraContext";
import { useOverlay } from "./OverlayContext";
import { Plane } from "@react-three/drei";
import { overlayMaterial } from "../../utils/materials";

interface FocusContextType {
  isFocused: boolean;
  setFocus: (
    object: THREE.Object3D,
    position: THREE.Vector3,
    rotation: THREE.Euler,
    canRotate: boolean
  ) => void;
  focusedObject: THREE.Object3D | null;
  isPulsing: boolean;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export function FocusProvider({ children }: { children: ReactNode }) {
  const { camera } = useThree();
  const { setEnabled } = useCamera();
  const { isOpen, setIsOpen, setActions } = useOverlay();

  const [isDragging, setIsDragging] = useState(false);

  const [focusValues, setFocusValues] = useState<{
    object: THREE.Object3D;
    position: THREE.Vector3;
    rotation: THREE.Euler;
    canRotate: boolean;
  } | null>(null);

  const setFocus = (
    object: THREE.Object3D,
    position: THREE.Vector3,
    rotation: THREE.Euler,
    canRotate: boolean
  ) => {
    setEnabled(false);
    setFocusValues({ object, position, rotation, canRotate });
    setIsOpen(true);
    setActions({ close: handleClose });
  };

  const handleDragStart = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!focusValues || !focusValues.canRotate) return;

    setIsDragging(true);
  };

  const handleDragMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!isDragging || !focusValues || !focusValues.canRotate) return;

    const deltaX = e.movementX / 500;
    const deltaY = e.movementY / 500;

    const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(
      camera.quaternion
    );
    const cameraUp = new THREE.Vector3(0, 1, 0).applyQuaternion(
      camera.quaternion
    );
    const rightRotation = new THREE.Quaternion().setFromAxisAngle(
      cameraUp,
      deltaX
    );
    const upRotation = new THREE.Quaternion().setFromAxisAngle(
      cameraRight,
      deltaY
    );
    const combinedRotation = rightRotation.multiply(upRotation);

    focusValues.object.quaternion.multiplyQuaternions(
      combinedRotation,
      focusValues.object.quaternion
    );
  };

  const handleDragEnd = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!focusValues || !focusValues.canRotate) return;
    setIsDragging(false);
  };

  const handleClose = () => {
    setFocusValues((currentFocusValues) => {
      if (currentFocusValues) {
        setIsOpen(false);

        pulseTimerRef.current = pulseIntervalRef.current;

        if (currentFocusValues.object.name.includes("Monitor")) {
          gsap.to(camera.position, {
            x: currentFocusValues.position.x,
            y: currentFocusValues.position.y,
            z: currentFocusValues.position.z,
            duration: 1,
            ease: "power2.inOut",
          });
          gsap.to(camera.rotation, {
            x: currentFocusValues.rotation.x,
            y: currentFocusValues.rotation.y,
            z: currentFocusValues.rotation.z,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
              setFocusValues(null);
              setEnabled(true);
            },
          });
        } else {
          gsap.to(currentFocusValues.object.rotation, {
            x: currentFocusValues.rotation.x,
            y: currentFocusValues.rotation.y,
            z: currentFocusValues.rotation.z,
            duration: 1,
            ease: "power2.inOut",
          });
          gsap.to(currentFocusValues.object.position, {
            x: currentFocusValues.position.x,
            y: currentFocusValues.position.y,
            z: currentFocusValues.position.z,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
              setFocusValues(null);
              setEnabled(true);
            },
          });
        }
      }
      return currentFocusValues;
    });
  };

  //pulse all interactable objects every pulse interval
  const pulseTimerRef = useRef(180);
  const pulseIntervalRef = useRef(window.innerWidth < 768 ? 1800 : 3600);
  const [isPulsing, setIsPulsing] = useState(true);
  useFrame(() => {
    if (focusValues) {
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

  return (
    <FocusContext.Provider
      value={{
        isFocused: focusValues !== null,
        setFocus,
        focusedObject: focusValues?.object || null,
        isPulsing,
      }}
    >
      <Overlay
        isOpen={isOpen && !focusValues?.object.name.includes("Monitor")}
        camera={camera}
        handleDragStart={handleDragStart}
        handleDragMove={handleDragMove}
        handleDragEnd={handleDragEnd}
      />
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

function Overlay({
  isOpen,
  camera,
  handleDragStart,
  handleDragMove,
  handleDragEnd,
}: {
  isOpen: boolean;
  camera: THREE.Camera;
  handleDragStart: (e: ThreeEvent<PointerEvent>) => void;
  handleDragMove: (e: ThreeEvent<PointerEvent>) => void;
  handleDragEnd: (e: ThreeEvent<PointerEvent>) => void;
}) {
  const planeRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!planeRef.current || !isOpen) return;

    const planeDistance = 0.75;
    const height =
      2 *
      Math.tan(
        THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov / 2)
      ) *
      planeDistance;
    const width = height * (camera as THREE.PerspectiveCamera).aspect;
    planeRef.current.scale.set(width, height, 1);

    const planeVector = new THREE.Vector3(0, 0, -planeDistance);
    planeVector.applyQuaternion(camera.quaternion);
    planeVector.add(camera.position);

    planeRef.current.position.copy(planeVector);
    planeRef.current.quaternion.copy(camera.quaternion);
  }, [isOpen]);

  return (
    isOpen && (
      <Plane
        ref={planeRef}
        args={[1, 1]}
        material={overlayMaterial}
        renderOrder={-1}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerLeave={handleDragEnd}
      />
    )
  );
}
