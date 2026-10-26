import { userRepository } from "@/repositories";
import { authService } from "@/services";
import {
  ok,
  created,
  error,
  forbidden,
  serverError,
} from "@/lib/responseFactory";
import { withAuth } from "@/middleware/withAuth";

async function handler(req, res) {
  try {
    if (req.method === "GET") {
      if (!["TEAM_LEAD", "ADMIN"].includes(req.user.role))
        return forbidden(res);
      const users = await userRepository.findAll();
      return ok(res, { users });
    }
    if (req.method === "POST") {
      if (req.user.role !== "ADMIN") return forbidden(res);
      const user = await authService.createUser(req.body ?? {});
      return created(res, { user });
    }
    res.setHeader("Allow", "GET, POST");
    return error(res, "Method not allowed.", 405);
  } catch (err) {
    if (err?.code === "P2002")
      return error(res, "An account with this email already exists.", 409);
    if (err instanceof Error) return error(res, err.message);
    return serverError(res, err);
  }
}

export default withAuth(handler);
