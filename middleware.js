export { default } from "next-auth/middleware";

// ── Protect everything EXCEPT the auth routes themselves ─────────────────────
// The middleware intercepts every request and redirects to /auth/signin
// if the user has no valid session cookie.
export const config = {
  matcher: [
    "/((?!api/auth|auth/signin|_next/static|_next/image|favicon.ico).*)",
  ],
};
