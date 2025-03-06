import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const category = searchParams.get("category");

	console.log("category in the getPostsByCategory route ->", category);

	if (!category) {
		return NextResponse.json(
			{ message: "Category not found!" },
			{ status: 404 }
		);
	}

	try {
		const posts = await prisma.post.findMany({
			where: {
				category: category as Category,
			},
			include: {
				createdBy: true,
				comments: true,
				likes: true,
			},
		});

		return NextResponse.json(posts, {
			status: 200,
		});
	} catch (error) {
		console.log("Error Ocurred in the Categories retieval ->", error);

		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
