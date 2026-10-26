"use client";

import Image from "next/image";
import { useState } from "react";
import { FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";

const background = [
  "radial-gradient(circle at 30% 45%, #1fa3d6 0, transparent 35%)",
  "radial-gradient(circle at 85% 60%, #ff4a1c 0, transparent 30%)",
  "radial-gradient(circle at 60% 20%, #3a2fa0 0, transparent 35%)",
  "linear-gradient(#071428, #0a1d3d)",
].join(", ");

const inputClass =
  "h-11 w-full rounded-xl border border-white/25 bg-white/15 px-4 text-[13px] text-white " +
  "placeholder:text-white/60 outline-none transition focus:border-white/60 focus:bg-white/20";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
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
      window.location.assign(result.redirectTo || "/dashboard");
    } catch (submitError) {
      setError(submitError.message);
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden bg-cover bg-center text-white"
      style={{ backgroundImage: background }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[#050d1f]/35" />

      <div className="relative mx-auto grid min-h-screen max-w-[1400px] items-center gap-10 px-6 py-10 lg:grid-cols-[1fr_420px] lg:px-16">
        {/* Left: Brand & system description */}
        <section className="max-w-[620px]">
          <div className="flex items-center px-5 h-30">
            <Image
              src="/saaa-logo-white.svg"
              alt="SAAA Consultants"
              width={250}
              height={78}
              className="h-15 w-auto object-contain"
              priority
            />
          </div>

          <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] bg-[#ed272e]/10 inline-block px-3 py-1 rounded-full border border-[#ed272e]/20">
            Social Media Post & Compliance System
          </p>

          <h1 className="text-[18px] font-extrabold sm:text-[30px]">
            Manage social media direct messages with enterprise compliance
            approval.
          </h1>
        </section>

        {/* Right: Glass Sign-in Card */}
        <section className="w-full justify-self-center lg:justify-self-end">
          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] border border-white/30 bg-white/10 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
          >
            <h2 className="text-[24px] font-bold leading-tight">Sign in</h2>
            <p className="mt-1 text-[12px] text-white/85">
              Sign in with your account credentials.
            </p>

            <label
              htmlFor="email"
              className="mb-1.5 mt-4 block text-[11px] font-semibold"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
            />

            <label
              htmlFor="password"
              className="mb-1.5 mt-4 block text-[11px] font-semibold"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="**********"
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
                {showPassword ? (
                  <FiEyeOff className="h-4 w-4" />
                ) : (
                  <FiEye className="h-4 w-4" />
                )}
              </button>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-3 text-xs font-semibold text-rose-300 bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/30"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-[13px] font-bold text-[#1d273d] transition hover:bg-white/90 cursor-pointer shadow-lg"
            >
              {isSubmitting ? "Signing in..." : "Sign in to Dashboard"}{" "}
              <FiArrowRight className="h-4 w-4" />
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export async function getServerSideProps({ req }) {
  const { getSessionFromRequest, roleRedirect } = await import("@/lib/auth");
  const session = getSessionFromRequest(req);

  if (session) {
    return {
      redirect: {
        destination: roleRedirect(session.role),
        permanent: false,
      },
    };
  }

  return { props: {} };
}
