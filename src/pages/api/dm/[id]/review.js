import { reviewService } from "@/services";
import { ok, error, serverError } from "@/lib/responseFactory";
import { withRole } from "@/middleware/withRole";
import { withMethod } from "@/middleware/withMethod";

async function handler(req, res) {
  const { id } = req.query;
  const { decision, notes } = req.body ?? {};

  try {
    const dm = await reviewService.reviewDM(req.user.id, id, {
      decision,
      notes,
    });
    return ok(res, { dm });
  } catch (err) {
    if (err instanceof Error) return error(res, err.message);
    return serverError(res, err);
  }
}

export default withMethod(
  "POST",
  withRole(["COMPLIANCE", "TEAM_LEAD", "ADMIN"], handler),
);
