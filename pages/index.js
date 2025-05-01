// File: /pages/index.js
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div>
        <p>You must sign in first</p>
        <button onClick={() => signIn("email")}>Sign in</button>
      </div>
    );
  }

  const options = [
    ["preop", "Pre-operative care instructions"],
    ["postop", "Post-operative instructions"],
    ["chronic", "Chronic Care Management"],
    ["assisted", "Assisted Living Plan"],
  ];

  return (
    <div>
      <h1>Choose your care chatbot</h1>
      <ul>
        {options.map(([key, label]) => (
          <li key={key}>
            <Link href={`/chat/${key}`}>
              <a>{label}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
