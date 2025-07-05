import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Link } from "wouter";

export default function RecentCases() {
  const { data: cases, isLoading } = useQuery({
    queryKey: ["/api/cases/recent"],
  });

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

  const formatStatus = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span>Recent Cases</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : cases && cases.length > 0 ? (
          <div className="space-y-4">
            {cases.slice(0, 5).map((caseItem: any) => (
              <div key={caseItem.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-gray-900">
                      {caseItem.caseNumber}
                    </span>
                    <Badge className={getStatusColor(caseItem.status)}>
                      {formatStatus(caseItem.status)}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(caseItem.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{caseItem.title}</p>
                <p className="text-xs text-gray-500">
                  Type: {caseItem.type} • Priority: {caseItem.priority}
                </p>
              </div>
            ))}
            
            <div className="pt-4 border-t border-gray-200">
              <Link href="/cases">
                <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-800">
                  View All Cases
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No cases found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
