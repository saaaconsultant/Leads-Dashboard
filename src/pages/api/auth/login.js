// import {
//   authenticateCredentials,
//   createSessionToken,
//   sessionCookie,
// } from "@/lib/auth";

// export default function handler(request, response) {
//   if (request.method !== "POST") {
//     response.setHeader("Allow", "POST");
//     return response.status(405).json({ message: "Method not allowed." });
//   }

//   try {
//     const user = authenticateCredentials(request.body || {});
//     if (!user) {
//       return response.status(401).json({ message: "Email, password, or role is incorrect." });
//     }

//     const token = createSessionToken(user);
//     const remember = request.body.remember === true;
//     response.setHeader("Set-Cookie", sessionCookie(token, remember ? 60 * 60 * 24 * 30 : undefined));
//     return response.status(200).json({
//       redirectTo: user.role === "teamLead" ? "/leads" : "/dashboard",
//     });
//   } catch (error) {
//     return response.status(500).json({ message: "Authentication is not configured correctly." });
//   }
// }