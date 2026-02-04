"use client"; // Interactive parts must be client-side

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export default function UserNav({ initialUser, isAdmin }: { initialUser: any, isAdmin: boolean }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // Your existing "click outside" logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh(); // This refreshes the Server Navbar to show 0 items
  };

  if (!initialUser) {
    return (
      <Link href="/login" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black hover:scale-105 transition">
        Log In
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white hover:bg-white/20 transition"
      >
        {initialUser.email?.charAt(0).toUpperCase()}
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-black/90 p-1 shadow-2xl backdrop-blur-3xl"
          >
             <div className="px-4 py-3 border-b border-white/10">
                <p className="truncate text-sm font-medium text-white">{initialUser.email}</p>
             </div>
             {isAdmin && (
               <Link href="/admin" onClick={() => setIsDropdownOpen(false)} className="block px-3 py-2 text-sm text-white/80 hover:bg-white/10">
                 Admin Dashboard
               </Link>
             )}
             <button onClick={handleSignOut} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10">
               Sign Out
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}