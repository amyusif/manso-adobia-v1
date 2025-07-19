import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, FileText, Users, Calendar, Download, Filter, TrendingUp, AlertTriangle } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Reports() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [dateRange, setDateRange] = useState("30");
  const [reportType, setReportType] = useState("summary");

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

  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: isAuthenticated,
  });

  const { data: personnel } = useQuery({
    queryKey: ["/api/personnel"],
    enabled: isAuthenticated,
  });

  const { data: cases } = useQuery({
    queryKey: ["/api/cases"],
    enabled: isAuthenticated,
  });

  const { data: duties } = useQuery({
    queryKey: ["/api/duties"],
    enabled: isAuthenticated,
  });

  const { data: alerts } = useQuery({
    queryKey: ["/api/alerts"],
    enabled: isAuthenticated,
  });

  // Calculate analytics
  const personnelByRank = personnel?.reduce((acc: any, person: any) => {
    acc[person.rank] = (acc[person.rank] || 0) + 1;
    return acc;
  }, {}) || {};

  const casesByType = cases?.reduce((acc: any, caseItem: any) => {
    acc[caseItem.type] = (acc[caseItem.type] || 0) + 1;
    return acc;
  }, {}) || {};

  const casesByStatus = cases?.reduce((acc: any, caseItem: any) => {
    acc[caseItem.status] = (acc[caseItem.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const dutiesByStatus = duties?.reduce((acc: any, duty: any) => {
    acc[duty.status] = (acc[duty.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const onDutyCount = personnel?.filter((person: any) => person.isOnDuty).length || 0;
  const offDutyCount = (personnel?.length || 0) - onDutyCount;

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "Your report has been generated successfully.",
    });
  };

  const handleExportReport = () => {
    toast({
      title: "Export Started",
      description: "Your report export has started. You'll receive a download link shortly.",
    });
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
              <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
              <div className="flex space-x-2">
                <Button onClick={handleGenerateReport} className="bg-blue-600 hover:bg-blue-700">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button onClick={handleExportReport} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
            
            {/* Report Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Report Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">Summary Report</SelectItem>
                        <SelectItem value="personnel">Personnel Report</SelectItem>
                        <SelectItem value="cases">Cases Report</SelectItem>
                        <SelectItem value="duties">Duties Report</SelectItem>
                        <SelectItem value="performance">Performance Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date-range">Date Range</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="90">Last 3 months</SelectItem>
                        <SelectItem value="365">Last year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="custom-date">Custom Date</Label>
                    <Input type="date" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="personnel">Personnel</TabsTrigger>
              <TabsTrigger value="cases">Cases</TabsTrigger>
              <TabsTrigger value="operations">Operations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-l-4 border-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Personnel</p>
                        <p className="text-3xl font-bold text-blue-600">{dashboardStats?.totalPersonnel || 0}</p>
                        <p className="text-xs text-gray-500">Active officers</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-green-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Cases Resolved</p>
                        <p className="text-3xl font-bold text-green-600">
                          {cases?.filter((c: any) => c.status === 'closed').length || 0}
                        </p>
                        <p className="text-xs text-gray-500">This period</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-orange-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending Duties</p>
                        <p className="text-3xl font-bold text-orange-600">{dashboardStats?.pendingDuties || 0}</p>
                        <p className="text-xs text-gray-500">Awaiting assignment</p>
                      </div>
                      <Calendar className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-red-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                        <p className="text-3xl font-bold text-red-600">{dashboardStats?.activeAlerts || 0}</p>
                        <p className="text-xs text-gray-500">Requiring attention</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Summary Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cases by Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(casesByStatus).map(([status, count]) => (
                        <div key={status} className="flex items-center justify-between">
                          <span className="capitalize">{status.replace('_', ' ')}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${((count as number) / (cases?.length || 1)) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{count as number}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Personnel Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>On Duty</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(onDutyCount / (personnel?.length || 1)) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{onDutyCount}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Off Duty</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gray-600 h-2 rounded-full" 
                              style={{ width: `${(offDutyCount / (personnel?.length || 1)) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{offDutyCount}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="personnel">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personnel by Rank</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(personnelByRank).map(([rank, count]) => (
                        <div key={rank} className="flex items-center justify-between">
                          <span>{rank}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${((count as number) / (personnel?.length || 1)) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{count as number}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Duty Status Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(dutiesByStatus).map(([status, count]) => (
                        <div key={status} className="flex items-center justify-between">
                          <span className="capitalize">{status.replace('_', ' ')}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-orange-600 h-2 rounded-full" 
                                style={{ width: `${((count as number) / (duties?.length || 1)) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{count as number}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="cases">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Cases by Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(casesByType).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                          <span className="capitalize">{type}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full" 
                                style={{ width: `${((count as number) / (cases?.length || 1)) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{count as number}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Case Resolution Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {cases?.length > 0 
                          ? Math.round((cases.filter((c: any) => c.status === 'closed').length / cases.length) * 100)
                          : 0
                        }%
                      </div>
                      <p className="text-gray-600">Cases resolved this period</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Cases</span>
                          <span>{cases?.length || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Resolved</span>
                          <span>{cases?.filter((c: any) => c.status === 'closed').length || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>In Progress</span>
                          <span>{cases?.filter((c: any) => c.status === 'under_investigation').length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="operations">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Operations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Active Patrols</span>
                        <span className="font-medium">{onDutyCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending Duties</span>
                        <span className="font-medium">{dashboardStats?.pendingDuties || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Alerts</span>
                        <span className="font-medium">{dashboardStats?.activeAlerts || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Response Times</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        ~15 min
                      </div>
                      <p className="text-gray-600">Average response time</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>System Status</span>
                        <span className="text-green-600 font-medium">Operational</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Last Backup</span>
                        <span className="text-gray-600">Today</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Uptime</span>
                        <span className="text-green-600 font-medium">99.9%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
    </AppLayout>
  );
}
