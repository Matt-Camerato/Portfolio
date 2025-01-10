import { Canvas } from "@react-three/fiber";
import { EffectComposer, Selection } from "@react-three/postprocessing";
import { Overlay } from "../ui/Overlay";
import { CameraControls } from "./CameraControls";
import { Environment } from "./Environment";
import { PostProcessing } from "./PostProcessing";
import {
  Candle,
  Clock,
  Computer,
  Controller,
  Diploma,
  GithubFrame,
  ItchFrame,
  LinkedInFrame,
  Monitor1,
  Monitor2,
  Workspace,
} from "./models";
import { Envelope, Resume, RubiksCube } from "./objects";

export function Scene() {
  return (
    <div
      style={{
        width: "100vw",
        height: "calc(100vh - 64px)",
        marginTop: "64px",
      }}
    >
      <Canvas camera={{ position: [0, 2, 1.5], fov: 75 }} shadows>
        <CameraControls />
        <Overlay />
        <Selection>
          {/* Sky Color */}
          <color attach="background" args={["#1a1a2e"]} />

          {/* Lighting & Post Processing */}
          <EffectComposer
            multisampling={8}
            autoClear={false}
            depthBuffer={true}
          >
            <Environment />
            <PostProcessing />
          </EffectComposer>

          {/* Static Objects */}
          <Candle />
          <Clock />
          <Computer />
          <Controller />
          <Workspace />

          {/* Interactable Objects */}
          <Diploma />
          <Envelope />
          <GithubFrame />
          <ItchFrame />
          <LinkedInFrame />
          <Monitor1 />
          <Monitor2 />
          <Resume />
          <RubiksCube />
        </Selection>
      </Canvas>
    </div>
  );
}
