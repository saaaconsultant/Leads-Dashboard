import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import DMForm from "@/Components/dm/DMForm";
import { FiArrowLeft, FiCheck } from "react-icons/fi";

export default function CreateDMPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to create DM.");
      setSuccess(true);
      setTimeout(() => router.push("/dm"), 1200);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dm"
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to DMs
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h1 className="text-xl font-bold text-slate-800 mb-1">Create New DM</h1>
        <p className="text-sm text-slate-500 mb-6">
          Draft a direct message for compliance review.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-5 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-5 text-sm text-green-700 flex items-center gap-2">
            <FiCheck className="w-4 h-4" /> DM created! Redirecting…
          </div>
        )}

        <DMForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
