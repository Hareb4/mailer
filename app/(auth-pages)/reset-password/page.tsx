"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Loading } from "@/components/custome/loading";
const defaultData = { password: "", confirmPassword: "" };

export default function ResetPassword() {
  const [data, setData] = useState(defaultData);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();

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
    setIsLoading(true);

    if (!data.password || !data.confirmPassword) {
      setError("Please fill all mandatory fields");
      setIsLoading(false);
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/reset-password", {
        ...data,
        token,
      });

      if (response.status === 200) {
        router.push("/sign-in");
        toast({
          title: "Password reset",
          description: "Your password has been reset successfully",
        });
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
    } finally {
      setIsLoading(false);
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
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loading text="Resetting..." /> : "Reset Password"}
        </Button>
      </div>
    </form>
  );
}
