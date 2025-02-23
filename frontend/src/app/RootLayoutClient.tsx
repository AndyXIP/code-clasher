"use client";

export default function RootLayoutClient({
  children,
}: { children: React.ReactNode }) {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
}
