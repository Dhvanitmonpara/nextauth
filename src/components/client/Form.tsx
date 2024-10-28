"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import credentialLogin from "@/actions/credentialLogin";
import { useRouter } from "next/navigation";

function LoginForm() {
  const { toast } = useToast();
  const router = useRouter()

  return (
    <form
      action={async (formData: FormData) => {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
          toast({
            title: "Please provide both, email and password",
            variant: "destructive",
          });
          return;
        }

        const error = await credentialLogin(email, password);
        if (error) {
          toast({
            title: typeof error === "string" ? error : "Login failed",
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Login successful",
          variant: "default",
        });
        router.refresh();
      }}
      className="space-y-4 flex flex-col justify-center items-center"
    >
      <Input type="email" placeholder="Email" name="email" />
      <Input type="password" placeholder="Password" name="password" />
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
}

export default LoginForm;
