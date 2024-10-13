"use client";
import { useState, useEffect } from 'react';
import { parseCookies } from 'nookies'; // Add nookies to handle cookies in Next.js
import axios from 'axios';
import type { NextPage } from "next";
import Feature from "./feature";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type FrameComponentType = {
  className?: string;
};

const FrameComponent: NextPage<FrameComponentType> = ({ className = "" }) => {
  const router = useRouter();

  const getStarted = () => {
    router.push('/question/1');
  };

  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies.token;

    if (token) {
      // Verify token and extract username
      axios.post('/api/verify-token', { token }).then((res) => {
        setUsername(res.data.username);
      });
    }
  }, []);

  return (
    <section
      className={`self-stretch h-full bg-black flex flex-row items-start justify-start pt-0 px-0 pb-[976px] box-border relative max-w-full text-center text-29xl text-dark-foreground font-p-regular mq725:pb-[412px] mq725:box-border mq1025:pb-[634px] mq1025:box-border ${className}`}
    >
      <div className="h-full w-[1439px] relative [background:radial-gradient(50%_50%_at_50%_50%,_rgba(39,_39,_42,_0.05),_#09090b)] hidden max-w-full z-[0]" />
      <header className="flex-1 box-border flex flex-row items-center justify-center py-0 px-20 top-[0] z-[99] sticky max-w-full text-left text-sm text-dark-minor font-p-regular border-b-[1px] border-solid border-dark-border mq725:pl-10 mq725:pr-10 mq725:box-border">
        <div className="flex-1 flex flex-row items-center justify-between py-0 px-8 box-border gap-[20px] max-w-full">
          <div className="w-[487px] flex flex-row items-center justify-start gap-[32px] max-w-full mq725:hidden mq725:gap-[16px]">
            <div className="flex flex-row items-center justify-start py-2.5 px-0 gap-[12px] text-base text-white">
              <img
                className="h-[23.2px] w-5 relative"
                loading="lazy"
                alt=""
                src="/logo.svg"
              />
              <a className="[text-decoration:none] relative leading-[28px] font-medium text-[inherit] inline-block min-w-[63px] whitespace-nowrap">
                CodeSensei
              </a>
            </div>
            <a className="[text-decoration:none] relative leading-[28px] text-[inherit] inline-block min-w-[34px]">
              Docs
            </a>
            {/* <a className="[text-decoration:none] relative leading-[28px] text-[inherit] inline-block min-w-[46px]">
              Pricing
            </a> */}
            <a className="[text-decoration:none] relative leading-[28px] text-[inherit] inline-block min-w-[43px]">
              Status
            </a>
            <a className="[text-decoration:none] relative leading-[28px] text-[inherit] inline-block min-w-[34px]">
              FAQs
            </a>
            <a className="[text-decoration:none] relative leading-[28px] text-[inherit] inline-block min-w-[75px] whitespace-nowrap">
              Contact Us
            </a>
          </div>

            {/* CHECKING SESSION */}

          {username ? (
          <p>Welcome, {username}</p>
        ) : (
          <div className="login-buttons">
            <a href="/login">Login</a>
            <button>Sign Up</button>
          </div>
        )}


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
        <h1 className="m-0 relative text-xl tracking-[-0.01em] leading-[56px] font-extrabold font-inherit mq450:text-12xl mq450:leading-[36px] mq975:text-22xl mq975:leading-[46px]">
          Welcome to CodeSensie – Your AI-Powered DSA Practice Platform!
        </h1>

          <p className="m-0 self-stretch relative leading-[18px] text-dark-minor">
          Revolutionize your Data Structures & Algorithms (DSA) practice with AI.
          CodeSensie is the ultimate AI-powered platform for mastering DSA through personalized, engaging, and unique problem sets. 
          Inspired by the best DSA practice platforms like LeetCode, GeeksforGeeks, and CodeChef, CodeSensie offers something these platforms don't—AI-generated, limitless, and tailored DSA challenges.
          </p>
        </div>
        <button onClick={getStarted} className="cursor-pointer [border:none] relative bottom-5 py-0.5 px-4 bg-dark-foreground rounded-md flex flex-row items-center justify-center gap-[8px] whitespace-nowrap hover:bg-gainsboro mq450:w-[calc(100%_-_40px)]">
          <b className="relative text-sm leading-[28px] font-semibold font-p-regular text-dark-primary-foreground text-left inline-block min-w-[78px]">
            Get started
          </b>
          <img className="h-2 w-1 relative" alt="" src="/vector.svg" />
        </button>
        <img
          className="w-[1024px] relative rounded max-h-full object-cover max-w-full"
          loading="lazy"
          alt=""
          src="/hero-image-1@2x.png"
        />
        <div className=" h-[1000px] relative flex flex-col [background:radial-gradient(50%_50%_at_50%_50%,_rgba(39,_39,_42,_0.05),_#09090b)] items-center justify-start pt-24 px-5 pb-0 box-border gap-[104px] w-full">
          <div className="w-[960px] flex flex-col items-center justify-start gap-[48px] max-w-full">
            <h1 className="m-0 w-[672px] relative text-inherit tracking-[-0.01em] leading-[48px] font-extrabold font-inherit inline-block max-w-full mq450:text-10xl mq450:leading-[29px] mq975:text-19xl mq975:leading-[38px]">
              Level Up Your Skills Faster, Less Frustration.
            </h1>
            <div className="self-stretch flex flex-row flex-wrap items-start justify-center gap-[48px] text-left text-5xl text-dark-minor">
              <Feature
                frame="/frame.svg"
                fixEmergenciesFast="AI-Generated, Relatable Problems"
                save2030MinutesPerTicket="CodeSensie’s AI generates unique DSA problems in real-time, customized just for you! Want a challenge based on your favorite superhero like Batman or Ironman? Our AI will create one that keeps you engaged while you learn."
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
                save2030MinutesPerTicket="Whether you're coding in Python, Java, C, or JavaScript, CodeSensie offers multiple language support so you can practice DSA in the language you're most comfortable with."
                propMargin="0"
              />
            </div>
          </div>
          <div className="w-[672px] flex flex-col items-center justify-start gap-[24px] max-w-full">
          <h1 className="m-0 self-stretch relative text-inherit tracking-[-0.01em] leading-[48px] font-extrabold font-inherit mq450:text-10xl mq450:leading-[29px] mq975:text-19xl mq975:leading-[38px]">
              AI-Powered DSA Practice, Unlimited and Unique
            </h1>
            <p className="m-0 self-stretch relative text-lg leading-[18px] text-dark-minor">
              With CodeSensie, every DSA problem is generated by AI, offering limitless, engaging, and tailored challenges. No custom setup required—just dive in and start coding!
            </p>

            <img
              className="self-stretch h-[415.1px] relative rounded max-w-full overflow-hidden shrink-0 object-cover"
              loading="lazy"
              alt=""
              src="/hero-image-1-1@2x.png"
            />
          </div>
          <div className="w-[960px] flex flex-col items-center justify-start gap-[48px] max-w-full">
            <h1 className="m-0 w-[672px] relative text-inherit tracking-[-0.01em] leading-[48px] font-extrabold font-inherit inline-block max-w-full mq450:text-10xl mq450:leading-[29px] mq975:text-19xl mq975:leading-[38px]">
              Why CodeSensie?
            </h1>
            <div className="self-stretch flex flex-row flex-wrap items-start justify-center gap-[48px] text-left text-5xl text-dark-minor">
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
            <h1 className="m-0 self-stretch relative text-inherit tracking-[-0.01em] leading-[48px] font-extrabold font-inherit mq450:text-10xl mq450:leading-[29px] mq975:text-19xl mq975:leading-[38px]">
            Join the Future of DSA Learning
            </h1>
            <div className="self-stretch relative text-lg leading-[18px]">
              Whether you're a beginner looking to grasp the fundamentals or an expert polishing your skills, CodeSensie is designed for all levels. Start practicing smarter, not harder, with our AI-powered platform and transform your DSA skills today!
            </div>
            <button onClick={getStarted} className="cursor-pointer [border:none] py-0.5 px-4 bg-dark-foreground rounded-md flex flex-row items-center justify-center gap-[8px] whitespace-nowrap hover:bg-gainsboro">
              <b className="relative text-sm leading-[28px] font-semibold font-p-regular text-dark-primary-foreground text-left inline-block min-w-[78px]">
                Get started
              </b>
              <img className="h-2 w-1 relative" alt="" src="/vector-1.svg" />
            </button>
          </div>
        </div>
        <div className="bg-black h-[200px] w-full"></div>
      </div>
    </section>
  );
};

export default FrameComponent;