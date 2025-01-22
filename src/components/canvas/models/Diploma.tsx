import { useEffect, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import * as THREE from "three";
import { useFocusable } from "../../../hooks/useFocusable";
import { createToonMaterial, DissolveMaterial } from "../../../utils/materials";

//position and rotation of diploma on shelf
const DEFAULT_POSITION = new THREE.Vector3(-1.804, 2.537, -3.142);
const DEFAULT_ROTATION = new THREE.Euler(-0.1, 0, 0);

export function Diploma() {
  const { scene } = useGLTF("/models/diploma.glb");
  const [progress, setProgress] = useState(-1.0);
  const [dissolving, setDissolving] = useState(false);

  const texture = useMemo(() => {
    const tex = new THREE.TextureLoader().load("/images/diploma.png");
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const dissolveMaterial = useMemo(
    () => DissolveMaterial(texture, "#000000", progress),
    []
  );

  const { isHovered, pulseIntensity, focusableProps } = useFocusable({
    id: "diploma",
    tooltipContent: "Diploma",
    defaultPosition: DEFAULT_POSITION,
    defaultRotation: DEFAULT_ROTATION,
    transition: {
      type: "OBJECT_TO_CAMERA",
      targetOffset: new THREE.Vector3(
        0,
        0,
        window.innerWidth < 768 ? 0.5 : 0.3
      ),
    },
    onFocusStart: () => {
      setProgress(0.0);
      setDissolving(true);
    },
    onFocusEnd: () => setDissolving(false),
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

  useFrame(() => {
    if (dissolving && progress >= 0.0 && progress < 1.0) {
      dissolveMaterial.uniforms.uProgress.value = progress;
      setProgress((prev) => prev + 0.003);
    }

    if (!dissolving && progress >= 0.0) {
      dissolveMaterial.uniforms.uProgress.value = progress;
      setProgress((prev) => prev - 0.02);
    }
  });

  return (
    <group
      name="diploma"
      position={DEFAULT_POSITION}
      rotation={DEFAULT_ROTATION}
      {...focusableProps}
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
