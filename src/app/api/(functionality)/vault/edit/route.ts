import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Add a post to the vault!
export async function PUT(request: NextRequest) {
	try {
		// Extracting the postID and the VaultId from the request params!
		const { searchParams } = new URL(request.url);
		const postId = searchParams.get("postId");
		const vaultId = searchParams.get("vaultId");

		// Extracting the user from the clerk session!
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

		// Validating the postID and the VaultId!
		if (!postId || !vaultId) {
			return NextResponse.json(
				{
					error: "Please provide the post ID and the Vault ID!, through Params",
					success: "false",
				},
				{ status: 400 }
			);
		}

		const postExists = await prisma.post.findUnique({
			where: { id: postId },
		});

		const vaultExists = await prisma.vault.findUnique({
			where: { id: vaultId },
		});

		if (!(postExists && vaultExists)) {
			return NextResponse.json(
				{
					error: "Post or Vault not found!",
					success: "false",
				},
				{ status: 404 }
			);
		}

		// Check if the user owns the post
		if (postExists.createdById !== user.id) {
			return NextResponse.json(
				{
					error: "You are not the owner of this post!",
					success: "false",
				},
				{ status: 403 }
			);
		}

		// Check if the post is already in the vault
		if (vaultExists.postId === postId) {
			return NextResponse.json(
				{
					message: "Post is already in the vault!",
					success: "true",
				},
				{ status: 200 }
			);
		}

		// Add the post to the vault
		const updatedVault = await prisma.vault.update({
			where: { id: vaultId },
			data: {
				post: {
					connect: { id: postId },
				},
			},
		});

		return NextResponse.json(
			{
				message: "Post added to the vault successfully!",
				success: "true",
				vault: updatedVault,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log("error : ", error);
		return NextResponse.json(
			{
				error: "Failed to update the vault!",
				success: "false",
			},
			{ status: 500 }
		);
	}
}

// Delete a post from the vault!
export async function DELETE(request: NextRequest) {
	try {
		// Extracting the postID and the VaultId from the request params!
		const { searchParams } = new URL(request.url);
		const postId = searchParams.get("postId");
		const vaultId = searchParams.get("vaultId");

		// Extracting the user from the clerk session!
		const { userId } = await auth();
		// const userId = "user_2sJIyezjngUEdffPDXTnSJULLnf";

		if (!userId) {
			return new Response("Unauthorized", { status: 401 });
		}

		// Validating the postID and the VaultId!
		if (!postId || !vaultId) {
			return NextResponse.json(
				{
					error: "Please provide the post ID and the Vault ID!, through Params",
					success: "false",
				},
				{ status: 400 }
			);
		}

		// Check if the post is in the vault
		const vault = await prisma.vault.findUnique({
			where: { id: vaultId },
			include: { post: true },
		});

		if (!vault || vault.postId !== postId) {
			return NextResponse.json(
				{
					message: "Post is not in the vault!",
					success: "false",
				},
				{ status: 404 }
			);
		}

		// Remove the post from the vault
		const updatedVault = await prisma.vault.update({
			where: { id: vaultId },
			data: {
				post: {
					disconnect: true,
				},
			},
		});

		return NextResponse.json(
			{
				message: "Post removed from the vault successfully!",
				success: "true",
				vault: updatedVault,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log("error : ", error);
		return NextResponse.json(
			{
				error: "Failed to delete the post from the vault!",
				success: "false",
			},
			{ status: 500 }
		);
	}
}
