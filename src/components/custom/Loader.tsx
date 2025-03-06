"use client";

import React, { JSX } from "react";

export function Loader({ type = "spinner", size = "md", className = "" }: LoaderProps) {
	const baseClasses = "flex items-center justify-center";

	// Different loader styles
	const loaderStyles: { [key in NonNullable<LoaderProps['type']>]: JSX.Element } = {
		spinner: (
			<div
				className={cn(
					baseClasses,
					"relative",
					size === "sm" ? "w-8 h-8" : size === "lg" ? "w-16 h-16" : "w-12 h-12",
					className
				)}>
				<div className='absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin'></div>
				<span className='absolute text-xs font-medium text-blue-600'>
					Loading...
				</span>
			</div>
		),
		pulse: (
			<div
				className={cn(
					baseClasses,
					"relative",
					size === "sm" ? "w-8 h-8" : size === "lg" ? "w-16 h-16" : "w-12 h-12",
					className
				)}>
				<div className='absolute inset-0 rounded-full bg-blue-500 animate-pulse opacity-50'></div>
				<span className='absolute text-xs font-medium text-blue-600'>
					Loading...
				</span>
			</div>
		),
		wave: (
			<div
				className={cn(
					baseClasses,
					"flex flex-col items-center space-y-2",
					size === "sm"
						? "w-20 h-10"
						: size === "lg"
						? "w-32 h-16"
						: "w-24 h-12",
					className
				)}>
				<div className='flex space-x-1'>
					{Array.from({ length: 3 }).map((_, index) => (
						<div
							key={index}
							className={cn(
								"w-2 h-2 bg-blue-600 rounded-full animate-bounce",
								index === 0
									? "animation-delay-0"
									: index === 1
									? "animation-delay-200"
									: "animation-delay-400"
							)}
						/>
					))}
				</div>
				<span className='text-xs font-medium text-blue-600'>Loading...</span>
			</div>
		),
	};

	return loaderStyles[type] || loaderStyles.spinner;
}

// Utility to combine classes (if needed, but cn is already imported from your lib/utils)
interface LoaderProps {
    type?: "spinner" | "pulse" | "wave";
    size?: "sm" | "md" | "lg";
    className?: string;
}

const cn = (...classes: (string | false | null | undefined)[]): string => classes.filter(Boolean).join(" ");
