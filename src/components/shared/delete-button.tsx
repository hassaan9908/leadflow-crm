"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { buttonVariants } from "@/components/ui/button";

type DeleteResult = {
  success: boolean;
  message: string;
};

type DeleteButtonProps = {
  action: () => Promise<DeleteResult>;
  label?: string;
  itemName?: string;
  redirectTo: string;
};

export function DeleteButton({
  action,
  label = "Delete",
  itemName = "this item",
  redirectTo,
}: DeleteButtonProps) {
  const router = useRouter();

  const [pending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${itemName}?`
    );

    if (!confirmed) return;

    startTransition(async () => {
      const result = await action();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      router.push(redirectTo);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleDelete}
      className={buttonVariants({
        variant: "destructive",
      })}
    >
      {pending ? "Deleting..." : label}
    </button>
  );
}