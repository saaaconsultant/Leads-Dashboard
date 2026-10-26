import { dmService } from "@/services";
import { error, forbidden, notFound, serverError } from "@/lib/responseFactory";
import { withAuth } from "@/middleware/withAuth";
import { ROLES } from "@/lib/auth";

async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return error(res, "Method not allowed.", 405);
  }

  try {
    const { id, mediaId } = req.query;
    const dm = await dmService.getDM(id);
    if (req.user.role === ROLES.EMPLOYEE && dm.createdById !== req.user.id) return forbidden(res);
    const media = await dmService.getMedia(id, mediaId);
    if (!media) return notFound(res, "Attachment");

    res.setHeader("Content-Type", media.mimeType);
    res.setHeader("Content-Length", media.size);
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "private, no-store");
    return res.status(200).send(media.data);
  } catch (err) {
    if (err instanceof Error) return error(res, err.message, 404);
    return serverError(res, err);
  }
}

export default withAuth(handler);
