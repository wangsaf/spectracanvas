import { Composition } from "remotion";
import { DemoVideo } from "./DemoVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SpectraCanvasDemo"
      component={DemoVideo}
      durationInFrames={5400} // 3 minutes at 30fps
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
