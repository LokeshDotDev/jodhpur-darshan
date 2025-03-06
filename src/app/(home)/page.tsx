"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import Image from "next/image";

export default function Home() {
	const router = useRouter();
	const [currentSlide, setCurrentSlide] = useState(0);

	const handleExploreClick = () => {
		router.push("/preview"); // Redirect to the preview page or dashboard
	};

	const featuredExperiences = [
		{
			title: "Mehrangarh Fort",
			description: "Explore the majestic fort overlooking the Blue City.",
			image:
				"https://t3.ftcdn.net/jpg/03/22/52/98/360_F_322529875_xskoq6Pg8vzxnDR3FNigstBWZAC2g14U.jpg",
			category: "Landmarks",
		},
		{
			title: "Jaswant Thada",
			description: "Visit the serene marble memorial near Mehrangarh Fort.",
			image:
				"https://cdn1.tripoto.com/media/filter/nl/img/2380291/Image/1707567910_jaswant_thada_jodhpur.jpg.webp",
			category: "Landmarks",
		},
		{
			title: "Sardar Market",
			description: "Shop for handicrafts and textiles in this vibrant market.",
			image:
				"https://www.rajasthanbhumitours.com/blog/wp-content/uploads/2024/09/Clock-Tower-and-Sardar-Market-The-Bustling-Heart-of-Jodhpurs-Old-City.jpg",
			category: "Markets",
		},
	];

	// Auto-slide every 5 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % featuredExperiences.length);
		}, 5000);
		return () => clearInterval(interval);
	}, [featuredExperiences.length]);

	const handleCategoryClick = (category: string) => {
		router.push(`/category/${category.toLowerCase()}`);
	};

	return (
		<div className='w-full min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col items-center justify-center overflow-hidden'>
			{/* Hero Section */}
			<header className='w-full max-w-7xl px-4 py-16 text-center'>
				<h1 className='text-5xl font-extrabold text-gray-900 mb-4 drop-shadow-md'>
					Welcome to Jodhpur Darshan
				</h1>
				<p className='text-xl text-gray-700 mb-8 max-w-2xl mx-auto'>
					Discover the Blue City’s majestic landmarks, serene lakes, vibrant
					markets, and rich culture. Explore Jodhpur like never before!
				</p>
				<Button
					onClick={handleExploreClick}
					className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-md hover:shadow-lg transition-all duration-300'>
					Explore Now
				</Button>
			</header>

			{/* Background Image Overlay */}
			<div className='absolute inset-0 -z-10'>
				<Image
					width='1280'
					height='720'
					src='https://t3.ftcdn.net/jpg/03/22/52/98/360_F_322529875_xskoq6Pg8vzxnDR3FNigstBWZAC2g14U.jpg'
					alt='Jodhpur Mehrangarh Fort'
					className='w-full h-full object-cover opacity-20 blur-sm'
				/>
			</div>

			{/* Featured Categories Section */}
			<section className='w-full max-w-7xl px-4 py-16'>
				<h2 className='text-3xl font-bold text-gray-800 text-center mb-12'>
					Discover Jodhpur’s Highlights
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					{[
						{
							title: "Landmarks",
							description: "Explore majestic forts and palaces.",
							image:
								"https://t3.ftcdn.net/jpg/03/22/52/98/360_F_322529875_xskoq6Pg8vzxnDR3FNigstBWZAC2g14U.jpg",
						},
						{
							title: "Lakes",
							description: "Visit serene lakes and tranquil waters.",
							image:
								"https://www.rajasthandirect.com/wp-content/uploads/2012/11/Kailana-lake.jpg",
						},
						{
							title: "Markets",
							description: "Shop at vibrant bazaars and local markets.",
							image:
								"https://www.rajasthanbhumitours.com/blog/wp-content/uploads/2024/09/Clock-Tower-and-Sardar-Market-The-Bustling-Heart-of-Jodhpurs-Old-City.jpg",
						},
						{
							title: "Temples",
							description: "Discover spiritual temples and shrines.",
							image:
								"https://cdn1.tripoto.com/media/filter/nl/img/2380291/Image/1707567910_jaswant_thada_jodhpur.jpg.webp",
						},
					].map((item) => (
						<Card
							key={item.title}
							className='overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 rounded-xl cursor-pointer'
							onClick={() => handleCategoryClick(item.title)}>
							<CardHeader className='p-0'>
								<Image
									width='300'
									height='200'
									src={item.image}
									alt={item.title}
									className='w-full h-40 object-cover rounded-t-xl'
								/>
							</CardHeader>
							<CardContent className='p-4'>
								<CardTitle className='text-lg font-semibold text-gray-900 mb-2'>
									{item.title}
								</CardTitle>
								<CardDescription className='text-gray-600 text-sm'>
									{item.description}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* Featured Experiences Carousel */}
			<section className='w-full max-w-7xl px-4 py-16 bg-gradient-to-r from-blue-50 to-gray-50 rounded-xl shadow-2xl mb-12'>
				<h2 className='text-3xl font-bold text-gray-800 text-center mb-8'>
					Experience Jodhpur’s Wonders
				</h2>
				<div className='relative w-full max-w-4xl mx-auto'>
					<div className='overflow-hidden rounded-xl'>
						<div
							className='flex transition-transform duration-500 ease-in-out'
							style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
							{featuredExperiences.map((experience, index) => (
								<div key={index} className='w-full flex-shrink-0 p-4'>
									<Card className='overflow-hidden shadow-lg border border-gray-200 rounded-xl bg-white'>
										<CardHeader className='p-0'>
											<Image
												width='600'
												height='400'
												src={experience.image}
												alt={experience.title}
												className='w-full h-96 object-cover rounded-t-xl' // Changed to object-top
											/>
										</CardHeader>
										<CardContent className='p-6'>
											<CardTitle className='text-2xl font-bold text-gray-900 mb-2'>
												{experience.title}
											</CardTitle>
											<CardDescription className='text-gray-700 text-lg mb-4'>
												{experience.description}
											</CardDescription>
											<Button
												onClick={() => handleCategoryClick(experience.category)}
												className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300'>
												Discover {experience.category}
											</Button>
										</CardContent>
									</Card>
								</div>
							))}
						</div>
					</div>
					{/* Navigation Dots with Padding */}
					<div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2'>
						{featuredExperiences.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentSlide(index)}
								className={`w-3 h-3 rounded-full ${
									index === currentSlide ? "bg-blue-600" : "bg-gray-400"
								} hover:bg-blue-500 transition-colors duration-300`}
								aria-label={`Go to slide ${index + 1}`}
							/>
						))}
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className='w-full max-w-7xl px-4 py-8 text-center text-gray-600'>
				<div className='flex justify-center gap-6 mb-4'>
					<a
						href='https://instagram.com/jodhpurdarshan'
						target='_blank'
						rel='noopener noreferrer'
						className='text-gray-600 hover:text-blue-600 transition-colors'>
						<FaInstagram className='w-6 h-6' />
					</a>
					<a
						href='https://facebook.com/jodhpurdarshan'
						target='_blank'
						rel='noopener noreferrer'
						className='text-gray-600 hover:text-blue-600 transition-colors'>
						<FaFacebook className='w-6 h-6' />
					</a>
					<a
						href='https://twitter.com/jodhpurdarshan'
						target='_blank'
						rel='noopener noreferrer'
						className='text-gray-600 hover:text-blue-600 transition-colors'>
						<FaTwitter className='w-6 h-6' />
					</a>
				</div>
				<p className='text-sm'>© 2025 Jodhpur Darshan. All rights reserved.</p>
			</footer>
		</div>
	);
}
