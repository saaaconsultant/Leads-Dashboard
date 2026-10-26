import { authService } from "@/services";
import { createSessionToken, sessionCookie, roleRedirect } from "@/lib/auth";
import { ok, error, serverError } from "@/lib/responseFactory";
import { withMethod } from "@/middleware/withMethod";

async function handler(req, res) {
  const { email, password } = req.body ?? {};

  try {
    const user = await authService.login({ email, password });
    const token = createSessionToken(user);
    res.setHeader("Set-Cookie", sessionCookie(token));
    return ok(res, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      redirectTo: roleRedirect(user.role),
    });
  } catch (err) {
    if (err instanceof Error) {
      return error(res, err.message, 401);
    }
    return serverError(res, err);
  }
}

export default withMethod("POST", handler);
