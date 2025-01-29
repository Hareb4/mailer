"use client";
import { forgotPasswordAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Loading } from "@/components/custome/loading";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const forgotPasswordHandler = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError("");
    setIsLoading(true); // Set loading to true

    if (!email) {
      alert("Please fill all mandatory parameters");
      setIsLoading(false); // Reset loading on error
      return;
    }

    try {
      const response = await forgotPasswordAction(email);

      if (response.status === 200) {
        toast({
          title: "Email sent",
          description: "Please check your email for the URL to reset password",
          variant: "success",
        });
        setEmail("");
        setError("");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response);
        setError(error.response?.data);
      } else {
        console.log("An unexpected error occurred:", error);
      }
    } finally {
      setIsLoading(false); // Reset loading after the try/catch
    }
  };

  return (
    <>
      <form
        className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-64 mx-auto"
        onSubmit={forgotPasswordHandler}
      >
        <div>
          <h1 className="text-2xl font-medium">Reset Password</h1>
          <p className="text-sm text-secondary-foreground">
            Already have an account?{" "}
            <Link className="text-primary underline" href="/sign-in">
              Sign in
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-red-500">{error}</p>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loading text="Sending..." /> : "Reset Password"}
          </Button>
        </div>
      </form>
    </>
  );
}
