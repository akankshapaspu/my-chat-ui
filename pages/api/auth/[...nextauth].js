// File: pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

export default NextAuth({
  // Persist users/sessions & verification tokens to MongoDB
  adapter: MongoDBAdapter(clientPromise),

  // “Magic link” via your SMTP server
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT, 10),  // ← cast to number
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],

  // This MUST match your Vercel “NEXTAUTH_URL” setting exactly
  // (e.g. https://my-chat-ui.vercel.app)
  secret: process.env.NEXTAUTH_SECRET,

  // Use JWT sessions (stored in the cookie)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // optional: 30 days
  },

  callbacks: {
    async session({ session, token }) {
      // Attach the user ID to the session object
      session.user.id = token.sub;
      return session;
    },
  }
