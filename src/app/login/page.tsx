import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LoginForm from "@/components/client/Form";
import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

async function Page() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="flex justify-center items-center h-dvh">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Login to Instagram</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
            className="flex justify-center items-center w-full"
          >
            <Button type="submit" variant="outline" className="w-full">
              Login with Google
            </Button>
          </form>
          <p className="text-center text-xs">
            Don&apos;t have an account?{" "}
            <Link className="text-blue-600 hover:underline" href="/signup">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Page;
