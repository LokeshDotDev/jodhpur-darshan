import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const commentId = searchParams.get("commentId");

	const requestBody = await request.json();
	const { newText } = requestBody;

	const { userId } = await auth();
	// const userId = "user_2sJIyezjngUEdffPDXTnSJULLnf";

	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const user = await prisma.user.findUnique({
		where: { clerkId: userId },
	});

	if (!user) {
		return NextResponse.json({ error: "User not found!" }, { status: 404 });
	}

	if (!commentId) {
		return NextResponse.json(
			{
				error: "Please provide the comment ID!, through Params",
				success: "false",
			},
			{ status: 400 }
		);
	}

	if (!newText) {
		return NextResponse.json(
			{
				error: "Please provide the new content of the comment!",
				success: "false",
			},
			{ status: 400 }
		);
	}

	const oldComment = await prisma.comment.findUnique({
		where: { id: commentId },
	});

	console.log("oldComment : ", oldComment);

	if (oldComment?.userId !== user.id) {
		return NextResponse.json(
			{
				error:
					"You are not the Owner of this Comment ,so you are not Authorized to Edit this Comment!",
				success: "false",
			},
			{ status: 404 }
		);
	}

	const updateComment = await prisma.comment.update({
		where: { id: commentId },
		data: {
			text: newText,
		},
	});

	console.log("updateComment : ", updateComment);

	if (!updateComment) {
		return NextResponse.json(
			{
				error: "Comment is not updated ,due to some error!",
				success: "false",
			},
			{ status: 500 }
		);
	}

	return NextResponse.json(
		{
			message: "Comment is updated Successfully! 👍",
			success: "true",
			comment: updateComment,
		},
		{ status: 200 }
	);
}

export async function DELETE(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const commentId = searchParams.get("commentId");

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

	if (!commentId) {
		return NextResponse.json(
			{
				error: "Please provide the comment ID!, through Params",
				success: "false",
			},
			{ status: 400 }
		);
	}

	const ownerComment = await prisma.comment.findUnique({
		where: { id: commentId },
	});

	console.log("ownerComment : ", ownerComment);

	if (!ownerComment) {
		return NextResponse.json(
			{
				error: "Comment not found in the comment model!",
				success: "false",
			},
			{ status: 404 }
		);
	}

	if (!(ownerComment.userId === user.id)) {
		return NextResponse.json(
			{
				error:
					"You are not the Owner of this Comment ,so you are not Authorized to Delete this Comment!",
				success: "false",
			},
			{ status: 404 }
		);
	}

	const deleteComment = await prisma.comment.delete({
		where: { id: commentId },
	});

	if (!deleteComment) {
		return NextResponse.json(
			{
				error: "Comment is not deleted ,due to some error!",
				success: "false",
			},
			{ status: 500 }
		);
	}

	return NextResponse.json(
		{
			message: "Comment is deleted Successfully! 👍",
			success: "true",
		},
		{ status: 200 }
	);
}
