import React from 'react'
import GenereDialog from './GenereDialog';
import MenuBar from './MenuBar';

const NavigationMenu = () => {
  return (
    <header className="flex-1 box-border flex flex-row items-center justify-center py-0 px-20 top-[0] z-[1] max-w-full text-left text-sm text-dark-minor font-p-regular border-b-[1px] border-solid border-dark-border mq725:pl-10 mq725:pr-10 mq725:box-border">
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
      <div className='absolute left-1/2 transform -translate-x-1/2'><MenuBar/></div>
      <div className='absolute left-[300px] ml-20'><GenereDialog /></div>



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
    </div>
  </header>
  )
}


export default NavigationMenu;