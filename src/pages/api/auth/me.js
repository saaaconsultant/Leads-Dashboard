import { ok, serverError } from "@/lib/responseFactory";
import { withAuth } from "@/middleware/withAuth";
import { withMethod } from "@/middleware/withMethod";

async function handler(req, res) {
  try {
    return ok(res, { user: req.user });
  } catch (err) {
    return serverError(res, err);
  }
}

export default withMethod("GET", withAuth(handler));
