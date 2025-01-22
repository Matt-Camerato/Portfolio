import { useRef, useState } from "react";
import { Select } from "@react-three/postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { useFocus } from "../../context/FocusContext";
import { useFocusable } from "../../../hooks/useFocusable";
import { ColorPalette } from "../../../utils/colors";
import { ContactForm } from "../../ui/ContactForm";

//position and rotation of envelope on desk
const DEFAULT_POSITION = new THREE.Vector3(-2.945, 1.174, -1.87);
const DEFAULT_ROTATION = new THREE.Euler(-1, 1.2, 0.95);

export function Envelope() {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const { setInteractState } = useFocus();

  const envelopeRef = useRef<THREE.Group>(null);
  const flapRef = useRef<THREE.Group>(null);
  const paperRef = useRef<THREE.Group>(null);

  const handleEnvelopeOpen = () => {
    if (
      !envelopeOpen &&
      flapRef.current &&
      envelopeRef.current &&
      paperRef.current
    ) {
      setInteractState(0);

      gsap.to(flapRef.current.rotation, {
        x: -Math.PI,
        duration: 1,
        ease: "power2.inOut",
      });
      gsap.to(flapRef.current.position, {
        z: 0,
        duration: 1,
        ease: "power2.inOut",
      });
      gsap.to(paperRef.current.scale, {
        y: 2,
        duration: 1,
        delay: 1,
        ease: "power2.inOut",
      });
      gsap.to(envelopeRef.current.position, {
        y: -1,
        duration: 2,
        delay: 1,
        ease: "power2.inOut",
        onComplete: () => {
          setEnvelopeOpen(true);
          setInteractState(1);
        },
      });
    }
  };

  const handleEnvelopeClose = () => {
    setEnvelopeOpen(false);

    gsap.to(paperRef.current!.scale, {
      y: 1,
      duration: 0.5,
      delay: 0.2,
      ease: "power2.inOut",
    });

    gsap.to(envelopeRef.current!.position, {
      y: 0,
      duration: 0.7,
      ease: "power2.inOut",
    });

    gsap.to(flapRef.current!.rotation, {
      x: 0,
      duration: 0.2,
      ease: "power2.inOut",
      delay: 0.6,
    });
    gsap.to(flapRef.current!.position, {
      z: 0.006,
      duration: 0.2,
      ease: "power2.inOut",
      delay: 0.6,
    });
  };

  const { isHovered, pulseIntensity, focusableProps } = useFocusable({
    id: "envelope",
    tooltipContent: "Contact",
    defaultPosition: DEFAULT_POSITION,
    defaultRotation: DEFAULT_ROTATION,
    transition: {
      type: "OBJECT_TO_CAMERA",
      targetOffset: new THREE.Vector3(0, 0, 0.4),
    },
    onFocusStart: () => {
      handleEnvelopeOpen();
    },
    onFocusEnd: () => {
      handleEnvelopeClose();
    },
    actions: new Map([["focus-envelope", () => null]]),
  });

  return (
    <Select enabled={isHovered || pulseIntensity > 0}>
      <group
        name="envelope"
        position={DEFAULT_POSITION}
        rotation={DEFAULT_ROTATION}
        {...focusableProps}
      >
        <group ref={envelopeRef}>
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
                    0, //bottom right
                    -0.2,
                    0,
                    0, //bottom left
                    0,
                    0.15,
                    0, //top center
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
                    0, //bottom left
                    -0.2,
                    0.13,
                    0, //top left
                    0,
                    0,
                    0, //center
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
                    0, //top right
                    0.2,
                    -0.13,
                    0, //bottom right
                    0,
                    0,
                    0, //center
                  ])
                }
                count={3}
                itemSize={3}
              />
            </bufferGeometry>
            <meshToonMaterial color={"#D8D8CF"} side={THREE.DoubleSide} />
          </mesh>

          {/* Envelope flap */}
          <group
            name="envelope-flap"
            ref={flapRef}
            position={[0, 0.13, 0.006]}
            rotation={[0, 0, 0]}
          >
            {/* Convert to a very thin box instead of */}
            <mesh rotation={[Math.PI, 0, 0]}>
              <polyhedronGeometry
                args={[
                  [
                    -2,
                    0,
                    0, //back left
                    2,
                    0,
                    0, //back center
                    0,
                    4,
                    0, //back right
                    2,
                    0,
                    -0.001, //back bottom right
                    -2,
                    0,
                    -0.001, //back bottom left
                    0,
                    4,
                    -0.001, //back top center
                  ],
                  [0, 1, 2, 3, 4, 5],
                  0.2,
                  0,
                ]}
              />
              <meshToonMaterial color={ColorPalette.White} />
            </mesh>
          </group>
        </group>

        {/* Contact form */}
        <ContactForm paperRef={paperRef} envelopeOpen={envelopeOpen} />
      </group>
    </Select>
  );
}
