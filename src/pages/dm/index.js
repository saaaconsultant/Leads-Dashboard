import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import DMCard from "@/Components/dm/DMCard";
import DMTable from "@/Components/dm/DMTable";
import DMForm from "@/Components/dm/DMForm";
import Modal from "@/Components/ui/Modal";
import {
  FiPlus,
  FiSearch,
  FiGrid,
  FiList,
  FiMessageSquare,
} from "react-icons/fi";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaWhatsapp,
} from "react-icons/fa";

const PLATFORM_ICONS = {
  INSTAGRAM: <FaInstagram className="w-4 h-4 text-pink-500" />,
  TWITTER: <FaTwitter className="w-4 h-4 text-sky-500" />,
  LINKEDIN: <FaLinkedin className="w-4 h-4 text-blue-700" />,
  FACEBOOK: <FaFacebook className="w-4 h-4 text-blue-600" />,
  WHATSAPP: <FaWhatsapp className="w-4 h-4 text-green-500" />,
};

const TABS = [
  { key: "ALL", label: "All Posts" },
  { key: "DRAFT", label: "Drafts" },
  { key: "PENDING_REVIEW", label: "Pending Review" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Needs Revision" },
];

export default function DMListPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [dms, setDms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDm, setEditingDm] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const fetchDMs = async () => {
    try {
      const res = await fetch("/api/dm").then((r) => r.json());
      if (res.success) {
        const list = Array.isArray(res.data) ? res.data : res.data?.dms || [];
        setDms(list);
      } else {
        setError(res.message || "Could not load posts.");
      }
    } catch {
      setError("Network error fetching posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDMs();
  }, []);

  const handleSubmitReview = async (id) => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/dm/${id}/submit`, { method: "POST" }).then(
        (r) => r.json(),
      );
      if (res.success) {
        setSuccess("Post submitted for Compliance team review!");
        fetchDMs();
      } else {
        setError(res.message || "Failed to submit post.");
      }
    } catch {
      setError("Network error submitting post.");
    }
  };

  const handleOpenCreate = () => {
    setEditingDm(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dm) => {
    setEditingDm(dm);
    setIsModalOpen(true);
  };

  const handleSaveDm = async (formData) => {
    setModalLoading(true);
    setError("");
    setSuccess("");

    try {
      if (editingDm) {
        const res = await fetch(`/api/dm/${editingDm.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }).then((r) => r.json());

        if (res.success) {
          setSuccess("Post updated successfully!");
          setIsModalOpen(false);
          fetchDMs();
        } else {
          setError(res.message || "Failed to update post.");
        }
      } else {
        const res = await fetch("/api/dm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }).then((r) => r.json());

        if (res.success) {
          setSuccess("New post created in Drafts!");
          setIsModalOpen(false);
          fetchDMs();
        } else {
          setError(res.message || "Failed to create post.");
        }
      }
    } catch {
      setError("Error saving post.");
    } finally {
      setModalLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/dm/${deletingId}`, {
        method: "DELETE",
      }).then((r) => r.json());
      if (res.success) {
        setSuccess("Post deleted successfully.");
        setDeletingId(null);
        fetchDMs();
      } else {
        setError(res.message || "Failed to delete post.");
      }
    } catch {
      setError("Network error deleting post.");
    }
  };

  const dmList = Array.isArray(dms) ? dms : [];
  const filtered = dmList.filter((dm) => {
    const matchesTab = activeTab === "ALL" || dm.status === activeTab;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      dm.recipient?.toLowerCase().includes(q) ||
      dm.content?.toLowerCase().includes(q) ||
      dm.platform?.toLowerCase().includes(q) ||
      dm.subject?.toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              DMs
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Create, edit, delete, and send DMs for compliance approval.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-slate-600">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded ${viewMode === "table" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"}`}
                title="Table View"
              >
                <FiList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-white text-slate-900 shadow-sm" : "hover:text-slate-900"}`}
                title="Grid View"
              >
                <FiGrid className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleOpenCreate}
              className="bg-[#844de9] hover:bg-[#7337df] text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <FiPlus className="w-4 h-4" /> New Post
            </button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1">
            {TABS.map((tab) => {
              const count =
                tab.key === "ALL"
                  ? dmList.length
                  : dmList.filter((d) => d.status === tab.key).length;

              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    active
                      ? "bg-[#844de9] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search recipient, text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#844de9]"
            />
          </div>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between">
          <span>{success}</span>
          <button
            onClick={() => setSuccess("")}
            className="text-emerald-600 font-bold ml-2"
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="text-rose-600 font-bold ml-2"
          >
            ×
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-[#844de9] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <FiMessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-800">
            No Posts Found
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {search
              ? "No posts match your search query."
              : activeTab !== "ALL"
                ? `No posts under status "${activeTab}".`
                : "Start by composing your first social media post draft."}
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#844de9] hover:underline"
          >
            <FiPlus className="w-3.5 h-3.5" /> Create a Post
          </button>
        </div>
      )}

      {!loading && filtered.length > 0 && viewMode === "table" && (
        <DMTable
          dms={filtered}
          onSubmit={handleSubmitReview}
          onEdit={(id) => {
            const found = filtered.find((d) => d.id === id);
            if (found) handleOpenEdit(found);
          }}
          onDelete={(id) => setDeletingId(id)}
          showAuthor={user?.role === "ADMIN" || user?.role === "TEAM_LEAD"}
        />
      )}

      {!loading && filtered.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((dm) => (
            <DMCard
              key={dm.id}
              dm={dm}
              onSubmit={handleSubmitReview}
              onEdit={() => handleOpenEdit(dm)}
              onDelete={() => setDeletingId(dm.id)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingDm
            ? `Edit Post to ${editingDm.recipient}`
            : "Create New Social Post"
        }
      >
        <DMForm
          initialData={editingDm}
          onSubmit={handleSaveDm}
          isLoading={modalLoading}
        />
      </Modal>

      <Modal
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Are you sure you want to delete this post? This action is
            permanent and cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setDeletingId(null)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
            >
              Delete Post
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
