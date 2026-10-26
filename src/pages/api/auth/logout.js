import { clearSessionCookie } from "@/lib/auth";
import { ok, serverError } from "@/lib/responseFactory";
import { withAuth } from "@/middleware/withAuth";
import { withMethod } from "@/middleware/withMethod";

async function handler(req, res) {
  try {
    res.setHeader("Set-Cookie", clearSessionCookie());
    return ok(res, { message: "Logged out." });
  } catch (err) {
    return serverError(res, err);
  }
}

export default withMethod("POST", withAuth(handler));
