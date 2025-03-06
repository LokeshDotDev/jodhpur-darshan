"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa"; // Importing react-icons
import { usePathname } from "next/navigation"; // Import to get current path
import { useUser, useSession } from "@clerk/nextjs"; // Import Clerk hooks

const navLinks = [
	{ name: "Dashboard", href: "/dashboard" },
	{ name: "Settings", href: "/settings" },
	{ name: "Premium", href: "/premium" },
	{ name: "Discord", href: "https://discord.gg/tess", target: "_blank" },
	{ name: "Privacy Policy", href: "/privacy-policy" },
	{ name: "Faq", href: "/help" },
];

const Navbar = () => {
	const { user } = useUser(); // Get the user from Clerk
	const { session } = useSession(); // Get the session from Clerk
	const [isMobileMenuVisible, setMobileMenuVisible] = useState(false);
	const pathname = usePathname(); // Get current path

	// Toggle mobile menu visibility
	const toggleMobileMenu = () => {
		setMobileMenuVisible(!isMobileMenuVisible);
	};

	// Close mobile menu after a link click
	const closeMobileMenu = () => {
		setMobileMenuVisible(false);
	};

	return (
		<div className='flex justify-center items-center'>
			<nav className='backdrop-blur-lg border border-primary duration-300 mt-2 flex flex-col max-w-3xl mx-auto rounded-2xl shadow-lg transition-all w-full h-auto fixed top-0 z-50 justify-center '>
				{/* Main Navbar */}
				<div className='flex w-full items-center justify-between p-2'>
					{/* Logo */}
					<div className='relative flex items-center gap-2'>
						<Link className='flex items-center' href='/'>
							<img src='/images/logo.png' alt='Saint' className='h-10 w-10' />
							<span className='text-heading font-instrument-serif text-lg font-black ml-1'>
								SAINT
							</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<ul className='hidden md:flex items-center gap-4'>
						{navLinks.map((link, index) => {
							if (link.name == "Premium" && user?.isPremium) return null;
							return (
								<li key={index} className='relative group'>
									<Link
										href={link.href}
										className={`text-text-button text-xs font-medium transition-all duration-300 group-hover:scale-105 ${
											pathname === link.href ? "text-purple-300" : "text-text"
										}`}
										target={link.target}>
										{link.name}
									</Link>
									{/* Underline Effect */}
									<div
										className={`absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-secondary to-purple-300 transition-all duration-300 group-hover:w-full ${
											pathname === link.href && "w-full"
										}`}></div>
								</li>
							);
						})}
					</ul>

					<div className='flex gap-3 items-center'>
						{/* Profile Dropdown */}
						<div className='items-center gap-2'>
							{!session && (
								<Link
									href='/auth/signin'
									className='flex items-center justify-center h-8 px-4 text-sm font-medium text-white bg-gradient-to-br from-primary to-secondary rounded-full transition-transform hover:scale-105'>
									Sign In
								</Link>
							)}

							{session && (
								<div className='relative'>
									<Link
										href='/profile'
										className='flex items-center justify-center h-8 w-8 rounded-full overflow-hidden bg-primary'>
										<img
											src={
												user?.profileImageUrl || "/images/default-avatar.png"
											}
											alt='User Profile'
											className='h-full w-full object-cover'
										/>
									</Link>
								</div>
							)}
						</div>

						{/* Mobile Hamburger Icon */}
						<button
							onClick={toggleMobileMenu}
							className='h-6 w-6 md:hidden flex flex-col items-center justify-center space-y-1.5'>
							{isMobileMenuVisible ? (
								<FaTimes className='text-text' size={40} />
							) : (
								<FaBars className='text-text' size={40} />
							)}
						</button>
					</div>
				</div>

				{/* Mobile Menu with Slide Down Animation */}
				<div
					className={`md:hidden w-full overflow-hidden transition-all duration-300 ${
						isMobileMenuVisible
							? "opacity-100 max-h-screen overflow-auto"
							: "bg-transparent opacity-0 max-h-0 overflow-hidden"
					}`}>
					<div className='w-full rounded-b-lg p-6 transition-all duration-300'>
						<ul className='space-y-4'>
							{navLinks.map((link, index) => (
								<li key={index}>
									<Link
										href={link.href}
										className={`text-lg font-medium text-heading transition-colors ${
											pathname === link.href
												? "text-purple-300"
												: "text-heading"
										}`}
										target={link.target}
										onClick={closeMobileMenu} // Close the mobile menu when clicked
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			</nav>
		</div>
	);
};

export default Navbar;
