import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { deleteContent, uploadContent } from "@/lib/Cloudinary";
import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";
import { isAdmin } from "@/lib/AdminRoleVerification";

interface CloudinaryUploadResult {
	secure_url: string;
	public_id: string;
	[key: string]: string | number | boolean;
}

// functionality to upload the image
export async function POST(request: NextRequest) {
	const { userId } = await auth();

	if (!userId || !(await isAdmin(userId))) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	// if (userId && (await isAdmin(userId))) {
	// 	return NextResponse.json(
	// 		{ message: "welcome Admin is authorized to upload the image!" },
	// 		{ status: 200 }
	// 	);
	// }

	try {
		const formData = await request.formData();
		const file = formData.get("file") as File | null;
		const title = formData.get("title") as string | null;
		const content = formData.get("content") as string | null;
		const categoryString = formData.get("category") as string | null;
		const category = categoryString ? (categoryString as Category) : null;

		console.log("File ->", file);
		console.log("Title ->", title);
		console.log("Content ->", content);
		console.log("Category ->", category);

		if (!file || !title || !content || !category) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		const result = (await uploadContent(file)) as CloudinaryUploadResult;

		console.log("Result Obtained from the Cloudinary! ->", result);

		if (!result) {
			throw new Error("Error : Upload failed in the Cloudinary Process!");
		}

		// Check for user by Clerk ID (clerkId)
		const userExists = await prisma.user.findUnique({
			where: { clerkId: userId },
		});

		console.log("User Exists ->", userExists);

		if (!userExists) {
			return NextResponse.json({ error: "User not found" }, { status: 400 });
		}

		console.log("Final Data to be inserted ->", {
			title,
			content,
			imageURL: result?.secure_url,
			publicID: result?.public_id,
			category,
			createdBy: userId,
		});

		const imageData = await prisma.post.create({
			data: {
				title,
				content,
				imageURL: (result as CloudinaryUploadResult).secure_url,
				publicID: (result as CloudinaryUploadResult).public_id,
				category: category as Category,
				createdBy: { connect: { clerkId: userId } },
			},
		});

		console.log("Image Data ->", imageData);

		return NextResponse.json(
			{ message: "Content is Uploaded, successfully!", success: true },
			{ status: 200 }
		);
	} catch (error) {
		console.log("UPload image failed", error);
		return NextResponse.json({ error: "Upload image failed" }, { status: 500 });
	}
}

// functionality to delete the image
export async function DELETE(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const publicID = searchParams.get("publicID");

	const { userId } = await auth();

	if (!userId || !(await isAdmin(userId))) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	if (userId && (await isAdmin(userId))) {
		return NextResponse.json(
			{ message: "Admin is authorized to delete the image!" },
			{ status: 200 }
		);
	}

	try {
		if (!publicID) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		//Delete the image from the cloudinary!
		const deleteImageFromCloudinary = await deleteContent(publicID);

		if (!deleteImageFromCloudinary) {
			throw new Error("Error : Delete failed in the Cloudinary Process!");
		}
		console.log(
			"Delete the image from the cloudinary ->",
			deleteImageFromCloudinary
		);

		//Delete the image from the Database!
		const result = await prisma.post.delete({
			where: { publicID },
		});

		console.log("Deleted Iamge Result from the Database! ->", result);

		if (!result) {
			throw new Error(
				"Error : Delete failed in the Database deletion Process!"
			);
		}

		return NextResponse.json(
			{ message: "Content is Deleted, successfully!", success: true },
			{ status: 200 }
		);
	} catch (error) {
		console.log("Delete image failed", error);
		return NextResponse.json({ error: "Delete image failed" }, { status: 500 });
	}
}
