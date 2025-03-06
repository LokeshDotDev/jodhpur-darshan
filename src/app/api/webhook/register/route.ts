import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
	const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

	if (!WEBHOOK_SECRET) {
		throw new Error(
			"Please Add the Webhook secret from the Clerk's Dashboard to the .ENV file!"
		);
	}

	const headerPayload = headers();
	const svix_id = (await headerPayload).get("svix-id");
	const svix_timestamp = (await headerPayload).get("svix-timestamp");
	const svix_signature = (await headerPayload).get("svix-signature");

	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response("Error Occurred --no SVIX headers found!", {
			status: 400,
		});
	}

	const payload = await req.json();
	const body = JSON.stringify(payload);

	const wh = new Webhook(WEBHOOK_SECRET);
	let event: WebhookEvent;

	try {
		event = wh.verify(body, {
			"svix-id": svix_id,
			"svix-timestamp": svix_timestamp,
			"svix-signature": svix_signature,
		}) as WebhookEvent;
	} catch (err) {
		console.log("Error Occurred in verification of the webhooks: ", err);
		return new Response("Error Occurred in webhooks verification!", {
			status: 400,
		});
	}

	const { id } = event.data;
	const eventType = event.type;

	console.log(`Webhook with the ID of ${id} and the type of ${eventType}`);
	console.log("Webhook body: ", body);
	console.log("Event's Data: ", event.data);

	if (eventType === "user.created") {
		try {
			const {
				email_addresses,
				primary_email_address_id,
				username,
				first_name,
				last_name,
			} = event.data;

			const primaryEmail = email_addresses.find(
				(email) => email.id === primary_email_address_id
			);

			if (!primaryEmail) {
				console.error("No Primary Email is found!");
				return new Response("No Primary Email is found!", { status: 400 });
			}

			const finalUsername =
				username ||
				`${first_name || "user"}_${
					last_name || (id ? id.substring(0, 5) : "default")
				}`;

			const newUser = await prisma.user.create({
				data: {
					id: event.data.id!,
					email: primaryEmail.email_address,
					username: finalUsername,
				},
			});

			console.log("New User created successfully! 🤘", newUser);
		} catch (error) {
			console.error("Error occurred when creating the user in Database", error);

			return new Response(
				"Error Occurred when creating the User in Database!",
				{
					status: 500,
				}
			);
		}
	}

	return new Response("Webhook Received Successfully 🤘", { status: 200 });
}
