import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

//Getting all the comments of the post!
export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const postId = searchParams.get("postId");
	const page = searchParams.get("page") || "1";
	const limit = searchParams.get("limit") || "10";

	if (!postId) {
		return NextResponse.json(
			{
				error: "please provide the post ID!",
			},
			{ status: 400 }
		);
	}

	const postFounded = await prisma.post.findUnique({
		where: { id: postId },
	});

	if (!postFounded) {
		return NextResponse.json(
			{
				error: "Post not found in the post model!",
			},
			{ status: 404 }
		);
	}

	console.log("postFounded : ", postFounded);

	const commentsFounded = await prisma.comment.findMany({
		where: {
			postId: postId,
		},
		include: {
			owner: true, // Include the owner (user) data
			likes: true, // Include the likes data
		},
		take: parseInt(limit),
		skip: (parseInt(page) - 1) * parseInt(limit),
	});

	console.log("commentsFounded", commentsFounded);

	return NextResponse.json(
		{
			comments: commentsFounded,
			message: "Comments founded successfully!",
			success: true,
		},
		{ status: 200 }
	);
}

//functionality to create the comment!
export async function POST(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const postId = searchParams.get("postId");
	const requestBody = await request.json();
	const { text } = requestBody;

	const { userId } = await auth();

	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const user = await prisma.user.findUnique({
		where: { clerkId: userId },
	});

	if (!user) {
		return NextResponse.json({ error: "User not found!" }, { status: 404 });
	}

	if (!postId) {
		return NextResponse.json(
			{
				error: "Please provide the post ID!",
				success: "false",
			},
			{ status: 400 }
		);
	}

	if (!text) {
		return NextResponse.json(
			{ error: "Please provide the content of the comment!", success: "false" },
			{ status: 400 }
		);
	}

	const postContent = await prisma.post.findUnique({
		where: { id: postId },
	});

	if (!postContent) {
		return NextResponse.json(
			{
				error: "Post not found in the post model!",
				success: "false",
			},
			{ status: 404 }
		);
	}

	const creatingComment = await prisma.comment.create({
		data: {
			text: text,
			postId: postId,
			userId: user.id,
		},
	});

	console.log("creatingComment : ", creatingComment);

	if (!creatingComment) {
		return NextResponse.json(
			{ error: "Comment is not created ,due to some error!" },
			{ status: 500 }
		);
	}

	return NextResponse.json(
		{
			message: "Comment is created Successfully! 👍",
			success: "true",
			comment: creatingComment,
		},
		{ status: 201 }
	);
}
