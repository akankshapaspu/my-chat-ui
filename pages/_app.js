// pages/_app.js
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider
      session={pageProps.session}
      // optional: keep session fresh
      refetchInterval={5 * 60}
    >
      <Component {...pageProps} />
    </SessionProvider>
  );
}

