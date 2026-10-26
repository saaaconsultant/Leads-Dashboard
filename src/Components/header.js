import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { IoLogOutOutline } from "react-icons/io5";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [openLogout, setOpenLogout] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const getPageTitle = () => {
    if (router.pathname.startsWith("/compliance")) return "Compliance Center";
    if (router.pathname.startsWith("/dm")) return "Social Media DMs";
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-20 flex h-[61px] w-full items-center border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="flex items-center">
        <span className="text-[17px] font-bold tracking-tight text-[#202638]">
          {getPageTitle()}
        </span>
      </div>

      <div className="mx-4 h-5 w-px bg-slate-200" />
      <div className="ml-auto flex items-center gap-2">
        <div className="relative ml-2">
          <button
            type="button"
            onClick={() => setOpenLogout(!openLogout)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f57c20] text-xs font-bold text-white shadow-sm hover:opacity-90 transition cursor-pointer"
            title={user?.name}
          >
            {initials}
          </button>

          {openLogout && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg text-xs z-30">
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold transition"
              >
                <span>Sign Out</span>
                <IoLogOutOutline className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
