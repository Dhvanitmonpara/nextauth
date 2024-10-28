import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User } from "@/models/user.model";
import bcryptjs from "bcryptjs";
import { redirect } from "next/navigation";
import connectDB from "@/lib/connectDB";

function Page() {
  const signupHandler = async (formData: FormData) => {
    "use server";

    const name = formData.get("name") as string | undefined;
    const email = formData.get("email") as string | undefined;
    const password = formData.get("password") as string | undefined;

    if (!name || !email || !password) {
      throw new Error("Please provide name, email and password");
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (user) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await User.create({ name, email, password: hashedPassword });

    redirect("/login");
  };

  return (
    <div className="flex justify-center items-center h-dvh">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Signup to Instagram</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={signupHandler}
            className="space-y-4 flex flex-col justify-center items-center"
          >
            <Input type="text" placeholder="Name" name="name" />
            <Input type="email" placeholder="Email" name="email" />
            <Input type="password" placeholder="Password" name="password" />
            <Button type="submit" className="w-full">
              Signup
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <form action="" className="flex justify-center items-center w-full">
            <Button type="submit" variant="outline" className="w-full">
              Signup with Google
            </Button>
          </form>
          <p className="text-center text-xs">
            Already have an account?{" "}
            <Link className="text-blue-600 hover:underline" href="/login">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Page;
