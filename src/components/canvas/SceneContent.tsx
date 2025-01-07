import { EffectComposer, Selection } from "@react-three/postprocessing";
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

export function SceneContent() {
  return (
    <Selection>
      {/* Sky Color */}
      <color attach="background" args={["#1a1a2e"]} />

      {/* Lighting & Post Processing */}
      <EffectComposer multisampling={8} autoClear={false} depthBuffer={true}>
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
  );
}
