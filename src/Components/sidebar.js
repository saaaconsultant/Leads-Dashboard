import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  FiMessageSquare,
  FiCheckSquare,
  FiList,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiX,
  FiLayers,
} from "react-icons/fi";
import { useState } from "react";
import Image from "next/image";

function getMenuItems(role) {
  const home = {
    id: "dashboard",
    label: "Dashboard",
    icon: FiMessageSquare,
    url: "/dashboard",
  };
  const allDMs = { id: "dm-all", label: "All Posts", icon: FiList, url: "/dm" };
  const compliance = {
    id: "compliance",
    label: "Compliance Queue",
    icon: FiCheckSquare,
    url: "/compliance",
  };
  const users = { id: "users", label: "Users", icon: FiUsers, url: "/users" };

  switch (role) {
    case "EMPLOYEE":
      return [home, allDMs];
    case "COMPLIANCE":
      return [compliance, allDMs, home];
    case "TEAM_LEAD":
      return [home, allDMs, compliance];
    case "ADMIN":
      return [home, allDMs, compliance, users];
    default:
      return [home];
  }
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = getMenuItems(user?.role);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <Image
          src="/saaa-logo-white.svg"
          alt="SAAA Consultants"
          width={180}
          height={58}
          className="h-11 w-auto object-contain"
          priority
        />
        <button
          onClick={() => setMobileOpen(false)}
          className="ml-auto text-white/60 hover:text-white lg:hidden"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            router.pathname === item.url ||
            (item.url !== "/dashboard" &&
              router.pathname.startsWith(item.url + "/"));
          return (
            <Link
              key={item.id}
              href={item.url}
              onClick={() => setMobileOpen(false)}
              className={`mb-1 flex h-10 items-center rounded-lg px-3.5 transition-all ${
                isActive
                  ? "bg-[#844de9] text-white shadow-md font-semibold"
                  : "text-slate-300 hover:bg-white/10 hover:text-white font-medium"
              }`}
            >
              <Icon className="mr-3 h-[18px] w-[18px] flex-shrink-0 opacity-90" />
              <span className="text-[13px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <FiLogOut className="h-4 w-4" />
          <span className="text-[13px] font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3.5 left-4 z-40 flex lg:hidden items-center justify-center w-9 h-9 rounded-lg bg-[#1d273d] text-white shadow-lg"
      >
        <FiMenu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed left-0 top-0 z-50 h-screen w-64 bg-[#1d273d] text-white transition-transform lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block h-full">
        <SidebarContent />
      </div>
    </>
  );
}
