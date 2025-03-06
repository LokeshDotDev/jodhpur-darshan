"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import UploadModal from "@/components/custom/UploadModal"; // Adjust the import path as needed
import { Loader } from "@/components/custom/Loader";

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

const AdminDashboard: React.FC = () => {
	const [userCount, setUserCount] = useState<number>(0);
	const [likedPosts, setLikedPosts] = useState<LikedPost[]>([]);
	const [vaultPosts, setVaultPosts] = useState<Vault[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [showAllLiked, setShowAllLiked] = useState<boolean>(false);
	const [showAllVaults, setShowAllVaults] = useState<boolean>(false);
	const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false); // Modal state
	const likedPostsRef = useRef<HTMLDivElement>(null);
	const vaultPostsRef = useRef<HTMLDivElement>(null);

	// Dummy chart data for users (replace with real data if available)
	const chartData = [
		{ month: "January", users: 3 },
		{ month: "February", users: 150 },
		{ month: "March", users: 180 },
		{ month: "April", users: 150 },
		{ month: "May", users: 160 },
		{ month: "June", users: userCount || 250 },
	];

	const chartConfig: ChartConfig = {
		users: {
			label: "Users",
			color: "hsl(var(--chart-1))",
		},
	} satisfies ChartConfig;

	useEffect(() => {
		const fetchUserCount = async () => {
			try {
				const response = await fetch("/api/user/count");
				if (!response.ok) throw new Error(`Error: ${response.statusText}`);
				const data = await response.json();
				setUserCount(data.count);
			} catch (error) {
				console.error("Error fetching user count:", error);
			}
		};

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

		fetchUserCount();
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

	// Function to refetch posts after successful upload
	const handleUploadSuccess = () => {
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
			}
		};

		fetchLikedPosts(); // Refresh liked posts after upload
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<div className='min-h-screen bg-gray-100'>
			{/* Fixed Header */}
			<header className='right-0 z-10 bg-white shadow-md p-2'>
				<div className='max-w-5xl mx-10'>
					<h1 className='text-3xl font-bold text-gray-800'>Admin Dashboard</h1>
					<p className='text-sm text-gray-500 mt-1'>
						Manage your portal efficiently
					</p>
				</div>
			</header>

			{/* Main Content with padding-top and constrained width */}
			<main className='max-w-5xl mx-auto pt-24 p-6 space-y-8'>
				{/* User Stats Section with shadcn Chart */}
				<section className='bg-white rounded-lg shadow-md p-6'>
					<Card>
						<CardHeader>
							<CardTitle>User Growth</CardTitle>
							<CardDescription>
								Showing total users for the last 6 months
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ChartContainer config={chartConfig}>
								<AreaChart
									accessibilityLayer
									data={chartData}
									margin={{ left: 12, right: 12 }}>
									<CartesianGrid vertical={false} />
									<XAxis
										dataKey='month'
										tickLine={false}
										axisLine={false}
										tickMargin={8}
										tickFormatter={(value) => value.slice(0, 3)}
									/>
									<ChartTooltip
										cursor={false}
										content={<ChartTooltipContent indicator='line' />}
									/>
									<Area
										dataKey='users'
										type='natural'
										fill='var(--color-users)'
										fillOpacity={0.4}
										stroke='var(--color-users)'
									/>
								</AreaChart>
							</ChartContainer>
						</CardContent>
						<CardFooter>
							<div className='flex w-full items-start gap-2 text-sm'>
								<div className='grid gap-2'>
									<div className='flex items-center gap-2 font-medium leading-none'>
										Total Users: {userCount} <TrendingUp className='h-4 w-4' />
									</div>
									<div className='flex items-center gap-2 leading-none text-muted-foreground'>
										January - June 2025
									</div>
								</div>
							</div>
						</CardFooter>
					</Card>
					<Button
						onClick={() => setIsUploadModalOpen(true)}
						className='mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
						Upload New Post
					</Button>
				</section>

				{/* Liked Posts Section */}
				<section
					className='bg-white rounded-lg shadow-md p-6'
					ref={likedPostsRef}>
					<h2 className='text-xl font-semibold text-gray-800 mb-4'>
						Liked Posts
					</h2>
					{loading ? (
						<p className='text-gray-600'>Loading liked posts...</p>
					) : !likedPosts || likedPosts.length === 0 ? (
						<p className='text-gray-600'>No liked posts available.</p>
					) : (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{(showAllLiked ? likedPosts : likedPosts.slice(0, 4)).map(
								(likedPost) => (
									<div
										key={likedPost.id}
										className='bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow opacity-0 lazy-load-item'>
										<h3 className='text-lg font-semibold text-gray-800 truncate'>
											{likedPost.post.title}
										</h3>
										<p className='text-gray-600 mt-2 line-clamp-2'>
											{likedPost.post.content}
										</p>
										<Image
											height={200}
											width={200}
											src={likedPost.post.imageURL}
											alt={likedPost.post.title}
											className='w-full h-40 object-cover mt-3 rounded-md'
										/>
										<div className='mt-3 space-y-1'>
											<p className='text-sm text-gray-500'>
												Category:{" "}
												<span className='font-medium'>
													{likedPost.post.category}
												</span>
											</p>
											<p className='text-sm text-gray-500'>
												Status:{" "}
												<span className='font-medium'>
													{likedPost.post.status}
												</span>
											</p>
											<p className='text-sm text-gray-500'>
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
					{likedPosts.length > 4 && !showAllLiked && (
						<button
							onClick={() => setShowAllLiked(true)}
							className='mt-4 text-blue-600 hover:underline'>
							Show {likedPosts.length - 4} more posts
						</button>
					)}
				</section>

				{/* Vaults Section */}
				<section
					className='bg-white rounded-lg shadow-md p-6'
					ref={vaultPostsRef}>
					<h2 className='text-xl font-semibold text-gray-800 mb-4'>
						Vaults List
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{(showAllVaults ? vaultPosts : vaultPosts.slice(0, 4)).map(
							(vault) => (
								<div
									key={vault.id}
									className='bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow opacity-0 lazy-load-item'>
									<h3 className='text-lg font-semibold text-gray-800'>
										{vault.name}
									</h3>
									<p className='text-gray-600 mt-2 line-clamp-2'>
										{vault.description}
									</p>
									{vault.post && (
										<div className='mt-3'>
											<h4 className='text-md font-semibold text-blue-600 truncate'>
												{vault.post.title}
											</h4>
											<p className='text-gray-600 mt-1 line-clamp-2'>
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
					{vaultPosts.length > 4 && !showAllVaults && (
						<button
							onClick={() => setShowAllVaults(true)}
							className='mt-4 text-blue-600 hover:underline'>
							Show {vaultPosts.length - 4} more vaults
						</button>
					)}
				</section>
			</main>

			{/* Upload Modal */}
			<UploadModal
				isOpen={isUploadModalOpen}
				onClose={() => setIsUploadModalOpen(false)}
				onUploadSuccess={handleUploadSuccess} // Optional: Refresh data on success
			/>
		</div>
	);
};

export default AdminDashboard;
