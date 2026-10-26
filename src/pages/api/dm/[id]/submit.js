import { dmService } from "@/services";
import { ok, error, serverError } from "@/lib/responseFactory";
import { withAuth } from "@/middleware/withAuth";
import { withMethod } from "@/middleware/withMethod";

async function handler(req, res) {
  const { id } = req.query;

  try {
    const dm = await dmService.submitForReview(req.user.id, id);
    return ok(res, { dm });
  } catch (err) {
    if (err instanceof Error) return error(res, err.message);
    return serverError(res, err);
  }
}

export default withMethod("POST", withAuth(handler));
