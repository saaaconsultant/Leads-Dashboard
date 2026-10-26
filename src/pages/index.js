import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === "COMPLIANCE") {
          router.replace("/compliance");
        } else {
          router.replace("/dashboard");
        }
      } else {
        router.replace("/authentication/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#ed272e] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">
          Redirecting to Compliance Dash…
        </p>
      </div>
    </div>
  );
}
