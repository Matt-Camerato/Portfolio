import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { useInteraction } from "../../../hooks/useInteraction";
import { useFocus } from "../../context/FocusContext";
import { useOverlay } from "../../context/OverlayContext";
import { createToonMaterial } from "../../../utils/materials";
import { ProjectsScreen } from "../../ui/projects/ProjectsScreen";

const DEFAULT_POSITION = new THREE.Vector3(-1.18, 1.259, -2.86);
const DEFAULT_ROTATION = new THREE.Euler(0, 0, 0);

export function Monitor1() {
  const { scene } = useGLTF("/models/monitor1.glb");
  const { isHovered, setIsHovered, pulseIntensity, interactionHandlers } =
    useInteraction();
  const { isFocused, setFocus } = useFocus();
  const { isOpen, setActions } = useOverlay();
  const { camera } = useThree();
  const [isScreenActive, setScreenActive] = useState(false);

  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.receiveShadow = true;
        child.castShadow = true;

        const baseColor =
          "#" + child.material.color?.getHexString() || "#ffffff";
        child.material = createToonMaterial(baseColor);
      }
    });
  }, [scene]);

  const handleClick = () => {
    if (!groupRef.current) return;

    const cameraPosition = camera.position.clone();
    const cameraRotation = camera.rotation.clone();

    setIsHovered(false);
    setFocus(groupRef.current, cameraPosition, cameraRotation, false);

    const targetDistance = window.innerWidth < 768 ? 1.2 : 0.75;
    const targetPosition = groupRef.current.position
      .clone()
      .add(new THREE.Vector3(0, targetDistance * 0.5, targetDistance));
    const targetRotation = groupRef.current.rotation.clone();

    gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 1,
      ease: "power2.inOut",
    });
    gsap.to(camera.rotation, {
      x: targetRotation.x,
      y: targetRotation.y,
      z: targetRotation.z,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => setScreenActive(true),
    });
  };

  useEffect(() => {
    if (!isOpen && isScreenActive) setScreenActive(false);
  }, [isOpen]);

  useEffect(() => {
    if (groupRef.current) {
      setActions((prev) => ({ ...prev, projects: handleClick }));
    }
  }, [groupRef, isFocused]);

  return (
    <Select enabled={isHovered || pulseIntensity > 0}>
      <group
        ref={groupRef}
        name="Monitor1"
        position={DEFAULT_POSITION}
        rotation={DEFAULT_ROTATION}
        {...interactionHandlers}
        {...(!isFocused && { onClick: handleClick })}
      >
        <primitive object={scene} />
        <ProjectsScreen isActive={isScreenActive} />
      </group>
    </Select>
  );
}
