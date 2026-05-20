import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Wifi, CreditCard, FileText, AlertCircle, LogOut, Download, Clock, Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGetCustomer, useListComplaints, useCreateComplaint } from "@workspace/api-client-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const usageData = [
  { day: "Mon", usage: 12 }, { day: "Tue", usage: 8 }, { day: "Wed", usage: 15 },
  { day: "Thu", usage: 6 }, { day: "Fri", usage: 18 }, { day: "Sat", usage: 22 }, { day: "Sun", usage: 14 },
];

const complaintSchema = z.object({
  subject: z.string().min(3, "Subject required"),
  description: z.string().min(10, "Description required"),
});

export default function Portal() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [showComplaintForm, setShowComplaintForm] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("rudra_customer");
    if (!stored) { setLocation("/login"); return; }
    try {
      const customer = JSON.parse(stored);
      setCustomerId(customer.id);
    } catch { setLocation("/login"); }
  }, []);

  const { data: customer } = useGetCustomer(customerId!, {
    query: { enabled: !!customerId, queryKey: ["getCustomer", customerId] as any },
  });
  const { data: complaints } = useListComplaints();
  const createComplaint = useCreateComplaint();

  const form = useForm<z.infer<typeof complaintSchema>>({
    resolver: zodResolver(complaintSchema),
    defaultValues: { subject: "", description: "" },
  });

  const handleLogout = () => {
    localStorage.removeItem("rudra_token");
    localStorage.removeItem("rudra_customer");
    setLocation("/login");
  };

  const onSubmitComplaint = (vals: z.infer<typeof complaintSchema>) => {
    if (!customer) return;
    createComplaint.mutate({
      data: { name: customer.fullName, mobile: customer.mobile, subject: vals.subject, description: vals.description, priority: "medium" },
    }, {
      onSuccess: () => {
        toast({ title: "Ticket Created", description: "We'll resolve your issue soon." });
        setShowComplaintForm(false);
        form.reset();
      },
      onError: () => toast({ title: "Error", description: "Failed to create ticket.", variant: "destructive" }),
    });
  };

  const usagePct = customer ? (customer.dataUsedGB / Math.max(customer.dataLimitGB, 1)) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-black gradient-text">Customer Portal</h1>
          <p className="text-muted-foreground text-sm">Welcome back{customer ? `, ${customer.fullName}` : ""}!</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive" data-testid="btn-logout">
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-5">
          {/* Plan card */}
          <motion.div className="glass rounded-2xl p-5 relative overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                <Wifi className="w-5 h-5 text-background" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Current Plan</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30 text-xs">Active</Badge>
            </div>
            {customer ? (
              <div className="space-y-2">
                <p className="font-display text-2xl font-black text-primary">Plan #{customer.planId || "—"}</p>
                <p className="text-sm text-muted-foreground">Due: {customer.dueDate || "N/A"}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Loading plan details...</p>
            )}
          </motion.div>

          {/* Data usage */}
          <motion.div className="glass rounded-2xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-accent" />
              <p className="font-semibold text-foreground text-sm">Data Usage</p>
            </div>
            <div className="flex items-end justify-between mb-2">
              <p className="font-display text-2xl font-bold text-foreground">{customer?.dataUsedGB.toFixed(1) || "0"} GB</p>
              <p className="text-sm text-muted-foreground">/ {customer?.dataLimitGB || 0} GB</p>
            </div>
            <Progress value={usagePct} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">{(100 - usagePct).toFixed(0)}% remaining</p>
          </motion.div>

          {/* Quick actions */}
          <motion.div className="glass rounded-2xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <p className="font-semibold text-foreground text-sm mb-4">Quick Actions</p>
            <div className="space-y-2">
              {[
                { icon: CreditCard, label: "Pay Bill", color: "text-primary" },
                { icon: Download, label: "Download Invoice", color: "text-accent" },
                { icon: Clock, label: "View History", color: "text-orange-400" },
              ].map(action => (
                <button
                  key={action.label}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl glass hover:bg-muted/50 transition-all text-left"
                  data-testid={`portal-action-${action.label.toLowerCase().replace(/ /g, "-")}`}
                >
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                  <span className="text-sm text-foreground">{action.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Middle + right */}
        <div className="lg:col-span-2 space-y-5">
          {/* Usage chart */}
          <motion.div className="glass rounded-2xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-semibold text-foreground text-sm mb-4">Weekly Data Usage (GB)</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={usageData} barSize={20}>
                <XAxis dataKey="day" tick={{ fill: "hsl(215 20% 65%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "hsl(222 40% 12%)", border: "1px solid hsl(222 30% 20%)", borderRadius: 8, color: "white" }}
                  cursor={{ fill: "hsl(222 30% 20%)" }}
                />
                <Bar dataKey="usage" fill="hsl(38 92% 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Complaints */}
          <motion.div className="glass rounded-2xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-400" />
                <p className="font-semibold text-foreground text-sm">Support Tickets</p>
              </div>
              <Button size="sm" onClick={() => setShowComplaintForm(!showComplaintForm)} className="gradient-gold border-0 text-background text-xs font-semibold" data-testid="btn-new-ticket">
                <Plus className="w-3.5 h-3.5 mr-1" /> New Ticket
              </Button>
            </div>

            {showComplaintForm && (
              <motion.div className="glass rounded-xl p-4 mb-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmitComplaint)} className="space-y-3">
                    <FormField control={form.control} name="subject" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-foreground">Subject</FormLabel>
                        <FormControl><Input {...field} placeholder="Issue subject" className="bg-muted/30 border-border/50 h-8 text-sm" data-testid="input-ticket-subject" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-foreground">Description</FormLabel>
                        <FormControl><Textarea {...field} placeholder="Describe the issue" rows={2} className="bg-muted/30 border-border/50 text-sm resize-none" data-testid="input-ticket-desc" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" size="sm" disabled={createComplaint.isPending} className="gradient-gold border-0 text-background font-semibold text-xs" data-testid="btn-submit-ticket">
                      {createComplaint.isPending ? "Submitting..." : "Submit Ticket"}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            )}

            {complaints && complaints.length > 0 ? (
              <div className="space-y-2">
                {complaints.slice(0, 5).map(c => (
                  <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/20" data-testid={`ticket-row-${c.id}`}>
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{c.subject}</p>
                      <p className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge className={`text-xs shrink-0 ${
                      c.status === "resolved" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                      c.status === "open" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                      "bg-blue-500/20 text-blue-400 border-blue-500/30"
                    }`}>
                      {c.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">No support tickets yet</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
