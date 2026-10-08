"use client";
import React from 'react'

import { useState } from "react";
import { FiHome,FiTarget,FiUsers,FiSettings,FiMenu   } from "react-icons/fi";
import { TbReportAnalytics } from "react-icons/tb";
import { SiPerforce } from "react-icons/si";

const menuItems = [
  {
    id: "executive",
    label: "Executive Home",
    icon: <FiHome className="w-5 h-5" />,
    url: "/"
  },
//   {
//     id: "pipeline",
//     label: "Deals Pipeline",
//     icon: <FiTarget className="w-5 h-5" />,
//     // count: "6",
//   },
  {
    id: "leads",
    label: "Leads & Accounts",
    icon: <FiUsers className="w-5 h-5" />,
    url: "/leads"
  },
  {
    id: "contacts",
    label: "Contacts",
    icon: <FiUsers className="w-5 h-5" />,
  },
  {
    id: "analytics",
    label: "Analytics & KPIs",
    icon: <TbReportAnalytics className="w-5 h-5" />,
  },
  {
    id: "forecasting",
    label: "Forecasting",
    icon: <SiPerforce className="w-5 h-5" />,
  },
  {
    id: "workflow",
    label: "Workflow Rules",
    icon: <FiSettings className="w-5 h-5" />,
  },
];



export default function Sidebar() {
  const [isActive, setIsActive] = useState("executive");
  
  const handleMenuItemClick = (id) => {
    setIsActive(id);
    console.log("isActive", isActive);
  }
  return (
   <>
      {/* <div className="flex flex-col items-center justify-between sm:items-start"> */}
         <aside className="">
        
          <div className="flex h-16 items-center border-b border-white/10 px-5">
            <div className="grid grid-cols-3 gap-1">
              <span className="h-2 w-2 rounded-sm bg-sky-400" />
              <span className="h-2 w-2 rounded-sm bg-sky-400" />
              <span className="h-2 w-2 rounded-sm bg-sky-400" />
              <span className="h-2 w-2 rounded-sm bg-indigo-400" />
              <span className="h-2 w-2 rounded-sm bg-indigo-400" />
              <span className="h-2 w-2 rounded-sm bg-indigo-400" />
              <span className="h-2 w-2 rounded-sm bg-purple-400" />
              <span className="h-2 w-2 rounded-sm bg-purple-400" />
              <span className="h-2 w-2 rounded-sm bg-purple-400" />
            </div>

            <span className="ml-3 text-[13px] font-medium tracking-[0.08em]">
              NAVIGATION
            </span>

            <button className="ml-auto text-white/60 hover:text-white">
              <FiMenu className="h-5 w-5" />
            </button>
          </div>

            <nav className="px-2 py-5">
            {menuItems.map((item) =>  (
              <a
                key={item.label}
                onClick={() => handleMenuItemClick(item.id)}
                className={`mb-1 flex h-11 cursor-pointer items-center rounded-lg px-4 transition ${
                  isActive === item.id
                    ? "bg-[#ed272e] text-white"
                    : "text-slate-200 hover:bg-white/10"
                }`}
                href={item.url}
              >
                <span className="mr-3 opacity-90">{item.icon}</span>

                <span className="text-[14px] font-semibold">
                  {item.label}
                </span>

                {item.count && (
                  <span
                    className={`ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                      isActive === item.id
                        ? "bg-white/20"
                        : "bg-slate-600 text-white"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </a>
            ))}
          </nav>
        </aside>

    </>
  );
}
