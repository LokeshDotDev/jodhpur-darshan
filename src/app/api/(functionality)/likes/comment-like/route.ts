import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const commentId = searchParams.get("commentId");

	const { userId } = await auth();

	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const user = await prisma.user.findUnique({
			where: { clerkId: userId },
		});

		if (!user) {
			return NextResponse.json({ error: "User not found!" }, { status: 404 });
		}

		if (!commentId) {
			return NextResponse.json(
				{ error: "Please provide the Comment ID!" },
				{ status: 400 }
			);
		}

		const commentFounded = await prisma.comment.findUnique({
			where: { id: commentId },
		});

		console.log("commentFounded : ", commentFounded);

		if (!commentFounded) {
			return NextResponse.json(
				{ error: "Comment not found in the comment model!" },
				{ status: 404 }
			);
		}

		const alreadyLikedComment = await prisma.like.findFirst({
			where: {
				commentId: commentId,
				userId: user.id,
			},
		});

		console.log("alreadyLikedComment : ", alreadyLikedComment);

		if (alreadyLikedComment) {
			await prisma.like.delete({
				where: {
					id: alreadyLikedComment.id,
				},
			});
			return NextResponse.json(
				{
					error:
						"You already liked this Comment!, now it's Disliked successfully!",
				},
				{ status: 200 }
			);
		}

		const likeComment = await prisma.like.create({
			data: {
				comment: {
					connect: {
						id: commentId,
					},
				},
				owner: {
					connect: {
						id: user.id,
					},
				},
			},
		});

		if (!likeComment) {
			return NextResponse.json(
				{ error: "Unfortunately Like failed!" },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: "Liked successfully! 👍", likeComment },
			{ status: 200 }
		);
	} catch (error) {
		console.log("Unfortunately Like failed!", error);
		return NextResponse.json(
			{ error: "Unfortunately Like failed!" },
			{ status: 500 }
		);
	}
}
