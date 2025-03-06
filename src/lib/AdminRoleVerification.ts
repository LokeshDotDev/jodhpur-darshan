import { auth } from "@clerk/nextjs/server";

export async function isAdmin(userId: string) {
	const user = await auth();
	if (user.userId !== userId) {
		return false;
	}
	const userRole = user.sessionClaims?.metadata?.role;
	return userRole === "admin";
}
