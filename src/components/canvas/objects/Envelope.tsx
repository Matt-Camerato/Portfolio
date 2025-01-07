import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Select } from "@react-three/postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { useInteraction } from "../../../hooks/useInteraction";
import { useFocus } from "../../context/FocusContext";
import { useOverlay } from "../../context/OverlayContext";
import { ColorPalette } from "../../../utils/colors";

//position and rotation of envelope on desk
const DEFAULT_POSITION = new THREE.Vector3(-2.945, 1.174, -1.87);
const DEFAULT_ROTATION = new THREE.Euler(-1, 1.2, 0.95);

export function Envelope() {
  const { isHovered, setIsHovered, pulseIntensity, interactionHandlers } =
    useInteraction();
  const { isFocused, setFocus, setCanClose } = useFocus();
  const { camera } = useThree();
  const { isOpen, setActions, setShowContactForm } = useOverlay();

  const groupRef = useRef<THREE.Group>(null);
  const envelopeRef = useRef<THREE.Group>(null);
  const flapRef = useRef<THREE.Mesh>(null);
  const paperRef = useRef<THREE.Mesh>(null);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  const handleClick = () => {
    if (!groupRef.current) return;

    setIsHovered(false);
    setFocus(groupRef.current, DEFAULT_POSITION, DEFAULT_ROTATION, false);

    const targetDistance = 0.4;
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
    });

    gsap.to(groupRef.current.rotation, {
      x: targetRotation.x,
      y: targetRotation.y,
      z: targetRotation.z,
      duration: 1,
      ease: "power2.inOut",
    });
  };

  const handleEnvelopeClick = () => {
    if (
      !envelopeOpen &&
      flapRef.current &&
      envelopeRef.current &&
      paperRef.current
    ) {
      setEnvelopeOpen(true);
      setCanClose(false);

      gsap.to(flapRef.current.rotation, {
        x: 0,
        duration: 1,
        ease: "power2.inOut",
      });
      gsap.to(flapRef.current.position, {
        z: 0,
        duration: 1,
        ease: "power2.inOut",
      });

      gsap.to(envelopeRef.current.position, {
        y: -1,
        duration: 2,
        delay: 1,
        ease: "power2.inOut",
      });
      gsap.to(paperRef.current.scale, {
        y: 2,
        duration: 1,
        delay: 1,
        ease: "power2.inOut",
        onComplete: () => {
          setCanClose(true);
          setShowContactForm(true);
        },
      });
    }
  };

  const closeEnvelope = () => {
    if (
      envelopeOpen &&
      flapRef.current &&
      envelopeRef.current &&
      paperRef.current
    ) {
      gsap.to(paperRef.current.scale, {
        y: 1,
        duration: 0.5,
        delay: 0.2,
        ease: "power2.inOut",
      });

      gsap.to(envelopeRef.current.position, {
        y: 0,
        duration: 0.7,
        ease: "power2.inOut",
      });

      gsap.to(flapRef.current.rotation, {
        x: Math.PI,
        duration: 0.2,
        ease: "power2.inOut",
        delay: 0.6,
      });
      gsap.to(flapRef.current.position, {
        z: 0.006,
        duration: 0.2,
        ease: "power2.inOut",
        delay: 0.6,
        onComplete: () => {
          setEnvelopeOpen(false);
        },
      });
    }
  };

  useEffect(() => {
    if (!isOpen && envelopeOpen) {
      closeEnvelope();
      setShowContactForm(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (groupRef.current) {
      setActions((prev) => ({ ...prev, contact: handleClick }));
    }
  }, [groupRef, isFocused]);

  return (
    <>
      <group
        ref={groupRef}
        position={DEFAULT_POSITION}
        rotation={DEFAULT_ROTATION}
        {...interactionHandlers}
        {...(!isFocused
          ? { onClick: handleClick }
          : { onClick: handleEnvelopeClick })}
      >
        <Select enabled={isHovered || pulseIntensity > 0}>
          <group ref={envelopeRef} name="Envelope">
            {/* Envelope body */}
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[0.4, 0.26]} />
              <meshToonMaterial color={ColorPalette.DarkWhite} />
            </mesh>

            <mesh position={[0, -0.13, 0.003]}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  array={
                    new Float32Array([
                      0.2,
                      0,
                      0, // Bottom right
                      -0.2,
                      0,
                      0, // Bottom left
                      0,
                      0.15,
                      0, // Top center
                    ])
                  }
                  count={3}
                  itemSize={3}
                />
              </bufferGeometry>
              <meshToonMaterial
                color={ColorPalette.White}
                side={THREE.DoubleSide}
              />
            </mesh>

            <mesh position={[0, 0, 0.002]}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  array={
                    new Float32Array([
                      -0.2,
                      -0.13,
                      0, // Bottom left
                      -0.2,
                      0.13,
                      0, // Top left
                      0,
                      0,
                      0, // Center
                    ])
                  }
                  count={3}
                  itemSize={3}
                />
              </bufferGeometry>
              <meshToonMaterial color={"#D8D8CF"} side={THREE.DoubleSide} />
            </mesh>

            <mesh position={[0, 0, 0.002]}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  array={
                    new Float32Array([
                      0.2,
                      0.13,
                      0, // Top right
                      0.2,
                      -0.13,
                      0, // Bottom right
                      0,
                      0,
                      0, // Center
                    ])
                  }
                  count={3}
                  itemSize={3}
                />
              </bufferGeometry>
              <meshToonMaterial color={"#D8D8CF"} side={THREE.DoubleSide} />
            </mesh>

            {/* Envelope flap */}
            <mesh
              ref={flapRef}
              position={[0, 0.13, 0.006]}
              rotation={[Math.PI, 0, 0]}
            >
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  array={
                    new Float32Array([
                      -0.2,
                      0,
                      0, // Bottom left
                      0.2,
                      0,
                      0, // Bottom right
                      0,
                      0.15,
                      0, // Top center
                    ])
                  }
                  count={3}
                  itemSize={3}
                />
              </bufferGeometry>
              <meshToonMaterial
                color={ColorPalette.BrightWhite}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>

          {/* Paper with contact form */}
          <mesh ref={paperRef} name="ContactForm" position={[0, 0, 0.001]}>
            <planeGeometry args={[0.35, 0.25]} />
            <meshToonMaterial color={ColorPalette.White} />
          </mesh>
        </Select>
      </group>
    </>
  );
}
