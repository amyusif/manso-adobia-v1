import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar, AlertTriangle } from "lucide-react";
import CaseForm from "@/components/forms/case-form";
import DutyForm from "@/components/forms/duty-form";

export default function QuickActions() {
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Dialog open={openDialog === 'case'} onOpenChange={(open) => setOpenDialog(open ? 'case' : null)}>
            <DialogTrigger asChild>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Case
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Case</DialogTitle>
              </DialogHeader>
              <CaseForm onSuccess={() => setOpenDialog(null)} />
            </DialogContent>
          </Dialog>

          <Dialog open={openDialog === 'duty'} onOpenChange={(open) => setOpenDialog(open ? 'duty' : null)}>
            <DialogTrigger asChild>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                <Calendar className="h-4 w-4 mr-2" />
                Assign Duty
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Assign New Duty</DialogTitle>
              </DialogHeader>
              <DutyForm onSuccess={() => setOpenDialog(null)} />
            </DialogContent>
          </Dialog>

          <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Send Alert
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
