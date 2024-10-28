import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "./models/user.model";
import bcryptjs from "bcryptjs";
import connectDB from "./lib/connectDB";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // By default it is set to username and password login so, if you want them then no need to customize it otherwise you can customize this customize this according to your needs
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      authorize: async (credentials) => {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password) {
          throw new CredentialsSignin({
            cause: "Please provide email and password",
          });
        }

        await connectDB();

        const user = await User.findOne({ email }).select("+password");

        if (!user)
          throw new CredentialsSignin({ cause: "Invalid Email or Password" });
        if (!user.password)
          throw new CredentialsSignin({ cause: "Invalid Email or Password" });

        const isPasswordMatch = await bcryptjs.compare(password, user.password);

        if (!isPasswordMatch)
          throw new CredentialsSignin({ cause: "Invalid Password" });

        return { name: user.name, email: user.email, _id: user._id };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        try {
          const { email, name, image, id } = user;
          await connectDB();
          const existingUser = await User.findOne({ email });
          if (!existingUser) {
            await User.create({ name, email, image, googleId: id });
          }
          return true;
        } catch (error) {
          console.log(error);
          throw new AuthError("Error while creating user");
        }
      }
      return false;
    },
  },
});
