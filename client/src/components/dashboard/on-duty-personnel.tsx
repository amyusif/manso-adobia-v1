import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Link } from "wouter";

export default function OnDutyPersonnel() {
  const { data: personnel, isLoading } = useQuery({
    queryKey: ["/api/personnel/on-duty"],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-blue-600" />
          <span>On Duty Personnel</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : personnel && personnel.length > 0 ? (
          <div className="space-y-4">
            {personnel.slice(0, 4).map((officer: any) => (
              <div key={officer.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {officer.firstName?.charAt(0) || "O"}
                        {officer.lastName?.charAt(0) || ""}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {officer.firstName} {officer.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{officer.rank}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">
                      {officer.currentLocation || officer.unit}
                    </p>
                    <Badge className="bg-green-100 text-green-800">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t border-gray-200">
              <Link href="/personnel">
                <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-800">
                  View All Personnel
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No personnel currently on duty</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
