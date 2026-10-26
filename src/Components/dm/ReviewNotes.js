import { FiCheckCircle, FiXCircle, FiMessageSquare } from "react-icons/fi";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReviewNotes({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <FiMessageSquare className="w-8 h-8 text-slate-300 mb-3" />
        <p className="text-sm font-medium text-slate-500">No reviews yet</p>
        <p className="text-xs text-slate-400 mt-1">
          Review history will appear here once submitted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {reviews.map((review, idx) => {
        const isApproved = review.decision === "APPROVED";
        return (
          <div key={review.id ?? idx} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isApproved ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {isApproved ? (
                  <FiCheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <FiXCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
              {idx < reviews.length - 1 && (
                <div className="w-px flex-1 bg-slate-200 my-1" />
              )}
            </div>
            {/* Content */}
            <div className="pb-6 flex-1">
              <div className="flex items-center justify-between flex-wrap gap-1 mb-1">
                <span className="text-sm font-semibold text-slate-800">
                  {review.reviewer?.name ?? "Reviewer"}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isApproved
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isApproved ? "Approved" : "Rejected"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-2">
                {formatDate(review.createdAt)}
              </p>
              {review.notes && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {review.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
