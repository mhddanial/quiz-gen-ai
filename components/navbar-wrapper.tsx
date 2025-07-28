"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  // Hide Navbar on /auth and its subroutes
  if (pathname.startsWith("/auth")) {
    return null;
  }
  return <Navbar />;
} 