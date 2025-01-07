import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { ColorPalette } from "../../utils/colors";

interface Vertex {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
}

export const PlexusScreenSaver = ({
  position,
  scale,
}: {
  position: THREE.Vector3;
  scale: THREE.Vector3;
}) => {
  const SCREEN_SIZE = new THREE.Vector2(42, 23.5);
  const MAX_CONNECTIONS = 4;
  const CONNECTION_DISTANCE = 6;
  const POINT_COUNT = 75;

  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const vertices = useMemo(() => {
    const verts: Vertex[] = [];
    for (let i = 0; i < POINT_COUNT; i++) {
      verts.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * SCREEN_SIZE.x,
          (Math.random() - 0.5) * SCREEN_SIZE.y,
          0
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.05,
          (Math.random() - 0.5) * 0.05,
          0
        ),
      });
    }
    return verts;
  }, []);

  const colorCycle = useRef(0);
  const colors = useMemo(
    () => [ColorPalette.Yellow, ColorPalette.Green, ColorPalette.Pink],
    []
  );

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;

    colorCycle.current += 0.01;
    const baseColorIndex = Math.floor(colorCycle.current % colors.length);
    const nextColorIndex = (baseColorIndex + 1) % colors.length;
    const lerpFactor = colorCycle.current % 1;

    const positions = new Float32Array(POINT_COUNT * 3);
    const linePositions: number[] = [];
    const lineColors: number[] = [];

    vertices.forEach((vertex, i) => {
      vertex.position.add(vertex.velocity);

      if (Math.abs(vertex.position.x) > SCREEN_SIZE.x / 2) {
        vertex.velocity.x *= -1;
      }
      if (Math.abs(vertex.position.y) > SCREEN_SIZE.y / 2) {
        vertex.velocity.y *= -1;
      }

      positions[i * 3] = vertex.position.x;
      positions[i * 3 + 1] = vertex.position.y;
      positions[i * 3 + 2] = 0.01;

      const connections: { vertex: Vertex; distance: number }[] = [];
      vertices.forEach((other) => {
        if (other === vertex) return;
        const distance = vertex.position.distanceTo(other.position);
        if (distance < CONNECTION_DISTANCE) {
          connections.push({ vertex: other, distance });
        }
      });

      connections
        .sort((a, b) => a.distance - b.distance)
        .slice(0, MAX_CONNECTIONS)
        .forEach((connection) => {
          const opacity = Math.max(
            0,
            1 - connection.distance / CONNECTION_DISTANCE
          );

          linePositions.push(
            vertex.position.x,
            vertex.position.y,
            0.01,
            connection.vertex.position.x,
            connection.vertex.position.y,
            0.01
          );

          const color = new THREE.Color(colors[baseColorIndex]).lerp(
            new THREE.Color(colors[nextColorIndex]),
            lerpFactor
          );

          lineColors.push(
            color.r * opacity,
            color.g * opacity,
            color.b * opacity,
            color.r * opacity,
            color.g * opacity,
            color.b * opacity
          );
        });
    });

    pointsRef.current.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    linesRef.current.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(linePositions), 3)
    );
    linesRef.current.geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(lineColors), 3)
    );
  });

  return (
    <group position={position} scale={scale} raycast={() => null}>
      <mesh>
        <planeGeometry args={[SCREEN_SIZE.x, SCREEN_SIZE.y]} />
        <meshToonMaterial color={ColorPalette.DarkBlack} />
      </mesh>

      <points ref={pointsRef} raycast={() => null} visible={false} />

      <lineSegments ref={linesRef} raycast={() => null}>
        <bufferGeometry />
        <lineBasicMaterial vertexColors={true} transparent={true} opacity={1} />
      </lineSegments>
    </group>
  );
};

interface Column {
  x: number;
  chars: {
    y: number;
    char: string;
    speed: number;
    materialRef: THREE.MeshBasicMaterial | null;
  }[];
}

export const MatrixScreenSaver = ({
  position,
  scale,
}: {
  position: THREE.Vector3;
  scale: THREE.Vector3;
}) => {
  const SCREEN_SIZE = new THREE.Vector2(42, 23.5);
  const COLUMN_COUNT = 25;
  const CHARS_PER_COLUMN = 12;
  const MIN_SPEED = 0.05;
  const MAX_SPEED = 0.2;

  const columnsRef = useRef<Column[]>([]);
  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const characters = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";

  const columns = useMemo(() => {
    const cols: Column[] = [];
    for (let i = 0; i < COLUMN_COUNT; i++) {
      const col: Column = {
        x: (i - COLUMN_COUNT / 2) * (SCREEN_SIZE.x / COLUMN_COUNT),
        chars: Array.from({ length: CHARS_PER_COLUMN }, (_, j) => ({
          y: SCREEN_SIZE.y / 2 - j * 1.5,
          char: characters[Math.floor(Math.random() * characters.length)],
          speed: MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED),
          materialRef: null,
        })),
      };
      cols.push(col);
    }
    return cols;
  }, []);

  const colorCycle = useRef(0);
  const colors = useMemo(
    () => [ColorPalette.Green, ColorPalette.Pink, ColorPalette.Yellow],
    []
  );

  useEffect(() => {
    columnsRef.current = columns;
  }, [columns]);

  useFrame(() => {
    colorCycle.current += 0.01;
    const baseColorIndex = Math.floor(colorCycle.current % colors.length);
    const nextColorIndex = (baseColorIndex + 1) % colors.length;
    const lerpFactor = colorCycle.current % 1;

    columnsRef.current.forEach((column, colIdx) => {
      column.chars.forEach((char, charIdx) => {
        if (!char.materialRef) return;

        char.y -= char.speed;
        if (char.y < -SCREEN_SIZE.y / 2) {
          char.y = SCREEN_SIZE.y / 2;
          char.char = characters[Math.floor(Math.random() * characters.length)];
        }

        const group = groupRefs.current[colIdx * CHARS_PER_COLUMN + charIdx];
        if (group) {
          group.position.y = char.y;
        }

        const opacity = 1 - charIdx / CHARS_PER_COLUMN;
        const color = new THREE.Color(colors[baseColorIndex]).lerp(
          new THREE.Color(colors[nextColorIndex]),
          lerpFactor
        );

        char.materialRef.color = color;
        char.materialRef.opacity = opacity;
      });
    });
  });

  return (
    <group position={position} scale={scale}>
      <mesh>
        <planeGeometry args={[SCREEN_SIZE.x, SCREEN_SIZE.y]} />
        <meshToonMaterial color={ColorPalette.DarkBlack} />
      </mesh>

      {columns.map((column, i) => (
        <group key={i} position={[column.x, 0, 0.01]}>
          {column.chars.map((char, j) => (
            <group
              key={j}
              ref={(el) => (groupRefs.current[i * CHARS_PER_COLUMN + j] = el)}
              position={[0, char.y, 0]}
            >
              <Text
                anchorX="center"
                anchorY="middle"
                font={"/fonts/NotoSansJP.ttf"}
                fontSize={1.2}
              >
                {char.char}
                <meshBasicMaterial
                  ref={(material) => {
                    if (material) char.materialRef = material;
                  }}
                  transparent
                  color={colors[i % colors.length]}
                />
              </Text>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
};
