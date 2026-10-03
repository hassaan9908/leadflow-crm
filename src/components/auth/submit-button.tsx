"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

type SubmitButtonProps = {
  idleText: string;
  pendingText: string;
};

export function SubmitButton({
  idleText,
  pendingText,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}

      {pending ? pendingText : idleText}
    </button>
  );
}