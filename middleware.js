// Auth middleware temporarily disabled — enable after confirming app loads
// To re-enable: uncomment the lines below and redeploy

// export { default } from "next-auth/middleware";
// export const config = {
//   matcher: ["/((?!api/auth|auth/signin|_next/static|_next/image|favicon.ico).*)"],
// };

export function middleware() {}
export const config = { matcher: [] };
