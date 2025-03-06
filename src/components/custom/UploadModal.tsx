"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { PiUploadSimpleFill } from "react-icons/pi";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from "@/components/ui/dialog";
import Selection from "@/components/custom/Selection";

const FormSchema = z.object({
	title: z.string().min(2, {
		message: "Title must be at least 2 characters.",
	}),
	content: z
		.string()
		.min(10, {
			message: "Content must be at least 10 characters.",
		})
		.max(100, {
			message: "Content is only 100 characters long!",
		}),
	category: z.string().nonempty({
		message: "Category is required.",
	}),
});

interface UploadModalProps {
	isOpen: boolean;
	onClose: () => void;
	onUploadSuccess?: () => void;
}

export default function UploadModal({
	isOpen,
	onClose,
	onUploadSuccess,
}: UploadModalProps) {
	const [file, setFile] = useState<File | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: "",
			content: "",
			category: "",
		},
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		if (!file) {
			toast({
				title: "Error",
				description: "Please upload a picture.",
				variant: "destructive",
			});
			return;
		}

		setIsLoading(true);

		const formData = new FormData();
		formData.append("title", data.title);
		formData.append("content", data.content);
		formData.append("category", data.category);
		formData.append("file", file);

		try {
			const response = await axios.post("/api/post", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (response.status === 200) {
				toast({
					title: "Success",
					description: "Image uploaded successfully!",
					variant: "default",
				});
				form.reset();
				setFile(null);
				onUploadSuccess?.();
				onClose();
			} else {
				toast({
					title: "Error",
					description: "Failed to upload image.",
					variant: "destructive",
				});
			}
		} catch {
			toast({
				title: "Error",
				description: "Failed to upload image.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[425px] bg-white rounded-lg shadow-lg'>
				<DialogHeader>
					<DialogTitle className='text-2xl font-bold text-gray-800'>
						Upload Your Image
					</DialogTitle>
					<DialogDescription className='text-sm text-gray-500'>
						Fill out the form below to upload an image to your portal.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
						<FormField
							control={form.control}
							name='title'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-sm font-medium text-gray-700'>
										Title
									</FormLabel>
									<FormControl>
										<Input
											placeholder='Enter a title'
											className='w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md'
											{...field}
										/>
									</FormControl>
									<FormMessage className='text-xs text-red-600' />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='content'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-sm font-medium text-gray-700'>
										Content
									</FormLabel>
									<FormControl>
										<Input
											placeholder='Write some content (10-100 characters)'
											className='w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md'
											{...field}
										/>
									</FormControl>
									<FormMessage className='text-xs text-red-600' />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='category'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-sm font-medium text-gray-700'>
										Category
									</FormLabel>
									<FormControl>
										<Selection
											{...field}
										/>
									</FormControl>
									<FormMessage className='text-xs text-red-600' />
								</FormItem>
							)}
						/>
						<FormItem>
							<FormLabel className='text-sm font-medium text-gray-700'>
								Upload Picture
							</FormLabel>
							<FormControl>
								<Input
									id='picture'
									type='file'
									accept='image/*'
									onChange={(e) => {
										if (e.target.files) {
											setFile(e.target.files[0]);
										}
									}}
									className='w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
								/>
							</FormControl>
							<FormDescription className='text-xs text-gray-500'>
								Upload an image file (e.g., PNG, JPG).
							</FormDescription>
							<FormMessage className='text-xs text-red-600' />
						</FormItem>
						<DialogFooter>
							<Button
								type='submit'
								disabled={isLoading}
								className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400'>
								<PiUploadSimpleFill className='w-5 h-5' />
								{isLoading ? "Submitting..." : "Submit"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
