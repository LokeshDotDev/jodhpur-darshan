import * as React from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface SelectionProps {
	value: string;
	onChange: (value: string) => void;
}

export default function Selection({ value, onChange }: SelectionProps) {
	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className='w-[180px]'>
				<SelectValue placeholder='Select a Category' />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Joudhpur-places</SelectLabel>
					<SelectItem value='Landmarks'>Landmarks</SelectItem>
					<SelectItem value='Lakes'>Lakes</SelectItem>
					<SelectItem value='Markets'>Markets</SelectItem>
					<SelectItem value='Savours'>Savours</SelectItem>
					<SelectItem value='Temples'>Temples</SelectItem>
					<SelectItem value='Arts'>Arts</SelectItem>
					<SelectItem value='Museum'>Museum</SelectItem>
					<SelectItem value='Hotels'>Hotels</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
