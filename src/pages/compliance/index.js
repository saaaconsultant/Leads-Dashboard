import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import DMTable from "@/Components/dm/DMTable";
import { FiCheckSquare, FiShield, FiAlertCircle } from "react-icons/fi";

export default function ComplianceQueuePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [dms, setDms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadQueue = async () => {
    try {
      const res = await fetch("/api/compliance/queue").then((r) => r.json());
      if (res.success) {
        const list = Array.isArray(res.data) ? res.data : res.data?.dms || [];
        setDms(list);
      } else {
        setError(res.message || "Failed to load compliance queue");
      }
    } catch {
      setError("Network error fetching queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const dmList = Array.isArray(dms) ? dms : [];

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#844de9]/10 text-[#844de9]">
              <FiShield className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-800">
              Compliance Review Queue
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review and approve or reject social media direct posts before
            they are dispatched.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs border border-amber-300">
            {dmList.length} Pending Approval
          </span>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-[#844de9] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && dmList.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <FiCheckSquare className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-800">
            Queue is Clear!
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            There are currently no social media posts awaiting compliance
            review.
          </p>
          <Link
            href="/dm"
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-[#844de9] hover:underline"
          >
            View all posts history →
          </Link>
        </div>
      )}

      {/* Queue items Table */}
      {!loading && !error && dmList.length > 0 && (
        <DMTable dms={dmList} showAuthor={true} isComplianceView={true} />
      )}
    </div>
  );
}
