"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/"; // back to landing
  }

  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 min-h-screen text-white">
        <header className="flex justify-between items-center px-6 py-4 bg-white/10 backdrop-blur-md shadow-md">
          <h1 className="text-lg font-bold">Quiet Hours Scheduler</h1>
          <nav>
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition"
              >
                Logout
              </button>
            ) : (
              <a
                href="/login"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition"
              >
                Login
              </a>
            )}
          </nav>
        </header>
        <main className="px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
