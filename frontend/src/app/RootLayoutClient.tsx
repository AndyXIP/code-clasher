// src/app/RootLayoutClient.tsx (Client-side layout)
'use client'; // Mark as a client-side component

import { usePathname } from 'next/navigation';
import Navbar from './components/Navbar';

export default function RootLayoutClient({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login"; // Check if the current path is '/login'

  return (
    <>
      {/* Only render Navbar if not on the /login page */}
      {!isLoginPage && <Navbar />}
      {children}
    </>
  );
}
