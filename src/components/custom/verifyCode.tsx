// components/custom/verifyCode.tsx
"use client";

import React, { FormEvent } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useSignupContext } from "@/context/SignUpContext";
import { OtpContainer } from "./OtpContainer";
import { cn } from "@/lib/utils";

export default function VerifyCode() {
	const { isLoaded, signUp, setActive } = useSignUp();
	const { code, setCode, setError } = useSignupContext();
	const router = useRouter();

	if (!isLoaded) {
		return null;
	}

	async function verifyCode(e: FormEvent) {
		e.preventDefault();

		if (!isLoaded) {
			return;
		}

		try {
			const completeSignUp = await signUp.attemptEmailAddressVerification({
				code,
			});

			if (completeSignUp.status === "complete") {
				await setActive({ session: completeSignUp.createdSessionId });
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
				setError("An unexpected error occurred.");
			}
		}
	}

	return (
		<div className='max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black'>
			<h2 className='font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center pb-2'>
				Verify your code
			</h2>
			<form className='my-8' onSubmit={verifyCode}>
				<div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4'>
					<LabelInputContainer className='flex justify-center items-center pb-3'>
						<OtpContainer value={code} onChange={setCode} />
					</LabelInputContainer>
				</div>
				<button
					className='bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]'
					type='submit'>
					Submit &rarr;
				</button>
			</form>
		</div>
	);
}

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
