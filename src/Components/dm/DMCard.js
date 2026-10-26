import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaWhatsapp,
} from "react-icons/fa";
import {
  FiEdit2,
  FiSend,
  FiClock,
  FiTrash2,
  FiAlertCircle,
} from "react-icons/fi";
import DMStatusBadge from "@/Components/dm/DMStatusBadge";

const PLATFORM_ICONS = {
  INSTAGRAM: <FaInstagram className="w-4 h-4 text-pink-500" />,
  TWITTER: <FaTwitter className="w-4 h-4 text-sky-500" />,
  LINKEDIN: <FaLinkedin className="w-4 h-4 text-blue-700" />,
  FACEBOOK: <FaFacebook className="w-4 h-4 text-blue-600" />,
  WHATSAPP: <FaWhatsapp className="w-4 h-4 text-green-500" />,
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DMCard({ dm, onSubmit, onEdit, onDelete }) {
  const canAct = dm.status === "DRAFT" || dm.status === "REJECTED";
  const latestReview = dm.reviews?.slice(-1)[0];

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition p-4 shadow-sm">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
            {PLATFORM_ICONS[dm.platform] ?? (
              <span className="text-slate-400 text-xs">{dm.platform?.[0]}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">
              {dm.recipient || (
                <span className="text-slate-400 italic">No recipient</span>
              )}
            </p>
            <p className="text-[11px] text-slate-500">
              {dm.platform} {dm.subject ? `· ${dm.subject}` : ""}
            </p>
          </div>
        </div>
        <DMStatusBadge status={dm.status} />
      </div>

      {/* Content preview */}
      <p className="text-xs text-slate-600 line-clamp-3 mb-3 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
        {dm.content || (
          <span className="italic text-slate-400">Empty post</span>
        )}
      </p>

      {dm.media?.length > 0 && <p className="mb-3 text-[11px] font-medium text-slate-500">{dm.media.length} attachment{dm.media.length === 1 ? "" : "s"}</p>}

      {dm.status === "REJECTED" && latestReview?.notes && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 mb-3 flex items-start gap-2">
          <FiAlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-bold text-rose-700">
              Compliance Reason:
            </p>
            <p className="text-xs text-rose-600">{latestReview.notes}</p>
          </div>
        </div>
      )}

      {/* Footer controls */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1 text-slate-400 text-[11px]">
          <FiClock className="w-3 h-3" />
          <span>{formatDate(dm.createdAt)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {canAct && onEdit && (
            <button
              onClick={() => onEdit(dm.id)}
              className="px-2.5 py-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium transition flex items-center gap-1"
              title="Edit Post"
            >
              <FiEdit2 className="w-3 h-3" /> Edit
            </button>
          )}

          {canAct && onDelete && (
            <button
              onClick={() => onDelete(dm.id)}
              className="px-2.5 py-1 rounded text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-medium transition flex items-center gap-1"
              title="Delete Post"
            >
              <FiTrash2 className="w-3 h-3" /> Delete
            </button>
          )}

          {canAct && onSubmit && (
            <button
              onClick={() => onSubmit(dm.id)}
              className="px-3 py-1 rounded-md text-white bg-[#844de9] hover:bg-[#7337df] font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <FiSend className="w-3 h-3" /> Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
