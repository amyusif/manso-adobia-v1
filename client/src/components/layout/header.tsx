import { Bell, Mail, Sun, Moon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
}

export default function Header({ sidebarExpanded, setSidebarExpanded }: HeaderProps) {
  const { user } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Mock notifications - in a real app, this would come from an API
  const notifications = [
    { id: 1, message: "New case assigned: Case #2024-001", time: "5 min ago" },
    { id: 2, message: "Duty roster updated for tomorrow", time: "1 hour ago" },
    { id: 3, message: "Emergency alert from Unit 3", time: "2 hours ago" },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="mr-4"
          >
            {sidebarExpanded ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="h-5 w-5 text-gray-400" />
            ) : (
              <Sun className="h-5 w-5 text-gray-400" />
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-400" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4">
                    <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem className="p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon">
            <Mail className="h-5 w-5 text-gray-400" />
          </Button>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {(user as any)?.role?.replace("_", " ") || "Personnel"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {(user as any)?.firstName || (user as any)?.email || "User"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
