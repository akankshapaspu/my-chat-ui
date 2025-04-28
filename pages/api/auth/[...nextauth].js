// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER, // e.g. smtp://youremail@gmail.com:app_password@smtp.gmail.com:587
      from: process.env.EMAIL_FROM,      // same email you put in the URL above
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
};

export default NextAuth(authOptions);
