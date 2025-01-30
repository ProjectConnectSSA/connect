'use client';

import { useRouter } from "next/navigation";
import { Button } from "./button";

export function StayButton() {
  const router = useRouter();

  const handleStay = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleStay}
      type="button"
    >
      Stay
    </Button>
  );
}