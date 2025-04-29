// File: pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

export default NextAuth({
  // Persist users/sessions & verification tokens to MongoDB
  adapter: MongoDBAdapter(clientPromise),

  // Magic-link email provider
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],

  // Used for encrypting tokens, must match Vercel’s NEXTAUTH_URL
  secret: process.env.NEXTAUTH_SECRET,

  // Use JWT strategy
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },              // ← **comma** here!
});               // ← **close the NextAuth( … )** call
