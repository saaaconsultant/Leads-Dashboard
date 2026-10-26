import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import DMStatusBadge from "@/Components/dm/DMStatusBadge";
import ReviewNotes from "@/Components/dm/ReviewNotes";
import DMMediaGallery from "@/Components/dm/DMMediaGallery";
import Button from "@/Components/ui/Button";
import {
  FiArrowLeft,
  FiCheck,
  FiX,
  FiShield,
  FiUser,
  FiClock,
  FiAlertTriangle,
} from "react-icons/fi";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaWhatsapp,
} from "react-icons/fa";

const PLATFORM_ICONS = {
  INSTAGRAM: FaInstagram,
  TWITTER: FaTwitter,
  LINKEDIN: FaLinkedin,
  FACEBOOK: FaFacebook,
  WHATSAPP: FaWhatsapp,
};

export default function ComplianceReviewDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const [dm, setDm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [decision, setDecision] = useState("APPROVED");
  const [notes, setNotes] = useState("");

  const loadDM = async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/dm/${id}`).then((r) => r.json());
      if (res.success) {
        setDm(res.data.dm || res.data);
      } else {
        setError(res.message || "Failed to load DM details");
      }
    } catch {
      setError("Network error fetching DM");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDM();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (decision === "REJECTED" && !notes.trim()) {
      setError(
        "Compliance feedback / reason for rejection is required so the employee can revise the DM.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/dm/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, notes: notes.trim() }),
      }).then((r) => r.json());

      if (res.success) {
        router.push("/compliance");
      } else {
        setError(res.message || "Failed to submit compliance review.");
      }
    } catch {
      setError("Network error submitting review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-[#844de9] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !dm) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
          {error}
        </div>
        <Link
          href="/compliance"
          className="inline-flex items-center gap-2 mt-4 text-[#844de9] font-semibold text-sm"
        >
          <FiArrowLeft /> Back to Queue
        </Link>
      </div>
    );
  }

  const PlatformIcon = PLATFORM_ICONS[dm?.platform] || FiShield;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/compliance"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" /> Back to Compliance Queue
        </Link>
        <DMStatusBadge status={dm?.status} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <FiAlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* DM details card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <PlatformIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Reviewing DM to {dm?.recipient}
            </h1>
            <p className="text-xs text-slate-500">
              Platform: <span className="font-semibold">{dm?.platform}</span>
              {dm?.subject ? ` · Campaign: ${dm.subject}` : ""}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-slate-600">
            <FiUser className="w-4 h-4 text-slate-400" />
            <span>
              Author:{" "}
              <strong className="text-slate-800">
                {dm?.createdBy?.name || dm?.createdBy?.email}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <FiClock className="w-4 h-4 text-slate-400" />
            <span>
              Submitted:{" "}
              <strong className="text-slate-800">
                {new Date(dm?.submittedAt || dm?.createdAt).toLocaleString()}
              </strong>
            </span>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            DM Content for Approval:
          </label>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-900 whitespace-pre-wrap leading-relaxed font-sans">
            {dm?.content}
          </div>
        </div>
      </div>

      <DMMediaGallery dmId={dm?.id} media={dm?.media} />

      {/* Prior reviews if any */}
      {dm?.reviews && dm.reviews.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-4">
            Previous Review History
          </h2>
          <ReviewNotes reviews={dm.reviews} />
        </div>
      )}

      {/* Decision form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
          <FiShield className="text-[#844de9]" /> Compliance Decision
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          Select whether this message complies with corporate and regulatory
          standards.
        </p>

        <form onSubmit={handleReviewSubmit} className="space-y-5">
          {/* Action toggle buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setDecision("APPROVED")}
              className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 font-bold text-sm transition-all ${
                decision === "APPROVED"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <FiCheck className="w-5 h-5 text-emerald-600" /> Approve DM
            </button>

            <button
              type="button"
              onClick={() => setDecision("REJECTED")}
              className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 font-bold text-sm transition-all ${
                decision === "REJECTED"
                  ? "border-red-600 bg-red-50 text-red-800 shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <FiX className="w-5 h-5 text-red-600" /> Reject with Feedback
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Reviewer Notes / Feedback{" "}
              {decision === "REJECTED" && (
                <span className="text-red-500">* (Required)</span>
              )}
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                decision === "REJECTED"
                  ? "Explain what needs to be changed (e.g., 'Remove unapproved claims regarding ROI, adjust tone according to compliance guidelines')..."
                  : "Optional approval comments or audit note..."
              }
              className="w-full rounded-xl border border-slate-200 p-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#844de9]/20 focus:border-[#844de9]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href="/compliance"
              className="px-5 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              variant={decision === "APPROVED" ? "primary" : "danger"}
              isLoading={submitting}
              className="px-6"
            >
              Confirm {decision === "APPROVED" ? "Approval" : "Rejection"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
