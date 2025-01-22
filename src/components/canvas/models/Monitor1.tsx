import { useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import * as THREE from "three";
import { useFocusable } from "../../../hooks/useFocusable";
import { createToonMaterial } from "../../../utils/materials";
import { ProjectsScreen } from "../../ui/projects/ProjectsScreen";

const DEFAULT_POSITION = new THREE.Vector3(-1.18, 1.259, -2.86);
const DEFAULT_ROTATION = new THREE.Euler(0, 0, 0);

export function Monitor1() {
  const { scene } = useGLTF("/models/monitor1.glb");
  const [isScreenActive, setScreenActive] = useState(false);

  const { isHovered, pulseIntensity, focusableProps } = useFocusable({
    id: "monitor1",
    tooltipContent: "Projects",
    defaultPosition: DEFAULT_POSITION,
    defaultRotation: DEFAULT_ROTATION,
    transition: {
      type: "CAMERA_TO_OBJECT",
      targetOffset: new THREE.Vector3(
        0,
        window.innerWidth < 768 ? 0.6 : 0.4,
        window.innerWidth < 768 ? 1.2 : 0.75
      ),
    },
    onFocusStart: () => setScreenActive(true),
    onFocusEnd: () => setScreenActive(false),
    actions: new Map([["focus-monitor1", () => null]]),
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
        name="monitor1"
        position={DEFAULT_POSITION}
        rotation={DEFAULT_ROTATION}
        {...focusableProps}
      >
        <primitive object={scene} />
        <ProjectsScreen isActive={isScreenActive} />
      </group>
    </Select>
  );
}
