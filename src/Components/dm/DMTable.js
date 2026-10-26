import React from "react";
import Link from "next/link";
import DMStatusBadge from "@/Components/dm/DMStatusBadge";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaWhatsapp,
} from "react-icons/fa";
import {
  FiEdit2,
  FiTrash2,
  FiSend,
  FiAlertCircle,
  FiCheck,
  FiArrowRight,
  FiUser,
} from "react-icons/fi";

const PLATFORM_ICONS = {
  INSTAGRAM: <FaInstagram className="w-3.5 h-3.5 text-pink-500" />,
  TWITTER: <FaTwitter className="w-3.5 h-3.5 text-sky-500" />,
  LINKEDIN: <FaLinkedin className="w-3.5 h-3.5 text-blue-700" />,
  FACEBOOK: <FaFacebook className="w-3.5 h-3.5 text-blue-600" />,
  WHATSAPP: <FaWhatsapp className="w-3.5 h-3.5 text-green-500" />,
};

export default function DMTable({
  dms = [],
  onSubmit,
  onEdit,
  onDelete,
  showAuthor = false,
  isComplianceView = false,
}) {
  if (!dms || dms.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 whitespace-nowrap">Platform</th>
              <th className="py-3 px-4 whitespace-nowrap">Recipient</th>
              <th className="py-3 px-4 min-w-[280px]">Content</th>
              <th className="py-3 px-4 whitespace-nowrap">Status</th>
              <th className="py-3 px-4 min-w-[220px]">Remark</th>
              {showAuthor && (
                <th className="py-3 px-4 whitespace-nowrap">Created By</th>
              )}
              <th className="py-3 px-4 whitespace-nowrap">Date</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {dms.map((dm) => {
              const canAct = dm.status === "DRAFT" || dm.status === "REJECTED";
              const latestReview = dm.reviews?.[0] || dm.reviews?.slice(-1)[0];

              return (
                <tr
                  key={dm.id}
                  className="hover:bg-slate-50/80 transition-colors align-top"
                >
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <span className="p-1 rounded bg-slate-100 flex-shrink-0">
                        {PLATFORM_ICONS[dm.platform]}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Link
                      href={`/dm/${dm.id}`}
                      className="font-bold text-slate-900 hover:text-[#844de9] hover:underline block text-xs"
                    >
                      {dm.recipient}
                    </Link>
                    {dm.subject && (
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                        Tag: {dm.subject}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 text-xs leading-relaxed max-w-md whitespace-pre-wra p-2.5 rounded-lg">
                      {dm.content || (
                        <span className="text-slate-400 italic">
                          No content
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <DMStatusBadge status={dm.status} />
                  </td>

                  <td className="py-3.5 px-4">
                    {dm.status === "REJECTED" && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-lg text-xs leading-relaxed">
                        <div className="flex items-center gap-1 font-bold text-rose-900 text-[11px] mb-0.5">
                          <FiAlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                          <span>Revision Required:</span>
                        </div>
                        <p className="font-medium text-rose-800">
                          {latestReview?.notes ||
                            "Rejected. Please update post."}
                        </p>
                        {latestReview?.reviewer?.name && (
                          <span className="text-[10px] text-rose-600 block mt-1">
                            By: {latestReview.reviewer.name}
                          </span>
                        )}
                      </div>
                    )}

                    {dm.status === "APPROVED" && (
                      <div className=" p-2 rounded-lg text-xs leading-relaxed">
                        {latestReview?.notes && (
                          <p className="text-[11px] text-emerald-700 mt-0.5 italic">
                            {latestReview.notes}
                          </p>
                        )}
                      </div>
                    )}

                    {dm.status === "PENDING_REVIEW" && (
                      <span className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 font-medium inline-block">
                        In Review Queue
                      </span>
                    )}

                    {dm.status === "DRAFT" && (
                      <span className="text-[11px] text-slate-400 italic">
                        Draft (not submitted yet)
                      </span>
                    )}
                  </td>

                  {showAuthor && (
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <FiUser className="w-3 h-3 text-slate-400" />
                        <span>
                          {dm.createdBy?.name || dm.createdBy?.email || "—"}
                        </span>
                      </div>
                    </td>
                  )}

                  {/* Date */}
                  <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                    {new Date(dm.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      {canAct && onSubmit && (
                        <button
                          type="button"
                          onClick={() => onSubmit(dm.id)}
                          className="px-2.5 py-1 rounded bg-[#844de9] hover:bg-[#7337df] text-white font-semibold text-[11px] flex items-center gap-1 shadow-sm transition"
                          title="Submit for Compliance Review"
                        >
                          <FiSend className="w-3 h-3" /> Submit
                        </button>
                      )}

                      {/* Edit button */}
                      {canAct && onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(dm.id)}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
                          title="Edit Post"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {canAct && onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(dm.id)}
                          className="p-1.5 rounded hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition"
                          title="Delete Post"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {isComplianceView && dm.status === "PENDING_REVIEW" && (
                        <Link
                          href={`/compliance/${dm.id}`}
                          className="px-2.5 py-1 rounded bg-[#1d273d] hover:bg-[#2b3a5a] text-white font-semibold text-[11px] flex items-center gap-1 shadow-sm transition"
                        >
                          Review <FiArrowRight className="w-3 h-3" />
                        </Link>
                      )}

                      <Link
                        href={`/dm/${dm.id}`}
                        className="p-1 rounded text-slate-400 hover:text-slate-800 font-bold transition ml-1"
                        title="View details"
                      >
                        →
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
