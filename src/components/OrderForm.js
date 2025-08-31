'use client';
import { useState } from "react";

export default function ChatOrderForm({ onSubmit }) {
  const [items, setItems] = useState([{ name: "", qty: 1 }]);

  const updateItem = (index, key, value) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { name: "", qty: 1 }]);

  const submit = () => {
    if (items.some(i => !i.name)) return;
    onSubmit({ items, status: "pending" });
    setItems([{ name: "", qty: 1 }]);
  };

  return (
    <div className="flex flex-col gap-2 p-2 border rounded mt-2">
      {items.map((i, idx) => (
        <div key={idx} className="flex gap-2">
          <input type="text" placeholder="Item name" value={i.name} onChange={e => updateItem(idx, "name", e.target.value)} className="border p-1 rounded flex-1" />
          <input type="number" min="1" value={i.qty} onChange={e => updateItem(idx, "qty", Number(e.target.value))} className="border p-1 rounded w-20" />
        </div>
      ))}
      <button onClick={addItem} className="bg-gray-300 px-2 py-1 rounded">+ Add Item</button>
      <button onClick={submit} className="bg-blue-500 text-white px-3 py-1 rounded">Order</button>
    </div>
  );
}
