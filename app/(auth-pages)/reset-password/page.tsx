"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";

const defaultData = { password: "", confirmPassword: "" };

export default function ResetPassword() {
  const [data, setData] = useState(defaultData);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  console.log("token: ", token);

  // Redirect if no token is provided
  if (!token) {
    router.push("/forgot-password");
    return null;
  }

  const onValueChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    setData({ ...data, [target.name]: target.value });
  };

  const onResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!data.password || !data.confirmPassword) {
      setError("Please fill all mandatory fields");
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("/api/reset-password", {
        ...data,
        token,
      });

      if (response.status === 200) {
        router.push("/sign-in");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data || "An error occurred");
        // If token expired, redirect after 3 seconds
        if (error.response?.status === 401) {
          setTimeout(() => {
            router.push("/forgot-password");
          }, 3000);
        }
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <form className="flex-1 flex flex-col min-w-64" onSubmit={onResetPassword}>
      <h1 className="text-2xl font-medium">Reset password</h1>
      <p className="text-sm text-foreground/60">
        Please enter your new password below.
      </p>

      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="password">New Password</Label>
        <Input
          type="password"
          name="password"
          placeholder="Enter new password"
          required
          onChange={onValueChange}
        />

        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm new password"
          required
          onChange={onValueChange}
        />

        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit">Reset Password</Button>
      </div>
    </form>
  );
}
