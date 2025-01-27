"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const defaultData = { name: "", email: "", password: "" };

export default function Signup() {
  const [data, setData] = useState(defaultData);

  const router = useRouter();

  const onValueChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    setData({ ...data, [target.name]: target.value });
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.email || !data.password || !data.name) {
      alert("Please fill all mandatory paramters");
      return;
    }

    try {
      const response = await axios.post("/api/sign-up", data);
      setData(defaultData);

      if (response.status === 200) {
        router.push("/sign-in");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <form className="flex flex-col min-w-64">
          <h1 className="text-2xl font-medium">Sign up</h1>
          <p className="text-sm text text-foreground">
            Already have an account?{" "}
            <Link
              className="text-primary font-medium underline"
              href="/sign-in"
            >
              Sign in
            </Link>
          </p>
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <Label htmlFor="name">Full Name</Label>
            <Input
              name="name"
              placeholder="John Doe"
              required
              onChange={onValueChange}
            />
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              onChange={onValueChange}
            />
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Your password"
              minLength={6}
              required
              onChange={onValueChange}
            />
            <Button onClick={(e) => onRegister(e)}>Sign Up</Button>
          </div>
        </form>
        <SmtpMessage />
      </div>
    </>
  );
}
