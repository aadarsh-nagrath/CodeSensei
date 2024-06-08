import type { NextPage } from "next";
import FrameComponent from "./components/frame-component";

const LandingPage: NextPage = () => {
  return (
    <div className="w-full relative bg-dark-background overflow-hidden flex flex-col items-start justify-start gap-[1717.6px] leading-[normal] tracking-[normal] mq450:gap-[429px] mq725:gap-[859px]">
      <FrameComponent />
      <footer className="self-stretch box-border flex flex-row items-center justify-center py-0 px-20 max-w-full text-left text-base text-white font-p-regular border-t-[1px] border-solid border-dark-border mq725:pl-10 mq725:pr-10 mq725:box-border">
        <div className="flex-1 flex flex-row items-center justify-between py-0 px-8 box-border max-w-full gap-[20px] mq725:flex-wrap">
          <div className="flex flex-row items-center justify-start">
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;