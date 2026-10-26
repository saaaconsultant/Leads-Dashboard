const statusColorMap = {
  DRAFT: "bg-slate-100 text-slate-600",
  PENDING_REVIEW: "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  SENT: "bg-blue-100 text-blue-700",
};

function toTitleCase(str) {
  return str
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Badge({ status, children, className = "" }) {
  const colorCls = statusColorMap[status] ?? "bg-slate-100 text-slate-600";
  const label = children ?? (status ? toTitleCase(status) : null);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorCls} ${className}`.trim()}
    >
      {label}
    </span>
  );
}
