// File: pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    EmailProvider({
      // explicit host/port/auth object
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

  // turn on debugging so you get clear SMTP errors in the logs
  logger: {
    error(code, metadata) {
      console.error("NEXTAUTH ERROR", code, metadata);
    },
    warn(code) {
      console.warn("NEXTAUTH WARN", code);
    },
    debug(code, metadata) {
      console.debug("NEXTAUTH DEBUG", code, metadata);
    },
  },
});
