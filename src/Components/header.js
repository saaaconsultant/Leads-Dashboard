import React from 'react'
import { IoIosNotifications,IoIosHelpCircle  } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";



export default function Header() {
    const [openLogout, setOpenlogout] = React.useState(false);
   console.log("openLogout", openLogout);
    return (  
     <header className="fixed left-0 right-0 top-0 z-20 flex h-[61px] items-center border-b border-slate-200 bg-white px-5 lg:left-[253px] shadow-md">
      {/* App launcher */}
      <button className="mr-5 text-slate-500">
        {/* {Icons.grid} */}
      </button>

      <div className="flex items-center">
        {/* <div className="mr-2 flex h-7 w-7 overflow-hidden rounded-md">
          <span className="w-1/4 bg-[#ed1c24]" />
          <span className="w-1/4 bg-[#f9a825]" />
          <span className="w-1/4 bg-[#00a9e0]" />
          <span className="w-1/4 bg-[#72bf44]" />
        </div> */}

        <span className="text-[19px] font-bold tracking-tight text-[#202638]">
          Reports
        </span>

        {/* <span className="ml-1 text-[13px] font-semibold text-[#555]">
          CRM
        </span> */}
      </div>

      <div className="mx-4 h-7 w-px bg-slate-200" />

      {/* <button className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] font-medium text-slate-700">
        <span>▣</span>
        <span>Acme Enterprise Corp</span>
        <span className="text-slate-500">⌄</span>
      </button> */}

      <div className="ml-auto flex items-center gap-2">
        {/* Create */}
        <button className="flex h-9 items-center gap-1.5 rounded-md bg-[#ed272e] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#d91f26]">
          {/* {Icons.plus} */}+
          Create
        </button>


        {/* <button className="flex h-9 items-center gap-2 rounded-md border border-purple-200 bg-purple-50 px-3 text-sm font-semibold text-purple-600">
           AI
        </button> */}

        <button className="relative ml-1 p-2 text-slate-500">
          {/* {Icons.bell} */} <IoIosNotifications className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button className="p-2 text-slate-500">
          {/* {Icons.help} */} <IoIosHelpCircle className="h-5 w-5" />
        </button>
        <div className="relative">
            <div onClick={() => setOpenlogout(!openLogout)} className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#f57c20] text-xs font-bold text-white cursor-pointer">
            SJ
            </div>

            { openLogout && (
            <div className="text-[13px] font-semibold text-[#555] absolute right-0 top-[calc(100%+5px)] w-36 rounded-md border border-slate-200 bg-white px-3 py-2 shadow-md" style={{ display: openLogout ? 'block' : 'hidden' }}>
                <p className='flex justify-between items-center cursor-pointer'>Logout <span><IoLogOutOutline className="h-4 w-4 text-red-500" /></span></p>
            </div>)}
        </div>
      </div>
    </header>
     )

    }