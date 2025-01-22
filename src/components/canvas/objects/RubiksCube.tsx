import * as THREE from "three";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { Select } from "@react-three/postprocessing";
import { useFocusable } from "../../../hooks/useFocusable";
import { useFocus } from "../../context/FocusContext";
import { ColorPalette } from "../../../utils/colors";
import Confetti from "../../../effects/Confetti";

type Face = "F" | "B" | "L" | "R" | "U" | "D";
interface Cubie {
  position: THREE.Vector3;
  faces: CubieFaces;
  rotation: THREE.Quaternion;
}
interface CubieFaces {
  F: string | null;
  B: string | null;
  L: string | null;
  R: string | null;
  U: string | null;
  D: string | null;
}
interface DragState {
  startPoint: THREE.Vector2;
  clickedFace: Face | null;
  intersectionPoint: THREE.Vector3 | null;
}

//position and rotation of cube on desk
const DEFAULT_POSITION = new THREE.Vector3(-3.15, 1.135, -1.2);
const DEFAULT_ROTATION = new THREE.Euler(0, 0.5, 0);

const CUBIE_SIZE = 0.06;
const GAP = 0.001;
const CUBE_COLORS = {
  F: ColorPalette.Pink,
  B: ColorPalette.Orange,
  L: ColorPalette.Green,
  R: ColorPalette.Blue,
  U: ColorPalette.Yellow,
  D: ColorPalette.White,
};
const DRAG_THRESHOLD = 10;

