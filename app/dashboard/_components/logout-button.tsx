"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";
import { LogOut } from "lucide-react";
import { useFormStatus } from "react-dom"; // For pending state

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="text-white text-sm sm:text-base bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 w-fit px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
    >
      {pending ? (
        <div className="flex items-center space-x-2">
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
          <span className="text-xs sm:text-sm">Logging out...</span>
        </div>
      ) : (
        <>
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          <span className="text-xs sm:text-sm font-medium">Logout</span>
        </>
      )}
    </Button>
  );
}

export default function LogoutButton() {
  return (
    <form action={logout}>
      <SubmitButton />
    </form>
  );
}
