import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Configuration
cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
	public_id: string;
	secure_url: string;
	[key: string]: unknown;
}

//upload the image to the Cloudinary
export async function uploadContent(file: File) {
	if (
		!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
		!process.env.CLOUDINARY_API_KEY ||
		!process.env.CLOUDINARY_API_SECRET
	) {
		return NextResponse.json(
			{ error: "Cloudinary credentials not found" },
			{ status: 500 }
		);
	}

	try {
		console.log("Uploading image to Cloudinary");
		console.log("File for the upload: ", file);

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const result = await new Promise<CloudinaryUploadResult>(
			(resolve, reject) => {
				const uploadStream = cloudinary.uploader.upload_stream(
					{ folder: "next-cloudinary-uploads", resource_type: "auto" },
					(error, result) => {
						if (error) reject(error);
						else resolve(result as CloudinaryUploadResult);
					}
				);
				uploadStream.end(buffer);
			}
		);

		console.log("Cloudinary upload result", result);

		return result;
	} catch (error) {
		console.log("UPload image failed in the Cloudinary Process!", error);
		return NextResponse.json(
			{ error: "Upload image failed in the Cloudinary Process!" },
			{ status: 500 }
		);
	}
}

//Delete the image form the Cloudinary and also form the DB!
export async function deleteContent(publicID: string) {
	if (
		!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
		!process.env.CLOUDINARY_API_KEY ||
		!process.env.CLOUDINARY_API_SECRET
	) {
		return NextResponse.json(
			{ error: "Cloudinary credentials not found" },
			{ status: 500 }
		);
	}

	try {
		console.log("Deleting image from Cloudinary");
		console.log("Public ID for the deletion: ", publicID);

		const deleteResult = await cloudinary.uploader.destroy(publicID);
		console.log("Cloudinary delete result", deleteResult);

		return deleteResult;
	} catch (error) {
		console.log("Delete image failed in the Cloudinary Process!", error);
		return NextResponse.json(
			{ error: "Delete image failed in the Cloudinary Process!" },
			{ status: 500 }
		);
	}
}
