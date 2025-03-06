import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const postId = searchParams.get("postId");

	const { userId } = await auth();

	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		if (!postId) {
			return NextResponse.json(
				{ error: "Please provide the POST ID!" },
				{ status: 400 }
			);
		}

		console.log("postId -> ", postId);

		const postFounded = await prisma.post.findUnique({
			where: { id: postId },
		});

		console.log("postFounded", postFounded);

		if (!postFounded) {
			return NextResponse.json(
				{ error: "Post not foundin the post model!" },
				{ status: 404 }
			);
		}

		const user = await prisma.user.findUnique({
			where: { clerkId: userId },
		});

		if (!user) {
			return NextResponse.json({ error: "User not found!" }, { status: 404 });
		}

		const alreadyLikedPost = await prisma.like.findFirst({
			where: {
				postId: postId,
				userId: user.id,
			},
		});

		console.log("alreadyLikedPost", alreadyLikedPost);

		if (alreadyLikedPost) {
			await prisma.like.delete({
				where: {
					id: alreadyLikedPost.id,
				},
			});
			return NextResponse.json(
				{
					error:
						"You already liked this post!, now it's Disliked successfully!",
				},
				{ status: 200 }
			);
		}

		const likePost = await prisma.like.create({
			data: {
				post: {
					connect: {
						id: postId,
					},
				},
				owner: {
					connect: {
						id: user.id,
					},
				},
			},
		});

		if (!likePost) {
			return NextResponse.json(
				{ error: "Unfortunately Like failed!" },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: "Liked successfully! 👍", likePost },
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

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const page = searchParams.get("page") || "1";
	const limit = searchParams.get("limit") || "10";

	const { userId } = await auth();
	// const userId = "user_2sJIyezjngUEdffPDXTnSJULLnf";

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

		const likedPosts = await prisma.like.findMany({
			where: {
				userId: user.id,
			},
			include: {
				post: true,
			},
			take: parseInt(limit),
			skip: (parseInt(page) - 1) * parseInt(limit),
		});

		console.log("likedPosts: ", likedPosts);

		if (!likedPosts || likedPosts.length === 0) {
			return NextResponse.json(
				{ error: "No liked posts found!" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{
				message: "Liked posts fetched successfully!",
				LikedPosts: likedPosts,
				succes: true,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log("Error fetching liked posts", error);
		return NextResponse.json(
			{ error: "Error fetching liked posts" },
			{ status: 500 }
		);
	}
}
