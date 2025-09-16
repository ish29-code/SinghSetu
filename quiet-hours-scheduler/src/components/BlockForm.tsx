"use client";
import { useState } from "react";

export default function BlockForm({
  user_id,
  user_email,
  onAdded,
}: {
  user_id: string;
  user_email: string;
  onAdded: () => void;
}) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/addBlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, user_email, start_time: start, end_time: end }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      setError(error || "Failed to add block");
      return;
    }

    setStart("");
    setEnd("");
    onAdded();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Start Time</label>
        <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />
      </div>
      <div>
        <label>End Time</label>
        <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">Add Block</button>
    </form>
  );
}
