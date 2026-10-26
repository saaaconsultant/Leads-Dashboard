import { withAuth } from "./withAuth";
import { forbidden } from "@/lib/responseFactory";

export function withRole(roles, handler) {
  const allowed = Array.isArray(roles) ? roles : [roles];

  const roleCheckedHandler = (req, res) => {
    if (!allowed.includes(req.user.role)) {
      return forbidden(res);
    }
    return handler(req, res);
  };

  // Compose: auth check → role check → handler
  return withAuth(roleCheckedHandler);
}

export default withRole;
