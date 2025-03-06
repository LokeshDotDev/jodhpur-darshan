import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "@/components/custom/Sidebar";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Jodhpur Darshan",
	description: "Explore the beauty of Jodhpur with us",
};
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}>
					<SidebarProvider>
						<Sidebar />
						<main>
							<SidebarTrigger className='fixed top-2 left-2 bg-zinc-600 rounded-md p-3 text-white' />
							{children}
							<Toaster />
						</main>
					</SidebarProvider>
					<div id='clerk-captcha'></div>
				</body>
			</html>
		</ClerkProvider>
	);
}
