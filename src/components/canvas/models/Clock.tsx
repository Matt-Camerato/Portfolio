import { useEffect } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { createToonMaterial } from "../../../utils/materials";

export function Clock() {
  const { scene } = useGLTF("/models/clock.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.receiveShadow = true;
        child.castShadow = true;

        const baseColor =
          "#" + child.material.color?.getHexString() || "#ffffff";

        child.material = createToonMaterial(baseColor);
      }
    });
  }, [scene]);

  useFrame(() => {
    const currentTime = new Date();
    const seconds = currentTime.getSeconds();
    const minutes = currentTime.getMinutes();
    const hours = currentTime.getHours();

    const secondHand = scene.getObjectByName("secondHand");
    const minuteHand = scene.getObjectByName("minuteHand");
    const hourHand = scene.getObjectByName("hourHand");

    if (secondHand) {
      secondHand.rotation.z = -((seconds / 60) * (2 * Math.PI)); // Rotate based on current seconds
    }
    if (minuteHand) {
      minuteHand.rotation.z = -(
        (minutes / 60) * (2 * Math.PI) +
        (seconds / 3600) * (2 * Math.PI)
      ); // Rotate based on current minutes and seconds
    }
    if (hourHand) {
      hourHand.rotation.z = -(
        ((hours % 12) / 12) * (2 * Math.PI) +
        (minutes / 720) * (2 * Math.PI)
      ); // Rotate based on current hours and minutes
    }
  });

  return <primitive object={scene} />;
}
