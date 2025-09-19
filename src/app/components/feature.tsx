import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import Image from "next/image";

export type FeatureType = {
  className?: string;
  frame?: string;
  fixEmergenciesFast?: string;
  save2030MinutesPerTicket?: string;

  propMargin?: CSSProperties["margin"];
};

const Feature: NextPage<FeatureType> = ({
  className = "",
  frame,
  fixEmergenciesFast,
  save2030MinutesPerTicket,
  propMargin,
}) => {
  const fixEmergenciesFastStyle: CSSProperties = useMemo(() => {
    return {
      margin: propMargin,
    };
  }, [propMargin]);

  return (
    <div
      className={`flex-1 flex flex-col items-start justify-start gap-[24px] min-w-[115px] text-left text-gray-300 font-p-regular ${className}`}
    >
      <div className="w-14 rounded-md bg-gradient-to-br from-yellow-500/20 to-yellow-400/10 box-border flex flex-row items-center justify-center py-3.5 px-[15px] border-[2px] border-solid border-yellow-500/30 backdrop-blur-sm">
        <Image
          className="h-6 w-6 relative overflow-hidden shrink-0"
          loading="lazy"
          alt="Feature icon"
          src={frame || "/default-image.png"}
          width={24}
          height={24}
        />
      </div>
      <h2
        className="m-0 self-stretch relative text-inherit tracking-[-0.01em] leading-[36px] font-semibold font-inherit text-[1.75rem] bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent mq450:text-xl mq450:leading-[28px]"
        style={fixEmergenciesFastStyle}
      >
        {fixEmergenciesFast || "Default Text"}
      </h2>
      <p className="m-0 self-stretch relative text-sm leading-[24px] text-gray-400 font-light mq450:text-sm mq450:leading-[22px]">
        {save2030MinutesPerTicket || "Default description"}
      </p>
    </div>
  );
};

export default Feature;
