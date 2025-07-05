import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/app-layout";
import StatsCards from "@/components/dashboard/stats-cards";
import RecentCases from "@/components/dashboard/recent-cases";
import OnDutyPersonnel from "@/components/dashboard/on-duty-personnel";
import QuickActions from "@/components/dashboard/quick-actions";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppLayout>
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <RecentCases />
        <OnDutyPersonnel />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <QuickActions />
        
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">System initialized</p>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Communication Center */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Communication</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-envelope text-blue-600"></i>
                  <span className="text-sm text-gray-900">Messages</span>
                </div>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">0</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-bullhorn text-orange-600"></i>
                  <span className="text-sm text-gray-900">Circulars</span>
                </div>
                <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
