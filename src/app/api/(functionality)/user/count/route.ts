import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const userCount = await prisma.user.count();
		return NextResponse.json({ count: userCount }, { status: 200 });
	} catch (error) {
		console.error("Error fetching user count:", error);
		return NextResponse.json(
			{ error: "Failed to fetch user count" },
			{ status: 500 }
		);
	}
}
