'use client';
import { useState } from "react";

export default function BookingForm({ onSubmit }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const submit = () => {
    if (!date || !time) return;
    onSubmit({ date, time, status: "pending" });
    setDate(""); setTime("");
  };

  return (
    <div className="flex flex-col gap-2 p-2 border rounded mt-2">
      <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-1 rounded" />
      <input type="time" value={time} onChange={e => setTime(e.target.value)} className="border p-1 rounded" />
      <button onClick={submit} className="bg-green-500 text-white px-3 py-1 rounded">Book</button>
    </div>
  );
}
