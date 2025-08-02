"use client";

import { useFormStatus } from "react-dom";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubmitButtonProps extends React.ComponentProps<typeof Button> {
	loadingText?: string;
	className?: string;
	children: React.ReactNode;
}

export function SubmitButton({ loadingText = "Loading...", children, className, ...props }: SubmitButtonProps) {
	const { pending } = useFormStatus();

	return (
		<Button {...props} disabled={pending || props.disabled} className={cn(className)}>
			{pending ? (
				<>
					<Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
					{loadingText}
				</>
			) : (
				children
			)}
		</Button>
	);
}
