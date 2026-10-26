import { useRouter } from "next/router";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Sidebar from "@/Components/sidebar";
import Header from "@/Components/header";
import { manrope, archivo, syne } from "@/lib/fonts";
import "@/styles/globals.css";

const PUBLIC_PATHS = ["/authentication/login", "/authentication/register", "/"];

function AppShell({ Component, pageProps }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const isPublicPage = PUBLIC_PATHS.includes(router.pathname);
  const showShell = !isPublicPage && (loading || user);

  if (isPublicPage) {
    return <Component {...pageProps} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#ed272e] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <aside className="hidden lg:block fixed left-0 top-0 z-30 h-screen w-56 bg-[#1d273d] text-white">
        <Sidebar />
      </aside>

      <div className="lg:hidden">
        <Sidebar />
      </div>

      <div className="flex flex-col min-h-screen lg:pl-56">
        <Header />
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
          <Component {...pageProps} />
        </main>
      </div>
    </div>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <div className={`${manrope.variable} ${archivo.variable} ${syne.variable} min-h-screen font-sans`}>
      <AuthProvider>
        <AppShell Component={Component} pageProps={pageProps} />
      </AuthProvider>
    </div>
  );
}
