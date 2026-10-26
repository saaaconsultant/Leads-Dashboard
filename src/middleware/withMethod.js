import { methodNotAllowed } from "@/lib/responseFactory";

export function withMethod(methods, handler) {
  const allowed = Array.isArray(methods) ? methods : [methods];

  return function methodGuardedHandler(req, res) {
    if (!allowed.includes(req.method)) {
      return methodNotAllowed(res, allowed);
    }
    return handler(req, res);
  };
}

export default withMethod;
