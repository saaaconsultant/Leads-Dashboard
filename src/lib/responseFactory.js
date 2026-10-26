export function ok(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function created(res, data) {
  return ok(res, data, 201);
}

export function error(res, message, status = 400) {
  return res.status(status).json({ success: false, message });
}

export function unauthorized(res) {
  return error(res, "Authentication required.", 401);
}

export function forbidden(res) {
  return error(res, "You do not have permission to perform this action.", 403);
}

export function notFound(res, resource = "Resource") {
  return error(res, `${resource} not found.`, 404);
}

export function methodNotAllowed(res, allowed) {
  res.setHeader("Allow", allowed.join(", "));
  return error(res, `Method not allowed. Allowed: ${allowed.join(", ")}`, 405);
}

export function serverError(res, err) {
  const message =
    process.env.NODE_ENV === "development"
      ? err instanceof Error
        ? err.message
        : String(err ?? "Internal server error.")
      : "An unexpected error occurred.";
  return error(res, message, 500);
}
