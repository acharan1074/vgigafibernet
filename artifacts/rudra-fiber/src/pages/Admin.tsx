import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Wifi, AlertCircle, TrendingUp, CheckCircle, XCircle, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  useGetAdminStats,
  useListConnections, getListConnectionsQueryKey,
  useUpdateConnection,
  useListCustomers,
  useListComplaints, getListComplaintsQueryKey,
  useUpdateComplaint,
  useSeedDatabase
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { useToast } from "@/hooks/use-toast";

const revenueData = [
  { month: "Jan", revenue: 42000 }, { month: "Feb", revenue: 55000 },
  { month: "Mar", revenue: 61000 }, { month: "Apr", revenue: 58000 },
  { month: "May", revenue: 72000 }, { month: "Jun", revenue: 80000 },
];

const ADMIN_PASSWORD = "Vgigafiber@2026";

const fallbackAdminStats = { totalCustomers: 24, activeConnections: 21, pendingRequests: 3, openComplaints: 2, monthlyRevenue: 18640, newConnectionsThisMonth: 6 };

const fallbackConnections = [
  { id: 1001, fullName: "Ravi Kumar", mobile: "+91 98765 43210", village: "Warangal", address: "Main Road", pinCode: "506001", connectionType: "home", status: "pending", planId: 1, installationDate: null, createdAt: "2026-08-18T09:30:00.000Z" },
  { id: 1002, fullName: "Sowmya Reddy", mobile: "+91 91234 56789", village: "Hanamkonda", address: "Station Road", pinCode: "506011", connectionType: "home", status: "approved", planId: 5, installationDate: null, createdAt: "2026-08-16T11:00:00.000Z" },
  { id: 1003, fullName: "Vamsi Tech Solutions", mobile: "+91 99887 76655", village: "Kazipet", address: "Industrial Area", pinCode: "506003", connectionType: "business", status: "installed", planId: 8, installationDate: "2026-08-10T08:00:00.000Z", createdAt: "2026-08-05T08:00:00.000Z" },
];

const fallbackCustomers = [
  { id: 2001, fullName: "Anil Kumar", mobile: "+91 90000 11111", village: "Warangal", address: "Market Road", pinCode: "506002", planId: 5, status: "active", dataUsedGB: 146.5, dataLimitGB: 3300, dueDate: "2026-09-05", createdAt: "2026-06-12T08:00:00.000Z" },
  { id: 2002, fullName: "Lakshmi Devi", mobile: "+91 90000 22222", village: "Hanamkonda", address: "Temple Street", pinCode: "506011", planId: 8, status: "active", dataUsedGB: 98.2, dataLimitGB: 9999, dueDate: "2026-09-10", createdAt: "2026-05-20T08:00:00.000Z" },
  { id: 2003, fullName: "Prasad Rao", mobile: "+91 90000 33333", village: "Kazipet", address: "Nehru Nagar", pinCode: "506003", planId: 2, status: "inactive", dataUsedGB: 12.8, dataLimitGB: 1400, dueDate: "2026-08-28", createdAt: "2026-04-02T08:00:00.000Z" },
];

