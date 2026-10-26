import { reviewService } from "@/services";
import { ok, error, serverError } from "@/lib/responseFactory";
import { withRole } from "@/middleware/withRole";
import { withMethod } from "@/middleware/withMethod";

async function handler(req, res) {
  try {
    const dms = await reviewService.getPendingQueue();
    return ok(res, { dms });
  } catch (err) {
    if (err instanceof Error) return error(res, err.message);
    return serverError(res, err);
  }
}

export default withMethod(
  "GET",
  withRole(["COMPLIANCE", "TEAM_LEAD", "ADMIN"], handler),
);
