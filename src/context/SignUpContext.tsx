"use client";

import React, { createContext, useContext, useState } from "react";

interface SignUpContextType {
	emailAddress: string;
	setEmailAddress: (email: string) => void;
	password: string;
	setPassword: (password: string) => void;
	pendingVerification: boolean;
	setPendingVerification: (pending: boolean) => void;
	code: string;
	setCode: (code: string) => void;
	error: string;
	setError: (error: string) => void;
	username: string;
	setUsername: (username: string) => void;
}

const SignupContext = createContext<SignUpContextType | undefined>(undefined);

export const SignupProvider = ({ children }: { children: React.ReactNode }) => {
	const [emailAddress, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const [pendingVerification, setPendingVerification] = useState(false);
	const [code, setCode] = useState("");
	const [error, setError] = useState("");
	const [username, setUsername] = useState("");

	return (
		<SignupContext.Provider
			value={{
				username,
				setUsername,
				emailAddress,
				setEmailAddress,
				password,
				setPassword,
				pendingVerification,
				setPendingVerification,
				code,
				setCode,
				error,
				setError,
			}}>
			{children}
		</SignupContext.Provider>
	);
};

export const useSignupContext = () => {
	const context = useContext(SignupContext);
	if (!context) {
		throw new Error("useSignupContext must be used within a SignupProvider");
	}
	return context;
};
