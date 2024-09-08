import type { NextPage } from "next";
import FrameComponent from "./components/frame-component";

const LandingPage: NextPage = () => {
  return (
    <div className="w-full relative bg-dark-background h-full flex flex-col items-start justify-start leading-[normal] tracking-[normal] mq450:gap-[429px] mq725:gap-[859px]">
      <FrameComponent />
    </div>
  );
};

export default LandingPage;