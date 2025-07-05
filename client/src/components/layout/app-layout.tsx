import { useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar expanded={sidebarExpanded} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}