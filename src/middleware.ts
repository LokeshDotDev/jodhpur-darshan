import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoutes = [
	"/",
	"/sign-in",
	"/sign-up",
	"/api/webhook/register",
	"/sso-callback",
	// "/api/vault/all-vaults",
	// "/api/vault/edit",
	// "/api/vault",
];

export default clerkMiddleware(async (auth, req) => {
	// Extracting the user data from the auth object
	const user = await auth();
	const userId = user.userId;
	const role = user.sessionClaims?.metadata?.role;

	// If the user is not logged in and the route is not public, redirect to the login page
	if (!userId && !isPublicRoutes.includes(req.nextUrl.pathname)) {
		return NextResponse.redirect(new URL("/sign-in", req.url));
	}

	// If the user is logged in
	if (userId) {
		try {
			// Redirect all signed-in users to the /preview section initially
			if (req.nextUrl.pathname === "/") {
				return NextResponse.redirect(new URL("/preview", req.url));
			}

			// If admin user is trying to access the normal dashboard, redirect to the admin dashboard
			if (role === "admin" && req.nextUrl.pathname.startsWith("/dashboard")) {
				return NextResponse.redirect(new URL("/admin/dashboard", req.url));
			}

			// If normal user is trying to access the admin dashboard, redirect to the user's dashboard
			if (role !== "admin" && req.nextUrl.pathname.startsWith("/admin")) {
				return NextResponse.redirect(new URL("/admin/dashboard", req.url));
			}

			// If the user is logged in and trying to access the public routes, redirect to the preview section
			if (isPublicRoutes.includes(req.nextUrl.pathname)) {
				return NextResponse.redirect(new URL("/preview", req.url));
			}
		} catch (error) {
			console.log(
				"Error in middleware when the data is fetching through the Clerk",
				error
			);
			return NextResponse.redirect(new URL("/sign-in", req.url));
		}
	}
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
