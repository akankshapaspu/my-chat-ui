import { SessionProvider } from "next-auth/react"

export default function App({ Component, pageProps }) {
  // pageProps may include `session` if you ever use getServerSideProps
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
