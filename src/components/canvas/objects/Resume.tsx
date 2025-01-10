import { useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, RenderTexture } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import * as THREE from "three";
import { useFocusable } from "../../../hooks/useFocusable";
import { ColorPalette } from "../../../utils/colors";
import { DissolveMaterial } from "../../../utils/materials";

//position and rotation of resume on desk
const DEFAULT_POSITION = new THREE.Vector3(-2, 1.05, -2.6);
const DEFAULT_ROTATION = new THREE.Euler(-Math.PI / 2, 0, 0.3);

export function Resume() {
  const [progress, setProgress] = useState(-1.0);
  const [dissolving, setDissolving] = useState(false);

  const texture = useMemo(() => {
    const tex = new THREE.TextureLoader().load("/textures/resume.png");
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const dissolveMaterial = useMemo(
    () => DissolveMaterial(texture, "#000000", progress),
    []
  );

  const { isHovered, pulseIntensity, focusableProps } = useFocusable({
    id: "resume",
    defaultPosition: DEFAULT_POSITION,
    defaultRotation: DEFAULT_ROTATION,
    transition: {
      type: "OBJECT_TO_CAMERA",
      targetOffset: new THREE.Vector3(
        0,
        0,
        window.innerWidth < 768 ? 0.6 : 0.4
      ),
    },
    onFocusStart: () => {
      setProgress(0.0);
      setDissolving(true);
    },
    onFocusEnd: () => setDissolving(false),
  });

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
      name="resume"
      position={DEFAULT_POSITION}
      rotation={DEFAULT_ROTATION}
      {...focusableProps}
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
