import { useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Select } from "@react-three/postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { useInteraction } from "../../../hooks/useInteraction";
import { useFocus } from "../../context/FocusContext";
import { useOverlay } from "../../context/OverlayContext";
import { ColorPalette } from "../../../utils/colors";
import { DissolveMaterial } from "../../../utils/materials";

import { PerspectiveCamera } from "@react-three/drei";
import { RenderTexture } from "@react-three/drei";

//position and rotation of resume on desk
const DEFAULT_POSITION = new THREE.Vector3(-2, 1.05, -2.6);
const DEFAULT_ROTATION = new THREE.Euler(-Math.PI / 2, 0, 0.3);

export function Resume() {
  const { isHovered, setIsHovered, pulseIntensity, interactionHandlers } =
    useInteraction();
  const { isFocused, setFocus } = useFocus();
  const { isOpen } = useOverlay();
  const { camera } = useThree();

  const groupRef = useRef<THREE.Group>(null);
  const [progress, setProgress] = useState(-1.0);

  const texture = useMemo(() => {
    const tex = new THREE.TextureLoader().load("/textures/resume.png");
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const dissolveMaterial = useMemo(
    () => DissolveMaterial(texture, "#000000", progress),
    []
  );

  useFrame(() => {
    if (isOpen && progress >= 0.0 && progress < 1.0) {
      dissolveMaterial.uniforms.uProgress.value = progress;
      setProgress((prev) => prev + 0.003);
    }

    if (!isOpen && progress >= 0.0) {
      dissolveMaterial.uniforms.uProgress.value = progress;
      setProgress((prev) => prev - 0.02);
    }
  });

  const handleClick = () => {
    if (!groupRef.current) return;

    setIsHovered(false);
    setFocus(groupRef.current, DEFAULT_POSITION, DEFAULT_ROTATION, false);

    //target distance is 0.6 for mobile and 0.4 for desktop
    const targetDistance = window.innerWidth < 768 ? 0.6 : 0.4;

    const cameraDirection = camera.getWorldDirection(new THREE.Vector3());
    const targetPosition = new THREE.Vector3().addVectors(
      camera.position,
      cameraDirection.multiplyScalar(targetDistance)
    );
    const targetRotation = camera.rotation.clone();

    gsap.to(groupRef.current.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        setProgress(0.0);
      },
    });

    gsap.to(groupRef.current.rotation, {
      x: targetRotation.x,
      y: targetRotation.y,
      z: targetRotation.z,
      duration: 1,
      ease: "power2.inOut",
    });
  };

  return (
    <group
      ref={groupRef}
      name="Resume"
      position={DEFAULT_POSITION}
      rotation={DEFAULT_ROTATION}
      {...interactionHandlers}
      {...(!isFocused && { onClick: handleClick })}
    >
      <Select enabled={isHovered || pulseIntensity > 0}>
        <mesh>
          <planeGeometry args={[0.4, 0.55]} />
          <meshToonMaterial color={ColorPalette.White} />
        </mesh>
      </Select>
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[0.4, 0.55]} />
        <meshStandardMaterial>
          <RenderTexture attach="map">
            <color attach="background" args={["white"]} />
            <PerspectiveCamera makeDefault position={[0, 0, 1]} />
            <ambientLight intensity={1} color={"#ea8dad"} />
            <mesh material={dissolveMaterial}>
              <planeGeometry args={[2.03, 0.95]} />
            </mesh>
          </RenderTexture>
        </meshStandardMaterial>
      </mesh>
    </group>
  );
}
