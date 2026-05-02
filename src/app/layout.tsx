import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexusFlow | Prompt Wars",
  description: "Team collaboration tool for Google Prompt Wars",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex h-screen bg-[#F8F9FA] text-gray-800 antialiased`}>
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10 relative">
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#4285F4"/>
                <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">NexusFlow</h1>
            </div>
          </div>
          <nav className="flex-1 py-6 px-4 space-y-1">
            <div className="mb-4 px-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
            </div>
            <Link href="/" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg bg-[#E8F0FE] text-[#1967D2] transition-colors">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              Projects
            </Link>
            <Link href="/calendar" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Calendar
            </Link>
            <Link href="/team" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              Team
            </Link>
          </nav>
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-3 px-2 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4285F4] to-[#34A853] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                US
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 leading-tight">User</p>
                <p className="text-xs text-gray-500">user@promptwars.com</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden flex flex-col relative z-0">
          {children}
        </main>
      </body>
    </html>
  );
}
