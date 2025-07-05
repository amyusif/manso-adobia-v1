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
import { insertCommunicationSchema } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

const communicationFormSchema = insertCommunicationSchema.extend({
  type: z.string().min(1, "Communication type is required"),
  message: z.string().min(1, "Message is required"),
});

type CommunicationFormData = z.infer<typeof communicationFormSchema>;

interface CommunicationFormProps {
  onSuccess: () => void;
}

export default function CommunicationForm({ onSuccess }: CommunicationFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const { data: personnel } = useQuery({
    queryKey: ["/api/personnel"],
  });

  const form = useForm<CommunicationFormData>({
    resolver: zodResolver(communicationFormSchema),
    defaultValues: {
      type: "",
      subject: "",
      message: "",
      recipients: "",
      status: "pending",
      sender: user?.id || "",
    },
  });

  const createCommunicationMutation = useMutation({
    mutationFn: async (data: CommunicationFormData) => {
      await apiRequest("POST", "/api/communications", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Message sent successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/communications"] });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CommunicationFormData) => {
    createCommunicationMutation.mutate({
      ...data,
      status: "sent",
      sentAt: new Date().toISOString(),
    } as any);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Communication Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="circular">Circular</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter subject" {...field} />
                </FormControl>
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
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter your message..." 
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
            {personnel?.map((person: any) => (
              <div key={person.id} className="flex items-center space-x-2">
                <Checkbox id={`person-${person.id}`} />
                <label htmlFor={`person-${person.id}`} className="text-sm">
                  {person.firstName} {person.lastName} ({person.rank})
                </label>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Select personnel to receive this message
          </p>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={createCommunicationMutation.isPending}>
            {createCommunicationMutation.isPending ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
