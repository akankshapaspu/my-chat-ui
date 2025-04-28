// pages/_app.js
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import axios from "axios";

// ⚠️ tell axios to always send cookies
axios.defaults.withCredentials = true;

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
