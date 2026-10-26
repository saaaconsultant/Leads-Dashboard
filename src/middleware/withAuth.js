import { getSessionFromRequest } from "@/lib/auth";
import { unauthorized } from "@/lib/responseFactory";

export function withAuth(handler) {
  return function authenticatedHandler(req, res) {
    const session = getSessionFromRequest(req);
    if (!session) {
      return unauthorized(res);
    }
    req.user = session;
    return handler(req, res);
  };
}

export default withAuth;
