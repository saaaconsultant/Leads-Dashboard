import prisma from "@/lib/prisma";

const CREATED_BY_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
};

const REVIEWER_SELECT = {
  id: true,
  name: true,
  email: true,
};

const FULL_INCLUDE = {
  createdBy: {
    select: CREATED_BY_SELECT,
  },
  reviews: {
    include: {
      reviewer: {
        select: REVIEWER_SELECT,
      },
    },
    orderBy: { createdAt: "asc" },
  },
  media: { select: { id: true, fileName: true, mimeType: true, size: true } },
};

const LIST_INCLUDE = {
  createdBy: {
    select: CREATED_BY_SELECT,
  },
  reviews: {
    include: {
      reviewer: {
        select: REVIEWER_SELECT,
      },
    },
    orderBy: { createdAt: "desc" },
  },
  media: { select: { id: true, fileName: true, mimeType: true, size: true } },
};

const dmRepository = {
  async findById(id) {
    return prisma.dM.findUnique({
      where: { id },
      include: FULL_INCLUDE,
    });
  },

  async findByCreatorId(userId) {
    return prisma.dM.findMany({
      where: { createdById: userId },
      include: LIST_INCLUDE,
      orderBy: { updatedAt: "desc" },
    });
  },

  async findPendingReview() {
    return prisma.dM.findMany({
      where: { status: "PENDING_REVIEW" },
      include: LIST_INCLUDE,
      orderBy: { submittedAt: "asc" },
    });
  },

  async findAll() {
    return prisma.dM.findMany({
      include: LIST_INCLUDE,
      orderBy: { updatedAt: "desc" },
    });
  },

  async create({ content, platform, recipient, subject, createdById, media = [] }) {
    return prisma.dM.create({
      data: {
        content,
        platform,
        recipient,
        subject: subject ?? null,
        status: "DRAFT",
        createdById,
        media: { create: media },
      },
      include: {
        createdBy: {
          select: CREATED_BY_SELECT,
        },
      },
    });
  },

  async update(id, data) {
    const { content, platform, recipient, subject, media = [] } = data;
    const safeData = {};
    if (content !== undefined) safeData.content = content;
    if (platform !== undefined) safeData.platform = platform;
    if (recipient !== undefined) safeData.recipient = recipient;
    if (subject !== undefined) safeData.subject = subject;
    if (media.length) safeData.media = { create: media };

    return prisma.dM.update({
      where: { id },
      data: safeData,
      include: {
        createdBy: {
          select: CREATED_BY_SELECT,
        },
      },
    });
  },

  async updateStatus(id, status, extraFields = {}) {
    return prisma.dM.update({
      where: { id },
      data: {
        status,
        ...extraFields,
      },
      include: {
        createdBy: {
          select: CREATED_BY_SELECT,
        },
      },
    });
  },

  async delete(id) {
    return prisma.dM.delete({
      where: { id },
    });
  },

  async findMediaById(id) {
    return prisma.dMMedia.findUnique({ where: { id } });
  },
};

export default dmRepository;
