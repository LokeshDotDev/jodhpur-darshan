"use client";

import React, { FormEvent } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useAuthenticationContext } from "@/context/AuthenticationContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandFacebook, IconBrandGoogle } from "@tabler/icons-react";

export default function SignupForm() {
	const { isLoaded, signUp } = useSignUp();
	const {
		username,
		setUsername,
		emailAddress,
		setEmailAddress,
		password,
		setPassword,
		setPendingVerification,
		setError,
	} = useAuthenticationContext();

	if (!isLoaded) {
		return null;
	}

	async function submit(e: FormEvent) {
		e.preventDefault();

		if (!isLoaded) {
			return;
		}

		try {
			await signUp.create({
				username,
				emailAddress,
				password,
			});

			await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

			setPendingVerification(true);
		} catch (err: unknown) {
			console.error(JSON.stringify(err, null, 2));
			if (
				err &&
				typeof err === "object" &&
				"error" in err &&
				Array.isArray(err.error)
			) {
				setError(err.error[0].message);
			} else {
				setError("An unexpected error occurred in Sign-up process!");
			}
		}
	}

	async function handleGoogleSignUp() {
		if (!isLoaded) {
			return;
		}
		console.log("Hero hu me!");

		try {
			await signUp.authenticateWithRedirect({
				strategy: "oauth_google",
				redirectUrl: "/sign-up/sso-callback",
				redirectUrlComplete: "/dashboard",
				continueSignUp: true,
			});
		} catch (err: unknown) {
			console.error(JSON.stringify(err, null, 2));
			if (
				err &&
				typeof err === "object" &&
				"error" in err &&
				Array.isArray(err.error)
			) {
				setError(err.error[0].message);
			} else {
				setError(
					"An unexpected error occurred in Google Oauth sign-up process!"
				);
			}
		}
	}

	return (
		<div className='max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black'>
			<h2 className='font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center pb-2'>
				Welcome to Jodhpur Dharshan
			</h2>
			<p className='text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300 text-center'>
				Sign-up to Jodhpur Dharshan for exploring the beauty of Jodhpur Gems!💎
			</p>

			<div className='flex flex-row justify-center items-center gap-10 mt-5'>
				<button
					onClick={handleGoogleSignUp}
					className=' relative group/btn flex space-x-2 items-center justify-start px-4 w-auto text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]'
					type='submit'>
					<IconBrandGoogle className='h-4 w-4 text-neutral-800 dark:text-neutral-300' />
					<span className='text-neutral-700 dark:text-neutral-300 text-sm'>
						Google
					</span>
					<BottomGradient />
				</button>
				<button
					className=' relative group/btn flex space-x-2 items-center justify-start px-4 w-auto text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]'
					type='submit'>
					<IconBrandFacebook className='h-4 w-4 text-neutral-800 dark:text-neutral-300' />
					<span className='text-neutral-700 dark:text-neutral-300 text-sm'>
						Facebook
					</span>
					<BottomGradient />
				</button>
			</div>
			<div className='bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full' />
			<form className='my-8' onSubmit={submit}>
				<LabelInputContainer className='mb-4'>
					<Label htmlFor='email'>Email Address</Label>
					<Input
						id='email'
						placeholder='example@gmail.com'
						type='email'
						value={emailAddress}
						onChange={(e) => setEmailAddress(e.target.value)}
					/>
				</LabelInputContainer>
				<LabelInputContainer className='mb-4'>
					<Label htmlFor='password'>Password</Label>
					<Input
						id='password'
						placeholder='••••••••'
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</LabelInputContainer>

				<div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-7'>
					<LabelInputContainer>
						<Label htmlFor='username'>Username</Label>
						<Input
							id='username'
							placeholder='Enter your username'
							type='text'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</LabelInputContainer>
				</div>

				<button
					className='bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]'
					type='submit'>
					Sign up &rarr;
					<BottomGradient />
				</button>
			</form>
		</div>
	);
}

const BottomGradient = () => {
	return (
		<>
			<span className='group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent' />
			<span className='group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent' />
		</>
	);
};

const LabelInputContainer = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<div className={cn("flex flex-col space-y-2 w-full", className)}>
			{children}
		</div>
	);
};
