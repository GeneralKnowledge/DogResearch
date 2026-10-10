import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getPublishable } from "@/lib/publishable";

const data = getPublishable();

export const metadata: Metadata = {
  title: `${data.productName} — UK reward-based dog training`,
  description:
    "Independent UK owner guidance built from an auditable, force-free training knowledge base."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>
        <header className="site-header">
          <Link href="/" className="brand">
            {data.productName}
          </Link>
          <nav>
            <Link href="/learn">Learn</Link>
            <Link href="/ethics">Ethics</Link>
            <Link href="/referrals">Get help</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/pro">For trainers</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
