// File: pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

export default NextAuth({
  // Use the MongoDB adapter to persist sessions and verification tokens
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    EmailProvider({
      // SMTP connection string, e.g.:
      // smtp://youremail@gmail.com:your_app_password@smtp.gmail.com:587
      server: process.env.EMAIL_SERVER,
      // The "from" address for magic-link emails
      from: process.env.EMAIL_FROM,
    }),
  ],

  // A random 32+ character string to sign cookies and tokens
  secret: process.env.NEXTAUTH_SECRET,

  // (Optional) you can customize session behavior here
  session: {
    strategy: "jwt",
  },

  // (Optional) callbacks, pages, etc.
  callbacks: {
    async session({ session, user, token }) {
      // attach user.id or custom props if needed
      session.user.id = token.sub;
      return session;
    },
  },
});
