import Badge from "@/Components/ui/Badge";

const STATUS_LABELS = {
  DRAFT: "Draft",
  PENDING_REVIEW: "Pending Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  SENT: "Sent",
};

export default function DMStatusBadge({ status }) {
  return <Badge status={status}>{STATUS_LABELS[status] ?? status}</Badge>;
}
