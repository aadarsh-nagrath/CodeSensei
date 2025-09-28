"use client";

import type { NextPage } from "next";
import Feature from "./feature";
import ProfileDrawer from "./ProfileDrawer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export type FrameComponentType = {
  className?: string;
};

const FrameComponent: NextPage<FrameComponentType> = ({ className = "" }) => {
  const router = useRouter();

  const getStarted = () => {
    router.push('/question/1');
  };

  return (
    <section
      className={`self-stretch h-full bg-gradient-to-br from-black via-gray-900 to-black flex flex-row items-start justify-start pt-0 px-0 pb-[976px] box-border relative max-w-full text-center text-29xl text-white font-p-regular mq725:pb-[412px] mq725:box-border mq1025:pb-[634px] mq1025:box-border ${className}`}
    >
      <div className="h-full w-[1439px] relative [background:radial-gradient(50%_50%_at_50%_50%,_rgba(255,_215,_0,_0.1),_rgba(0,_0,_0,_0.8))] hidden max-w-full z-[0]" />
      <header className="flex-1 box-border flex flex-row items-center justify-center py-0 px-20 top-[0] z-[99] sticky max-w-full text-left text-sm text-gray-300 font-p-regular border-b-[2px] border-solid border-yellow-500/30 backdrop-blur-md bg-black/50 mq725:pl-10 mq725:pr-10 mq725:box-border">
        <div className="flex-1 flex flex-row items-center justify-between py-0 px-8 box-border gap-[20px] max-w-full">
          <div className="w-[487px] flex flex-row items-center justify-start gap-[32px] max-w-full mq725:hidden mq725:gap-[16px]">
            <div className="flex flex-row items-center justify-start py-2.5 px-0 gap-[12px] text-base text-white">
              <Image
                className="h-[23.2px] w-5 relative"
                loading="lazy"
                alt=""
                src="/logo.svg"
                width={20}
                height={23}
              />
              <a className="[text-decoration:none] relative leading-[28px] font-medium text-yellow-400 inline-block min-w-[63px] whitespace-nowrap text-shadow-lg">
                CodeSensei
              </a>
            </div>
            <a className="[text-decoration:none] relative leading-[28px] text-gray-300 hover:text-yellow-400 transition-colors duration-300 inline-block min-w-[34px]">
              Docs
            </a>
            {/* <a className="[text-decoration:none] relative leading-[28px] text-[inherit] inline-block min-w-[46px]">
              Pricing
            </a> */}
            <a className="[text-decoration:none] relative leading-[28px] text-gray-300 hover:text-yellow-400 transition-colors duration-300 inline-block min-w-[43px]">
              Status
            </a>
            <a className="[text-decoration:none] relative leading-[28px] text-gray-300 hover:text-yellow-400 transition-colors duration-300 inline-block min-w-[34px]">
              FAQs
            </a>
            <a className="[text-decoration:none] relative leading-[28px] text-gray-300 hover:text-yellow-400 transition-colors duration-300 inline-block min-w-[75px] whitespace-nowrap">
              Contact Us
            </a>
          </div>

          {/* Profile Button */}
          <div className='flex items-center'>
            <ProfileDrawer />
          </div>

          {/* LOGIN BUTTONS */}


          {/* <div className="w-[154px] flex flex-row items-center justify-start gap-[32px]">
            <a className="[text-decoration:none] relative leading-[28px] text-[inherit] inline-block min-w-[37px]">
              Login
            </a>
            <button className="cursor-pointer [border:none] py-0.5 px-4 bg-dark-foreground rounded-md flex flex-row items-center justify-center whitespace-nowrap hover:bg-gainsboro">
              <a className="[text-decoration:none] relative text-sm leading-[28px] font-semibold font-p-regular text-dark-primary-foreground text-left inline-block min-w-[53px]">
                Sign Up
              </a>
            </button>
          </div> */}



        </div>
      </header>
      <div className="w-full h-full absolute flex flex-col items-center justify-start py-36 px-0  box-border  max-w-full z-[1]">
        <div className="w-[712px] flex flex-col bottom-9 items-center justify-start relative  py-0 px-5 box-border gap-[24px] max-w-full">
        <h1 className="m-0 relative text-xl tracking-[-0.01em] leading-[56px] font-extrabold font-inherit bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent mq450:text-12xl mq450:leading-[36px] mq975:text-22xl mq975:leading-[46px]">
          Welcome to CodeSensie – Your AI-Powered DSA Practice Platform!
        </h1>

          <p className="m-0 self-stretch relative leading-[24px] text-gray-300 text-lg">
          Revolutionize your Data Structures & Algorithms (DSA) practice with AI.
          CodeSensie is the ultimate AI-powered platform for mastering DSA through personalized, engaging, and unique problem sets. 
          Inspired by the best DSA practice platforms like LeetCode, GeeksforGeeks, and CodeChef, CodeSensie offers something these platforms don&apos;t—AI-generated, limitless, and tailored DSA challenges.
          </p>
        </div>
        <button onClick={getStarted} className="cursor-pointer [border:none] relative bottom-5 py-4 px-8 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-lg flex flex-row items-center justify-center gap-[8px] whitespace-nowrap hover:from-yellow-400 hover:to-yellow-300 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 mq450:w-[calc(100%_-_40px)]">
          <b className="relative text-sm leading-[28px] font-semibold font-p-regular text-black text-left inline-block min-w-[78px]">
            Get started
          </b>
          <Image className="h-2 w-1 relative" alt="" src="/vector.svg" width={4} height={8} />
        </button>
        <Image
          className="w-[1024px] relative rounded max-h-full object-cover max-w-full"
          loading="lazy"
          alt=""
          src="/hero-image-1@2x.png"
          width={1024}
          height={600}
        />
        <div className=" h-[1000px] relative flex flex-col [background:radial-gradient(50%_50%_at_50%_50%,_rgba(255,_215,_0,_0.1),_rgba(0,_0,_0,_0.9))] items-center justify-start pt-24 px-5 pb-0 box-border gap-[104px] w-full">
          <div className="w-[960px] flex flex-col items-center justify-start gap-[48px] max-w-full">
            <h1 className="m-0 w-[672px] relative text-inherit tracking-[-0.01em] leading-[48px] font-extrabold font-inherit inline-block max-w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent mq450:text-10xl mq450:leading-[29px] mq975:text-19xl mq975:leading-[38px]">
              Level Up Your Skills Faster, Less Frustration.
            </h1>
            <div className="self-stretch flex flex-row flex-wrap items-start justify-center gap-[48px] text-left text-5xl text-gray-300">
              <Feature
                frame="/frame.svg"
                fixEmergenciesFast="AI-Generated, Relatable Problems"
                save2030MinutesPerTicket="CodeSensie&apos;s AI generates unique DSA problems in real-time, customized just for you!"

              />
              <Feature
                frame="/frame-1.svg"
                fixEmergenciesFast="Unlimited Questions, Unlimited Possibilities"
                save2030MinutesPerTicket="Forget running out of problems to practice. With every click of Next, a brand-new question awaits you. No two questions are the same—each one is created on the spot by our advanced AI system."
                propMargin="unset"
              />
              <Feature
                frame="/frame-2.svg"
                fixEmergenciesFast="Multi-Language Support"
                save2030MinutesPerTicket="Whether you&apos;re coding in Python, Java, C, or JavaScript, CodeSensie offers multiple language support so you can practice DSA in the language you&apos;re most comfortable with."
                propMargin="0"
              />
            </div>
          </div>
          <div className="w-[672px] flex flex-col items-center justify-start gap-[24px] max-w-full">
          <h1 className="m-0 self-stretch relative text-inherit tracking-[-0.01em] leading-[48px] font-extrabold font-inherit bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent mq450:text-10xl mq450:leading-[29px] mq975:text-19xl mq975:leading-[38px]">
              AI-Powered DSA Practice, Unlimited and Unique
            </h1>
            <p className="m-0 self-stretch relative text-lg leading-[24px] text-gray-300">
              With CodeSensie, every DSA problem is generated by AI, offering limitless, engaging, and tailored challenges. No custom setup required—just dive in and start coding!
            </p>

            <Image
              className="self-stretch h-[415.1px] relative rounded max-w-full overflow-hidden shrink-0 object-cover"
              loading="lazy"
              alt=""
              src="/hero-image-1-1@2x.png"
              width={960}
              height={415}
            />
          </div>
          <div className="w-[960px] flex flex-col items-center justify-start gap-[48px] max-w-full">
            <h1 className="m-0 w-[672px] relative text-inherit tracking-[-0.01em] leading-[48px] font-extrabold font-inherit inline-block max-w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent mq450:text-10xl mq450:leading-[29px] mq975:text-19xl mq975:leading-[38px]">
              Why CodeSensie?
            </h1>
            <div className="self-stretch flex flex-row flex-wrap items-start justify-center gap-[48px] text-left text-5xl text-gray-300">
              <Feature
                frame="/frame.svg"
                fixEmergenciesFast="Stay Engaged with Personalized Challenges"
                save2030MinutesPerTicket="Bored of the same old DSA problems? With CodeSensie, you can choose themes or topics you love, and our AI will craft questions that make learning both fun and educational."
              />
              <Feature
                frame="/frame-1.svg"
                fixEmergenciesFast="Practice Like Never Before"
                save2030MinutesPerTicket="CodeSensie combines the power of AI with a massive repository of DSA knowledge, giving you endless ways to challenge your problem-solving skills."
                propMargin="unset"
              />
              <Feature
                frame="/frame-2.svg"
                fixEmergenciesFast="Real-World, Interesting Scenarios"
                save2030MinutesPerTicket="From superheroes to tech giants, CodeSensie lets you practice DSA with questions that are both practical and interesting, keeping you hooked on learning."
                propMargin="0"
              />
            </div>
          </div>
          <div className="w-[672px] flex flex-col items-center justify-start  gap-[24px] max-w-full">
            <h1 className="m-0 self-stretch relative text-inherit tracking-[-0.01em] leading-[48px] font-extrabold font-inherit bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent mq450:text-10xl mq450:leading-[29px] mq975:text-19xl mq975:leading-[38px]">
            Join the Future of DSA Learning
            </h1>
            <div className="self-stretch relative text-lg leading-[24px] text-gray-300">
              Whether you&apos;re a beginner looking to grasp the fundamentals or an expert polishing your skills, CodeSensie is designed for all levels. Start practicing smarter, not harder, with our AI-powered platform and transform your DSA skills today!
            </div>
            <button onClick={getStarted} className="cursor-pointer [border:none] py-4 px-8 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-lg flex flex-row items-center justify-center gap-[8px] whitespace-nowrap hover:from-yellow-400 hover:to-yellow-300 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25">
              <b className="relative text-sm leading-[28px] font-semibold font-p-regular text-black text-left inline-block min-w-[78px]">
                Get started
              </b>
              <Image className="h-2 w-1 relative" alt="" src="/vector-1.svg" width={4} height={8} />
            </button>
          </div>
        </div>
        <div className="bg-gradient-to-b from-gray-900 to-black h-[200px] w-full"></div>
      </div>
    </section>
  );
};

export default FrameComponent;