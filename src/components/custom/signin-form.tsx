"use client";

import React, { FormEvent } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useAuthenticationContext } from "@/context/AuthenticationContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader } from "@/components/custom/Loader";

export default function SignInForm() {
	const { isLoaded, signIn, setActive } = useSignIn();
	const { emailAddress, setEmailAddress, password, setPassword, setError } =
		useAuthenticationContext();

	const router = useRouter();

	if (!isLoaded) {
		return <Loader />;
	}

	async function submit(e: FormEvent) {
		e.preventDefault();

		if (!isLoaded) {
			return;
		}

		try {
			const result = await signIn.create({
				identifier: emailAddress,
				password,
			});

			if (result.status !== "complete") {
				console.log("Sign-in process is not completed yet!");
			}

			if (result.status === "complete") {
				console.log("Sign-in process is completed successfully!");
				await setActive({ session: result.createdSessionId });
				router.push("/dashboard");
			}
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
				setError("An unexpected error occurred in Sign-in process!");
			}
		}
	}

	async function handleGoogleSignIn() {
		if (!isLoaded) {
			return;
		}

		try {
			await signIn.authenticateWithRedirect({
				strategy: "oauth_google",
				redirectUrl: "/sso-callback",
				redirectUrlComplete: "/dashboard",
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
					"An unexpected error occurred in Google Oauth sign-in process!"
				);
			}
		}
	}

	return (
		<div className='w-full max-w-md mx-auto rounded-2xl p-6 md:p-8 shadow-lg bg-white border border-gray-200'>
			<div className='text-center mb-6'>
				<h2 className='text-2xl font-bold text-gray-900 mb-2'>
					Welcome Back, Dude! 👋
				</h2>
				<p className='text-sm text-gray-600'>
					Sign in to Jodhpur Darshan to explore the beauty of Jodhpur’s gems! 💎
				</p>
			</div>

			{/* Social Sign-In Button */}
			<div className='flex flex-col sm:flex-row justify-center items-center gap-4 mb-6'>
				<Button
					onClick={handleGoogleSignIn}
					variant='outline'
					className='w-full sm:w-auto flex items-center gap-2 bg-gray-50 text-gray-800 hover:bg-gray-100 border-gray-300 transition-colors duration-300 rounded-md px-4 py-2'>
					<IconBrandGoogle className='h-5 w-5' />
					<span className='text-sm font-medium'>Google</span>
				</Button>
			</div>

			<div className='relative my-6'>
				<div className='absolute inset-0 flex items-center'>
					<span className='w-full border-t border-gray-200'></span>
				</div>
				<div className='relative flex justify-center text-sm'>
					<span className='bg-white px-2 text-gray-500'>
						Or sign in with email
					</span>
				</div>
			</div>

			<form className='space-y-6' onSubmit={submit}>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<Label
							htmlFor='email'
							className='text-sm font-medium text-gray-700'>
							Email Address
						</Label>
						<Input
							id='email'
							placeholder='example@gmail.com'
							type='email'
							value={emailAddress}
							onChange={(e) => setEmailAddress(e.target.value)}
							className='w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md'
						/>
					</div>
					<div className='space-y-2'>
						<Label
							htmlFor='password'
							className='text-sm font-medium text-gray-700'>
							Password
						</Label>
						<Input
							id='password'
							placeholder='••••••••'
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className='w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md'
						/>
					</div>
				</div>

				<Button
					type='submit'
					className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors duration-300 shadow-md hover:shadow-lg'>
					Sign In →
				</Button>
			</form>

			<div className='text-center mt-4'>
				<p className='text-sm text-gray-600'>
					Don’t have an account?{" "}
					<Link
						href='/sign-up'
						className='font-medium text-blue-600 hover:underline transition-colors'>
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
}
