// CONFETTI COMPONENT BY ANDERSON MANCINI AND ROMAIN HERAULT
// Based on: https://github.com/JamesChan21/threejs-confetti
// Based on: https://github.com/daniel-lundin/dom-confetti
// If you use, please credit it :)

import { forwardRef, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ConfettiProps {
  isExploding?: boolean;
  amount?: number;
  rate?: number;
  radius?: number;
  areaWidth?: number;
  areaHeight?: number;
  fallingHeight?: number;
  fallingSpeed?: number;
  colors?: number[];
  enableShadows?: boolean;
  [key: string]: any;
}

interface Boom extends THREE.Object3D {
  life: number;
  dispose: () => void;
}

interface Particle extends THREE.Mesh {
  life: number;
  destination: {
    x: number;
    y: number;
    z: number;
  };
  rotateSpeedX: number;
  rotateSpeedY: number;
  rotateSpeedZ: number;
}

const Confetti = forwardRef<THREE.Mesh, ConfettiProps>(function Confetti(
  {
    isExploding = false,
    amount = 100,
    rate = 3,
    radius = 15,
    areaWidth = 3,
    areaHeight = 1,
    fallingHeight = 10,
    fallingSpeed = 8,
    colors = ["#C4265E", "#8C6BC8", "#86B42B", "#E6DB74"],
    enableShadows = false,
    ...props
  },
  ref
) {
  const localRef = useRef<THREE.Mesh>(null);
  const actualRef = (ref as React.MutableRefObject<THREE.Mesh>) || localRef;
  const [booms, setBooms] = useState<Boom[]>([]);

  rate = rate / 100;
  const geometry = new THREE.PlaneGeometry(0.01, 0.01, 1, 1);

  function explode() {
    const boom = new THREE.Object3D() as Boom;
    boom.life = Math.random() * 5 + 5;
    boom.position.x = -(areaWidth / 2) + areaWidth * Math.random();
    boom.position.y = fallingHeight + areaHeight - fallingSpeed;
    boom.position.z = -(areaWidth / 2) + areaWidth * Math.random();
    actualRef.current.add(boom);
    booms.push(boom);

    for (let i = 0; i < amount; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        side: THREE.DoubleSide,
      });
      var particle = new THREE.Mesh() as Particle;
      particle.geometry = geometry;
      particle.material = material;
      particle.castShadow = enableShadows;
      boom.add(particle);

      particle.life = 1;
      particle.destination = {
        x: (Math.random() - 0.5) * (radius * 2) * Math.random(),
        y: (Math.random() - 0.5) * (radius * 2) * Math.random(),
        z: (Math.random() - 0.5) * (radius * 2) * Math.random(),
      };

      particle.rotation.x = Math.random() * 360;
      particle.rotation.y = Math.random() * 360;
      particle.rotation.z = Math.random() * 360;

      const size = Math.random() * 2 + 1;
      particle.scale.set(size, size, size);

      particle.rotateSpeedX = Math.random() * 0.8 - 0.4;
      particle.rotateSpeedY = Math.random() * 0.8 - 0.4;
      particle.rotateSpeedZ = Math.random() * 0.8 - 0.4;
    }

    boom.dispose = function () {
      for (let i = 0; i < boom.children.length; i++) {
        const particle = boom.children[i] as Particle;
        (particle.material as THREE.MeshBasicMaterial).dispose();
        particle.geometry.dispose();
        boom.remove(particle);
      }
      actualRef.current.remove(boom);
    };
  }

  useFrame(() => {
    if (isExploding && Math.random() < rate) explode();

    for (let i = 0; i < booms.length; i++) {
      const boom = booms[i];

      for (let k = 0; k < boom.children.length; k++) {
        let particle = boom.children[k] as Particle;

        particle.destination.y -= THREE.MathUtils.randFloat(0.1, 0.3);
        particle.life -= THREE.MathUtils.randFloat(0.005, 0.01);

        const speedX = (particle.destination.x - particle.position.x) / 400;
        const speedY = (particle.destination.y - particle.position.y) / 400;
        const speedZ = (particle.destination.z - particle.position.z) / 400;

        particle.position.x += speedX;
        particle.position.y += speedY;
        particle.position.z += speedZ;

        particle.rotation.y += particle.rotateSpeedY;
        particle.rotation.x += particle.rotateSpeedX;
        particle.rotation.z += particle.rotateSpeedZ;

        (particle.material as THREE.MeshBasicMaterial).opacity -=
          THREE.MathUtils.randFloat(0.005, 0.01);

        if (particle.position.y < -fallingHeight) {
          (particle.material as THREE.MeshBasicMaterial).dispose();
          particle.geometry.dispose();
          boom.remove(particle);
        }
      }

      if (boom.children.length <= 0) {
        boom.dispose();
        setBooms(booms.filter((b) => b !== boom));
      }
    }
  });

  return <mesh ref={actualRef} {...props} />;
});

export default Confetti;
