"use client";
export default function BlockList({ blocks }: { blocks: any[] }) {
  if (!Array.isArray(blocks)) return null;
  return (
    <div>
      <h2>Your Quiet Hours</h2>
      <ul>
        {blocks.map((b, i) => (
          <li key={i}>
            {new Date(b.start_time).toLocaleString()} → {new Date(b.end_time).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
