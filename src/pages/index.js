import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
import { FiHome,FiTarget,FiUsers,FiSettings,FiMenu   } from "react-icons/fi";
import { TbReportAnalytics } from "react-icons/tb";
import { SiPerforce } from "react-icons/si";
import SignInPage from "./authentication/login";



export default function Home() {

  return (
    <div
      className={`fixed left-0 right-0 top-0 z-20 mt-24 items-center px-5 lg:left-64 text-black`}
    >
      <main className="">
         <p className="text-lg font-semibold ">Main Dashboard Content</p>
         
      </main>
      {/* <SignInPage /> */}
    </div>
  );
}
