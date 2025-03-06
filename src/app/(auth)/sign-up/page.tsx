"use client";
import SignupForm from "@/components/custom/signup-form";
import VerifyCode from "@/components/custom/verifyCode";
import {
	AuthenticationProvider,
	useAuthenticationContext,
} from "@/context/AuthenticationContext";
import React from "react";

function SignUpPage() {
	return (
		<AuthenticationProvider>
			<div className='w-full h-screen max-w-md mx-auto flex flex-col items-center justify-center'>
				<SignUpContent />
			</div>
		</AuthenticationProvider>
	);
}

// Helper component to conditionally render SignupForm or VerifyCode
function SignUpContent() {
	const { pendingVerification } = useAuthenticationContext();

	return <>{!pendingVerification ? <SignupForm /> : <VerifyCode />}</>;
}

export default SignUpPage;
