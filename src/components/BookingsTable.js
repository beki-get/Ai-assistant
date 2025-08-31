'use client';
import { useEffect, useState } from "react";

export default function BookingsTable() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setBookings([]);
      alert("Failed to load bookings. Try refreshing.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Update failed");
      fetchBookings();
    } catch (err) {
      console.error("Failed to update booking status:", err);
      alert("Failed to update booking status. Try again.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;
  if (!bookings.length) return <p>No bookings found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Bookings</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Date</th>
            <th className="border p-2">Time</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id} className="odd:bg-white even:bg-gray-50">
              <td className="border p-2">{b.date}</td>
              <td className="border p-2">{b.time}</td>
              <td className="border p-2 capitalize">{b.status}</td>
              <td className="border p-2 flex gap-2">
                {b.status !== "completed" && (
                  <button
                    onClick={() => updateStatus(b.id, "completed")}
                    className="bg-green-500 text-white px-2 rounded"
                  >
                    Complete
                  </button>
                )}
                {b.status !== "canceled" && (
                  <button
                    onClick={() => updateStatus(b.id, "canceled")}
                    className="bg-red-500 text-white px-2 rounded"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
