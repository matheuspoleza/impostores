"use client";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen h-dvh overflow-hidden">
      {children}
    </div>
  );
}

