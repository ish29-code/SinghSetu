"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import BlockForm from "@/components/BlockForm";
import BlockList from "@/components/BlockList";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  async function loadBlocks() {
    if (!user) return;
    const res = await fetch(`https://singhsetu.onrender.com/api/blocks?user_id=${user.id}`);
    if (res.ok) {
      setBlocks(await res.json());
    }
  }

  useEffect(() => {
    loadBlocks();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-[70vh]">
        <h2 className="text-4xl font-extrabold">Welcome to Quiet Hours</h2>
        <p className="mt-4 text-gray-200">
          Manage your productivity with scheduled quiet hours.
        </p>
        <a
          href="/login"
          className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 rounded-lg text-lg font-semibold shadow-lg hover:scale-105 transition"
        >
          Get Started
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10 mt-10">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <BlockForm
          user_id={user.id}
          user_email={user.email}
          onAdded={loadBlocks}
        />
      </div>
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <BlockList blocks={blocks} />
      </div>
    </div>
  );
}
