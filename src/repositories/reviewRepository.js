import prisma from "@/lib/prisma";

const REVIEWER_SELECT = {
  id: true,
  name: true,
  email: true,
};

const reviewRepository = {
  async findByDmId(dmId) {
    return prisma.review.findMany({
      where: { dmId },
      include: {
        reviewer: {
          select: REVIEWER_SELECT,
        },
      },
      orderBy: { createdAt: "asc" },
    });
  },

  async findLatestByDmId(dmId) {
    return prisma.review.findFirst({
      where: { dmId },
      include: {
        reviewer: {
          select: REVIEWER_SELECT,
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async create({ dmId, reviewerId, decision, notes }) {
    return prisma.review.create({
      data: {
        dmId,
        reviewerId,
        decision,
        notes: notes ?? null,
      },
      include: {
        reviewer: {
          select: REVIEWER_SELECT,
        },
      },
    });
  },
};

export default reviewRepository;
