"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/custome/loading";

const defaultData = { email: "", password: "" };

export default function Login() {
  const [data, setData] = useState(defaultData);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onValueChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    setData({ ...data, [target.name]: target.value });
  };

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError("");
    setIsLoading(true);

    if (!data.email || !data.password) {
      alert("Please fill all mandatory parameters");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/sign-in", data);
      setData(defaultData);

      if (response.status === 200) {
        router.push("/config");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data);
      } else {
        setError("An unexpected error occurred: " + error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex-1 flex flex-col min-w-64" onSubmit={onLogin}>
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
        Don't have an account?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          onChange={onValueChange}
        />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
          onChange={onValueChange}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loading text="Signing in..." /> : "Sign in"}
        </Button>
        <p className="text-red-500">{error}</p>
      </div>
    </form>
  );
}
