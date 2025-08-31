import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, serverTimestamp, query, where, doc, updateDoc } from "firebase/firestore";

// GET: fetch bookings for a specific business
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) return new Response(JSON.stringify({ error: "Missing businessId" }), { status: 400 });

    const bookingsQuery = query(collection(db, "bookings"), where("businessId", "==", businessId));
    const bookingsSnapshot = await getDocs(bookingsQuery);
    const bookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return new Response(JSON.stringify(bookings), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// POST: create a new booking (customer)
export async function POST(req) {
  try {
    const { businessId, customerName, email, service, date, time } = await req.json();

    if (!businessId || !customerName || !email || !service || !date || !time) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const newBooking = {
      businessId,
      customerName,
      email,
      service,
      date,
      time,
      status: "pending",
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "bookings"), newBooking);

    return new Response(JSON.stringify({ success: true, bookingId: docRef.id, booking: newBooking }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// PATCH: update booking status
export async function PATCH(req) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) return new Response(JSON.stringify({ error: "Missing id or status" }), { status: 400 });

    const bookingRef = doc(db, "bookings", id);
    await updateDoc(bookingRef, { status });

    return new Response(JSON.stringify({ success: true, id, status }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
