import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexusFlow | Team Productivity",
  description: "Next-generation team collaboration for Google Workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex h-screen bg-[#FDFDFD] text-[#1A1A1A] antialiased`}>
        {/* Modern Sidebar */}
        <aside className="w-64 bg-[#1E1E2D] flex flex-col z-20 shadow-2xl">
          <div className="h-20 flex items-center px-6 border-b border-white/5">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17" />
                  <path d="M2 12L12 17L22 12" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">NexusFlow</h1>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
            {/* Menu Section */}
            <div>
              <p className="text-[10px] font-bold text-[#A2A3B7] uppercase tracking-[0.15em] mb-4 px-3">Main Navigation</p>
              <nav className="space-y-1">
                <Link href="/" className="flex items-center px-4 py-3 text-sm font-semibold rounded-xl bg-white/10 text-white transition-all shadow-lg shadow-black/10">
                  <svg className="w-5 h-5 mr-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                  Projects
                </Link>
                <Link href="/calendar" className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-[#A2A3B7] hover:bg-white/5 hover:text-white transition-all group">
                  <svg className="w-5 h-5 mr-3 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  Calendar
                </Link>
                <Link href="/team" className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-[#A2A3B7] hover:bg-white/5 hover:text-white transition-all group">
                  <svg className="w-5 h-5 mr-3 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  Team
                </Link>
              </nav>
            </div>

            {/* Quick Actions */}
            <div>
              <p className="text-[10px] font-bold text-[#A2A3B7] uppercase tracking-[0.15em] mb-4 px-3">Integrations</p>
              <div className="space-y-2">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 5.92 2 10.75c0 2.76 1.48 5.23 3.8 6.84.28.19.46.5.46.85v3.13c0 .35.39.56.68.36l3.41-2.31c.21-.14.46-.22.72-.22H12c5.52 0 10-3.92 10-8.75S17.52 2 12 2z"/></svg>
                    </div>
                    <span className="text-xs font-semibold text-white/80 group-hover:text-white">Google Chat</span>
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                    </div>
                    <span className="text-xs font-semibold text-white/80 group-hover:text-white">Google Drive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center space-x-3 px-3 py-3 bg-white/5 rounded-2xl hover:bg-white/10 cursor-pointer transition-all border border-white/5 shadow-inner">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-[#34A853] text-white flex items-center justify-center font-bold text-sm shadow-lg ring-2 ring-white/10">
                US
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white leading-tight truncate">User Name</p>
                <p className="text-[10px] font-medium text-[#A2A3B7] truncate">user@promptwars.com</p>
              </div>
              <svg className="w-4 h-4 text-[#A2A3B7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden flex flex-col relative bg-[#FDFDFD]">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 z-[-1] opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1E1E2D 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          {children}
        </main>
      </body>
    </html>
  );
}
