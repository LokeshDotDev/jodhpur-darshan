"use client";

import React, { createContext, useContext, useState } from "react";

interface AuthenticationContextType {
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

const AuthenticationContext = createContext<AuthenticationContextType | undefined>(undefined);

export const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
	const [emailAddress, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const [pendingVerification, setPendingVerification] = useState(false);
	const [code, setCode] = useState("");
	const [error, setError] = useState("");
	const [username, setUsername] = useState("");

	return (
		<AuthenticationContext.Provider
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
		</AuthenticationContext.Provider>
	);
};

export const useAuthenticationContext = () => {
	const context = useContext(AuthenticationContext);
	if (!context) {
		throw new Error("useAuthenticationContext must be used within a AuthenticationProvider");
	}
	return context;
};
