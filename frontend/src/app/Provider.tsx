"use client";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";


interface ProviderProps {
  children: React.ReactNode;
}

const Provider = ({ children }: ProviderProps) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export default Provider;
