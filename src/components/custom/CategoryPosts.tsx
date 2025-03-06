"use client";

import React, { useEffect, useState } from "react";
import { CldImage } from "next-cloudinary";
import { BiSolidLike } from "react-icons/bi";
import { FaRegBookmark } from "react-icons/fa";
import { FiEdit, FiMoreVertical } from "react-icons/fi"; // Edit and More icons
import { MdDelete } from "react-icons/md"; // Delete icon
import VaultModal from "./VaultModal";
import { useUser } from "@clerk/clerk-react"; // Import useUser from Clerk

interface CategoryPostsProps {
	category: string;
	image?: string;
}

interface Comment {
	id: string;
	text: string;
	userId: string;
	postId: string;
	createdAt: string;
	updatedAt: string;
}

interface Post {
	id: string;
	title: string;
	content: string;
	createdBy: {
		username: string;
	};
	imageURL?: string;
	publicID?: string;
	likes: {
		id: string;
		userId: string;
		postId: string;
		commentId: string | null;
	}[];
	comments: Comment[];
	createdAt: string; // Added for post creation date
}

const CategoryPosts: React.FC<CategoryPostsProps> = ({ category }) => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [commentText, setCommentText] = useState<string>("");
	const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
	const [editingCommentText, setEditingCommentText] = useState<string>("");
	const [showVaultModal, setShowVaultModal] = useState<boolean>(false);
	const [currentPostId, setCurrentPostId] = useState<string | null>(null);
	const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);

	const { user } = useUser(); // Use the useUser hook to get the user
	const isAdmin = user?.publicMetadata?.role === "admin"; // Check if the user is an admin

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await fetch(
					`/api/getPostsByCategory?category=${category}`
				);
				if (!response.ok) {
					throw new Error(`Error: ${response.statusText}`);
				}
				const data = await response.json();
				setPosts(data);
			} catch (error) {
				console.error("Error fetching posts:", error);
				setError("Failed to fetch posts. Please try again later.");
			}
		};

		fetchPosts();
	}, [category]);

	const handleLike = async (postId: string) => {
		try {
			const response = await fetch(`/api/likes/post-like?postId=${postId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ postId }),
			});
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}
			window.location.reload();
		} catch (error) {
			console.error("Error liking post:", error);
		}
	};

	const handleSaveToVault = (postId: string) => {
		setCurrentPostId(postId);
		setShowVaultModal(true);
	};

	const handleCommentSubmit = async (postId: string) => {
		try {
			const response = await fetch(`/api/comments?postId=${postId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text: commentText }),
			});
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}
			setCommentText("");
			window.location.reload();
		} catch (error) {
			console.error("Error submitting comment:", error);
		}
	};

	const handleEditComment = async (commentId: string) => {
		try {
			const response = await fetch(
				`/api/comments/edit?commentId=${commentId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ newText: editingCommentText }),
				}
			);
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}
			window.location.reload();
		} catch (error) {
			console.error("Error editing comment:", error);
		}
	};

	const handleDeleteComment = async (commentId: string) => {
		try {
			const response = await fetch(
				`/api/comments/edit?commentId=${commentId}`,
				{
					method: "DELETE",
				}
			);
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}
			window.location.reload();
		} catch (error) {
			console.error("Error deleting comment:", error);
		}
	};

	const handleDeletePost = async (publicID: string) => {
		try {
			const response = await fetch(`/api/post?publicID=${publicID}`, {
				method: "DELETE",
			});
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}
			setPosts(posts.filter((post) => post.publicID !== publicID));
		} catch (error) {
			console.error("Error deleting post:", error);
		}
	};

	return (
		<div className='min-h-screen bg-gray-100 py-8'>
			<div className='max-w-5xl mx-auto px-4'>
				<h1 className='text-3xl font-bold text-gray-800 mb-8'>
					{category} Category
				</h1>
				{error ? (
					<p className='text-red-600 text-center'>{error}</p>
				) : posts.length > 0 ? (
					<div className='space-y-6'>
						{posts.map((post) => (
							<div
								key={post.id}
								className='bg-white rounded-lg shadow-md p-6 border border-gray-200'>
								<div className='space-y-4'>
									{post.imageURL && (
										<div className='w-full aspect-[16/9]'>
											<CldImage
												width='960'
												height='540'
												src={post.publicID || ""}
												sizes='100vw'
												alt={post.title}
												className='w-full h-full object-cover rounded-md'
											/>
										</div>
									)}
									<div>
										<h2 className='text-2xl font-bold text-gray-800 bg-blue-50 px-2 py-1 rounded-md mb-2'>
											{post.title}
										</h2>
										<p className='text-gray-600 mb-4'>{post.content}</p>
										<p className='text-sm text-gray-500'>
											Posted on:{" "}
											<span className='font-medium'>
												{new Date(post.createdAt).toLocaleDateString()}
												{" | "}
												{new Date(post.createdAt).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
												})}
											</span>
										</p>
										<div className='flex items-center gap-4 mt-4'>
											<button
												onClick={() => handleLike(post.id)}
												className='flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors'>
												<BiSolidLike className='w-5 h-5' /> {post.likes.length}
											</button>
											<button
												onClick={() => handleSaveToVault(post.id)}
												className='flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors'>
												<FaRegBookmark className='w-5 h-5' /> Save to Vault
											</button>
											{isAdmin && (
												<button
													onClick={() => handleDeletePost(post.publicID || "")}
													className='flex bg-slate-200 shadow-md px-2 py-1 rounded-md items-center gap-1 text-red-600 hover:text-red-800 transition-colors'>
													<MdDelete className='w-5 h-5' /> Delete Post
												</button>
											)}
										</div>
									</div>
								</div>

								{/* Comments Section */}
								<div className='mt-6 border-t border-gray-200 pt-4'>
									<div className='flex items-start gap-2'>
										<textarea
											placeholder='Add a comment...'
											value={commentText}
											onChange={(e) => setCommentText(e.target.value)}
											className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 resize-none'
											rows={2}
										/>
										<button
											onClick={() => handleCommentSubmit(post.id)}
											className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'>
											Submit
										</button>
									</div>

									<div className='mt-4'>
										<h3 className='text-lg font-semibold text-gray-800 mb-2'>
											Comments
										</h3>
										{post.comments.length > 0 ? (
											<div className='space-y-4'>
												{post.comments.map((comment) => (
													<div
														key={comment.id}
														className='bg-gray-50 p-4 rounded-md border border-gray-200 relative'>
														{editingCommentId === comment.id ? (
															<div className='flex items-start gap-2'>
																<textarea
																	value={editingCommentText}
																	onChange={(e) =>
																		setEditingCommentText(e.target.value)
																	}
																	className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 resize-none'
																	rows={2}
																/>
																<div className='flex flex-col gap-2'>
																	<button
																		onClick={() =>
																			handleEditComment(comment.id)
																		}
																		className='bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors'>
																		Save
																	</button>
																	<button
																		onClick={() => setEditingCommentId(null)}
																		className='bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors'>
																		Cancel
																	</button>
																</div>
															</div>
														) : (
															<div>
																<p className='text-gray-700'>{comment.text}</p>
																<div className='text-sm text-gray-500 mt-1'>
																	<span>
																		Posted on:{" "}
																		{new Date(
																			comment.createdAt
																		).toLocaleDateString()}
																		{" | "}
																		{new Date(
																			comment.createdAt
																		).toLocaleTimeString([], {
																			hour: "2-digit",
																			minute: "2-digit",
																		})}
																	</span>
																</div>
																<div className='absolute top-2 right-2'>
																	<button
																		onClick={() =>
																			setDropdownVisible(
																				dropdownVisible === comment.id
																					? null
																					: comment.id
																			)
																		}
																		className='text-gray-600 hover:text-gray-800 transition-colors'>
																		<FiMoreVertical className='w-5 h-5' />
																	</button>
																	{dropdownVisible === comment.id && (
																		<div className='absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10'>
																			<button
																				onClick={() => {
																					setEditingCommentId(comment.id);
																					setEditingCommentText(comment.text);
																					setDropdownVisible(null);
																				}}
																				className='block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100'>
																				<FiEdit className='inline-block mr-2' />
																				Edit
																			</button>
																			<button
																				onClick={() => {
																					handleDeleteComment(comment.id);
																					setDropdownVisible(null);
																				}}
																				className='block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100'>
																				<MdDelete className='inline-block mr-2' />
																				Delete
																			</button>
																		</div>
																	)}
																</div>
															</div>
														)}
													</div>
												))}
											</div>
										) : (
											<p className='text-gray-600'>No comments available.</p>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className='text-gray-600 text-center'>No posts available.</p>
				)}
			</div>
			{showVaultModal && currentPostId && (
				<VaultModal
					postId={currentPostId}
					onClose={() => setShowVaultModal(false)}
				/>
			)}
		</div>
	);
};

export default CategoryPosts;
