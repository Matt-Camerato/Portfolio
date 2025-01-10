import { useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import * as THREE from "three";
import { useFocusable } from "../../../hooks/useFocusable";
import { createToonMaterial } from "../../../utils/materials";
import { AboutScreen } from "../../ui/about/AboutScreen";

const DEFAULT_POSITION = new THREE.Vector3(-2.57, 1.256, -2.56);
const DEFAULT_ROTATION = new THREE.Euler(0, 0.44, 0);

export function Monitor2() {
  const { scene } = useGLTF("/models/monitor2.glb");
  const [isScreenActive, setScreenActive] = useState(false);

  const { isHovered, pulseIntensity, focusableProps } = useFocusable({
    id: "monitor2",
    defaultPosition: DEFAULT_POSITION,
    defaultRotation: DEFAULT_ROTATION,
    transition: {
      type: "CAMERA_TO_OBJECT",
      targetOffset: new THREE.Vector3(
        0,
        window.innerWidth < 768 ? 0.5 : 0.35,
        window.innerWidth < 768 ? 0.9 : 0.6
      ).applyEuler(DEFAULT_ROTATION),
    },
    onFocusStart: () => setScreenActive(true),
    onFocusEnd: () => setScreenActive(false),
    actions: new Map([["focus-monitor2", () => null]]),
  });

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

  return (
    <Select enabled={isHovered || pulseIntensity > 0}>
      <group
        name="monitor2"
        position={DEFAULT_POSITION}
        rotation={DEFAULT_ROTATION}
        {...focusableProps}
      >
        <primitive object={scene} />
        <AboutScreen isActive={isScreenActive} />
      </group>
    </Select>
  );
}
