"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Loader } from "@/components/custom/Loader";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Interfaces (same as before)
interface Post {
	id: string;
	title: string;
	content: string;
	imageURL: string;
	publicID: string;
	createdById: string;
	status: string;
	approvedById: string | null;
	category: string;
	createdAt: string;
	updatedAt: string;
}

interface Vault {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	postId: string;
	userId: string;
	post?: Post;
}

interface LikedPost {
	id: string;
	userId: string;
	postId: string;
	commentId: string | null;
	post: Post;
}

const UserDashboard: React.FC = () => {
	const [likedPosts, setLikedPosts] = useState<LikedPost[]>([]);
	const [vaultPosts, setVaultPosts] = useState<Vault[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [showAllLiked, setShowAllLiked] = useState<boolean>(false);
	const [showAllVaults, setShowAllVaults] = useState<boolean>(false);
	const likedPostsRef = useRef<HTMLDivElement>(null);
	const vaultPostsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const fetchLikedPosts = async () => {
			try {
				const response = await fetch("/api/likes/post-like");
				if (!response.ok)
					throw new Error(`HTTP error! Status: ${response.status}`);
				const data = await response.json();
				const posts = Array.isArray(data) ? data : data.LikedPosts;
				setLikedPosts(Array.isArray(posts) ? posts : []);
			} catch (error) {
				console.error("Error fetching liked posts:", error);
				setLikedPosts([]);
			} finally {
				setLoading(false);
			}
		};

		const fetchVaultPosts = async () => {
			try {
				const response = await fetch("/api/vault/all-vaults");
				if (!response.ok) throw new Error(`Error: ${response.statusText}`);
				const data = await response.json();
				setVaultPosts(Array.isArray(data.vaults) ? data.vaults : []);
			} catch (error) {
				console.error("Error fetching vault posts:", error);
			}
		};

		fetchLikedPosts();
		fetchVaultPosts();
	}, []);

	// Lazy loading observer
	useEffect(() => {
		const observerOptions = {
			root: null,
			rootMargin: "0px",
			threshold: 0.1,
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("opacity-100");
					entry.target.classList.remove("opacity-0");
					observer.unobserve(entry.target);
				}
			});
		}, observerOptions);

		if (likedPostsRef.current) {
			const items = likedPostsRef.current.querySelectorAll(".lazy-load-item");
			items.forEach((item) => observer.observe(item));
		}
		if (vaultPostsRef.current) {
			const items = vaultPostsRef.current.querySelectorAll(".lazy-load-item");
			items.forEach((item) => observer.observe(item));
		}

		return () => observer.disconnect();
	}, [likedPosts, vaultPosts, showAllLiked, showAllVaults]);

	if (loading) {
		return <Loader />;
	}

	return (
		<div className='min-h-screen bg-gray-100'>
			{/* Fixed Header */}
			<header className=' right-0 z-10 bg-white shadow-md p-6'>
				<div className='max-w-5xl mx-auto'>
					<h1 className='text-3xl font-bold text-gray-900'>User Dashboard</h1>
					<p className='text-sm text-gray-600 mt-1'>Explore your portal</p>
				</div>
			</header>

			{/* Main Content with padding-top and constrained width */}
			<main className='max-w-5xl mx-auto pt-24 p-6 space-y-8'>
				{/* Liked Posts Section */}
				<section
					className='bg-white rounded-lg shadow-md p-6'
					ref={likedPostsRef}>
					<Card>
						<CardHeader>
							<CardTitle className='text-xl font-semibold text-gray-800'>
								Liked Posts
							</CardTitle>
							<CardDescription>
								View the posts you’ve liked in your journey through Jodhpur.
							</CardDescription>
						</CardHeader>
						<CardContent>
							{!likedPosts || likedPosts.length === 0 ? (
								<p className='text-gray-600'>No liked posts available.</p>
							) : (
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
									{(showAllLiked ? likedPosts : likedPosts.slice(0, 4)).map(
										(likedPost) => (
											<div
												key={likedPost.id}
												className='bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow opacity-0 lazy-load-item'>
												<h3 className='text-lg font-semibold text-gray-900 truncate'>
													{likedPost.post.title}
												</h3>
												<p className='text-gray-700 mt-2 line-clamp-2'>
													{likedPost.post.content}
												</p>
												<Image
													height={200}
													width={200}
													src={likedPost.post.imageURL}
													alt={likedPost.post.title}
													className='w-full h-40 object-cover mt-3 rounded-md'
												/>
												<div className='mt-4 space-y-2'>
													<p className='text-sm text-gray-600'>
														Category:{" "}
														<span className='font-medium text-gray-800'>
															{likedPost.post.category}
														</span>
													</p>
													<p className='text-sm text-gray-600'>
														Status:{" "}
														<span className='font-medium text-gray-800'>
															{likedPost.post.status}
														</span>
													</p>
													<p className='text-sm text-gray-600'>
														Created:{" "}
														{new Date(
															likedPost.post.createdAt
														).toLocaleDateString()}
													</p>
												</div>
											</div>
										)
									)}
								</div>
							)}
						</CardContent>
						{likedPosts.length > 4 && !showAllLiked && (
							<CardFooter>
								<Button
									onClick={() => setShowAllLiked(true)}
									className='mt-4 text-blue-600 hover:underline transition-colors duration-200'
									variant='link'>
									Show {likedPosts.length - 4} more posts
								</Button>
							</CardFooter>
						)}
					</Card>
				</section>

				{/* Vaults Section */}
				<section
					className='bg-white rounded-lg shadow-md p-6'
					ref={vaultPostsRef}>
					<Card>
						<CardHeader>
							<CardTitle className='text-xl font-semibold text-gray-800'>
								Vaults List
							</CardTitle>
							<CardDescription>
								Access your saved posts in personalized vaults.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
								{(showAllVaults ? vaultPosts : vaultPosts.slice(0, 4)).map(
									(vault) => (
										<div
											key={vault.id}
											className='bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow opacity-0 lazy-load-item'>
											<h3 className='text-lg font-semibold text-gray-900'>
												{vault.name}
											</h3>
											<p className='text-gray-700 mt-2 line-clamp-2'>
												{vault.description}
											</p>
											{vault.post && (
												<div className='mt-4'>
													<h4 className='text-md font-semibold text-blue-600 truncate'>
														{vault.post.title}
													</h4>
													<p className='text-gray-700 mt-1 line-clamp-2'>
														{vault.post.content}
													</p>
													<Image
														width={200}
														height={200}
														src={vault.post.imageURL}
														alt={vault.post.title}
														className='w-full h-40 object-cover mt-2 rounded-md'
													/>
												</div>
											)}
										</div>
									)
								)}
							</div>
						</CardContent>
						{vaultPosts.length > 4 && !showAllVaults && (
							<CardFooter>
								<Button
									onClick={() => setShowAllVaults(true)}
									className='mt-4 text-blue-600 hover:underline transition-colors duration-200'
									variant='link'>
									Show {vaultPosts.length - 4} more vaults
								</Button>
							</CardFooter>
						)}
					</Card>
				</section>
			</main>
		</div>
	);
};

export default UserDashboard;
