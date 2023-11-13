import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();

	const cookies = req.cookies.get("one-auth")?.value || "";

	// If the user is logged in and tries to access the login page, redirect to dashboard
	if (cookies.length > 0 && req.nextUrl.pathname === "/login") {
		return NextResponse.redirect(new URL("/dashboard", req.url));
	}

	// If the user is not logged in and tries to access the dashboard, redirect to login
	if (cookies.length === 0 && req.nextUrl.pathname !== "/login") {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	return res;
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|auth).*)"],
};
