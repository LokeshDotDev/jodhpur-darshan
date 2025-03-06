"use client";

import React, { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs"; // Import signOut and useUser from Clerk
import {
	Sidebar as ShadcnSidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VscPreview } from "react-icons/vsc";
import {
	ChevronDown,
	ChevronRight,
	Home,
	Map,
	LogOut,
	MapPin,
	Droplet,
	ShoppingCart,
	Utensils,
	Church,
	Paintbrush,
	BookOpen,
	Hotel,
} from "lucide-react";
import { Loader } from "@/components/custom/Loader";

const Sidebar: React.FC = () => {
	const { user } = useUser(); // Use the useUser hook to get the user
	const [isCategoryOpen, setIsCategoryOpen] = useState(false);

	const { signOut } = useClerk();

	if (!user) {
		return <Loader />;
	}

	const categories = [
		{ name: "Landmarks", icon: MapPin, url: "/category/Landmarks" },
		{ name: "Lakes", icon: Droplet, url: "/category/Lakes" },
		{ name: "Markets", icon: ShoppingCart, url: "/category/Markets" },
		{ name: "Savours", icon: Utensils, url: "/category/Savours" },
		{ name: "Temples", icon: Church, url: "/category/Temples" },
		{ name: "Arts", icon: Paintbrush, url: "/category/Arts" },
		{ name: "Museum", icon: BookOpen, url: "/category/Museum" },
		{ name: "Hotels", icon: Hotel, url: "/category/Hotels" },
	];

	const userName =
		user?.username ||
		user?.emailAddresses[0]?.emailAddress.split("@")[0] ||
		"Guest";
	const userImage = user?.imageUrl || "https://github.com/shadcn.png";

	return (
		<ShadcnSidebar
			collapsible='icon'
			className='w-64 md:w-64 bg-white border-r border-gray-200 shadow-md transition-all duration-300 max-md:w-64'>
			<SidebarContent className='py-4'>
				<SidebarGroup className='mb-4'>
					<SidebarGroupLabel className='text-xl font-extrabold text-gray-800 px-6 py-4 border-b border-gray-600 pb-5'>
						Jodhpur Darshan
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu className='space-y-1'>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className='text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-md mx-2 py-2 px-4 mt-5'
									tooltip='Dashboard'>
									<a href='/dashboard'>
										<Home className='w-5 h-5 mr-3' />
										<span className='text-sm font-medium'>Dashboard</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									className='text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-md mx-2 px-4 '
									tooltip='Preview'>
									<a href='/preview'>
										<VscPreview className='w-5 h-5 mr-3' />
										<span className='text-sm font-medium'>Preview</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton
									onClick={() => setIsCategoryOpen(!isCategoryOpen)}
									className='text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-md mx-2 py-2 px-4 flex justify-between items-center'
									tooltip='Category'>
									<div className='flex items-center gap-3'>
										<Map className='w-5 h-5' />
										<span className='text-sm font-medium'>Category</span>
									</div>
									{isCategoryOpen ? (
										<ChevronDown className='w-4 h-4 text-gray-500' />
									) : (
										<ChevronRight className='w-4 h-4 text-gray-500' />
									)}
								</SidebarMenuButton>
								{isCategoryOpen && (
									<SidebarMenuSub className='pl-8 pt-1 space-y-1'>
										{categories.map((category) => (
											<SidebarMenuSubItem key={category.name}>
												<SidebarMenuSubButton
													asChild
													className='text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-md py-2 px-3 text-sm flex items-center gap-3'>
													<a href={category.url}>
														<category.icon className='w-4 h-4' />
														<span>{category.name}</span>
													</a>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								)}
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className='p-4 border-t border-gray-200 bg-gray-50'>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<div className='flex items-center gap-3 p-3 rounded-md hover:bg-gray-200 cursor-pointer transition-colors duration-200'>
							<Avatar className='w-9 h-9'>
								<AvatarImage src={userImage} alt={userName} />
								<AvatarFallback className='bg-blue-100 text-blue-600'>
									{userName[0]}
								</AvatarFallback>
							</Avatar>
							<span className='text-sm font-semibold text-gray-800 truncate'>
								{userName}
							</span>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent className='w-auto bg-white shadow-lg border border-gray-200'>
						<DropdownMenuItem asChild>
							<div className='flex items-center gap-2 text-gray-700 hover:bg-gray-100 cursor-pointer py-2 px-3'>
								<button
									onClick={() => signOut({ redirectUrl: "/" })}
									className='flex items-center gap-2'>
									Logout
									<LogOut className='w-4 h-4' />
								</button>
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarFooter>
		</ShadcnSidebar>
	);
};

export default Sidebar;
