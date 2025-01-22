import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
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
  const resumeMeshRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => {
    const tex = new THREE.TextureLoader().load("/images/resume.svg");
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const dissolveMaterial = useMemo(
    () => DissolveMaterial(texture, "#000000", progress),
    []
  );

  const { isHovered, pulseIntensity, focusableProps } = useFocusable({
    id: "resume",
    tooltipContent: "Resume",
    defaultPosition: DEFAULT_POSITION,
    defaultRotation: DEFAULT_ROTATION,
    transition: {
      type: "OBJECT_TO_CAMERA",
      targetOffset: new THREE.Vector3(
        0,
        0,
        window.innerWidth < 768 ? 0.5 : 0.38
      ),
    },
    onFocusStart: () => {
      setProgress(0.0);
      setDissolving(true);
    },
    onFocusEnd: () => setDissolving(false),
    actions: new Map([
      ["resume", () => window.open("/resume.pdf", "_blank")],
    ]),
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

  useEffect(() => {
    if (!resumeMeshRef.current) return;

    console.log(window.innerWidth, window.innerHeight);
    const aspect = window.innerWidth / window.innerHeight;
    resumeMeshRef.current.scale.set(100 * aspect, 100, 1);
  }, [window.innerWidth, window.innerHeight]);

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
      <mesh position={[0, 0, 0.001]} material={dissolveMaterial}>
        <planeGeometry args={[0.4, 0.55]} />
      </mesh>
    </group>
  );
}
