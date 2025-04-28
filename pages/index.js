// pages/index.js

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <button onClick={() => signIn()}>Sign in</button>;
  }

  const models = [
    { slug: "Akanksha17/healthcare-chronic-model",   label: "Chronic Care" },
    { slug: "Akanksha17/healthcare-postop-model",    label: "Post-Op Care" },
    { slug: "Akanksha17/healthcare-preop-model",     label: "Pre-Op Care" },
    { slug: "Akanksha17/healthcare-assisted-model",  label: "Assisted Living" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <p>
        Hi <strong>{session.user.email}</strong>!{" "}
        <button onClick={() => signOut()}>Sign out</button>
      </p>

      <h2>Select a chatbot:</h2>
      <ul>
        {models.map((m) => (
          <li key={m.slug}>
            <Link href={`/chat/${encodeURIComponent(m.slug)}`}>
              <a>{m.label}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
