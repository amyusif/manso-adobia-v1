import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const sessionId = localStorage.getItem('sessionId');
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: !!sessionId,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!sessionId,
  };
}
