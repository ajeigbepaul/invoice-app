import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

export const proxy = withAuth(
  function proxy(req: NextRequest) {
    // This proxy runs only for authenticated users
    // The withAuth middleware handles unauthenticated users by redirecting to login
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Return true to allow the request, false to reject it
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

// Configure which routes should be protected
export const config = {
  matcher: [
    // Protect all routes except:
    // - Auth pages (login, register)
    // - API routes for auth and registration
    // - Static files
    "/((?!api/auth|api/register|auth/login|auth/register|_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
