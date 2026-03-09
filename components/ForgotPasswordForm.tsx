"use client";

import { useState } from "react";
import { useActionState } from "react";
import { forgotPassword } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ForgotPasswordData {
  email: string;
}

const ForgotPasswordForm = () => {
  const initialState = { success: false, message: "" };
  const [state, formAction, isPending] = useActionState(forgotPassword, initialState);
  const [localError, setLocalError] = useState<string | null>(null);

  return (
    <form action={formAction} className="space-y-5">
      {(state.message || localError) && (
        <div
          className={`p-3 rounded-lg text-sm ${
            state.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {localError ? localError : state.message}
        </div>
      )}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          placeholder="Enter your email address"
          required 
          disabled={isPending} 
        />
      </div>

      <Button 
        type="submit" 
        disabled={isPending} 
        className="w-full bg-[#F17105] text-white py-3 rounded-lg"
      >
        {isPending ? "Sending reset link..." : "Send Reset Link"}
      </Button>

      <div className="mt-4 text-center">
        <a href="/login" className="text-[#F17105] font-semibold hover:underline text-sm">
          Back to Login
        </a>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
