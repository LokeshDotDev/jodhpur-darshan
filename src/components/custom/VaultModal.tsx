"use client";

import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface VaultModalProps {
	postId: string;
	onClose: () => void;
}

interface Vault {
	id: string;
	name: string;
	description: string;
}

const VaultModal: React.FC<VaultModalProps> = ({ postId, onClose }) => {
	const [vaults, setVaults] = useState<Vault[]>([]);
	const [newVaultName, setNewVaultName] = useState("");
	const [newVaultDescription, setNewVaultDescription] = useState("");
	const [selectedVaultId, setSelectedVaultId] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchVaults = async () => {
			try {
				const response = await fetch("/api/vault/all-vaults");
				if (!response.ok) {
					throw new Error(`Error: ${response.statusText}`);
				}
				const data = await response.json();
				setVaults(data.vaults || []);
			} catch (error) {
				console.error("Error fetching vaults:", error);
			}
		};

		fetchVaults();
	}, []);

	const handleCreateVault = async () => {
		if (!newVaultName.trim()) return;
		setIsLoading(true);
		try {
			const response = await fetch(`/api/vault?postId=${postId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: newVaultName,
					description: newVaultDescription,
				}),
			});
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}
			setNewVaultName("");
			setNewVaultDescription("");
			onClose();
			window.location.reload();
		} catch (error) {
			console.error("Error creating vault:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddToVault = async () => {
		if (!selectedVaultId) return;
		setIsLoading(true);
		try {
			const response = await fetch(
				`/api/vault/edit?vaultId=${selectedVaultId}&postId=${postId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ postId }),
				}
			);
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}
			onClose();
			window.location.reload();
		} catch (error) {
			console.error("Error adding to vault:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[425px] bg-white rounded-lg shadow-lg'>
				<DialogHeader>
					<DialogTitle className='text-2xl font-bold text-gray-800'>
						Save to Vault
					</DialogTitle>
				</DialogHeader>
				<div className='space-y-6 py-4'>
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold text-gray-700'>
							Create New Vault
						</h3>
						<div className='space-y-2'>
							<Label
								htmlFor='vaultName'
								className='text-sm font-medium text-gray-700'>
								Vault Name
							</Label>
							<Input
								id='vaultName'
								type='text'
								placeholder='Enter vault name'
								value={newVaultName}
								onChange={(e) => setNewVaultName(e.target.value)}
								className='w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md'
							/>
						</div>
						<div className='space-y-2'>
							<Label
								htmlFor='vaultDescription'
								className='text-sm font-medium text-gray-700'>
								Description
							</Label>
							<Textarea
								id='vaultDescription'
								placeholder='Enter vault description (optional)'
								value={newVaultDescription}
								onChange={(e) => setNewVaultDescription(e.target.value)}
								className='w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md resize-none'
								rows={3}
							/>
						</div>
						<Button
							onClick={handleCreateVault}
							disabled={isLoading || !newVaultName.trim()}
							className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors disabled:bg-gray-400'>
							{isLoading ? "Creating..." : "Create Vault"}
						</Button>
					</div>

					<div className='space-y-4'>
						<h3 className='text-lg font-semibold text-gray-700'>
							Or Add to Existing Vault
						</h3>
						<Select value={selectedVaultId} onValueChange={setSelectedVaultId}>
							<SelectTrigger className='w-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md'>
								<SelectValue placeholder='Select a vault' />
							</SelectTrigger>
							<SelectContent>
								{vaults.length > 0 ? (
									vaults.map((vault) => (
										<SelectItem key={vault.id} value={vault.id}>
											{vault.name}
										</SelectItem>
									))
								) : (
									<div className='px-4 py-2 text-gray-500 text-sm'>
										No vaults available
									</div>
								)}
							</SelectContent>
						</Select>
						<Button
							onClick={handleAddToVault}
							disabled={isLoading || !selectedVaultId}
							className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors disabled:bg-gray-400'>
							{isLoading ? "Adding..." : "Add to Vault"}
						</Button>
					</div>
				</div>
				<DialogFooter>
					<Button
						onClick={onClose}
						variant='outline'
						className='w-full border-gray-300 text-gray-700 hover:bg-gray-100'>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default VaultModal;
