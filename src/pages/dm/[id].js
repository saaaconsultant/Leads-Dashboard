import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import DMStatusBadge from "@/Components/dm/DMStatusBadge";
import DMForm from "@/Components/dm/DMForm";
import ReviewNotes from "@/Components/dm/ReviewNotes";
import DMMediaGallery from "@/Components/dm/DMMediaGallery";
import Button from "@/Components/ui/Button";
import {
  FiArrowLeft,
  FiSend,
  FiClock,
  FiUser,
  FiGlobe,
  FiTrash2,
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

export default function DMDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const [dm, setDm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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

  const handleUpdate = async (formData) => {
    setSaving(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await fetch(`/api/dm/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }).then((r) => r.json());

      if (res.success) {
        setSuccessMsg("DM updated successfully!");
        setDm(res.data.dm || res.data);
      } else {
        setError(res.message || "Failed to update DM");
      }
    } catch {
      setError("Network error while updating");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (
      !confirm("Are you sure you want to submit this DM for Compliance review?")
    )
      return;
    setSubmitting(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await fetch(`/api/dm/${id}/submit`, {
        method: "POST",
      }).then((r) => r.json());

      if (res.success) {
        setSuccessMsg("Submitted for Compliance review!");
        setDm(res.data.dm || res.data);
      } else {
        setError(res.message || "Failed to submit DM for review");
      }
    } catch {
      setError("Network error submitting DM");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/dm/${id}`, { method: "DELETE" }).then((r) =>
        r.json(),
      );
      if (res.success) {
        router.push("/dm");
      } else {
        setError(res.message || "Failed to delete DM");
      }
    } catch {
      setError("Network error deleting DM");
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
          href="/dm"
          className="inline-flex items-center gap-2 mt-4 text-[#844de9] font-semibold text-sm"
        >
          <FiArrowLeft /> Back to DMs
        </Link>
      </div>
    );
  }

  const isEditable = dm?.status === "DRAFT" || dm?.status === "REJECTED";
  const PlatformIcon = PLATFORM_ICONS[dm?.platform] || FiGlobe;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" /> Back to DMs
        </Link>
        <DMStatusBadge status={dm?.status} />
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <PlatformIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                To: {dm?.recipient}
              </h1>
              <p className="text-xs text-slate-500">
                Platform: <span className="font-semibold">{dm?.platform}</span>
                {dm?.subject ? ` · Campaign: ${dm?.subject}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isEditable && (
              <>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3.5 py-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-semibold transition flex items-center gap-1.5"
                >
                  <FiTrash2 className="w-4 h-4" /> Delete
                </button>
                <Button
                  variant="primary"
                  onClick={handleSubmitForReview}
                  isLoading={submitting}
                  className="flex items-center gap-2"
                >
                  <FiSend className="w-4 h-4" /> Submit for Review
                </Button>
              </>
            )}
            {(user?.role === "COMPLIANCE" ||
              user?.role === "ADMIN" ||
              user?.role === "TEAM_LEAD") &&
              dm?.status === "PENDING_REVIEW" && (
                <Link
                  href={`/compliance/${dm.id}`}
                  className="bg-[#1d273d] hover:bg-[#2b3a5a] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  Go to Compliance Review →
                </Link>
              )}
          </div>
        </div>

        <div className="flex flex-wrap gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <FiUser className="w-3.5 h-3.5" /> Created by:{" "}
            <strong className="text-slate-700 font-semibold">
              {dm?.createdBy?.name || "You"}
            </strong>
          </span>
          <span className="flex items-center gap-1.5">
            <FiClock className="w-3.5 h-3.5" /> Created:{" "}
            <strong className="text-slate-700 font-semibold">
              {new Date(dm?.createdAt).toLocaleString()}
            </strong>
          </span>
          {dm?.submittedAt && (
            <span className="flex items-center gap-1.5">
              <FiSend className="w-3.5 h-3.5" /> Submitted:{" "}
              <strong className="text-slate-700 font-semibold">
                {new Date(dm.submittedAt).toLocaleString()}
              </strong>
            </span>
          )}
        </div>
      </div>

      {dm?.reviews && dm.reviews.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-4">
            Compliance Review History
          </h2>
          <ReviewNotes reviews={dm.reviews} />
        </div>
      )}

      <DMMediaGallery dmId={dm?.id} media={dm?.media} />

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-4">
          {isEditable ? "Edit DM Details & Content" : "DM Message Content"}
        </h2>

        {isEditable ? (
          <div>
            {dm?.status === "REJECTED" && (
              <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-lg">
                ⚠️ This DM was rejected. Please review the notes above, update
                your message accordingly, and click{" "}
                <strong>Submit for Review</strong>.
              </div>
            )}
            <DMForm
              initialData={dm}
              onSubmit={handleUpdate}
              isLoading={saving}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Recipient
              </label>
              <p className="text-sm font-medium text-slate-800">
                {dm?.recipient}
              </p>
            </div>
            {dm?.subject && (
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Campaign / Subject
                </label>
                <p className="text-sm font-medium text-slate-800">
                  {dm.subject}
                </p>
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Message Body
              </label>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {dm?.content}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