export const RubiksCube = () => {
  const { focusConfig } = useFocus();
  const {
    objectRef,
    isHovered,
    isSelfFocused,
    pulseIntensity,
    focusableProps,
  } = useFocusable({
    id: "rubiksCube",
    tooltipContent: "Rubiks Cube",
    defaultPosition: DEFAULT_POSITION,
    defaultRotation: DEFAULT_ROTATION,
    transition: {
      type: "OBJECT_TO_CAMERA",
      targetOffset: new THREE.Vector3(0, 0, 0.5),
    },
    canRotate: true,
    onFocusStart: () => null,
    onFocusEnd: () => null,
    actions: new Map([["shuffle", () => shuffle()]]),
  });
  const { camera } = useThree();

  const confettiGroupRef = useRef<THREE.Group>(null);

  const generateCubies = (): Cubie[] => {
    const cubies: Cubie[] = [];

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const position = new THREE.Vector3(
            x * (CUBIE_SIZE + GAP),
            y * (CUBIE_SIZE + GAP),
            z * (CUBIE_SIZE + GAP)
          );

          const faces: CubieFaces = {
            F: null,
            B: null,
            L: null,
            R: null,
            U: null,
            D: null,
          };

          if (x === 1) faces.R = CUBE_COLORS.R;
          if (x === -1) faces.L = CUBE_COLORS.L;
          if (y === 1) faces.U = CUBE_COLORS.U;
          if (y === -1) faces.D = CUBE_COLORS.D;
          if (z === 1) faces.F = CUBE_COLORS.F;
          if (z === -1) faces.B = CUBE_COLORS.B;

          cubies.push({ position, faces, rotation: new THREE.Quaternion() });
        }
      }
    }
    return cubies;
  };
  const [cubies, setCubies] = useState<Cubie[]>(() => generateCubies());
  const [dragState, setDragState] = useState<DragState>({
    startPoint: new THREE.Vector2(),
    clickedFace: null,
    intersectionPoint: null,
  });
  const [isRotating, setIsRotating] = useState(false);
  const [randomMoves, setRandomMoves] = useState<number>(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [confettiTime, setConfettiTime] = useState<number>(0);

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!objectRef.current) return;
    e.stopPropagation();

    //get the local position of the click
    const localPoint = objectRef.current.worldToLocal(e.point.clone());

    //get the face that was clicked
    const clickedFace = getClickedFace(localPoint);

    setDragState({
      startPoint: new THREE.Vector2(e.clientX, e.clientY),
      clickedFace,
      intersectionPoint: localPoint,
    });
  };

  const getClickedFace = (localPoint: THREE.Vector3): Face => {
    const absX = Math.abs(localPoint.x);
    const absY = Math.abs(localPoint.y);
    const absZ = Math.abs(localPoint.z);

    if (absX > absY && absX > absZ) {
      return localPoint.x > 0 ? "R" : "L";
    } else if (absY > absX && absY > absZ) {
      return localPoint.y > 0 ? "U" : "D";
    } else if (absZ > absX && absZ > absY) {
      return localPoint.z > 0 ? "F" : "B";
    } else {
      console.log("Could not determine face clicked");
      return "F";
    }
  };

  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (
      !objectRef.current ||
      !dragState.clickedFace ||
      !dragState.intersectionPoint ||
      isRotating
    )
      return;
    e.stopPropagation();

    const deltaX = e.clientX - dragState.startPoint.x;
    const deltaY = e.clientY - dragState.startPoint.y;

    //only process if the mouse has moved more than the threshold
    if (
      Math.abs(deltaX) < DRAG_THRESHOLD &&
      Math.abs(deltaY) < DRAG_THRESHOLD
    ) {
      setDragState({
        startPoint: new THREE.Vector2(),
        clickedFace: null,
        intersectionPoint: null,
      });
      return;
    }

    //determine the direction of the drag relative to the current rotation of the cube
    const dragVector = new THREE.Vector3(deltaX, -deltaY, 0);
    const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(
      camera.quaternion
    );
    const cameraUp = new THREE.Vector3(0, 1, 0).applyQuaternion(
      camera.quaternion
    );

    //project drag vector onto camera plane
    const projectedDrag = new THREE.Vector3()
      .addScaledVector(cameraRight, dragVector.x)
      .addScaledVector(cameraUp, dragVector.y);

    //transform drag vector to cube space
    const localDrag = projectedDrag
      .clone()
      .applyQuaternion(objectRef.current.quaternion.clone().invert());

    const { axis, clockwise } = getDragRotation(
      dragState.clickedFace,
      localDrag
    );
    const cubiesToRotate = getCubiesToRotate(
      axis,
      dragState.intersectionPoint,
      cubies
    );

    //animate rotation
    if (cubiesToRotate.length > 0) {
      rotateCubies(cubiesToRotate, axis, clockwise);
    }

    setDragState({
      startPoint: new THREE.Vector2(),
      clickedFace: null,
      intersectionPoint: null,
    });
  };

  const getDragRotation = (face: Face, localDrag: THREE.Vector3) => {
    const absX = Math.abs(localDrag.x);
    const absY = Math.abs(localDrag.y);
    const absZ = Math.abs(localDrag.z);

    switch (face) {
      case "F":
      case "B":
        if (absX > absY) {
          return {
            axis: new THREE.Vector3(0, 1, 0),
            clockwise: face === "F" ? localDrag.x > 0 : localDrag.x < 0,
          };
        } else {
          return {
            axis: new THREE.Vector3(1, 0, 0),
            clockwise: face === "F" ? localDrag.y < 0 : localDrag.y > 0,
          };
        }
      case "L":
      case "R":
        if (absY > absZ) {
          return {
            axis: new THREE.Vector3(0, 0, 1),
            clockwise: face === "R" ? localDrag.y > 0 : localDrag.y < 0,
          };
        } else {
          return {
            axis: new THREE.Vector3(0, 1, 0),
            clockwise: face === "R" ? localDrag.z < 0 : localDrag.z > 0,
          };
        }
      case "U":
      case "D":
        if (absX > absZ) {
          return {
            axis: new THREE.Vector3(0, 0, 1),
            clockwise: face === "D" ? localDrag.x > 0 : localDrag.x < 0,
          };
        } else {
          return {
            axis: new THREE.Vector3(1, 0, 0),
            clockwise: face === "D" ? localDrag.z < 0 : localDrag.z > 0,
          };
        }
    }
  };

  const getRandomRotation = (face: Face) => {
    const localDrag = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    );

    const absX = Math.abs(localDrag.x);
    const absY = Math.abs(localDrag.y);
    const absZ = Math.abs(localDrag.z);

    switch (face) {
      case "F":
      case "B":
        if (absX > absY) {
          return {
            axis: new THREE.Vector3(0, 1, 0),
            clockwise: face === "F" ? localDrag.x > 0 : localDrag.x < 0,
          };
        } else {
          return {
            axis: new THREE.Vector3(1, 0, 0),
            clockwise: face === "F" ? localDrag.y < 0 : localDrag.y > 0,
          };
        }
      case "L":
      case "R":
        if (absY > absZ) {
          return {
            axis: new THREE.Vector3(0, 0, 1),
            clockwise: face === "R" ? localDrag.y > 0 : localDrag.y < 0,
          };
        } else {
          return {
            axis: new THREE.Vector3(0, 1, 0),
            clockwise: face === "R" ? localDrag.z < 0 : localDrag.z > 0,
          };
        }
      case "U":
      case "D":
        if (absX > absZ) {
          return {
            axis: new THREE.Vector3(0, 0, 1),
            clockwise: face === "D" ? localDrag.x > 0 : localDrag.x < 0,
          };
        } else {
          return {
            axis: new THREE.Vector3(1, 0, 0),
            clockwise: face === "D" ? localDrag.z < 0 : localDrag.z > 0,
          };
        }
    }
  };

  const getCubiesToRotate = (
    rotationAxis: THREE.Vector3,
    intersectionPoint: THREE.Vector3,
    cubies: Cubie[]
  ) => {
    //get grid coordinates of clicked cubie
    const gridPoint = new THREE.Vector3(
      Math.round(intersectionPoint.x / (CUBIE_SIZE + GAP)) + 1,
      Math.round(intersectionPoint.y / (CUBIE_SIZE + GAP)) + 1,
      Math.round(intersectionPoint.z / (CUBIE_SIZE + GAP)) + 1
    );

    if (rotationAxis.x === 1) {
      return cubies.filter(
        (cubie) =>
          Math.round(cubie.position.x / (CUBIE_SIZE + GAP)) + 1 === gridPoint.x
      );
    } else if (rotationAxis.y === 1) {
      return cubies.filter(
        (cubie) =>
          Math.round(cubie.position.y / (CUBIE_SIZE + GAP)) + 1 === gridPoint.y
      );
    } else {
      return cubies.filter(
        (cubie) =>
          Math.round(cubie.position.z / (CUBIE_SIZE + GAP)) + 1 === gridPoint.z
      );
    }
  };

  const rotateCubies = (
    cubiesToRotate: Cubie[],
    rotationAxis: THREE.Vector3,
    clockwise: boolean
  ): Promise<void> => {
    if (!objectRef.current) return Promise.resolve();
    setIsRotating(true);

    return new Promise((resolve) => {
      //determine angle from clockwise boolean
      const angle = (clockwise ? 1 : -1) * (Math.PI / 2);

      //get meshes of cubies to rotate
      const meshes = cubiesToRotate
        .map((cubie) =>
          objectRef.current!.children.find((child) =>
            child.position.equals(cubie.position)
          )
        )
        .filter((mesh): mesh is THREE.Object3D => mesh !== undefined);

      //create temp group for rotation
      const rotationGroup = new THREE.Group();
      objectRef.current!.add(rotationGroup);

      //add cubies to group while preserving world pos
      meshes.forEach((mesh) => {
        const worldPos = mesh.getWorldPosition(new THREE.Vector3());
        rotationGroup.attach(mesh);
        mesh.position.copy(rotationGroup.worldToLocal(worldPos));
      });

      //animate rotation
      gsap.to(rotationGroup.rotation, {
        x: rotationAxis.x * angle,
        y: rotationAxis.y * angle,
        z: rotationAxis.z * angle,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          //update cubies
          const updatedCubies = updateCubies(meshes, rotationAxis, clockwise);
          setCubies(updatedCubies);

          //return cubies to main group while preserving world pos
          meshes.forEach((mesh) => {
            const worldPos = mesh.getWorldPosition(new THREE.Vector3());
            objectRef.current!.attach(mesh);
            mesh.position.copy(objectRef.current!.worldToLocal(worldPos));
          });

          //remove rotation group
          objectRef.current!.remove(rotationGroup);

          //reset mesh rotations
          meshes.forEach((mesh) => {
            mesh.quaternion.set(0, 0, 0, 1);
          });

          //check if cube is solved
          if (isSolved(updatedCubies) && isShuffled && randomMoves === 0) {
            setConfettiTime(3000);
            setIsShuffled(false);
          }

          resolve();
          setIsRotating(false);
        },
      });
    });
  };

  const rotateFaces = (
    faces: CubieFaces,
    rotation: THREE.Vector3
  ): CubieFaces => {
    var newFaces = { ...faces };
    var order: Face[] = [];

    if (rotation.x === 1) order = ["F", "U", "B", "D"];
    else if (rotation.x === -1) order = ["F", "D", "B", "U"];
    else if (rotation.y === 1) order = ["F", "L", "B", "R"];
    else if (rotation.y === -1) order = ["F", "R", "B", "L"];
    else if (rotation.z === 1) order = ["U", "R", "D", "L"];
    else if (rotation.z === -1) order = ["U", "L", "D", "R"];

    return updateColors(newFaces, order);
  };

  const updateColors = (colors: CubieFaces, order: Face[]): CubieFaces => {
    const newColors = { ...colors };
    const temp = newColors[order[0]];
    for (let i = 0; i < order.length - 1; i++) {
      newColors[order[i]] = newColors[order[i + 1]];
    }
    newColors[order[order.length - 1]] = temp;
    return newColors;
  };

  const updateCubies = (
    meshes: THREE.Object3D[],
    axis: THREE.Vector3,
    clockwise: boolean
  ): Cubie[] => {
    const rotation = axis.multiplyScalar(clockwise ? 1 : -1);

    const updatedCubies = cubies.map((cubie) => {
      const mesh = meshes.find((m) => {
        const roundedMeshPos = new THREE.Vector3(
          Math.round(m.position.x * 1000) / 1000,
          Math.round(m.position.y * 1000) / 1000,
          Math.round(m.position.z * 1000) / 1000
        );
        return roundedMeshPos.equals(cubie.position);
      });
      if (!mesh) return cubie;

      //get updated position and round values
      const newWorldPos = mesh.getWorldPosition(new THREE.Vector3());
      const newLocalPos = objectRef.current!.worldToLocal(newWorldPos);
      newLocalPos.x =
        Math.round(newLocalPos.x / (CUBIE_SIZE + GAP)) * (CUBIE_SIZE + GAP);
      newLocalPos.y =
        Math.round(newLocalPos.y / (CUBIE_SIZE + GAP)) * (CUBIE_SIZE + GAP);
      newLocalPos.z =
        Math.round(newLocalPos.z / (CUBIE_SIZE + GAP)) * (CUBIE_SIZE + GAP);

      //update cubie faces
      const updatedFaces = rotateFaces(cubie.faces, rotation);

      return {
        position: newLocalPos,
        faces: updatedFaces,
        rotation: cubie.rotation,
      };
    });

    return updatedCubies;
  };

  const isSolved = (cubies: Cubie[]): boolean => {
    const getFaceCubies = (face: Face): Cubie[] => {
      switch (face) {
        case "F":
          return cubies.filter(
            (c) => Math.abs(c.position.z - (CUBIE_SIZE + GAP)) < 0.001
          );
        case "B":
          return cubies.filter(
            (c) => Math.abs(c.position.z + (CUBIE_SIZE + GAP)) < 0.001
          );
        case "L":
          return cubies.filter(
            (c) => Math.abs(c.position.x + (CUBIE_SIZE + GAP)) < 0.001
          );
        case "R":
          return cubies.filter(
            (c) => Math.abs(c.position.x - (CUBIE_SIZE + GAP)) < 0.001
          );
        case "U":
          return cubies.filter(
            (c) => Math.abs(c.position.y - (CUBIE_SIZE + GAP)) < 0.001
          );
        case "D":
          return cubies.filter(
            (c) => Math.abs(c.position.y + (CUBIE_SIZE + GAP)) < 0.001
          );
      }
    };

    const faces: Face[] = ["F", "B", "L", "R", "U", "D"];
    for (const face of faces) {
      const faceCubies = getFaceCubies(face);
      if (faceCubies.length !== 9) return false;

      const firstColor = faceCubies[0].faces[face];
      const sameColor = faceCubies.every(
        (cubie) => cubie.faces[face] === firstColor
      );

      if (!sameColor) return false;
    }

    return true;
  };

  const generateRandomMove = (): {
    cubiesToRotate: Cubie[];
    axis: THREE.Vector3;
    clockwise: boolean;
  } => {
    const faces = ["F", "B", "L", "R", "U", "D"];
    const face = faces[Math.floor(Math.random() * faces.length)];
    const { axis, clockwise } = getRandomRotation(face as Face);

    const randomPoint = generateRandomPointOnFace(face as Face);
    const cubiesToRotate = getCubiesToRotate(axis, randomPoint, cubies);

    return { cubiesToRotate, axis, clockwise };
  };

  const generateRandomPointOnFace = (face: Face): THREE.Vector3 => {
    const getRandomCoord = () =>
      (Math.floor(Math.random() * 3) - 1) * (CUBIE_SIZE + GAP);

    const randomPoint = new THREE.Vector3();

    switch (face) {
      case "F":
        randomPoint.set(getRandomCoord(), getRandomCoord(), CUBIE_SIZE + GAP);
        break;
      case "B":
        randomPoint.set(
          getRandomCoord(),
          getRandomCoord(),
          -(CUBIE_SIZE + GAP)
        );
        break;
      case "L":
        randomPoint.set(
          -(CUBIE_SIZE + GAP),
          getRandomCoord(),
          getRandomCoord()
        );
        break;
      case "R":
        randomPoint.set(CUBIE_SIZE + GAP, getRandomCoord(), getRandomCoord());
        break;
      case "U":
        randomPoint.set(getRandomCoord(), CUBIE_SIZE + GAP, getRandomCoord());
        break;
      case "D":
        randomPoint.set(
          getRandomCoord(),
          -(CUBIE_SIZE + GAP),
          getRandomCoord()
        );
        break;
    }

    return randomPoint;
  };

  const shuffle = () => {
    setRandomMoves(25);
    setIsShuffled(true);
  };

  //shuffle cube if randomMoves > 0
  useEffect(() => {
    if (isRotating) return;

    if (randomMoves > 0) {
      const { cubiesToRotate, axis, clockwise } = generateRandomMove();
      rotateCubies(cubiesToRotate, axis, clockwise);
      setRandomMoves((prev) => prev - 1);
    }
  }, [randomMoves, isRotating]);

  //stop shuffling and remove confetti when cube is not focused
  useEffect(() => {
    if (!focusConfig) {
      if (randomMoves > 0) setRandomMoves(0);
      if (confettiTime > 0) setConfettiTime(0);
    }
  }, [focusConfig]);

  useEffect(() => {
    if (!objectRef.current || !confettiGroupRef.current) return;

    if (confettiTime > 0) {
      confettiGroupRef.current.position.copy(objectRef.current.position);
      setConfettiTime((prev) => prev - 1);
    }
  }, [confettiTime]);

  return (
    <>
      <Select enabled={isHovered || pulseIntensity > 0}>
        <group
          name="rubiksCube"
          position={DEFAULT_POSITION}
          rotation={DEFAULT_ROTATION}
          {...focusableProps}
          {...(isSelfFocused && {
            onPointerDown: onPointerDown,
            onPointerUp: onPointerUp,
          })}
        >
          {cubies.map((cubie, index) => (
            <Cubie key={index} {...cubie} />
          ))}
        </group>
      </Select>
      <group ref={confettiGroupRef}>
        <Confetti
          isExploding={confettiTime > 0}
          amount={50}
          rate={3}
          radius={4}
          areaWidth={1}
          areaHeight={0.5}
          fallingHeight={2}
          fallingSpeed={1}
        />
      </group>
    </>
  );
};

const Cubie = ({ position, faces }: Cubie) => {
  const materials = [
    new THREE.MeshToonMaterial({ color: faces.R || ColorPalette.Black }),
    new THREE.MeshToonMaterial({ color: faces.L || ColorPalette.Black }),
    new THREE.MeshToonMaterial({ color: faces.U || ColorPalette.Black }),
    new THREE.MeshToonMaterial({ color: faces.D || ColorPalette.Black }),
    new THREE.MeshToonMaterial({ color: faces.F || ColorPalette.Black }),
    new THREE.MeshToonMaterial({ color: faces.B || ColorPalette.Black }),
  ];

  return (
    <mesh name="cubie" position={position}>
      <boxGeometry args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE]} />
      {materials.map((material, index) => (
        <primitive key={index} object={material} attach={`material-${index}`} />
      ))}
    </mesh>
  );
};
