import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, FileText, Calendar, MessageSquare, BarChart3 } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Personnel Management",
      description: "Manage officer profiles, ranks, and assignments"
    },
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: "Case Tracking",
      description: "Log and track cases with real-time status updates"
    },
    {
      icon: <Calendar className="h-8 w-8 text-blue-600" />,
      title: "Duty Management",
      description: "Schedule and monitor duty assignments"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      title: "Communication",
      description: "Send alerts and circulars to personnel"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "Reports",
      description: "Generate comprehensive reports and analytics"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Manso Adubia District Police Command
                </h1>
                <p className="text-sm text-gray-600">Command & Control System</p>
              </div>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Login to System
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Police Command Management System
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive system for managing personnel, tracking cases, assigning duties, 
            and facilitating communication within the police command structure.
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Access Command Center
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Manso Adubia District Police Command. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
