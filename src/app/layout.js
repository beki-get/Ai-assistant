// src/app/layout.js
"use client"; // layout must be client because it uses AuthProvider
import { BusinessProvider } from "@/context/BusinessContext";
import { AuthProvider } from "@/context/AuthContext";
//import "./globals.css";
import React from "react";
import { Provider } from "@/components/ui/provider"

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      
      
      <body className="bg-gray-50 text-gray-900">
        
        <Provider>
        <AuthProvider>
          <BusinessProvider>
            
            <main>{children}</main>
          </BusinessProvider>
        </AuthProvider>
        </Provider>
      </body>
      </html>
    
  );
}
