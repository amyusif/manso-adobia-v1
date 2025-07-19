import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, MessageSquare, AlertTriangle, Megaphone, Search, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import CommunicationForm from "@/components/forms/communication-form";
import AlertForm from "@/components/forms/alert-form";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Communication() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState<string | null>(null);

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

  const { data: communications, isLoading: isLoadingComms } = useQuery({
    queryKey: ["/api/communications"],
    enabled: isAuthenticated,
  });

  const { data: alerts, isLoading: isLoadingAlerts } = useQuery({
    queryKey: ["/api/alerts"],
    enabled: isAuthenticated,
  });

  const filteredCommunications = communications?.filter((comm: any) =>
    comm.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comm.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAlerts = alerts?.filter((alert: any) =>
    alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-orange-100 text-orange-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Communication Center</h1>
              <div className="flex space-x-2">
                <Dialog open={openDialog === 'message'} onOpenChange={(open) => setOpenDialog(open ? 'message' : null)}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Send Message/Circular</DialogTitle>
                    </DialogHeader>
                    <CommunicationForm onSuccess={() => setOpenDialog(null)} />
                  </DialogContent>
                </Dialog>

                <Dialog open={openDialog === 'alert'} onOpenChange={(open) => setOpenDialog(open ? 'alert' : null)}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Send Alert
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Send Alert</DialogTitle>
                    </DialogHeader>
                    <AlertForm onSuccess={() => setOpenDialog(null)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search communications and alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs defaultValue="messages" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="messages" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Messages</span>
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="circulars" className="flex items-center space-x-2">
                <Megaphone className="h-4 w-4" />
                <span>Circulars</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="messages">
              {isLoadingComms ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-32 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredCommunications && filteredCommunications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCommunications
                    .filter((comm: any) => comm.type !== 'circular')
                    .map((comm: any) => (
                    <Card key={comm.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-lg">{comm.subject || "Message"}</CardTitle>
                          <Badge className={getStatusColor(comm.status)}>
                            {comm.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Send className="h-4 w-4" />
                          <span>{comm.type}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600 line-clamp-3">{comm.message}</p>
                          <div className="flex justify-between text-xs text-gray-500 mt-3">
                            <span>
                              {comm.sentAt 
                                ? new Date(comm.sentAt).toLocaleString()
                                : new Date(comm.createdAt).toLocaleString()
                              }
                            </span>
                            <span>{comm.type.toUpperCase()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Messages Found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? "No messages match your search criteria." : "Start communicating with your team."}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="alerts">
              {isLoadingAlerts ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-32 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredAlerts && filteredAlerts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAlerts.map((alert: any) => (
                    <Card key={alert.id} className="hover:shadow-lg transition-shadow border-l-4 border-red-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-lg">{alert.title}</CardTitle>
                          <div className="flex space-x-2">
                            <Badge className={getAlertTypeColor(alert.type)}>
                              {alert.type}
                            </Badge>
                            <Badge className={getPriorityColor(alert.priority)}>
                              {alert.priority}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600 line-clamp-3">{alert.message}</p>
                          <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
                            <span>{new Date(alert.createdAt).toLocaleString()}</span>
                            <Badge className={alert.isRead ? "bg-gray-100 text-gray-800" : "bg-yellow-100 text-yellow-800"}>
                              {alert.isRead ? "Read" : "Unread"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Alerts Found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? "No alerts match your search criteria." : "No alerts have been sent."}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="circulars">
              {isLoadingComms ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-32 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredCommunications && filteredCommunications.filter((comm: any) => comm.type === 'circular').length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCommunications
                    .filter((comm: any) => comm.type === 'circular')
                    .map((comm: any) => (
                    <Card key={comm.id} className="hover:shadow-lg transition-shadow border-l-4 border-orange-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-lg">{comm.subject || "Circular"}</CardTitle>
                          <Badge className={getStatusColor(comm.status)}>
                            {comm.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Megaphone className="h-4 w-4" />
                          <span>Official Circular</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600 line-clamp-3">{comm.message}</p>
                          <div className="flex justify-between text-xs text-gray-500 mt-3">
                            <span>
                              {comm.sentAt 
                                ? new Date(comm.sentAt).toLocaleString()
                                : new Date(comm.createdAt).toLocaleString()
                              }
                            </span>
                            <span>CIRCULAR</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Megaphone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Circulars Found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? "No circulars match your search criteria." : "No official circulars have been issued."}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
    </AppLayout>
  );
}
