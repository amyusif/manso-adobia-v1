import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface LogoutModalProps {
  trigger?: React.ReactNode;
}

export default function LogoutModal({ trigger }: LogoutModalProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      localStorage.removeItem('sessionId');
      queryClient.clear();
      window.location.href = "/login";
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button 
            variant="ghost" 
            className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to logout? You will need to sign in again to access the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {logoutMutation.isPending ? "Logging out..." : "Yes, Logout"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}