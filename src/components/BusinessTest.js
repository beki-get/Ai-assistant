//src/components/BusinessTest.js
"use client";

import { useBusiness } from "@/context/BusinessContext";

export default function BusinessTest() {
  const { businesses, loading } = useBusiness();

  if (loading) return <p>Loading businesses...</p>;

  if (businesses.length === 0) return <p>No businesses found.</p>;

  return (
    <div className="p-5 space-y-3">
      {businesses.map((b) => (
        <div key={b.id} className="border p-3 rounded shadow">
          <h2 className="font-bold text-xl">{b.name}</h2>
          <p>{b.description}</p>
          <p className="text-gray-500">Hours: {b.hours}</p>
          <div className="mt-2">
            <h3 className="font-semibold">Products:</h3>
            <ul className="list-disc ml-5">
              {b.products?.map((p, idx) => (
                <li key={idx}>
                  {p.name} — ${p.price}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
