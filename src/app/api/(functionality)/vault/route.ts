import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

//Create a new vault for the user!
export async function POST(request: NextRequest) {
	try {
		// Get the user from the clerk session!

		const { userId } = await auth();
		// const userId = "user_2sJIyezjngUEdffPDXTnSJULLnf";

		if (!userId) {
			return new Response("Unauthorized", { status: 401 });
		}

		// get the name  and description of the vault from the request!

		const user = await prisma.user.findUnique({
			where: { clerkId: userId },
		});

		if (!user) {
			return NextResponse.json({ error: "User not found!" }, { status: 404 });
		}

		const requestBody = await request.json();
		const { name, description } = requestBody;

		if (!(name && description)) {
			return NextResponse.json(
				{
					error: "Please provide a name and the description of the vault!",
					success: "false",
				},
				{ status: 400 }
			);
		}

		//for testing  purposes!
		console.log(
			"Creating a new vault with name: ",
			name,
			" and description: ",
			description
		);

		//getting the postID from the params for adding it to the vault (1 post is required for a vault)
		const { searchParams } = new URL(request.url);
		const postId = searchParams.get("postId");

		if (!postId) {
			return NextResponse.json(
				{
					error:
						"Please provide the postId of the post you want to add to the vault! (1 post is required for a vault)",
					success: "false",
				},
				{ status: 400 }
			);
		}

		// Create a new vault in the database!
		const newVault = await prisma.vault.create({
			data: {
				name: name,
				description:
					description || "This is the Default description ,through hardcoded",
				userId: user.id,
				postId: postId,
			},
		});

		//Testing purposes!
		console.log("newVault : ", newVault);

		if (!newVault) {
			return NextResponse.json(
				{
					error: "Failed to create the vault!, Due to some internal error!",
					success: "false",
				},
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{
				message: "Vault created successfully! 👍",
				success: "true",
				newVault: newVault,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log("error : ", error);
		return NextResponse.json(
			{
				error: "Failed to create the vault!, Due to some internal error!",
				success: "false",
			},
			{ status: 400 }
		);
	}
}

//get specific vault by id for the user!
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const vaultId = searchParams.get("vaultId");

		const { userId } = await auth();
		// const userId = "user_2sJIyezjngUEdffPDXTnSJULLnf";

		if (!userId) {
			return new Response("Unauthorized", { status: 401 });
		}

		if (!vaultId) {
			return NextResponse.json(
				{
					error: "Please provide the vault ID!, through Params",
					success: "false",
				},
				{ status: 400 }
			);
		}

		const vault = await prisma.vault.findUnique({
			where: { id: vaultId },
			include: {
				post: true,
			},
		});

		if (!vault) {
			return NextResponse.json(
				{
					error: "Vault not found in the vault model!",
					success: "false",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			message: "Vault fetched successfully! 👍",
			success: "true",
			vault: vault,
		});
	} catch (error) {
		console.log("error : ", error);
		return NextResponse.json(
			{
				error: "Failed to fetch the vault!",
				success: "false",
			},
			{ status: 400 }
		);
	}
}

//Update the vault's name and the Description!
export async function PUT(request: NextRequest) {
	try {
		//Extracting the vaultId from the request params!
		const { searchParams } = new URL(request.url);
		const vaultId = searchParams.get("vaultId");

		//Extracting the name and Description from the request body!
		const requestBody = await request.json();
		const { name, description } = requestBody;

		// Extracting the user from the clerk session!
		const { userId } = await auth();
		// const userId = "user_2sJIyezjngUEdffPDXTnSJULLnf";

		if (!userId) {
			return new Response("Unauthorized", { status: 401 });
		}

		if (!vaultId) {
			return NextResponse.json(
				{
					error: "Please provide the vault ID!, through Params",
					success: "false",
				},
				{ status: 400 }
			);
		}

		if (!(name && description)) {
			return NextResponse.json(
				{
					error: "Please provide a name and the description of the vault!",
					success: "false",
				},
				{ status: 400 }
			);
		}

		// Update the vault in the database!
		const updatedVault = await prisma.vault.update({
			where: { id: vaultId },
			data: {
				name: name,
				description: description,
			},
		});

		//Testing purposes!
		console.log("updatedVault : ", updatedVault);

		if (!updatedVault) {
			return NextResponse.json(
				{
					error: "Failed to update the vault!, Due to some internal error!",
					success: "false",
				},
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{
				message: "Vault updated successfully! 👍",
				success: "true",
				updatedVault: updatedVault,
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
			{ status: 400 }
		);
	}
}

// Delete the vault!
export async function DELETE(request: NextRequest) {
	try {
		// Extracting the vaultId from the request params!
		const { searchParams } = new URL(request.url);
		const vaultId = searchParams.get("vaultId");

		// Extracting the user from the clerk session!
		const { userId } = await auth();
		// const userId = "user_2sJIyezjngUEdffPDXTnSJULLnf";

		if (!userId) {
			return new Response("Unauthorized", { status: 401 });
		}

		// Validating the vaultId!
		if (!vaultId) {
			return NextResponse.json(
				{
					error: "Please provide the vault ID!, through Params",
					success: "false",
				},
				{ status: 400 }
			);
		}

		// Check if the vault exists
		const vault = await prisma.vault.findUnique({
			where: { id: vaultId },
		});

		if (!vault) {
			return NextResponse.json(
				{
					error: "Vault not found!",
					success: "false",
				},
				{ status: 404 }
			);
		}

		// Check if the user owns the vault
		if (vault.userId !== userId) {
			return NextResponse.json(
				{
					error: "You are not the owner of this vault!",
					success: "false",
				},
				{ status: 403 }
			);
		}

		// Delete the vault
		await prisma.vault.delete({
			where: { id: vaultId },
		});

		return NextResponse.json(
			{
				message: "Vault deleted successfully!",
				success: "true",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log("error : ", error);
		return NextResponse.json(
			{
				error: "Failed to delete the vault!",
				success: "false",
			},
			{ status: 500 }
		);
	}
}
