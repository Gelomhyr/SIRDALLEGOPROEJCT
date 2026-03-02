
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Bell, Building2, ClipboardCheck, FileText, LayoutDashboard, LogOut, Mail, Menu, Settings, Shield, UserCog, Users, X } from "lucide-react";
import { clearAuthSession, type UserRole } from "@/lib/auth";
import { api, authHeaders } from "@/lib/api";
import { LogoutConfirmation } from "@/components/LogoutConfirmation";

interface DashboardProps { role: UserRole; }
type Panel = "overview" | "users" | "officials" | "announcements" | "reports" | "services" | "messages" | "subscriptions" | "settings" | "audit";
type UserItem = { _id: string; username: string; firstName?: string; middleName?: string; lastName?: string; email: string; contactNumber?: string; address?: string; role: string; status: "active" | "pending" | "suspended"; validIdType?: string; validIdStatus?: string; validIdImage?: string; avatarImage?: string; createdAt?: string; };
type Official = { _id: string; name: string; role: string; level: "city" | "barangay"; rankOrder: number; committee?: string; description?: string; image?: string; };
type AnnouncementItem = { _id: string; title: string; content?: string; category: string; module: string; source?: string; image?: string; createdAt?: string; };
type ReportItem = { _id: string; category: string; description: string; status: string; referenceNo: string; createdAt?: string; };
type ServiceRequest = { _id: string; referenceNo: string; serviceType: string; fullName: string; status: string; createdAt?: string; };
type ContactMessage = { _id: string; referenceNo: string; name: string; department: string; status: string; createdAt?: string; };
type Department = { _id: string; name: string; contactPerson: string; localNumber: string; active?: boolean };
type Subscription = { _id: string; email: string; status: "active" | "unsubscribed"; source?: string; createdAt?: string; };
type ActivityItem = { _id: string; title: string; type: string; createdAt: string; };
type SystemSettings = { autoArchiveReports: boolean; requireAnnouncementReview: boolean; emailDigest: boolean; allowResidentRegistration: boolean; maintenanceMode: boolean; maintenanceMessage: string; sessionTimeoutMinutes: number; lockoutWindowMinutes: number; };
type SiteContent = {
  communityCards: Array<{ value: string; label: string; sublabel: string }>;
  aboutHeroTitle: string;
  aboutHeroSubtitle: string;
  aboutSnapshotItems: Array<{ label: string; value: string }>;
  aboutPopulationTrend: Array<{ label: string; value: string }>;
  aboutCoreGovernance: string[];
  aboutHistoryText: string;
  aboutGovernanceText: string;
  contactOfficeHours?: string;
  contactLocationText?: string;
};
type PendingAction = { title: string; message: string; confirmLabel: string; run: () => Promise<void>; };
type Feedback = { type: "success" | "error"; title: string; message: string; };

