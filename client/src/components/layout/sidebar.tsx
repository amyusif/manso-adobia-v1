import { Link, useLocation } from "wouter";
import { Shield, BarChart3, Users, FileText, Calendar, MessageSquare, ChartBar, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LogoutModal from "@/components/logout-modal";

export default function Sidebar() {
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
    <div className="w-64 bg-[hsl(214,31%,21%)] text-white flex flex-col">
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
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <a
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 space-y-3">
        <LogoutModal />
        
        <div className="pt-3 border-t border-gray-600">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">
                {user?.firstName || user?.email || "User"}
              </p>
              <p className="text-xs text-gray-400">{user?.role || "Personnel"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
