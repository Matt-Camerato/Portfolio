import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ColorPalette } from "../../../utils/colors";
import {
  createToonMaterial,
  createTransparentMaterial,
} from "../../../utils/materials";

export function Computer() {
  const { scene } = useGLTF("/models/computer.glb");
  const rgbMaterial = useRef<THREE.MeshStandardMaterial>(
    new THREE.MeshStandardMaterial({
      color: ColorPalette.Pink,
      emissive: ColorPalette.Pink,
      emissiveIntensity: 15,
    })
  );
  const colorCycle = useRef(0);
  const colors = useMemo(
    () => [ColorPalette.Pink, ColorPalette.Yellow, ColorPalette.Green],
    []
  );

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.receiveShadow = true;
        child.castShadow = true;

        const baseColor =
          "#" + child.material.color?.getHexString() || "#ffffff";

        if (child.material.name === "transparent") {
          child.material = createTransparentMaterial("#111111", 0.9);
        } else if (child.material.name === "rgb") {
          child.material = rgbMaterial.current;
        } else {
          child.material = createToonMaterial(baseColor);
        }
      }
    });
  }, [scene]);

  useFrame(() => {
    colorCycle.current += 0.01;
    const baseColorIndex = Math.floor(colorCycle.current % colors.length);
    const nextColorIndex = (baseColorIndex + 1) % colors.length;
    const lerpFactor = colorCycle.current % 1;

    rgbMaterial.current.color = new THREE.Color(colors[baseColorIndex]).lerp(
      new THREE.Color(colors[nextColorIndex]),
      lerpFactor
    );
    rgbMaterial.current.emissive = rgbMaterial.current.color;
  });

  return <primitive object={scene} />;
}
