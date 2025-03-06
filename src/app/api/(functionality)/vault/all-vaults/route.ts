import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//Get all the vaults of the user!
export async function GET() {
	try {
		const { userId } = await auth();
		// const userId = "user_2sJIyezjngUEdffPDXTnSJULLnf";

		if (!userId) {
			return new Response("Unauthorized", { status: 401 });
		}

		const user = await prisma.user.findUnique({
			where: { clerkId: userId },
		});

		if (!user) {
			return NextResponse.json({ error: "User not found!" }, { status: 404 });
		}

		// Get all the vaults of the user from the database!
		const vaults = await prisma.vault.findMany({
			where: {
				userId: user.id,
			},
			include: {
				post: true,
			},
		});

		//Testing purposes!
		console.log("vaults : ", vaults);

		if (!vaults) {
			return NextResponse.json(
				{
					error: "Failed to fetch the vaults!, Due to some internal error!",
					success: "false",
				},
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{
				message: "Vaults fetched successfully! 👍",
				success: "true",
				vaults: vaults,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log("error : ", error);
		return NextResponse.json(
			{
				error: "Failed to fetch the vaults!",
				success: "false",
			},
			{ status: 400 }
		);
	}
}
