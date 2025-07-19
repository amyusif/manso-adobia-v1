import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import CaseForm from "@/components/forms/case-form";

export default function Cases() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const { data: cases, isLoading } = useQuery({
    queryKey: ["/api/cases"],
  });

  const filteredCases = cases?.filter((caseItem: any) =>
    caseItem.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "under_investigation":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-green-100 text-green-800";
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

  const formatStatus = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <AppLayout>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Case Management</h1>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Case
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Case</DialogTitle>
                  </DialogHeader>
                  <CaseForm onSuccess={() => setOpenDialog(false)} />
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-32 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCases && filteredCases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCases.map((caseItem: any) => (
                <Card key={caseItem.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {caseItem.caseNumber}
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Badge className={getStatusColor(caseItem.status)}>
                          {formatStatus(caseItem.status)}
                        </Badge>
                        <Badge className={getPriorityColor(caseItem.priority)}>
                          {caseItem.priority}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-700">{caseItem.title}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium capitalize">{caseItem.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Reported:</span>
                        <span className="font-medium">
                          {new Date(caseItem.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {caseItem.reportedBy && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Reporter:</span>
                          <span className="font-medium">{caseItem.reportedBy}</span>
                        </div>
                      )}
                      {caseItem.description && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {caseItem.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Cases Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "No cases match your search criteria." : "Get started by logging your first case."}
              </p>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Case
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Case</DialogTitle>
                  </DialogHeader>
                  <CaseForm onSuccess={() => setOpenDialog(false)} />
                </DialogContent>
              </Dialog>
            </div>
          )}
    </AppLayout>
  );
}
