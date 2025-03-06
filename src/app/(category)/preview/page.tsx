"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CldImage } from "next-cloudinary";
import { BiSolidLike } from "react-icons/bi";
import { FaRegBookmark } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "@/components/custom/Loader";

interface Post {
	id: string;
	title: string;
	content: string;
	imageURL?: string;
	publicID?: string;
	createdAt: string;
	likes: {
		id: string;
		userId: string;
		postId: string;
		commentId: string | null;
	}[];
}

interface Category {
	name: string;
	posts: Post[];
}

const PreviewPage: React.FC = () => {
	const router = useRouter();
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const categoriesList = [
			"Landmarks",
			"Lakes",
			"Markets",
			"Savours",
			"Temples",
			"Arts",
			"Museum",
			"Hotels",
		];
		const fetchPostsByCategories = async () => {
			try {
				const categoryPromises = categoriesList.map(async (category) => {
					const response = await fetch(
						`/api/getPostsByCategory?category=${category}`
					);
					if (!response.ok) {
						throw new Error(
							`Error fetching ${category}: ${response.statusText}`
						);
					}
					const data = await response.json();
					return { name: category, posts: data.slice(0, 3) }; // Limit to 3 posts per category
				});

				const categoriesData = await Promise.all(categoryPromises);
				setCategories(categoriesData);
			} catch (error) {
				console.error("Error fetching posts:", error);
				setError("Failed to load posts. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchPostsByCategories();
	});

	if (loading) {
		return <Loader />;
	}

	const handlePostClick = (postId: string, category: string) => {
		router.push(`/category/${category}`);
	};

	return (
		<div className='min-h-screen bg-gray-100 py-12'>
			<div className='max-w-7xl mx-auto px-4'>
				<h1 className='text-4xl font-extrabold text-gray-900 text-center mb-12'>
					Explore Jodhpur Darshan
				</h1>

				{error ? (
					<p className='text-red-600 text-center'>{error}</p>
				) : loading ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{Array.from({ length: 6 }).map((_, index) => (
							<Skeleton
								key={index}
								className='h-80 w-full rounded-xl bg-gray-200'
							/>
						))}
					</div>
				) : (
					<div className='space-y-12'>
						{categories.map((category) => (
							<div key={category.name} className='space-y-6'>
								<h2 className='text-2xl font-bold text-gray-800 pl-2 border-l-4 border-blue-600'>
									{category.name}
								</h2>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
									{category.posts.map((post) => (
										<Card
											key={post.id}
											className='overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 rounded-xl'
											onClick={() => handlePostClick(post.id, category.name)}>
											<CardHeader className='p-0'>
												{post.imageURL && (
													<CldImage
														width='480'
														height='270'
														src={post.publicID || ""}
														sizes='100vw'
														alt={post.title}
														className='w-full h-48 object-cover rounded-t-xl'
													/>
												)}
											</CardHeader>
											<CardContent className='p-4'>
												<CardTitle className='text-xl font-semibold text-gray-900 mb-2 line-clamp-1'>
													{post.title}
												</CardTitle>
												<p className='text-gray-600 text-sm line-clamp-2 mb-4'>
													{post.content}
												</p>
												<div className='flex items-center gap-4 text-gray-500'>
													<Button
														variant='ghost'
														size='sm'
														className='flex items-center gap-1 text-gray-600 hover:text-blue-600'
														disabled>
														<BiSolidLike className='w-4 h-4' />{" "}
														{post.likes.length}
													</Button>
													<Button
														variant='ghost'
														size='sm'
														className='flex items-center gap-1 text-gray-600 hover:text-gray-800'
														disabled>
														<FaRegBookmark className='w-4 h-4' /> Save
													</Button>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
								{category.posts.length > 3 && (
									<div className='text-center'>
										<div className='inline-flex items-center justify-center w-12 h-12 bg-blue-100/50 text-blue-600 rounded-full opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer'>
											{`${category.posts.length}+ posts`}
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default PreviewPage;
