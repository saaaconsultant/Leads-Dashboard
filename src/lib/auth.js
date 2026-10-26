import {
  createHmac,
  timingSafeEqual,
  randomBytes,
  scryptSync,
} from "node:crypto";

export const SESSION_COOKIE = "compliance_session";
const SESSION_DURATION = 60 * 60 * 8;

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET env var must be at least 32 characters.");
  }
  return secret;
}

function sign(value) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, storedHash] = stored.split(":");
  if (!salt || !storedHash) return false;
  const attemptHash = scryptSync(password, salt, 64);
  const storedBuf = Buffer.from(storedHash, "hex");
  if (attemptHash.length !== storedBuf.length) return false;
  return timingSafeEqual(attemptHash, storedBuf);
}

export function createSessionToken(user) {
  const payload = Buffer.from(
    JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      expiresAt: Date.now() + SESSION_DURATION * 1000,
    }),
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token) {
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;

    const expected = Buffer.from(sign(payload));
    const received = Buffer.from(signature);
    if (
      expected.length !== received.length ||
      !timingSafeEqual(expected, received)
    ) {
      return null;
    }

    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    if (!session.id || !session.role || session.expiresAt <= Date.now())
      return null;

    return {
      id: session.id,
      email: session.email,
      name: session.name,
      role: session.role,
    };
  } catch {
    return null;
  }
}

export function getSessionFromRequest(request) {
  const cookies = request.headers.cookie || "";
  const encoded = cookies
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);

  if (!encoded) return null;
  return verifySessionToken(decodeURIComponent(encoded));
}

export function sessionCookie(token, maxAge = SESSION_DURATION) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function clearSessionCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure}`;
}

export const ROLES = {
  EMPLOYEE: "EMPLOYEE",
  COMPLIANCE: "COMPLIANCE",
  TEAM_LEAD: "TEAM_LEAD",
  ADMIN: "ADMIN",
};

export const ROLE_HIERARCHY = [
  ROLES.EMPLOYEE,
  ROLES.COMPLIANCE,
  ROLES.TEAM_LEAD,
  ROLES.ADMIN,
];

export function hasRole(role, allowed) {
  return allowed.includes(role);
}

export function roleRedirect(role) {
  const map = {
    [ROLES.EMPLOYEE]: "/dashboard",
    [ROLES.COMPLIANCE]: "/compliance",
    [ROLES.TEAM_LEAD]: "/dashboard",
    [ROLES.ADMIN]: "/dashboard",
  };
  return map[role] ?? "/dashboard";
}