const fallbackComplaints = [
  { id: 3001, customerId: 2001, name: "Anil Kumar", mobile: "+91 90000 11111", subject: "Speed lower than plan", description: "Connection speed drops during evening hours.", status: "open", priority: "high", createdAt: "2026-08-21T10:00:00.000Z" },
  { id: 3002, customerId: 2002, name: "Lakshmi Devi", mobile: "+91 90000 22222", subject: "Router replacement", description: "Router is restarting frequently.", status: "in_progress", priority: "medium", createdAt: "2026-08-19T12:00:00.000Z" },
  { id: 3003, customerId: null, name: "Kiran", mobile: "+91 90000 44444", subject: "New connection enquiry", description: "Asked about installation availability.", status: "resolved", priority: "low", createdAt: "2026-08-12T09:00:00.000Z" },
];

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("rudra_admin") === "true");
  const [pwd, setPwd] = useState("");
  const [pwdError, setPwdError] = useState(false);
  const [activeTab, setActiveTab] = useState<"connections" | "customers" | "complaints">("connections");
  const [searchQuery, setSearchQuery] = useState("");
  const [connStatusFilter, setConnStatusFilter] = useState("");
  const [complaintStatusFilter, setComplaintStatusFilter] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats } = useGetAdminStats();
  const { data: connections, isLoading: connLoading } = useListConnections(
    connStatusFilter ? { status: connStatusFilter } : {},
  );
  const { data: customers } = useListCustomers(searchQuery ? { search: searchQuery } : {});
  const { data: complaints } = useListComplaints(
    complaintStatusFilter ? { status: complaintStatusFilter } : {},
  );
  const updateConnection = useUpdateConnection();
  const updateComplaint = useUpdateComplaint();
  const seedDatabase = useSeedDatabase();

  const displayStats = (stats && typeof stats === 'object') ? stats : fallbackAdminStats;
  const displayConnections = Array.isArray(connections) && connections.length > 0 ? connections : fallbackConnections.filter(connection => !connStatusFilter || connection.status === connStatusFilter);
  const displayCustomers = Array.isArray(customers) && customers.length > 0 ? customers : fallbackCustomers.filter(customer => !searchQuery || (customer.fullName && customer.fullName.toLowerCase().includes(searchQuery.toLowerCase())) || (customer.mobile && customer.mobile.includes(searchQuery)));
  const displayComplaints = Array.isArray(complaints) && complaints.length > 0 ? complaints : fallbackComplaints.filter(complaint => !complaintStatusFilter || complaint.status === complaintStatusFilter);

  const handleLogin = () => {
    if (pwd === ADMIN_PASSWORD) {
      sessionStorage.setItem("rudra_admin", "true");
      setAuthed(true);
    } else {
      setPwdError(true);
      setTimeout(() => setPwdError(false), 2000);
    }
  };

  const handleSeed = () => {
    seedDatabase.mutate(undefined, {
      onSuccess: () => {
        toast({ title: "Success", description: "Database seeded with default data!" });
        queryClient.invalidateQueries();
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to seed database.", variant: "destructive" });
      }
    });
  };

  const handleConnectionStatus = (id: number, status: string) => {
    updateConnection.mutate({ id, data: { status } }, {
      onSuccess: () => {
        toast({ title: "Updated", description: `Connection ${status}` });
        queryClient.invalidateQueries({ queryKey: getListConnectionsQueryKey() });
      },
    });
  };

  const handleComplaintStatus = (id: number, status: string) => {
    updateComplaint.mutate({ id, data: { status } }, {
      onSuccess: () => {
        toast({ title: "Updated", description: `Ticket ${status}` });
        queryClient.invalidateQueries({ queryKey: getListComplaintsQueryKey() });
      },
    });
  };

  if (!authed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          className="glass rounded-3xl p-10 w-full max-w-sm text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 rounded-2xl gradient-gold mx-auto mb-4 flex items-center justify-center neon-gold">
            <Users className="w-8 h-8 text-background" />
          </div>
          <h2 className="font-display text-xl font-black gradient-text mb-2">Admin Access</h2>
          <p className="text-sm text-muted-foreground mb-6">Enter admin password to continue</p>
          <Input
            type="password"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            placeholder="Admin password"
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            data-testid="input-admin-password"
            className={`bg-muted/30 border-border/50 mb-4 text-center ${pwdError ? "border-destructive" : ""}`}
          />
          {pwdError && <p className="text-xs text-destructive mb-3">Incorrect password</p>}
          <Button onClick={handleLogin} className="w-full gradient-gold border-0 text-background font-bold neon-gold" data-testid="btn-admin-login">
            Login
          </Button>

        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-black gradient-text">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">VGIGA FIBER NET — Control Panel</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSeed}
            disabled={seedDatabase.isPending}
            className="text-primary border-primary/40 hover:bg-primary/10"
          >
            {seedDatabase.isPending ? "Seeding..." : "Seed Database"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { sessionStorage.removeItem("rudra_admin"); setAuthed(false); }}
            className="text-muted-foreground hover:text-destructive"
            data-testid="btn-admin-logout"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Total Customers", value: displayStats?.totalCustomers ?? 0, icon: Users, color: "text-primary", bg: "from-primary/20 to-primary/5" },
          { label: "Active Connections", value: displayStats?.activeConnections ?? 0, icon: Wifi, color: "text-accent", bg: "from-accent/20 to-accent/5" },
          { label: "Pending Requests", value: displayStats?.pendingRequests ?? 0, icon: RefreshCw, color: "text-orange-400", bg: "from-orange-500/20 to-orange-500/5" },
          { label: "Open Complaints", value: displayStats?.openComplaints ?? 0, icon: AlertCircle, color: "text-red-400", bg: "from-red-500/20 to-red-500/5" },
          { label: "Monthly Revenue", value: `₹${(displayStats?.monthlyRevenue ?? 0).toLocaleString("en-IN")}`, icon: TrendingUp, color: "text-green-400", bg: "from-green-500/20 to-green-500/5" },
          { label: "New This Month", value: displayStats?.newConnectionsThisMonth ?? 0, icon: CheckCircle, color: "text-purple-400", bg: "from-purple-500/20 to-purple-500/5" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className={`glass rounded-2xl p-4 bg-gradient-to-br ${s.bg}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            data-testid={`stat-card-${s.label.toLowerCase().replace(/ /g, "-")}`}
          >
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <p className={`font-display text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue chart */}
      <motion.div className="glass rounded-2xl p-5 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p className="font-semibold text-foreground text-sm mb-4">Revenue Overview (₹)</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={revenueData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 20%)" />
            <XAxis dataKey="month" tick={{ fill: "hsl(215 20% 65%)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(222 40% 12%)", border: "1px solid hsl(222 30% 20%)", borderRadius: 8, color: "white", fontSize: 12 }}
              cursor={{ fill: "hsl(222 30% 20%)" }}
              formatter={(val: number) => [`₹${val.toLocaleString("en-IN")}`, "Revenue"]}
            />
            <Bar dataKey="revenue" fill="hsl(38 92% 50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(["connections", "customers", "complaints"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            data-testid={`admin-tab-${tab}`}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
              activeTab === tab ? "gradient-gold text-background neon-gold" : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Connections tab */}
      {activeTab === "connections" && (
        <motion.div className="glass rounded-2xl overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="p-4 border-b border-border/30 flex flex-wrap gap-2">
            {["", "pending", "approved", "installed", "rejected"].map(s => (
              <button
                key={s || "all"}
                onClick={() => setConnStatusFilter(s)}
                data-testid={`conn-filter-${s || "all"}`}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  connStatusFilter === s ? "gradient-gold text-background" : "glass text-muted-foreground"
                }`}
              >
                {s || "All"}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  {["Name", "Mobile", "Village", "Type", "Status", "Date", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayConnections.length > 0 ? displayConnections.map(c => (
                  <tr key={c.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors" data-testid={`conn-row-${c.id}`}>
                    <td className="px-4 py-3 font-medium text-foreground">{c.fullName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.mobile}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.village}</td>
                    <td className="px-4 py-3">
                      <Badge className="text-xs capitalize bg-blue-500/20 text-blue-300 border-blue-500/30">{c.connectionType}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-xs capitalize ${
                        c.status === "installed" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                        c.status === "pending" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                        c.status === "approved" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                        "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}>{c.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {c.status === "pending" && (
                          <>
                            <Button size="sm" onClick={() => handleConnectionStatus(c.id, "approved")} className="h-7 text-xs gradient-gold border-0 text-background" data-testid={`btn-approve-${c.id}`}>
                              <CheckCircle className="w-3 h-3 mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleConnectionStatus(c.id, "rejected")} className="h-7 text-xs text-destructive hover:bg-destructive/10" data-testid={`btn-reject-${c.id}`}>
                              <XCircle className="w-3 h-3 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                        {c.status === "approved" && (
                          <Button size="sm" onClick={() => handleConnectionStatus(c.id, "installed")} className="h-7 text-xs bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30" data-testid={`btn-install-${c.id}`}>
                            Mark Installed
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">{connLoading ? "Loading..." : "No connection requests"}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Customers tab */}
      {activeTab === "customers" && (
        <motion.div className="glass rounded-2xl overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="p-4 border-b border-border/30">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or mobile..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                data-testid="input-customer-search"
                className="bg-muted/30 border-border/50 pl-9 h-8 text-sm"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  {["Name", "Mobile", "Village", "Plan", "Status", "Data Used", "Due Date"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayCustomers.length > 0 ? displayCustomers.map(c => (
                  <tr key={c.id} className="border-b border-border/20 hover:bg-muted/20" data-testid={`customer-row-${c.id}`}>
                    <td className="px-4 py-3 font-medium text-foreground">{c.fullName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.mobile}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.village}</td>
                    <td className="px-4 py-3 text-muted-foreground">#{c.planId || "—"}</td>
                    <td className="px-4 py-3">
                      <Badge className={`text-xs ${c.status === "active" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.dataUsedGB.toFixed(1)} / {c.dataLimitGB} GB</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{c.dueDate || "—"}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No customers found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Complaints tab */}
      {activeTab === "complaints" && (
        <motion.div className="glass rounded-2xl overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="p-4 border-b border-border/30 flex flex-wrap gap-2">
            {["", "open", "in_progress", "resolved", "closed"].map(s => (
              <button
                key={s || "all"}
                onClick={() => setComplaintStatusFilter(s)}
                data-testid={`complaint-filter-${s || "all"}`}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  complaintStatusFilter === s ? "gradient-gold text-background" : "glass text-muted-foreground"
                }`}
              >
                {s || "All"}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  {["Name", "Mobile", "Subject", "Priority", "Status", "Date", "Action"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayComplaints.length > 0 ? displayComplaints.map(c => (
                  <tr key={c.id} className="border-b border-border/20 hover:bg-muted/20" data-testid={`complaint-row-${c.id}`}>
                    <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.mobile}</td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[140px] truncate">{c.subject}</td>
                    <td className="px-4 py-3">
                      <Badge className={`text-xs ${
                        c.priority === "high" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                        c.priority === "low" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                        "bg-orange-500/20 text-orange-400 border-orange-500/30"
                      }`}>{c.priority}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-xs ${
                        c.status === "resolved" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                        c.status === "open" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                        "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      }`}>{c.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {c.status === "open" && (
                        <div className="flex gap-1.5">
                          <Button size="sm" onClick={() => handleComplaintStatus(c.id, "in_progress")} className="h-7 text-xs bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30" data-testid={`btn-inprogress-${c.id}`}>
                            In Progress
                          </Button>
                          <Button size="sm" onClick={() => handleComplaintStatus(c.id, "resolved")} className="h-7 text-xs bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30" data-testid={`btn-resolve-${c.id}`}>
                            Resolve
                          </Button>
                        </div>
                      )}
                      {c.status === "in_progress" && (
                        <Button size="sm" onClick={() => handleComplaintStatus(c.id, "resolved")} className="h-7 text-xs bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30" data-testid={`btn-resolve-inprogress-${c.id}`}>
                          Resolve
                        </Button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No complaints found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
