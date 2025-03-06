import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function Page() {
	return (
		<>
			<AuthenticateWithRedirectCallback
				signInUrl='/sign-in'
				signUpUrl='/sign-up'
				signUpFallbackRedirectUrl='/dashboard'
				signInFallbackRedirectUrl='/dashboard'
			/>

			<div className='text-center mt-8 text-3xl font-bold text-neutral-800 dark:text-neutral-200'>
				Please Wait we are firstly sign-up you with our system. and then
				redirect you to the dashboard.
			</div>
		</>
	);
}
