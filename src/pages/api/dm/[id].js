import { dmService } from "@/services";
import {
  ok,
  error,
  forbidden,
  notFound,
  methodNotAllowed,
  serverError,
} from "@/lib/responseFactory";
import { withAuth } from "@/middleware/withAuth";
import { ROLES } from "@/lib/auth";

async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const dm = await dmService.getDM(id);
      if (!dm) return notFound(res, "DM");

      if (req.user.role === ROLES.EMPLOYEE && dm.createdById !== req.user.id) {
        return forbidden(res);
      }

      return ok(res, { dm });
    } catch (err) {
      if (err instanceof Error) return error(res, err.message);
      return serverError(res, err);
    }
  }

  if (req.method === "PUT") {
    try {
      const dm = await dmService.updateDM(req.user.id, id, req.body ?? {});
      return ok(res, { dm });
    } catch (err) {
      if (err instanceof Error) return error(res, err.message);
      return serverError(res, err);
    }
  }

  if (req.method === "DELETE") {
    try {
      await dmService.deleteDM(req.user.id, req.user.role, id);
      return ok(res, { message: "Message deleted successfully." });
    } catch (err) {
      if (err instanceof Error) return error(res, err.message);
      return serverError(res, err);
    }
  }

  return methodNotAllowed(res, ["GET", "PUT", "DELETE"]);
}

export default withAuth(handler);

export const config = {
  api: { bodyParser: { sizeLimit: "22mb" } },
};
