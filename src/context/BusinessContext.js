//src/context/BusinessContext.js
"use client"; // because we will use hooks

import { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const BusinessContext = createContext();
export const useBusiness = () => useContext(BusinessContext);

export const BusinessProvider = ({ children }) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBusinesses = async () => {
    try {
      const snapshot = await getDocs(collection(db, "businesses"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBusinesses(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching businesses:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  return (
    <BusinessContext.Provider value={{ businesses, loading }}>
      {children}
    </BusinessContext.Provider>
  );
};
