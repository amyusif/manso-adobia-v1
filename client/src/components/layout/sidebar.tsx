import { Link, useLocation } from "wouter";
import { Shield, BarChart3, Users, FileText, Calendar, MessageSquare, ChartBar, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LogoutModal from "@/components/logout-modal";

interface SidebarProps {
  expanded: boolean;
}

export default function Sidebar({ expanded }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: "Overview", href: "/", icon: BarChart3 },
    { name: "Personnel", href: "/personnel", icon: Users },
    { name: "Cases", href: "/cases", icon: FileText },
    { name: "Duties", href: "/duties", icon: Calendar },
    { name: "Communication", href: "/communication", icon: MessageSquare },
    { name: "Reports", href: "/reports", icon: ChartBar },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className={`bg-[hsl(214,31%,21%)] text-white flex flex-col transition-all duration-300 ${
      expanded ? "w-64" : "w-16"
    }`}>
      {expanded && (
        <div className="p-6 border-b border-gray-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Shield className="text-blue-600 h-6 w-6" />
            </div>
            <div>
              <h1 className="text-sm font-semibold">MADPC</h1>
              <p className="text-xs text-gray-300">Command Center</p>
            </div>
          </div>
        </div>
      )}
      {!expanded && (
        <div className="p-4 border-b border-gray-600 flex justify-center">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Shield className="text-blue-600 h-5 w-5" />
          </div>
        </div>
      )}
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <li key={item.name}>
                <Link href={item.href} 
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    expanded ? "space-x-3" : "justify-center"
                  } ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  title={!expanded ? item.name : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {expanded && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 space-y-3">
        <div className="border-t border-gray-600 pt-3">
          {expanded ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {(user as any)?.firstName?.charAt(0) || (user as any)?.email?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {(user as any)?.firstName || (user as any)?.email || "User"}
                  </p>
                  <p className="text-xs text-gray-400">{(user as any)?.role || "Personnel"}</p>
                </div>
              </div>
              <LogoutModal collapsed={false} />
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {(user as any)?.firstName?.charAt(0) || (user as any)?.email?.charAt(0) || "U"}
                </span>
              </div>
              <LogoutModal collapsed={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
