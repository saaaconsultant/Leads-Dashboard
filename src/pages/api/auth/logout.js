// import { clearSessionCookie } from "@/lib/auth";

// export default function handler(request, response) {
//   if (request.method !== "POST") {
//     response.setHeader("Allow", "POST");
//     return response.status(405).json({ message: "Method not allowed." });
//   }

//   response.setHeader("Set-Cookie", clearSessionCookie());
//   return response.redirect(303, "/");
// }