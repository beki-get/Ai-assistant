import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, serverTimestamp, query, where, doc, updateDoc } from "firebase/firestore";

// GET: fetch orders for a specific business
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) return new Response(JSON.stringify({ error: "Missing businessId" }), { status: 400 });

    const ordersQuery = query(collection(db, "orders"), where("businessId", "==", businessId));
    const ordersSnapshot = await getDocs(ordersQuery);
    const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// POST: create a new order (customer)
export async function POST(req) {
  try {
    const { businessId, customerName, email, items, totalAmount } = await req.json();

    if (!businessId || !customerName || !email || !items || !totalAmount) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const newOrder = {
      businessId,
      customerName,
      email,
      items,
      totalAmount,
      status: "pending",
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "orders"), newOrder);

    return new Response(JSON.stringify({ success: true, orderId: docRef.id, order: newOrder }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// PATCH: update order status
export async function PATCH(req) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) return new Response(JSON.stringify({ error: "Missing id or status" }), { status: 400 });

    const orderRef = doc(db, "orders", id);
    await updateDoc(orderRef, { status });

    return new Response(JSON.stringify({ success: true, id, status }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
