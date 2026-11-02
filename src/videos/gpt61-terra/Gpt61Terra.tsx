import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Background, Captions, PreviewBadge, ProgressBar, SceneWords } from "../../components/kit";
import type { TimedScene, VideoProps } from "../../lib/timing";
import { SCENE_VISUALS } from "./scenes";

const SceneShell: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const Visual = SCENE_VISUALS[scene.id];
  // short fade at each cut so scenes don't snap
  const fadeIn = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [scene.durationInFrames - 4, scene.durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
        <SceneWords.Provider value={scene.words}>{Visual ? <Visual /> : null}</SceneWords.Provider>
      </AbsoluteFill>
      <Captions words={scene.words} />
      {scene.audio ? <Audio src={staticFile(scene.audio)} /> : null}
    </AbsoluteFill>
  );
};

export const Gpt61Terra: React.FC<VideoProps> = ({ scenes, preview }) => {
  let from = 0;
  const total = scenes.reduce((n, s) => n + s.durationInFrames, 0) || 1;
  return (
    <AbsoluteFill>
      <Background />
      {scenes.map((scene) => {
        const seq = (
          <Sequence key={scene.id} from={from} durationInFrames={scene.durationInFrames} name={scene.id}>
            <SceneShell scene={scene} />
          </Sequence>
        );
        from += scene.durationInFrames;
        return seq;
      })}
      <ProgressBar total={total} />
      {preview ? <PreviewBadge /> : null}
    </AbsoluteFill>
  );
};
