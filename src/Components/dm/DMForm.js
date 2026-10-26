import { useState } from "react";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaWhatsapp,
} from "react-icons/fa";
import Button from "@/Components/ui/Button";
import { FiImage, FiUploadCloud, FiVideo, FiX } from "react-icons/fi";

const PLATFORMS = [
  {
    id: "INSTAGRAM",
    name: "Instagram",
    icon: FaInstagram,
    color: "text-pink-500",
  },
  {
    id: "TWITTER",
    name: "X / Twitter",
    icon: FaTwitter,
    color: "text-sky-500",
  },
  {
    id: "LINKEDIN",
    name: "LinkedIn",
    icon: FaLinkedin,
    color: "text-blue-700",
  },
  {
    id: "FACEBOOK",
    name: "Facebook",
    icon: FaFacebook,
    color: "text-blue-600",
  },
  {
    id: "WHATSAPP",
    name: "WhatsApp",
    icon: FaWhatsapp,
    color: "text-green-500",
  },
];

const inputClass =
  "w-full h-10 rounded-lg border border-slate-300 px-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#844de9] focus:ring-1 focus:ring-[#844de9] transition";
const labelClass = "block text-xs font-semibold text-slate-700 mb-1";

export default function DMForm({ initialData, onSubmit, isLoading }) {
  const [files, setFiles] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [form, setForm] = useState({
    platform: initialData?.platform ?? "INSTAGRAM",
    recipient: initialData?.recipient ?? "",
    subject: initialData?.subject ?? "",
    content: initialData?.content ?? "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError("");
    try {
      const attachments = await Promise.all(files.map((file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ fileName: file.name, mimeType: file.type, data: reader.result });
        reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
        reader.readAsDataURL(file);
      })));
      onSubmit({ ...form, attachments });
    } catch (error) {
      setUploadError(error.message || "Could not read the selected files.");
    }
  };

  const handleFiles = (event) => {
    const selected = Array.from(event.target.files ?? []);
    const current = files;
    const next = [...current, ...selected];
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm", "video/quicktime"];
    const totalBytes = next.reduce((sum, file) => sum + file.size, 0);
    if (next.length > 5) setUploadError("Choose up to 5 images or videos.");
    else if (next.some((file) => !allowedTypes.includes(file.type))) setUploadError("Use JPG, PNG, GIF, WebP, MP4, WebM, or MOV files.");
    else if (totalBytes > 15 * 1024 * 1024) setUploadError("Attachments must total 15 MB or less.");
    else {
      setFiles(next);
      setUploadError("");
    }
    event.target.value = "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Social Platform</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {PLATFORMS.map((p) => {
            const Icon = p.icon;
            const isSelected = form.platform === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setForm((f) => ({ ...f, platform: p.id }))}
                className={`flex items-center sm:flex-col justify-center gap-1.5 rounded-lg border p-2 transition text-left sm:text-center ${
                  isSelected
                    ? "border-[#844de9] bg-[#844de9]/10 shadow-sm"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isSelected ? "text-[#844de9]" : p.color}`}
                />
                <span
                  className={`text-[11px] font-semibold ${
                    isSelected ? "text-[#844de9]" : "text-slate-700"
                  }`}
                >
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="recipient" className={labelClass}>
          Recipient / Handle <span className="text-[#844de9]">*</span>
        </label>
        <input
          id="recipient"
          name="recipient"
          type="text"
          required
          placeholder="@username, contact name, or phone number"
          value={form.recipient}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="subject" className={labelClass}>
          Campaign / Subject Tag{" "}
          <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder="e.g. Q4 Outreach, Customer Onboarding, Demo Offer"
          value={form.subject}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="dm-media">Images and videos <span className="text-slate-400 font-normal">(Optional · up to 5 files, 15 MB total)</span></label>
        <label htmlFor="dm-media" className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-xs font-semibold text-slate-600 transition hover:border-[#844de9] hover:bg-[#844de9]/5">
          <FiUploadCloud className="h-4 w-4 text-[#844de9]" /> Select images or videos
        </label>
        <input id="dm-media" type="file" multiple accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime" onChange={handleFiles} className="sr-only" />
        {(files.length > 0 || initialData?.media?.length > 0) && <div className="mt-2 space-y-1.5">
          {initialData?.media?.map((media) => <div key={media.id} className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600"><FiImage className="h-3.5 w-3.5" /><span className="truncate">{media.fileName}</span><span className="ml-auto text-slate-400">Attached</span></div>)}
          {files.map((file, index) => <div key={`${file.name}-${index}`} className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">{file.type.startsWith("video/") ? <FiVideo className="h-3.5 w-3.5" /> : <FiImage className="h-3.5 w-3.5" />}<span className="truncate">{file.name}</span><button type="button" aria-label={`Remove ${file.name}`} onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="ml-auto rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><FiX /></button></div>)}
        </div>}
        {uploadError && <p role="alert" className="mt-2 text-xs text-rose-600">{uploadError}</p>}
      </div>

      <div>
        <label htmlFor="content" className={labelClass}>
          Post Body <span className="text-[#844de9]">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={5}
          placeholder="Type your post text here..."
          value={form.content}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#844de9] focus:ring-1 focus:ring-[#844de9] transition resize-none leading-relaxed"
        />
        <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
          <span>Will be reviewed by Compliance before sending.</span>
          <span>{form.content.length} chars</span>
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full py-2.5"
        >
          {initialData ? "Save Changes" : "Save as Draft"}
        </Button>
      </div>
    </form>
  );
}
