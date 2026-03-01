import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, ChevronDown, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get("http://localhost:5000/api/auth/user", {
            headers: { "x-auth-token": token },
          });
          setUser(res.data);
        } catch (err) {
          console.error("Failed to fetch user", err);
        }
      }
    };
    fetchUser();
  }, []);

  const navLinks = [
    { label: "Home", href: "/home" }, // ✅ FIXED
    { label: "About", href: "/about" },
    { label: "Officials", href: "/officials" },
    { label: "Services", href: "/services" },
    { label: "Weather", href: "/weather" },
    { label: "Contact", href: "/contact" },
  ];

  const announcementsItems = [
    { label: "All News & Updates", path: "/announcements" },
    { label: "Barangay Updates", path: "/announcements/barangay-updates" },
    { label: "Emergency Hotlines", path: "/announcements/emergency-hotlines" },
    { label: "PHIVOLCS Alerts", path: "/announcements/phivolcs-alerts" },
    { label: "Fact Check", path: "/announcements/fact-check" },
  ];

  const isAnnouncementsActive =
    location.pathname.startsWith("/announcements");

  const isReportActive = location.pathname.startsWith("/ReportIssue");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/"); // ✅ FIXED
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link to="/home" className="flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl border-4 border-primary/20">
            BT
          </div>
          <div>
            <span className="font-extrabold text-primary text-lg">
              BAYANTRACK +
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.label}
                to={link.href}
                className={cn(
                  "text-sm font-semibold transition-colors hover:text-primary relative py-1",
                  isActive ? "text-primary" : "text-gray-500"
                )}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Announcements Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1 text-sm font-semibold",
                  isAnnouncementsActive
                    ? "text-primary"
                    : "text-gray-500 hover:text-primary"
                )}
              >
                Announcements <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-60 p-2">
              {announcementsItems.map((item) => (
                <DropdownMenuItem key={item.label} asChild>
                  <Link to={item.path}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">

          <Link to="/ReportIssue">
            <Button variant="destructive">Report Issue</Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <User className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 p-2">
              {user && (
                <>
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem asChild>
                <Link to="/ProfileSettings">Profile Settings</Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}