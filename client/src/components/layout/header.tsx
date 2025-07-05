import { Bell, Mail, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

export default function Header() {
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

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manso Adubia District Police Command
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Command & Control Dashboard</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="h-5 w-5 text-gray-400" />
            ) : (
              <Sun className="h-5 w-5 text-gray-400" />
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-gray-400" />
          </Button>
          <Button variant="ghost" size="icon">
            <Mail className="h-5 w-5 text-gray-400" />
          </Button>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.role?.replace("_", " ") || "Personnel"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.firstName || user?.email || "User"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
