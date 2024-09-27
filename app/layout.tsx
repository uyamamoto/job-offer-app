import "./globals.css";
import { ReactNode } from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Job Offer App 3",
  description: "求人投稿サイト",
};

// 全ページに共通してサイト上部に表示するコンポーネント
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <nav className="p-4 bg-gray-800 text-white flex">
          <h1 className="text-2xl font-bold">求人検索アプリ</h1>
          <div className="ml-auto">
            <Link href="/jobs" className="mr-4">
              求人検索
            </Link>
            <Link href="/post">求人投稿</Link>
          </div>
        </nav>
        <main className="min-h-screen bg-white">{children}</main>
      </body>
    </html>
  );
}
