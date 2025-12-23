import { cn } from "@/lib/utils";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata = {
  title: "SupaPing",
  description:
    "Ping your Supabase project, so your unused project never gets paused.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={cn("antialiased", geist.className)}>{children}</body>
    </html>
  );
}
