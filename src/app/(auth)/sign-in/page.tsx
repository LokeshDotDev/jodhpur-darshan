"use client";

import SignInForm from "@/components/custom/signin-form";
import { AuthenticationProvider } from "@/context/AuthenticationContext";
import React from "react";

function SignInPage() {
	return (
		<AuthenticationProvider>
			<div className='w-full h-screen max-w-md mx-auto flex flex-col items-center justify-center'>
				<SignInForm />
			</div>
		</AuthenticationProvider>
	);
}
export default SignInPage;
