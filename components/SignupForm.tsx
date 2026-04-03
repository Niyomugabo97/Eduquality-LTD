"use client";

import { useState } from "react";
import { useActionState } from "react";
import { signup } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupForm = () => {
  const initialState = { success: false, message: "" };
  const [state, formAction, isPending] = useActionState(signup, initialState);
  const [localError, setLocalError] = useState<string | null>(null);

  // Validate confirm password before submitting
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setLocalError(null);

    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;

    if (password !== confirmPassword) {
      e.preventDefault();
      setLocalError("Passwords do not match.");
      return;
    }
  };

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-5">
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
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" type="text" required disabled={isPending} />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required disabled={isPending} />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" required disabled={isPending} />
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          disabled={isPending}
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full bg-[#F17105] text-white py-3 rounded-lg">
        {isPending ? "Signing up..." : "Sign Up"}
      </Button>

      <p className="mt-3 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <a href="/login" className="text-[#F17105] font-semibold hover:underline">
          Login
        </a>
      </p>
    </form>
  );
};

export default SignupForm;