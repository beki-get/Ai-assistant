'use client';
import { useEffect, useState } from "react";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]);
      alert("Failed to load orders. Try refreshing.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Update failed");
      fetchOrders();
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed to update order status. Try again.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (!orders.length) return <p>No orders found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Orders</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Customer</th>
            <th className="border p-2">Items</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="odd:bg-white even:bg-gray-50">
              <td className="border p-2">{o.customerName}</td>
              <td className="border p-2">
                {Array.isArray(o.items) ? o.items.map(i => `${i.name} x${i.qty}`).join(", ") : ""}
              </td>
              <td className="border p-2 capitalize">{o.status}</td>
              <td className="border p-2 flex gap-2">
                {o.status !== "completed" && (
                  <button
                    onClick={() => updateStatus(o.id, "completed")}
                    className="bg-green-500 text-white px-2 rounded"
                  >
                    Complete
                  </button>
                )}
                {o.status !== "canceled" && (
                  <button
                    onClick={() => updateStatus(o.id, "canceled")}
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
