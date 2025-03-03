import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Code Clasher",
  description: "Next.js App by Imperial Students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Wrap only the main part of the page with AuthProvider */}
        <AuthProvider>
          <header className="border-b border-gray-300 dark:border-gray-700">
            <Navbar />
          </header>
          <main>{children}</main> {/* Only this part updates when navigating */}
        </AuthProvider>
      </body>
    </html>
  );
}
