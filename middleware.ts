import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;
        const role = token?.role;

        // Role-based redirects with Hierarchy Enforcement
        // Admin Routes: Admin, SuperAdmin, Owner
        if (path.startsWith("/admin") && (!role || !["ADMIN", "SUPER_ADMIN", "OWNER"].includes(role))) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Super Admin Routes: SuperAdmin, Owner
        if (path.startsWith("/super-admin") && (!role || !["SUPER_ADMIN", "OWNER"].includes(role))) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Owner Routes: Owner only
        if (path.startsWith("/owner") && role !== "OWNER") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Instructor Routes
        if (path.startsWith("/instructor") && role !== "INSTRUCTOR") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Student Routes
        if (path.startsWith("/student") && role !== "STUDENT") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: [
        "/student/:path*",
        "/instructor/:path*",
        "/admin/:path*",
        "/super-admin/:path*",
        "/owner/:path*",
    ],
};
