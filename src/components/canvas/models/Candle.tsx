import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  createToonMaterial,
  createTransparentMaterial,
} from "../../../utils/materials";
import { FlameShader } from "../../../shaders/FlameShader";

const POSITION = new THREE.Vector3(-3.1, 1.14, -0.66);

export function Candle() {
  const { scene } = useGLTF("/models/candle.glb");
  const flameMaterial = useRef<THREE.ShaderMaterial | null>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.receiveShadow = true;
        child.castShadow = true;

        const baseColor =
          "#" + child.material.color?.getHexString() || "#ffffff";

        if (child.material.name.includes("transparent")) {
          child.material = createTransparentMaterial(baseColor, 0.3);
        } else {
          child.material = createToonMaterial(baseColor);
        }
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (flameMaterial.current) {
      flameMaterial.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }

    if (lightRef.current) {
      const flicker = Math.sin(state.clock.getElapsedTime() * 15) * 0.1 + 0.9;
      lightRef.current.intensity = 0.8 * flicker;
    }
  });

  return (
    <group position={POSITION}>
      <primitive object={scene} />

      {/* Flame mesh */}
      <mesh
        position={[0, 0.07, 0]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[0.04, 0.08, 0.04]}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <shaderMaterial
          ref={flameMaterial}
          args={[
            {
              vertexShader: FlameShader.vertexShader,
              fragmentShader: FlameShader.fragmentShader,
              uniforms: {
                uTime: { value: 0 },
              },
              transparent: true,
              side: THREE.FrontSide,
            },
          ]}
        />
      </mesh>

      {/* Flame light */}
      <pointLight
        ref={lightRef}
        position={[0, 0.2, 0]}
        color="#ff6600"
        intensity={0.2}
        distance={25}
        decay={1.5}
      />
    </group>
  );
}
