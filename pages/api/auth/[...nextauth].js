import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

export default NextAuth({
  // Persist accounts/sessions in MongoDB
  adapter: MongoDBAdapter(clientPromise),

  // Email magic‐link provider
  providers: [
    EmailProvider({
      server: {
        host:   process.env.EMAIL_HOST,
        port:   Number(process.env.EMAIL_PORT),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],

  // Use NEXTAUTH_URL and NEXTAUTH_SECRET in Vercel env‐vars
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

  // Debug logging to see any SMTP / session errors in Vercel logs
  logger: {
    error(code, metadata) {
      console.error("🔴 NEXTAUTH ERROR", code, metadata);
    },
    warn(code) {
      console.warn("🟠 NEXTAUTH WARN", code);
    },
    debug(code, metadata) {
      console.debug("🔵 NEXTAUTH DEBUG", code, metadata);
    },
  },
});
