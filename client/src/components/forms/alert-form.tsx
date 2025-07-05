import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertAlertSchema } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

const alertFormSchema = insertAlertSchema.extend({
  title: z.string().min(1, "Alert title is required"),
  message: z.string().min(1, "Alert message is required"),
  type: z.string().min(1, "Alert type is required"),
  priority: z.string().min(1, "Priority is required"),
});

type AlertFormData = z.infer<typeof alertFormSchema>;

interface AlertFormProps {
  onSuccess: () => void;
}

export default function AlertForm({ onSuccess }: AlertFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const { data: personnel } = useQuery({
    queryKey: ["/api/personnel"],
  });

  const form = useForm<AlertFormData>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      title: "",
      message: "",
      type: "",
      priority: "medium",
      recipients: "",
      isRead: false,
      sentBy: user?.id || "",
    },
  });

  const createAlertMutation = useMutation({
    mutationFn: async (data: AlertFormData) => {
      await apiRequest("POST", "/api/alerts", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Alert sent successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/alerts/active"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send alert",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AlertFormData) => {
    createAlertMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alert Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter alert title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alert Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select alert type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Information</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alert Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter alert message..." 
                  className="min-h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Recipients</FormLabel>
          <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border rounded p-2">
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox id="select-all" />
              <label htmlFor="select-all" className="text-sm font-medium">
                Select All Personnel
              </label>
            </div>
            {personnel?.map((person: any) => (
              <div key={person.id} className="flex items-center space-x-2">
                <Checkbox id={`alert-person-${person.id}`} />
                <label htmlFor={`alert-person-${person.id}`} className="text-sm">
                  {person.firstName} {person.lastName} ({person.rank})
                </label>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Select personnel to receive this alert
          </p>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createAlertMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {createAlertMutation.isPending ? "Sending Alert..." : "Send Alert"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
