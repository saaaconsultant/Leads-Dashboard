"use client";

import { useState } from "react";
import { Outfit } from "next/font/google";
import { FiEye, FiEyeOff, FiArrowRight, FiGlobe, FiSmartphone } from "react-icons/fi";
import { IoColorPaletteOutline } from "react-icons/io5";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

// Put your ink-in-water photo at /public/login-bg.jpg.
// The gradients below are a fallback if the image is missing.
const background = [
  "url('/login-bg.jpg')",
  "radial-gradient(circle at 30% 45%, #1fa3d6 0, transparent 35%)",
  "radial-gradient(circle at 85% 60%, #ff4a1c 0, transparent 30%)",
  "radial-gradient(circle at 60% 20%, #3a2fa0 0, transparent 35%)",
  "linear-gradient(#071428, #0a1d3d)",
].join(", ");

const palettes = [
  { name: "Sunset market", colors: ["#ff5a5f", "#ff9f1c", "#ffd23f"] },
  { name: "Night swim", colors: ["#3b82f6", "#6366f1", "#a855f7"] },
];

const inputClass =
  "h-11 w-full rounded-xl border border-white/25 bg-white/15 px-4 text-[13px] text-white " +
  "placeholder:text-white/60 outline-none transition focus:border-white/60 focus:bg-white/20";

function Logo() {
  return (
    <span className="relative inline-block h-5 w-5">
      <span className="absolute left-0 top-0 h-3 w-3 rounded-full bg-[#ff5a5f]" />
      <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-[#ffd23f] mix-blend-screen" />
      <span className="absolute bottom-0 left-1 h-3 w-3 rounded-full bg-[#3b82f6] mix-blend-screen" />
    </span>
  );
}

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", role: "employee", remember: false });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to sign in.");
      window.location.assign(result.redirectTo);
    } catch (submitError) {
      setError(submitError.message);
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className={`${outfit.className} relative min-h-screen w-full overflow-hidden bg-cover bg-center text-white`}
      style={{ backgroundImage: background }}
    >
      {/* subtle dark overlay so text stays readable */}
      <div className="pointer-events-none absolute inset-0 bg-[#050d1f]/25" />

      <div className="relative mx-auto grid min-h-screen max-w-[1400px] items-center gap-10 px-6 py-10 lg:grid-cols-[1fr_380px] lg:px-16">
        {/* Left: brand + headline */}
        <section className="max-w-[560px]">
          <div className="mb-14 flex items-center gap-2.5">
            <Logo />
            <span className="text-[15px] font-semibold">Kaleido</span>
          </div>

          <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.08em] text-white/85">
            TRACT MANAGEMENT DASHBOARD
          </p>

          <h1 className="text-[44px] font-bold leading-[1.05] tracking-tight sm:text-[56px]">
            Empower your team with a unified dashboard for CRM and Projects.
          </h1>

          <div className="mt-7 flex flex-wrap gap-3">
            {palettes.map((p) => (
              <span
                key={p.name}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-[#0a1630]/60 py-1.5 pl-2 pr-4 text-[12px] font-medium backdrop-blur"
              >
                <span className="flex -space-x-1.5">
                  {p.colors.map((c) => (
                    <span
                      key={c}
                      className="h-4 w-4 rounded-full ring-1 ring-black/20"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </span>
                {p.name}
              </span>
            ))}
          </div>
        </section>

        {/* Right: glass card */}
        <section className="w-full justify-self-center lg:justify-self-end">
          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] border border-white/30 bg-white/10 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
          >
            <h2 className="text-[24px] font-semibold leading-tight">Sign in</h2>
            <p className="mt-1 text-[12px] text-white/85">Good to see you again.</p>

            <label htmlFor="role" className="mb-1.5 mt-5 block text-[11px] font-semibold">
              Sign in as
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className={`${inputClass} appearance-none`}
            >
              <option value="employee" className="text-slate-900">Employee</option>
              <option value="teamLead" className="text-slate-900">Team lead</option>
            </select>

            <label htmlFor="email" className="mb-1.5 mt-4 block text-[11px] font-semibold">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@studio.com"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
            />

            <label htmlFor="password" className="mb-1.5 mt-4 block text-[11px] font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
              >
                {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
              </button>
            </div>

            {error && <p role="alert" className="mt-3 text-xs font-medium text-red-200">{error}</p>}

            {/* <div className="mt-4 flex items-center justify-between text-[11px] font-medium">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="h-3.5 w-3.5 rounded-sm accent-white"
                />
                Remember me
              </label>
              <a href="#" className="font-semibold underline underline-offset-2">
                Forgot password?
              </a>
            </div> */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-[13px] font-semibold text-[#1d273d] transition hover:bg-white/90"
            >
              {isSubmitting ? "Signing in..." : "Sign in"} <FiArrowRight className="h-3.5 w-3.5" />
            </button>

            {/* <div className="my-5 flex items-center gap-3 text-[10px] text-white/80">
              <span className="h-px flex-1 bg-white/25" />
              or continue with
              <span className="h-px flex-1 bg-white/25" />
            </div> */}

            {/* <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Continue with web", Icon: FiGlobe },
                { label: "Continue with mobile", Icon: FiSmartphone },
                { label: "Continue with design tools", Icon: IoColorPaletteOutline },
              ].map(({ label, Icon }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  className="flex h-10 items-center justify-center rounded-xl border border-white/25 bg-white/10 transition hover:bg-white/20"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div> */}

            {/* <p className="mt-5 text-center text-[11px] font-medium">
              New to Kaleido?{" "}
              <a href="#" className="font-semibold underline underline-offset-2">
                Create an account
              </a>
            </p> */}
            {/* <p className="mt-3 text-center text-[10px] text-white/80">Use the account assigned to your role.</p> */}
          </form>
        </section>
      </div>
    </main>
  );
}

export async function getServerSideProps({ req }) {
  const { getSessionFromRequest } = await import("@/lib/auth");
  const session = getSessionFromRequest(req);

  if (session) {
    return {
      redirect: {
        destination: session.role === "teamLead" ? "/leads" : "/dashboard",
        permanent: false,
      },
    };
  }

  return { props: {} };
}