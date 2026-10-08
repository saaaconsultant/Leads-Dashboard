// import { createHmac, timingSafeEqual } from "node:crypto";

// export const SESSION_COOKIE = "zoho_session";
// const SESSION_DURATION = 60 * 60 * 8;
// const validRoles = ["employee", "teamLead"];

// function getSecret() {
//   const secret = process.env.AUTH_SECRET;
//   if (!secret || secret.length < 32) {
//     throw new Error("AUTH_SECRET must contain at least 32 characters.");
//   }
//   return secret;
// }

// function sign(value) {
//   return createHmac("sha256", getSecret()).update(value).digest("base64url");
// }

// export function authenticateCredentials({ email, password, role }) {
//   if (!validRoles.includes(role) || !email || !password) return null;

//   const prefix = role === "teamLead" ? "TEAM_LEAD" : "EMPLOYEE";
//   const configuredEmail = process.env[`${prefix}_EMAIL`];
//   const configuredPassword = process.env[`${prefix}_PASSWORD`];
//   if (!configuredEmail || !configuredPassword) return null;

//   const emailMatches = email.trim().toLowerCase() === configuredEmail.trim().toLowerCase();
//   const passwordMatches = timingSafeEqual(
//     createHmac("sha256", "zoho-auth-comparison").update(password).digest(),
//     createHmac("sha256", "zoho-auth-comparison").update(configuredPassword).digest(),
//   );

//   return emailMatches && passwordMatches
//     ? { email: configuredEmail.trim(), role }
//     : null;
// }

// export function createSessionToken(user) {
//   const payload = Buffer.from(
//     JSON.stringify({ ...user, expiresAt: Date.now() + SESSION_DURATION * 1000 }),
//   ).toString("base64url");
//   return `${payload}.${sign(payload)}`;
// }

// export function getSessionFromRequest(request) {
//   const cookies = request.headers.cookie || "";
//   const encodedCookie = cookies
//     .split(";")
//     .map((part) => part.trim())
//     .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
//     ?.slice(SESSION_COOKIE.length + 1);

//   if (!encodedCookie) return null;

//   try {
//     const token = decodeURIComponent(encodedCookie);
//     const [payload, signature] = token.split(".");
//     if (!payload || !signature) return null;

//     const expected = Buffer.from(sign(payload));
//     const received = Buffer.from(signature);
//     if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

//     const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
//     if (!validRoles.includes(session.role) || session.expiresAt <= Date.now()) return null;
//     return { email: session.email, role: session.role };
//   } catch {
//     return null;
//   }
// }

// export function sessionCookie(token, maxAge = SESSION_DURATION) {
//   const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
//   return `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${secure}`;
// }

// export function clearSessionCookie() {
//   const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
//   return `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure}`;
// }