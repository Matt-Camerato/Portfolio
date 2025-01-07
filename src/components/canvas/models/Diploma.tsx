import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { useInteraction } from "../../../hooks/useInteraction";
import { useFocus } from "../../context/FocusContext";
import { useOverlay } from "../../context/OverlayContext";
import { createToonMaterial, DissolveMaterial } from "../../../utils/materials";

//position and rotation of diploma on shelf
const DEFAULT_POSITION = new THREE.Vector3(-1.804, 2.537, -3.142);
const DEFAULT_ROTATION = new THREE.Euler(-0.1, 0, 0);

export function Diploma() {
  const { scene } = useGLTF("/models/diploma.glb");
  const { isHovered, setIsHovered, pulseIntensity, interactionHandlers } =
    useInteraction();
  const { isFocused, setFocus } = useFocus();
  const { isOpen } = useOverlay();
  const { camera } = useThree();

  const groupRef = useRef<THREE.Group>(null);
  const [progress, setProgress] = useState(-1.0);

  const texture = useMemo(() => {
    const tex = new THREE.TextureLoader().load("/textures/diploma.png");
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const dissolveMaterial = useMemo(
    () => DissolveMaterial(texture, "#000000", progress),
    []
  );

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

    //target distance is 0.5 for mobile and 0.3 for desktop
    const targetDistance = window.innerWidth < 768 ? 0.5 : 0.3;

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
      position={DEFAULT_POSITION}
      rotation={DEFAULT_ROTATION}
      {...interactionHandlers}
      {...(!isFocused && { onClick: handleClick })}
    >
      <Select enabled={isHovered || pulseIntensity > 0}>
        <primitive object={scene} />
      </Select>
      <mesh position={[0, 0, 0.005]} material={dissolveMaterial}>
        <planeGeometry args={[0.6, 0.4]} />
      </mesh>
    </group>
  );
}
