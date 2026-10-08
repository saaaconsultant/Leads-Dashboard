import Header from "@/Components/header";
import Sidebar from "@/Components/sidebar";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return(
      <div className={`flex min-h-screen items-center justify-center bg-zinc-50 font-sans `}>
                  <div className="fixed left-0 top-0 z-30 hidden h-screen w-64 bg-[#1d273d] text-white lg:block">
                      <Sidebar />
                  </div>
                  <div className="">
                  <Header />
                  <Component {...pageProps} />
                  </div>
              </div>
  );
// );
}
