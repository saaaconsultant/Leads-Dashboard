import dmRepository from "@/repositories/dmRepository";
import reviewRepository from "@/repositories/reviewRepository";

const VALID_DECISIONS = ["APPROVED", "REJECTED"];

const reviewService = {
  async getPendingQueue() {
    return dmRepository.findPendingReview();
  },

  async reviewDM(reviewerId, dmId, { decision, notes }) {
    if (!decision || !VALID_DECISIONS.includes(decision)) {
      throw new Error(
        `Invalid decision "${decision}". Must be one of: ${VALID_DECISIONS.join(", ")}.`,
      );
    }
    if (decision === "REJECTED" && !notes?.trim()) {
      throw new Error("Notes are required when rejecting a DM.");
    }

    const dm = await dmRepository.findById(dmId);
    if (!dm) {
      throw new Error(`DM with id "${dmId}" not found.`);
    }
    if (dm.status !== "PENDING_REVIEW") {
      throw new Error(
        `DM is not pending review (current status: ${dm.status}). Only PENDING_REVIEW DMs can be reviewed.`,
      );
    }

    await reviewRepository.create({
      dmId,
      reviewerId,
      decision,
      notes: notes?.trim() ?? null,
    });
    const extraFields =
      decision === "APPROVED" ? { approvedAt: new Date() } : {};

    const updatedDm = await dmRepository.updateStatus(
      dmId,
      decision,
      extraFields,
    );

    return updatedDm;
  },
};

export default reviewService;
