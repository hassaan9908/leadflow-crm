"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function ToastMessage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success) {
      toast.success(success);
    }

    if (error) {
      toast.error(error);
    }

    if (success || error) {
      const params = new URLSearchParams(searchParams.toString());

      params.delete("success");
      params.delete("error");

      const query = params.toString();

      router.replace(query ? `?${query}` : window.location.pathname);
    }
  }, [searchParams, router]);

  return null;
}