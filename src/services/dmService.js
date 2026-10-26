import dmRepository from "@/repositories/dmRepository";

const EDITABLE_STATUSES = ["DRAFT", "REJECTED"];
const MAX_MEDIA_FILES = 5;
const MAX_MEDIA_BYTES = 15 * 1024 * 1024;
const ALLOWED_MEDIA_TYPES = new Set([
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "video/mp4", "video/webm", "video/quicktime",
]);

function prepareMedia(files = []) {
  if (!Array.isArray(files)) throw new Error("Attachments must be a list of files.");
  if (files.length > MAX_MEDIA_FILES) throw new Error(`Upload up to ${MAX_MEDIA_FILES} images or videos.`);

  let totalBytes = 0;
  return files.map((file) => {
    if (!file || typeof file.fileName !== "string" || typeof file.mimeType !== "string" || typeof file.data !== "string") {
      throw new Error("An uploaded attachment is invalid.");
    }
    if (!ALLOWED_MEDIA_TYPES.has(file.mimeType)) throw new Error("Use JPG, PNG, GIF, WebP, MP4, WebM, or MOV files.");
    const base64 = file.data.replace(/^data:[^,]*;base64,/, "");
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) throw new Error("An uploaded attachment could not be read.");
    const data = Buffer.from(base64, "base64");
    if (!data.length) throw new Error("An uploaded attachment is empty.");
    const validSignature = {
      "image/jpeg": () => data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff,
      "image/png": () => data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
      "image/gif": () => ["GIF87a", "GIF89a"].includes(data.toString("ascii", 0, 6)),
      "image/webp": () => data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP",
      "video/mp4": () => data.toString("ascii", 4, 8) === "ftyp",
      "video/quicktime": () => data.toString("ascii", 4, 8) === "ftyp" && data.toString("ascii", 8, 12).startsWith("qt"),
      "video/webm": () => data.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3])),
    }[file.mimeType];
    if (!validSignature || !validSignature()) throw new Error(`${file.fileName} does not match its declared file type.`);
    totalBytes += data.length;
    if (totalBytes > MAX_MEDIA_BYTES) throw new Error("Attachments must total 15 MB or less.");
    return {
      fileName: file.fileName.slice(0, 255),
      mimeType: file.mimeType,
      size: data.length,
      data,
    };
  });
}

const dmService = {
  async getMyDMs(userId) {
    return dmRepository.findByCreatorId(userId);
  },

  async getAllDMs() {
    return dmRepository.findAll();
  },

  async getDM(id) {
    const dm = await dmRepository.findById(id);
    if (!dm) {
      throw new Error(`DM with id "${id}" not found.`);
    }
    return dm;
  },

  async createDM(userId, { content, platform, recipient, subject, attachments }) {
    if (!content?.trim()) {
      throw new Error("DM content is required.");
    }
    if (!platform) {
      throw new Error("Platform is required.");
    }
    if (!recipient?.trim()) {
      throw new Error("Recipient is required.");
    }

    return dmRepository.create({
      content: content.trim(),
      platform,
      recipient: recipient.trim(),
      subject: subject?.trim() ?? null,
      createdById: userId,
      media: prepareMedia(attachments),
    });
  },

  async updateDM(userId, id, data) {
    const dm = await dmRepository.findById(id);
    if (!dm) {
      throw new Error(`DM with id "${id}" not found.`);
    }
    if (dm.createdById !== userId) {
      throw new Error("You do not have permission to edit this DM.");
    }
    if (!EDITABLE_STATUSES.includes(dm.status)) {
      throw new Error(
        `DM cannot be edited in its current state (${dm.status}). Only DRAFT or REJECTED DMs may be modified.`,
      );
    }

    return dmRepository.update(id, {
      ...data,
      media: prepareMedia(data.attachments),
    });
  },

  async submitForReview(userId, id) {
    const dm = await dmRepository.findById(id);
    if (!dm) {
      throw new Error(`DM with id "${id}" not found.`);
    }
    if (dm.createdById !== userId) {
      throw new Error("You do not have permission to submit this DM.");
    }
    if (!EDITABLE_STATUSES.includes(dm.status)) {
      throw new Error("DM cannot be submitted in its current state.");
    }

    return dmRepository.updateStatus(id, "PENDING_REVIEW", {
      submittedAt: new Date(),
    });
  },

  async getMedia(dmId, mediaId) {
    const media = await dmRepository.findMediaById(mediaId);
    if (!media || media.dmId !== dmId) return null;
    return media;
  },

  async deleteDM(userId, userRole, id) {
    const dm = await dmRepository.findById(id);
    if (!dm) {
      throw new Error(`DM with id "${id}" not found.`);
    }
    const isOwner = dm.createdById === userId;
    const isPrivileged = userRole === "ADMIN" || userRole === "TEAM_LEAD";

    if (!isOwner && !isPrivileged) {
      throw new Error("You do not have permission to delete this DM.");
    }

    if (!isPrivileged && !EDITABLE_STATUSES.includes(dm.status)) {
      throw new Error(
        "You can only delete DMs that are in DRAFT or REJECTED status.",
      );
    }

    return dmRepository.delete(id);
  },
};

export default dmService;
