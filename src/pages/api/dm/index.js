import { dmService } from "@/services";
import {
  ok,
  created,
  error,
  methodNotAllowed,
  serverError,
} from "@/lib/responseFactory";
import { withAuth } from "@/middleware/withAuth";
import { ROLES } from "@/lib/auth";

async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const privilegedRoles = [ROLES.COMPLIANCE, ROLES.TEAM_LEAD, ROLES.ADMIN];
      const dms = privilegedRoles.includes(req.user.role)
        ? await dmService.getAllDMs()
        : await dmService.getMyDMs(req.user.id);
      return ok(res, { dms });
    } catch (err) {
      if (err instanceof Error) return error(res, err.message);
      return serverError(res, err);
    }
  }

  if (req.method === "POST") {
    try {
      const { content, platform, recipient, subject } = req.body ?? {};
      const dm = await dmService.createDM(req.user.id, {
        content,
        platform,
        recipient,
        subject,
        attachments: req.body?.attachments,
      });
      return created(res, { dm });
    } catch (err) {
      if (err instanceof Error) return error(res, err.message);
      return serverError(res, err);
    }
  }

  return methodNotAllowed(res, ["GET", "POST"]);
}

export default withAuth(handler);

export const config = {
  api: { bodyParser: { sizeLimit: "22mb" } },
};
