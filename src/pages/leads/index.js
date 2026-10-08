import Head from "next/head";
import { getSessionFromRequest } from "@/lib/auth";

function Leads({ user }) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900 sm:px-10 ">
      <Head><title>Leads Dashboard</title></Head>
      <div className="mx-auto flex max-w-5xl items-center justify-between border-b border-slate-200 pb-5">
        
      </div>
      <section className="mt-8">
        <p className="mt-8 text-sm text-slate-600">Lead management is available to team leads.</p>
      </section>
    </main>
  );
}

export default Leads;

// export async function getServerSideProps({ req }) {
//   const user = getSessionFromRequest(req);
//   if (!user) return { redirect: { destination: "/", permanent: false } };
//   if (user.role !== "teamLead") {
//     return { redirect: { destination: "/dashboard", permanent: false } };
//   }

//   return { props: { user } };
// }