function Badge({ value }: { value: string }) {
  const v = value.toLowerCase();
  const tone = v === "active" || v === "approved" || v === "resolved" ? "bg-emerald-100 text-emerald-700" : v === "pending" || v === "new" || v === "in-review" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${tone}`}>{value}</span>;
}

function MiniBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.max(6, Math.round((value / max) * 100)) : 6;
  return (
    <div className="grid grid-cols-[140px,1fr,36px] items-center gap-2 text-xs">
      <span className="truncate font-medium text-slate-600">{label}</span>
      <div className="h-2 rounded bg-slate-100"><div className="h-2 rounded bg-slate-900" style={{ width: `${pct}%` }} /></div>
      <span className="text-right text-slate-500">{value}</span>
    </div>
  );
}

export default function RoleDashboard({ role }: DashboardProps) {
  const navigate = useNavigate();
  const canManage = role === "superadmin";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<Panel>("overview");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [officialEditModal, setOfficialEditModal] = useState<Official | null>(null);
  const [announcementEditModal, setAnnouncementEditModal] = useState<AnnouncementItem | null>(null);
  const [homeEditOpen, setHomeEditOpen] = useState(false);
  const [aboutEditOpen, setAboutEditOpen] = useState(false);
  const [contactEditOpen, setContactEditOpen] = useState(false);
  const [servicesEditOpen, setServicesEditOpen] = useState(false);
  const [aboutSnapshotDraft, setAboutSnapshotDraft] = useState("");
  const [aboutTrendDraft, setAboutTrendDraft] = useState("");
  const [aboutGovDraft, setAboutGovDraft] = useState("");

  const [users, setUsers] = useState<UserItem[]>([]);
  const [officials, setOfficials] = useState<Official[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [services, setServices] = useState<ServiceRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [serviceCatalog, setServiceCatalog] = useState<any[]>([]);
  const [editingCatalogId, setEditingCatalogId] = useState<string | null>(null);

  const [newOfficial, setNewOfficial] = useState({ name: "", role: "", level: "barangay", rankOrder: 10, committee: "", description: "", image: "" });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "", module: "barangay-updates", category: "Advisory", source: "Barangay Office", image: "" });
  const [newCatalogItem, setNewCatalogItem] = useState({ code: "", title: "", desc: "", usage: "", requirements: "", time: "", active: true, sortOrder: 100 });
  const [newDepartment, setNewDepartment] = useState({ name: "", contactPerson: "", localNumber: "" });
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({ autoArchiveReports: true, requireAnnouncementReview: false, emailDigest: true, allowResidentRegistration: true, maintenanceMode: false, maintenanceMessage: "", sessionTimeoutMinutes: 60, lockoutWindowMinutes: 15 });
  const [siteContent, setSiteContent] = useState<SiteContent>({
    communityCards: [
      { value: "4102", label: "Postal Code", sublabel: "Bacoor City" },
      { value: "7,129", label: "Population", sublabel: "2020 Census" },
      { value: "IV-A", label: "Region", sublabel: "CALABARZON" },
      { value: "CAVITE", label: "Province", sublabel: "Philippines" },
    ],
    aboutHeroTitle: "About Our Community",
    aboutHeroSubtitle: "Mambog II: A progressive residential barangay in the heart of Bacoor.",
    aboutSnapshotItems: [
      { label: "Region", value: "CALABARZON (Region IV-A)" },
      { label: "Population (2020)", value: "7,129 Residents" },
      { label: "City", value: "Bacoor City, Cavite" },
      { label: "Share of Bacoor", value: "Approx. 1.07%" },
    ],
    aboutPopulationTrend: [
      { label: "1990 Census", value: "~2,500" },
      { label: "2010 Census", value: "~5,800" },
      { label: "2020 Census", value: "7,129" },
    ],
    aboutCoreGovernance: [
      "Barangay Assembly: Biannual meetings for resident consultation.",
      "Committees: Peace & Order, Health, Finance, Youth, Infrastructure.",
      "Transparency: Full disclosure of budget and projects.",
    ],
    aboutHistoryText: "",
    aboutGovernanceText: "",
    contactOfficeHours: "Monday - Friday, 8:00 AM - 5:00 PM",
    contactLocationText: "Barangay Mambog II Hall, Bacoor City, Cavite",
  });

  useEffect(() => { void loadDashboardData(); }, []);
  useEffect(() => { if (!feedback) return; const t = setTimeout(() => setFeedback(null), 2800); return () => clearTimeout(t); }, [feedback]);

  const stats = useMemo(() => ({
    users: users.length,
    pendingUsers: users.filter((u) => u.status === "pending" || u.validIdStatus === "pending").length,
    announcements: announcements.length,
    subscribers: subscriptions.filter((s) => s.status === "active").length,
    openReports: reports.filter((r) => r.status !== "resolved").length,
    pendingServices: services.filter((s) => s.status === "pending" || s.status === "in-review").length,
    unreadMessages: messages.filter((m) => m.status === "new").length,
  }), [users, announcements, subscriptions, reports, services, messages]);

  const chartServices = useMemo(() => {
    const map = new Map<string, number>();
    services.forEach((s) => map.set(s.serviceType, (map.get(s.serviceType) || 0) + 1));
    return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
  }, [services]);

  const chartReports = useMemo(() => {
    const map = new Map<string, number>();
    reports.forEach((r) => map.set(r.category, (map.get(r.category) || 0) + 1));
    return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
  }, [reports]);

  const chartAnnouncements = useMemo(() => {
    const map = new Map<string, number>();
    announcements.forEach((a) => map.set(a.module, (map.get(a.module) || 0) + 1));
    return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
  }, [announcements]);

  async function loadDashboardData() {
    try {
      const [usersRes, officialsRes, announcementsRes, reportsRes, servicesRes, messagesRes, subscriptionsRes, activityRes, settingsRes, contentRes, catalogRes, deptRes] = await Promise.all([
        api.get("/api/admin/users", { headers: authHeaders() }),
        api.get("/api/officials"),
        api.get("/api/announcements"),
        api.get("/api/reports", { headers: authHeaders() }),
        api.get("/api/services/requests", { headers: authHeaders() }),
        api.get("/api/contact/messages", { headers: authHeaders() }),
        api.get("/api/subscriptions", { headers: authHeaders() }),
        api.get("/api/admin/activity/me", { headers: authHeaders() }),
        api.get("/api/admin/system-settings", { headers: authHeaders() }),
        api.get("/api/content/site"),
        api.get("/api/services/catalog/all", { headers: authHeaders() }),
        api.get("/api/contact/departments"),
      ]);
      setUsers(usersRes.data || []); setOfficials(officialsRes.data || []); setAnnouncements(announcementsRes.data || []);
      setReports(reportsRes.data || []); setServices(servicesRes.data || []); setMessages(messagesRes.data || []);
      setSubscriptions(subscriptionsRes.data || []); setActivities(activityRes.data || []);
      setSystemSettings((p) => ({ ...p, ...(settingsRes.data || {}) }));
      setSiteContent((p) => ({ ...p, ...(contentRes.data || {}) }));
      setServiceCatalog(catalogRes.data || []);
      setDepartments(deptRes.data || []);
    } catch (err: any) {
      setFeedback({ type: "error", title: "Load failed", message: err?.response?.data?.msg || "Could not load dashboard data." });
    }
  }

  async function runActionWithFeedback(title: string, action: () => Promise<void>) {
    await action(); await loadDashboardData(); setFeedback({ type: "success", title, message: `Completed at ${new Date().toLocaleString()}` });
  }

  async function confirmPendingAction() {
    if (!pendingAction) return;
    setActionLoading(true);
    try { await pendingAction.run(); setPendingAction(null); } catch (err: any) { setFeedback({ type: "error", title: "Action failed", message: err?.response?.data?.msg || "Please try again." }); }
    finally { setActionLoading(false); }
  }

  function confirmLogout() { setIsLoggingOut(true); setTimeout(() => { clearAuthSession(); navigate("/"); }, 3000); }

  function fileToBase64(file: File, cb: (value: string) => void) {
    const reader = new FileReader();
    reader.onload = () => cb(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  function pairsToLines(items: Array<{ label: string; value: string }>) {
    return (items || []).map((x) => `${x.label}|${x.value}`).join("\n");
  }

  function linesToPairs(text: string) {
    return String(text || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, ...rest] = line.split("|");
        return { label: (label || "").trim(), value: rest.join("|").trim() };
      })
      .filter((x) => x.label && x.value);
  }

  const navItems: Array<{ id: Panel; label: string; icon: JSX.Element }> = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
    { id: "users", label: "Users", icon: <Users size={16} /> },
    { id: "officials", label: "Officials", icon: <Building2 size={16} /> },
    { id: "announcements", label: "Announcements", icon: <Bell size={16} /> },
    { id: "reports", label: "Reports", icon: <AlertTriangle size={16} /> },
    { id: "services", label: "Service Requests", icon: <FileText size={16} /> },
    { id: "messages", label: "Messages", icon: <Mail size={16} /> },
    { id: "subscriptions", label: "Subscribers", icon: <Mail size={16} /> },
    { id: "settings", label: "System Settings", icon: <Settings size={16} /> },
    { id: "audit", label: "My Activity", icon: <ClipboardCheck size={16} /> },
  ];

  const card = "space-y-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm";
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="rounded-md border border-slate-200 p-2 md:hidden" onClick={() => setIsMenuOpen((v) => !v)} type="button">{isMenuOpen ? <X size={16} /> : <Menu size={16} />}</button>
            <div className="rounded-md bg-slate-900 p-2 text-white">{role === "superadmin" ? <Shield size={16} /> : <UserCog size={16} />}</div>
            <div><p className="text-xs uppercase tracking-wide text-slate-500">BayanTrack Panel</p><h1 className="text-lg font-bold text-slate-900">{role === "superadmin" ? "Superadmin Dashboard" : "Admin Dashboard"}</h1></div>
          </div>
          <button className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700" onClick={() => setShowLogoutDialog(true)} type="button"><LogOut size={14} /> Logout</button>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-4 sm:px-6 md:grid-cols-[220px,1fr]">
        <aside className={`${isMenuOpen ? "block" : "hidden"} rounded-xl border border-slate-200 bg-white p-2 shadow-sm md:block`}>
          {navItems.map((item) => <button key={item.id} className={`mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${activePanel === item.id ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`} onClick={() => { setActivePanel(item.id); setIsMenuOpen(false); }} type="button">{item.icon}{item.label}</button>)}
        </aside>

        <main className="space-y-4">
          {activePanel === "overview" && (
            <section className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs text-slate-500">Users</p><p className="text-3xl font-bold">{stats.users}</p></div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs text-slate-500">Pending Approval</p><p className="text-3xl font-bold">{stats.pendingUsers}</p></div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs text-slate-500">Announcements</p><p className="text-3xl font-bold">{stats.announcements}</p></div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs text-slate-500">Subscribers</p><p className="text-3xl font-bold">{stats.subscribers}</p></div>
              </div>
              <div className="grid gap-4 xl:grid-cols-3">
                <section className={card}><h3 className="font-semibold">Service Categories</h3>{chartServices.length === 0 ? <p className="text-xs text-slate-500">No data</p> : chartServices.map((x) => <MiniBar key={x.label} label={x.label} value={x.value} max={Math.max(...chartServices.map((a) => a.value))} />)}</section>
                <section className={card}><h3 className="font-semibold">Report Categories</h3>{chartReports.length === 0 ? <p className="text-xs text-slate-500">No data</p> : chartReports.map((x) => <MiniBar key={x.label} label={x.label} value={x.value} max={Math.max(...chartReports.map((a) => a.value))} />)}</section>
                <section className={card}><h3 className="font-semibold">Announcement Modules</h3>{chartAnnouncements.length === 0 ? <p className="text-xs text-slate-500">No data</p> : chartAnnouncements.map((x) => <MiniBar key={x.label} label={x.label} value={x.value} max={Math.max(...chartAnnouncements.map((a) => a.value))} />)}</section>
              </div>
            </section>
          )}

          {activePanel === "users" && (
            <section className={card}>
              <h2 className="mb-4 text-lg font-semibold">Users</h2>
              {users.map((user) => (
                <div key={user._id} className="mb-2 rounded border p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img src={user.avatarImage || "https://placehold.co/60x60/e2e8f0/475569?text=U"} alt={user.username} className="h-10 w-10 rounded-full border object-cover" />
                      <div><p className="font-semibold">{user.username}</p><p className="text-slate-500">{user.email}</p></div>
                    </div>
                    <div className="flex items-center gap-2"><Badge value={user.role} /><Badge value={user.status} /><Badge value={user.validIdStatus || "pending"} /></div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600"><span>ID Type: {user.validIdType || "N/A"}</span><button className="text-blue-700 underline" onClick={() => setSelectedUser(user)} type="button">View Details</button></div>
                  {canManage && <div className="mt-3 flex flex-wrap gap-2"><button className="rounded border px-2 py-1 text-xs" onClick={() => setPendingAction({ title: "Approve User", message: `Approve ${user.username}?`, confirmLabel: "Approve", run: () => runActionWithFeedback("User approved", () => api.patch(`/api/admin/users/${user._id}/status`, { status: "active", validIdStatus: "approved" }, { headers: authHeaders() })) })} type="button">Approve</button><button className="rounded border border-amber-300 px-2 py-1 text-xs text-amber-700" onClick={() => setPendingAction({ title: "Archive User", message: `Archive ${user.username}?`, confirmLabel: "Archive", run: () => runActionWithFeedback("User archived", () => api.patch(`/api/admin/users/${user._id}/status`, { status: "suspended", validIdStatus: "rejected" }, { headers: authHeaders() })) })} type="button">Archive</button>{!(user.role === "superadmin" && user.username === "superAdmin123") && <button className="rounded border border-red-300 px-2 py-1 text-xs text-red-700" onClick={() => setPendingAction({ title: "Delete Permanently", message: `Delete ${user.username} and linked records?`, confirmLabel: "Delete", run: () => runActionWithFeedback("User deleted", () => api.delete(`/api/admin/users/${user._id}`, { headers: authHeaders() })) })} type="button">Delete Permanently</button>}</div>}
                </div>
              ))}
            </section>
          )}

          {activePanel === "officials" && (
            <section className={card}>
              <h2 className="mb-4 text-lg font-semibold">Officials</h2>
              {canManage && (
                <div className="mb-4 grid gap-2 md:grid-cols-2">
                  <input className="rounded border px-3 py-2 text-sm" placeholder="Official Name" value={newOfficial.name} onChange={(e) => setNewOfficial((p) => ({ ...p, name: e.target.value }))} />
                  <input className="rounded border px-3 py-2 text-sm" placeholder="Role" value={newOfficial.role} onChange={(e) => setNewOfficial((p) => ({ ...p, role: e.target.value }))} />
                  <select className="rounded border px-3 py-2 text-sm" value={newOfficial.level} onChange={(e) => setNewOfficial((p) => ({ ...p, level: e.target.value as "city" | "barangay" }))}><option value="barangay">Barangay</option><option value="city">City</option></select>
                  <input className="rounded border px-3 py-2 text-sm" type="number" value={newOfficial.rankOrder} onChange={(e) => setNewOfficial((p) => ({ ...p, rankOrder: Number(e.target.value) || 10 }))} />
                  <input className="rounded border px-3 py-2 text-sm md:col-span-2" placeholder="Committee" value={newOfficial.committee} onChange={(e) => setNewOfficial((p) => ({ ...p, committee: e.target.value }))} />
                  <input className="rounded border px-3 py-2 text-sm md:col-span-2" placeholder="Description" value={newOfficial.description} onChange={(e) => setNewOfficial((p) => ({ ...p, description: e.target.value }))} />
                  <input className="rounded border px-3 py-2 text-sm md:col-span-2" placeholder="Image URL or base64" value={newOfficial.image} onChange={(e) => setNewOfficial((p) => ({ ...p, image: e.target.value }))} />
                  <input className="rounded border px-3 py-2 text-sm md:col-span-2" type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) fileToBase64(file, (value) => setNewOfficial((p) => ({ ...p, image: value }))); }} />
                  {newOfficial.image && <img src={newOfficial.image} alt="Official preview" className="h-20 w-20 rounded border object-cover md:col-span-2" />}
                  <button className="rounded bg-slate-900 px-3 py-2 text-sm font-semibold text-white md:col-span-2" onClick={() => setPendingAction({ title: "Add Official", message: "Create this official record?", confirmLabel: "Add", run: () => runActionWithFeedback("Official added", () => api.post("/api/officials", newOfficial, { headers: authHeaders() }).then(() => setNewOfficial({ name: "", role: "", level: "barangay", rankOrder: 10, committee: "", description: "", image: "" }))) })} type="button">Add Official</button>
                </div>
              )}
              {officials.map((o) => (
                <div key={o._id} className="mb-2 flex items-center justify-between rounded border p-3 text-sm">
                  <div className="flex items-center gap-3">
                    <img src={o.image || "https://placehold.co/80x80/e2e8f0/475569?text=Official"} alt={o.name} className="h-10 w-10 rounded-full border object-cover" />
                    <div><p className="font-semibold">{o.name}</p><p className="text-slate-500">{o.role} | {o.level}</p></div>
                  </div>
                  {canManage && <div className="flex gap-2"><button className="rounded border px-2 py-1 text-xs" onClick={() => setOfficialEditModal(o)} type="button">Edit</button><button className="rounded border border-red-300 px-2 py-1 text-xs text-red-700" onClick={() => setPendingAction({ title: "Delete Official", message: `Delete ${o.name}?`, confirmLabel: "Delete", run: () => runActionWithFeedback("Official removed", () => api.delete(`/api/officials/${o._id}`, { headers: authHeaders() })) })} type="button">Delete</button></div>}
                </div>
              ))}
            </section>
          )}

          {activePanel === "announcements" && (
            <section className={card}>
              <h2 className="mb-4 text-lg font-semibold">Announcements</h2>
              {canManage && (
                <div className="mb-4 grid gap-2 md:grid-cols-2">
                  <input className="rounded border px-3 py-2 text-sm" placeholder="Title" value={newAnnouncement.title} onChange={(e) => setNewAnnouncement((p) => ({ ...p, title: e.target.value }))} />
                  <select className="rounded border px-3 py-2 text-sm" value={newAnnouncement.module} onChange={(e) => setNewAnnouncement((p) => ({ ...p, module: e.target.value }))}><option value="barangay-updates">Barangay Updates</option><option value="emergency-hotlines">Emergency Hotlines</option><option value="phivolcs-alerts">PHIVOLCS Alerts</option><option value="fact-check">Fact Check</option><option value="all-news-updates">All News & Updates</option></select>
                  <input className="rounded border px-3 py-2 text-sm" placeholder="Category" value={newAnnouncement.category} onChange={(e) => setNewAnnouncement((p) => ({ ...p, category: e.target.value }))} />
                  <input className="rounded border px-3 py-2 text-sm" placeholder="Source" value={newAnnouncement.source} onChange={(e) => setNewAnnouncement((p) => ({ ...p, source: e.target.value }))} />
                  <textarea className="rounded border px-3 py-2 text-sm md:col-span-2" placeholder="Content" value={newAnnouncement.content} onChange={(e) => setNewAnnouncement((p) => ({ ...p, content: e.target.value }))} rows={3} />
                  <input className="rounded border px-3 py-2 text-sm md:col-span-2" placeholder="Image URL or base64" value={newAnnouncement.image} onChange={(e) => setNewAnnouncement((p) => ({ ...p, image: e.target.value }))} />
                  <input className="rounded border px-3 py-2 text-sm md:col-span-2" type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) fileToBase64(file, (value) => setNewAnnouncement((p) => ({ ...p, image: value }))); }} />
                  {newAnnouncement.image && <img src={newAnnouncement.image} alt="Announcement preview" className="h-20 w-28 rounded border object-cover md:col-span-2" />}
                  <button className="rounded bg-slate-900 px-3 py-2 text-sm font-semibold text-white md:col-span-2" onClick={() => setPendingAction({ title: "Publish Announcement", message: "Publish this announcement?", confirmLabel: "Publish", run: () => runActionWithFeedback("Announcement published", () => api.post("/api/announcements", newAnnouncement, { headers: authHeaders() }).then(() => setNewAnnouncement({ title: "", content: "", module: "barangay-updates", category: "Advisory", source: "Barangay Office", image: "" }))) })} type="button">Publish</button>
                </div>
              )}
              {announcements.map((a) => (
                <div key={a._id} className="mb-2 flex items-center justify-between rounded border p-3 text-sm">
                  <div className="flex items-center gap-3">
                    <img src={a.image || "https://placehold.co/80x80/e2e8f0/475569?text=News"} alt={a.title} className="h-10 w-10 rounded-md border object-cover" />
                    <div><p className="font-semibold">{a.title}</p><p className="text-slate-500">{a.module} | {a.category}</p></div>
                  </div>
                  {canManage && <div className="flex gap-2"><button className="rounded border px-2 py-1 text-xs" onClick={() => setAnnouncementEditModal(a)} type="button">Edit</button><button className="rounded border border-red-300 px-2 py-1 text-xs text-red-700" onClick={() => setPendingAction({ title: "Delete Announcement", message: `Delete ${a.title}?`, confirmLabel: "Delete", run: () => runActionWithFeedback("Announcement deleted", () => api.delete(`/api/announcements/${a._id}`, { headers: authHeaders() })) })} type="button">Delete</button></div>}
                </div>
              ))}
            </section>
          )}
          {activePanel === "reports" && <section className={card}><h2 className="mb-4 text-lg font-semibold">Issue Reports</h2>{reports.map((r) => <div key={r._id} className="mb-2 rounded border p-3 text-sm"><div className="mb-1 flex items-center justify-between"><p className="font-semibold">{r.referenceNo}</p><Badge value={r.status} /></div><p className="text-slate-600">{r.category}: {r.description}</p></div>)}</section>}
          {activePanel === "services" && <section className={card}><h2 className="mb-4 text-lg font-semibold">Service Requests</h2>{services.map((s) => <div key={s._id} className="mb-2 rounded border p-3 text-sm"><div className="mb-1 flex items-center justify-between"><p className="font-semibold">{s.referenceNo}</p><Badge value={s.status} /></div><p className="text-slate-600">{s.fullName} | {s.serviceType}</p></div>)}</section>}
          {activePanel === "messages" && <section className={card}><h2 className="mb-4 text-lg font-semibold">Messages</h2>{messages.map((m) => <div key={m._id} className="mb-2 rounded border p-3 text-sm"><div className="mb-1 flex items-center justify-between"><p className="font-semibold">{m.referenceNo}</p><Badge value={m.status} /></div><p className="text-slate-600">{m.name} | {m.department}</p></div>)}</section>}
          {activePanel === "subscriptions" && <section className={card}><h2 className="mb-4 text-lg font-semibold">Stay Updated Subscribers</h2>{subscriptions.map((sub) => <div key={sub._id} className="mb-2 rounded border p-3 text-sm"><div className="flex items-center justify-between"><div><p className="font-semibold">{sub.email}</p><p className="text-xs text-slate-500">{sub.source || "homepage"}</p></div><Badge value={sub.status} /></div></div>)}</section>}

          {activePanel === "settings" && (
            <section className={card}>
              <h2 className="mb-4 text-lg font-semibold">System Settings</h2>
              {!canManage && <p className="mb-3 text-sm text-slate-600">Admin access is read-only.</p>}
              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex items-center justify-between rounded border p-3 text-sm"><span>Allow Resident Registration</span><input type="checkbox" checked={systemSettings.allowResidentRegistration} disabled={!canManage} onChange={(e) => setSystemSettings((p) => ({ ...p, allowResidentRegistration: e.target.checked }))} /></label>
                <label className="flex items-center justify-between rounded border p-3 text-sm"><span>Maintenance Mode</span><input type="checkbox" checked={systemSettings.maintenanceMode} disabled={!canManage} onChange={(e) => setSystemSettings((p) => ({ ...p, maintenanceMode: e.target.checked }))} /></label>
                <label className="flex items-center justify-between rounded border p-3 text-sm"><span>Auto-archive Reports</span><input type="checkbox" checked={systemSettings.autoArchiveReports} disabled={!canManage} onChange={(e) => setSystemSettings((p) => ({ ...p, autoArchiveReports: e.target.checked }))} /></label>
                <label className="flex items-center justify-between rounded border p-3 text-sm"><span>Require Announcement Review</span><input type="checkbox" checked={systemSettings.requireAnnouncementReview} disabled={!canManage} onChange={(e) => setSystemSettings((p) => ({ ...p, requireAnnouncementReview: e.target.checked }))} /></label>
                <label className="flex items-center justify-between rounded border p-3 text-sm"><span>Email Digest</span><input type="checkbox" checked={systemSettings.emailDigest} disabled={!canManage} onChange={(e) => setSystemSettings((p) => ({ ...p, emailDigest: e.target.checked }))} /></label>
                <label className="flex items-center justify-between rounded border p-3 text-sm"><span>Login Lockout Window (minutes)</span><input className="w-20 rounded border px-2 py-1 text-xs" type="number" min={5} value={systemSettings.lockoutWindowMinutes} disabled={!canManage} onChange={(e) => setSystemSettings((p) => ({ ...p, lockoutWindowMinutes: Number(e.target.value) || 15 }))} /></label>
                <label className="md:col-span-2 text-sm"><span className="mb-1 block font-medium">Maintenance Message</span><textarea className="w-full rounded border p-2 text-sm" rows={2} value={systemSettings.maintenanceMessage} disabled={!canManage} onChange={(e) => setSystemSettings((p) => ({ ...p, maintenanceMessage: e.target.value }))} /></label>
              </div>
              <div className="mt-6 border-t pt-4">
                <h3 className="mb-3 font-semibold">Resident Content Editors</h3>
                {canManage ? (
                  <div className="grid gap-2 md:grid-cols-2">
                    <button className="rounded border px-3 py-2 text-left text-sm" onClick={() => setHomeEditOpen(true)} type="button">Edit Home Content</button>
                    <button className="rounded border px-3 py-2 text-left text-sm" onClick={() => { setAboutSnapshotDraft(pairsToLines((siteContent as any).aboutSnapshotItems || [])); setAboutTrendDraft(pairsToLines((siteContent as any).aboutPopulationTrend || [])); setAboutGovDraft(((siteContent as any).aboutCoreGovernance || []).join("\n")); setAboutEditOpen(true); }} type="button">Edit About Content</button>
                    <button className="rounded border px-3 py-2 text-left text-sm" onClick={() => setContactEditOpen(true)} type="button">Edit Contact Content</button>
                    <button className="rounded border px-3 py-2 text-left text-sm" onClick={() => setServicesEditOpen(true)} type="button">Manage Services Catalog</button>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Only superadmin can edit resident-facing content.</p>
                )}
              </div>
              {canManage && <button className="mt-4 rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => setPendingAction({ title: "Save System Settings", message: "Apply updated system settings?", confirmLabel: "Save", run: () => runActionWithFeedback("System settings updated", () => api.patch("/api/admin/system-settings", systemSettings, { headers: authHeaders() })) })} type="button">Save Settings</button>}
            </section>
          )}

          {activePanel === "audit" && <section className={card}><h2 className="mb-4 text-lg font-semibold">My Activity</h2>{activities.map((a) => <div key={a._id} className="mb-2 rounded border p-3 text-sm"><p className="font-semibold">{a.title}</p><p className="text-xs text-slate-500">{a.type} | {new Date(a.createdAt).toLocaleString()}</p></div>)}{activities.length === 0 && <p className="text-sm text-slate-500">No activity found.</p>}</section>}
        </main>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Resident Details</h3>
              <button onClick={() => setSelectedUser(null)} type="button"><X size={18} /></button>
            </div>
            <div className="grid gap-4 md:grid-cols-[220px,1fr]">
              <div>
                <img src={selectedUser.validIdImage || selectedUser.avatarImage || "https://placehold.co/300x200/e2e8f0/475569?text=No+Image"} alt="Resident ID" className="w-full rounded-lg border object-cover" />
                <a href={selectedUser.validIdImage || "#"} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-blue-700 underline">Open full image</a>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Username:</strong> {selectedUser.username}</p>
                <p><strong>Name:</strong> {[selectedUser.firstName, selectedUser.middleName, selectedUser.lastName].filter(Boolean).join(" ") || "N/A"}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Phone:</strong> {selectedUser.contactNumber || "N/A"}</p>
                <p><strong>Address:</strong> {selectedUser.address || "N/A"}</p>
                <div className="flex gap-2"><Badge value={selectedUser.role} /><Badge value={selectedUser.status} /><Badge value={selectedUser.validIdStatus || "pending"} /></div>
                {canManage && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    <select className="rounded border px-2 py-1 text-xs" value={selectedUser.role} onChange={(e) => setSelectedUser((p) => p ? { ...p, role: e.target.value } : p)}>
                      <option value="resident">resident</option>
                      <option value="admin">admin</option>
                      <option value="superadmin">superadmin</option>
                    </select>
                    <select className="rounded border px-2 py-1 text-xs" value={selectedUser.status} onChange={(e) => setSelectedUser((p) => p ? { ...p, status: e.target.value as UserItem["status"] } : p)}>
                      <option value="pending">pending</option>
                      <option value="active">active</option>
                      <option value="suspended">suspended</option>
                    </select>
                    <button
                      className="rounded bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
                      onClick={() => setPendingAction({
                        title: "Update Resident",
                        message: `Save role/status changes for ${selectedUser.username}?`,
                        confirmLabel: "Save",
                        run: () => runActionWithFeedback("Resident updated", () => api.patch(`/api/admin/users/${selectedUser._id}/status`, { role: selectedUser.role, status: selectedUser.status }, { headers: authHeaders() })),
                      })}
                      type="button"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {officialEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6">
            <div className="mb-3 flex items-center justify-between"><h3 className="text-lg font-bold">Edit Official</h3><button onClick={() => setOfficialEditModal(null)} type="button"><X size={18} /></button></div>
            <div className="grid gap-2 md:grid-cols-2">
              <input className="rounded border px-3 py-2 text-sm" value={officialEditModal.name} onChange={(e) => setOfficialEditModal((p) => p ? { ...p, name: e.target.value } : p)} />
              <input className="rounded border px-3 py-2 text-sm" value={officialEditModal.role} onChange={(e) => setOfficialEditModal((p) => p ? { ...p, role: e.target.value } : p)} />
              <select className="rounded border px-3 py-2 text-sm" value={officialEditModal.level} onChange={(e) => setOfficialEditModal((p) => p ? { ...p, level: e.target.value as "city" | "barangay" } : p)}><option value="barangay">Barangay</option><option value="city">City</option></select>
              <input className="rounded border px-3 py-2 text-sm" type="number" value={officialEditModal.rankOrder} onChange={(e) => setOfficialEditModal((p) => p ? { ...p, rankOrder: Number(e.target.value) || 100 } : p)} />
              <input className="rounded border px-3 py-2 text-sm md:col-span-2" value={officialEditModal.committee || ""} onChange={(e) => setOfficialEditModal((p) => p ? { ...p, committee: e.target.value } : p)} />
              <input className="rounded border px-3 py-2 text-sm md:col-span-2" value={officialEditModal.description || ""} onChange={(e) => setOfficialEditModal((p) => p ? { ...p, description: e.target.value } : p)} />
              <input className="rounded border px-3 py-2 text-sm md:col-span-2" value={officialEditModal.image || ""} onChange={(e) => setOfficialEditModal((p) => p ? { ...p, image: e.target.value } : p)} />
              <input className="rounded border px-3 py-2 text-sm md:col-span-2" type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) fileToBase64(file, (value) => setOfficialEditModal((p) => p ? { ...p, image: value } : p)); }} />
              {officialEditModal.image && <img src={officialEditModal.image} alt="Official preview" className="h-20 w-20 rounded border object-cover md:col-span-2" />}
            </div>
            <button className="mt-4 w-full rounded bg-slate-900 py-2 text-sm font-semibold text-white" onClick={() => setPendingAction({ title: "Update Official", message: "Save official changes?", confirmLabel: "Save", run: () => runActionWithFeedback("Official updated", () => api.put(`/api/officials/${officialEditModal._id}`, officialEditModal, { headers: authHeaders() }).then(() => setOfficialEditModal(null))) })} type="button">Save Official</button>
          </div>
        </div>
      )}

      {announcementEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-6">
            <div className="mb-3 flex items-center justify-between"><h3 className="text-lg font-bold">Edit Announcement</h3><button onClick={() => setAnnouncementEditModal(null)} type="button"><X size={18} /></button></div>
            <div className="grid gap-2 md:grid-cols-2">
              <input className="rounded border px-3 py-2 text-sm" value={announcementEditModal.title} onChange={(e) => setAnnouncementEditModal((p) => p ? { ...p, title: e.target.value } : p)} />
              <input className="rounded border px-3 py-2 text-sm" value={announcementEditModal.category} onChange={(e) => setAnnouncementEditModal((p) => p ? { ...p, category: e.target.value } : p)} />
              <select className="rounded border px-3 py-2 text-sm md:col-span-2" value={announcementEditModal.module} onChange={(e) => setAnnouncementEditModal((p) => p ? { ...p, module: e.target.value } : p)}><option value="barangay-updates">Barangay Updates</option><option value="emergency-hotlines">Emergency Hotlines</option><option value="phivolcs-alerts">PHIVOLCS Alerts</option><option value="fact-check">Fact Check</option><option value="all-news-updates">All News & Updates</option></select>
              <textarea className="rounded border px-3 py-2 text-sm md:col-span-2" rows={3} value={announcementEditModal.content || ""} onChange={(e) => setAnnouncementEditModal((p) => p ? { ...p, content: e.target.value } : p)} />
              <input className="rounded border px-3 py-2 text-sm md:col-span-2" value={announcementEditModal.image || ""} onChange={(e) => setAnnouncementEditModal((p) => p ? { ...p, image: e.target.value } : p)} />
              <input className="rounded border px-3 py-2 text-sm md:col-span-2" type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) fileToBase64(file, (value) => setAnnouncementEditModal((p) => p ? { ...p, image: value } : p)); }} />
              {announcementEditModal.image && <img src={announcementEditModal.image} alt="Announcement preview" className="h-20 w-28 rounded border object-cover md:col-span-2" />}
            </div>
            <button className="mt-4 w-full rounded bg-slate-900 py-2 text-sm font-semibold text-white" onClick={() => setPendingAction({ title: "Update Announcement", message: "Save announcement changes?", confirmLabel: "Save", run: () => runActionWithFeedback("Announcement updated", () => api.put(`/api/announcements/${announcementEditModal._id}`, announcementEditModal, { headers: authHeaders() }).then(() => setAnnouncementEditModal(null))) })} type="button">Save Announcement</button>
          </div>
        </div>
      )}

      {homeEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6">
            <div className="mb-3 flex items-center justify-between"><h3 className="text-lg font-bold">Edit Home Content</h3><button onClick={() => setHomeEditOpen(false)} type="button"><X size={18} /></button></div>
            <div className="grid gap-2 md:grid-cols-2">
              {siteContent.communityCards.map((c, idx) => (
                <div key={idx} className="rounded border p-3 text-xs">
                  <input className="mb-2 w-full rounded border px-2 py-1" placeholder="Value" value={c.value} onChange={(e) => setSiteContent((p) => ({ ...p, communityCards: p.communityCards.map((x, i) => i === idx ? { ...x, value: e.target.value } : x) }))} />
                  <input className="mb-2 w-full rounded border px-2 py-1" placeholder="Label" value={c.label} onChange={(e) => setSiteContent((p) => ({ ...p, communityCards: p.communityCards.map((x, i) => i === idx ? { ...x, label: e.target.value } : x) }))} />
                  <input className="w-full rounded border px-2 py-1" placeholder="Sublabel" value={c.sublabel} onChange={(e) => setSiteContent((p) => ({ ...p, communityCards: p.communityCards.map((x, i) => i === idx ? { ...x, sublabel: e.target.value } : x) }))} />
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded bg-slate-900 py-2 text-sm font-semibold text-white" onClick={() => setPendingAction({ title: "Save Home Content", message: "Apply homepage card updates?", confirmLabel: "Save", run: () => runActionWithFeedback("Home content updated", () => api.patch("/api/content/site", { communityCards: siteContent.communityCards }, { headers: authHeaders() }).then(() => setHomeEditOpen(false))) })} type="button">Save Home Content</button>
          </div>
        </div>
      )}

      {aboutEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6">
            <div className="mb-3 flex items-center justify-between"><h3 className="text-lg font-bold">Edit About Content</h3><button onClick={() => setAboutEditOpen(false)} type="button"><X size={18} /></button></div>
            <div className="space-y-2">
              <input className="w-full rounded border px-3 py-2 text-sm" placeholder="About hero title" value={siteContent.aboutHeroTitle} onChange={(e) => setSiteContent((p) => ({ ...p, aboutHeroTitle: e.target.value }))} />
              <input className="w-full rounded border px-3 py-2 text-sm" placeholder="About hero subtitle" value={siteContent.aboutHeroSubtitle} onChange={(e) => setSiteContent((p) => ({ ...p, aboutHeroSubtitle: e.target.value }))} />
              <label className="text-xs font-semibold text-slate-600">Snapshot lines (format: Label|Value)</label>
              <textarea className="w-full rounded border px-3 py-2 text-sm" rows={5} value={aboutSnapshotDraft} onChange={(e) => setAboutSnapshotDraft(e.target.value)} />
              <label className="text-xs font-semibold text-slate-600">Population trend lines (format: Year|Count)</label>
              <textarea className="w-full rounded border px-3 py-2 text-sm" rows={4} value={aboutTrendDraft} onChange={(e) => setAboutTrendDraft(e.target.value)} />
              <label className="text-xs font-semibold text-slate-600">Core governance lines (one line per bullet)</label>
              <textarea className="w-full rounded border px-3 py-2 text-sm" rows={4} value={aboutGovDraft} onChange={(e) => setAboutGovDraft(e.target.value)} />
              <textarea className="w-full rounded border px-3 py-2 text-sm" rows={3} placeholder="History text" value={siteContent.aboutHistoryText} onChange={(e) => setSiteContent((p) => ({ ...p, aboutHistoryText: e.target.value }))} />
              <textarea className="w-full rounded border px-3 py-2 text-sm" rows={3} placeholder="Governance text" value={siteContent.aboutGovernanceText} onChange={(e) => setSiteContent((p) => ({ ...p, aboutGovernanceText: e.target.value }))} />
            </div>
            <button className="mt-4 w-full rounded bg-slate-900 py-2 text-sm font-semibold text-white" onClick={() => setPendingAction({ title: "Save About Content", message: "Apply about page updates?", confirmLabel: "Save", run: () => runActionWithFeedback("About content updated", () => api.patch("/api/content/site", { aboutHeroTitle: siteContent.aboutHeroTitle, aboutHeroSubtitle: siteContent.aboutHeroSubtitle, aboutSnapshotItems: linesToPairs(aboutSnapshotDraft), aboutPopulationTrend: linesToPairs(aboutTrendDraft), aboutCoreGovernance: aboutGovDraft.split('\n').map((x) => x.trim()).filter(Boolean), aboutHistoryText: siteContent.aboutHistoryText, aboutGovernanceText: siteContent.aboutGovernanceText }, { headers: authHeaders() }).then(() => setAboutEditOpen(false))) })} type="button">Save About Content</button>
          </div>
        </div>
      )}

      {contactEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl rounded-xl bg-white p-6">
            <div className="mb-3 flex items-center justify-between"><h3 className="text-lg font-bold">Edit Contact Content</h3><button onClick={() => setContactEditOpen(false)} type="button"><X size={18} /></button></div>
            <div className="space-y-2">
              <input className="w-full rounded border px-3 py-2 text-sm" placeholder="Office hours" value={siteContent.contactOfficeHours || ""} onChange={(e) => setSiteContent((p: any) => ({ ...p, contactOfficeHours: e.target.value }))} />
              <input className="w-full rounded border px-3 py-2 text-sm" placeholder="Location text" value={siteContent.contactLocationText || ""} onChange={(e) => setSiteContent((p: any) => ({ ...p, contactLocationText: e.target.value }))} />
            </div>
            <div className="mt-4 rounded border p-3">
              <p className="mb-2 text-sm font-semibold">Department Directory</p>
              <div className="mb-2 hidden grid-cols-12 gap-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 md:grid">
                <span className="col-span-4">Department</span>
                <span className="col-span-4">Contact Person</span>
                <span className="col-span-2">Local No.</span>
                <span className="col-span-1 text-center">Save</span>
                <span className="col-span-1 text-center">Delete</span>
              </div>
              <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                {departments.map((d) => (
                  <div key={d._id} className="grid grid-cols-1 gap-2 md:grid-cols-12">
                    <input className="rounded border px-2 py-1.5 text-xs md:col-span-4" value={d.name} onChange={(e) => setDepartments((prev) => prev.map((x) => x._id === d._id ? { ...x, name: e.target.value } : x))} />
                    <input className="rounded border px-2 py-1.5 text-xs md:col-span-4" value={d.contactPerson} onChange={(e) => setDepartments((prev) => prev.map((x) => x._id === d._id ? { ...x, contactPerson: e.target.value } : x))} />
                    <input className="rounded border px-2 py-1.5 text-xs md:col-span-2" value={d.localNumber} onChange={(e) => setDepartments((prev) => prev.map((x) => x._id === d._id ? { ...x, localNumber: e.target.value } : x))} />
                    <button className="rounded border px-2 py-1.5 text-xs md:col-span-1" onClick={() => setPendingAction({ title: "Save Department", message: `Save changes for ${d.name}?`, confirmLabel: "Save", run: () => runActionWithFeedback("Department updated", () => api.put(`/api/contact/departments/${d._id}`, { name: d.name, contactPerson: d.contactPerson, localNumber: d.localNumber, active: true }, { headers: authHeaders() })) })} type="button">Save</button>
                    <button className="rounded border border-red-300 px-2 py-1.5 text-xs text-red-700 md:col-span-1" onClick={() => setPendingAction({ title: "Delete Department", message: `Delete ${d.name}?`, confirmLabel: "Delete", run: () => runActionWithFeedback("Department deleted", () => api.delete(`/api/contact/departments/${d._id}`, { headers: authHeaders() })) })} type="button">Delete</button>
                  </div>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2 border-t pt-3 md:grid-cols-12">
                <input className="rounded border px-2 py-1.5 text-xs md:col-span-4" placeholder="Department" value={newDepartment.name} onChange={(e) => setNewDepartment((p) => ({ ...p, name: e.target.value }))} />
                <input className="rounded border px-2 py-1.5 text-xs md:col-span-4" placeholder="Contact Person" value={newDepartment.contactPerson} onChange={(e) => setNewDepartment((p) => ({ ...p, contactPerson: e.target.value }))} />
                <input className="rounded border px-2 py-1.5 text-xs md:col-span-2" placeholder="Local No." value={newDepartment.localNumber} onChange={(e) => setNewDepartment((p) => ({ ...p, localNumber: e.target.value }))} />
                <button className="rounded bg-slate-900 px-2 py-1.5 text-xs font-semibold text-white md:col-span-2" onClick={() => setPendingAction({ title: "Add Department", message: "Create this department row?", confirmLabel: "Add", run: () => runActionWithFeedback("Department added", () => api.post("/api/contact/departments", { ...newDepartment, active: true }, { headers: authHeaders() }).then(() => setNewDepartment({ name: "", contactPerson: "", localNumber: "" }))) })} type="button">Add Department</button>
              </div>
            </div>
            <button className="mt-4 w-full rounded bg-slate-900 py-2 text-sm font-semibold text-white" onClick={() => setPendingAction({ title: "Save Contact Content", message: "Apply contact content updates?", confirmLabel: "Save", run: () => runActionWithFeedback("Contact content updated", () => api.patch("/api/content/site", { contactOfficeHours: (siteContent as any).contactOfficeHours, contactLocationText: (siteContent as any).contactLocationText }, { headers: authHeaders() }).then(() => setContactEditOpen(false))) })} type="button">Save Contact Content</button>
          </div>
        </div>
      )}

      {servicesEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl rounded-xl bg-white p-6">
            <div className="mb-3 flex items-center justify-between"><h3 className="text-lg font-bold">Manage Services Catalog</h3><button onClick={() => setServicesEditOpen(false)} type="button"><X size={18} /></button></div>
            <div className="mb-3 grid gap-2 md:grid-cols-2">
              <input className="rounded border px-3 py-2 text-sm" placeholder="Code (e.g. barangay-clearance)" value={newCatalogItem.code} onChange={(e) => setNewCatalogItem((p) => ({ ...p, code: e.target.value }))} />
              <input className="rounded border px-3 py-2 text-sm" placeholder="Title" value={newCatalogItem.title} onChange={(e) => setNewCatalogItem((p) => ({ ...p, title: e.target.value }))} />
              <input className="rounded border px-3 py-2 text-sm md:col-span-2" placeholder="Description" value={newCatalogItem.desc} onChange={(e) => setNewCatalogItem((p) => ({ ...p, desc: e.target.value }))} />
              <input className="rounded border px-3 py-2 text-sm" placeholder="Usage" value={newCatalogItem.usage} onChange={(e) => setNewCatalogItem((p) => ({ ...p, usage: e.target.value }))} />
              <input className="rounded border px-3 py-2 text-sm" placeholder="Time" value={newCatalogItem.time} onChange={(e) => setNewCatalogItem((p) => ({ ...p, time: e.target.value }))} />
              <input className="rounded border px-3 py-2 text-sm md:col-span-2" placeholder="Requirements (comma separated)" value={newCatalogItem.requirements} onChange={(e) => setNewCatalogItem((p) => ({ ...p, requirements: e.target.value }))} />
            </div>
            <button className="mb-4 w-full rounded bg-slate-900 py-2 text-sm font-semibold text-white" onClick={() => setPendingAction({ title: editingCatalogId ? "Update Service" : "Add Service", message: editingCatalogId ? "Save this service catalog item?" : "Create this service catalog item?", confirmLabel: editingCatalogId ? "Save" : "Add", run: () => runActionWithFeedback(editingCatalogId ? "Service updated" : "Service added", () => (editingCatalogId ? api.put(`/api/services/catalog/${editingCatalogId}`, { ...newCatalogItem, requirements: String(newCatalogItem.requirements).split(",").map((x) => x.trim()).filter(Boolean) }, { headers: authHeaders() }) : api.post("/api/services/catalog", { ...newCatalogItem, requirements: String(newCatalogItem.requirements).split(",").map((x) => x.trim()).filter(Boolean) }, { headers: authHeaders() })).then(() => { setEditingCatalogId(null); setNewCatalogItem({ code: "", title: "", desc: "", usage: "", requirements: "", time: "", active: true, sortOrder: 100 }); })) })} type="button">{editingCatalogId ? "Save Service" : "Add Service"}</button>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {serviceCatalog.map((item) => (
                <div key={item._id} className="flex items-center justify-between rounded border p-2 text-sm">
                  <div><p className="font-semibold">{item.title}</p><p className="text-xs text-slate-500">{item.code} | {item.active ? "active" : "archived"}</p></div>
                  <div className="flex gap-2">
                    <button className="rounded border px-2 py-1 text-xs" onClick={() => { setEditingCatalogId(item._id); setNewCatalogItem({ code: item.code || "", title: item.title || "", desc: item.desc || "", usage: item.usage || "", requirements: (item.requirements || []).join(", "), time: item.time || "", active: item.active !== false, sortOrder: item.sortOrder || 100 }); }} type="button">Edit</button>
                    <button className="rounded border px-2 py-1 text-xs" onClick={() => setPendingAction({ title: item.active ? "Archive Service" : "Activate Service", message: `${item.active ? "Archive" : "Activate"} ${item.title}?`, confirmLabel: "Confirm", run: () => runActionWithFeedback("Service status updated", () => api.patch(`/api/services/catalog/${item._id}/archive`, { active: !item.active }, { headers: authHeaders() })) })} type="button">{item.active ? "Archive" : "Activate"}</button>
                    <button className="rounded border border-red-300 px-2 py-1 text-xs text-red-700" onClick={() => setPendingAction({ title: "Delete Service", message: `Delete ${item.title}?`, confirmLabel: "Delete", run: () => runActionWithFeedback("Service deleted", () => api.delete(`/api/services/catalog/${item._id}`, { headers: authHeaders() })) })} type="button">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {feedback && <div className="fixed right-4 top-24 z-50"><div className={`rounded-lg border px-4 py-3 text-sm shadow-lg ${feedback.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}><p className="font-semibold">{feedback.title}</p><p>{feedback.message}</p></div></div>}
      {pendingAction && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><h3 className="text-lg font-bold text-slate-900">{pendingAction.title}</h3><p className="mt-2 text-sm text-slate-600">{pendingAction.message}</p><div className="mt-6 flex gap-3"><button className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-700" onClick={() => setPendingAction(null)} disabled={actionLoading} type="button">Cancel</button><button className="flex-1 rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white" onClick={confirmPendingAction} disabled={actionLoading} type="button">{actionLoading ? "Processing..." : pendingAction.confirmLabel}</button></div></div></div>}
      <LogoutConfirmation isOpen={showLogoutDialog} isLoggingOut={isLoggingOut} onClose={() => setShowLogoutDialog(false)} onConfirm={confirmLogout} />
    </div>
  );
}
