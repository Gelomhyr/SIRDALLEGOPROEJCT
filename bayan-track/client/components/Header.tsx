// Header.tsx (COMPLETE UPDATED CODE)
// ✅ Adds: Profile icon dropdown (Profile Settings + Logout)
// ✅ Keeps: Announcements dropdown routes
// ✅ Fixes: remove wrong import "Route"
// ✅ Adds: DropdownMenuSeparator + useNavigate for logout redirect

import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, ChevronDown, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
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

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Officials", href: "/officials" },
    { label: "Services", href: "/services" },
    { label: "Weather", href: "/weather" },
    { label: "Contact", href: "/contact" },
  ];

  /**
   * ✅ THIS IS WHERE YOU MODIFY / ADD YOUR ANNOUNCEMENTS TABS
   * - label = text displayed in dropdown
   * - path  = route to open when clicked
   * ⚠️ IMPORTANT: The same paths must exist in App.tsx Routes
   */
  const announcementsItems = [
    { label: "All News & Updates", path: "/announcements" },
    { label: "Barangay Updates", path: "/announcements/barangay-updates" },
    { label: "Emergency Hotlines", path: "/announcements/emergency-hotlines" },
    { label: "PHIVOLCS Alerts", path: "/announcements/phivolcs-alerts" },
    { label: "Fact Check", path: "/announcements/fact-check" },
  ];

  // ✅ highlight Announcements button if user is inside /announcements pages
  const isAnnouncementsActive = location.pathname.startsWith("/announcements");

  // ✅ highlight Report Issue if you want (optional)
  const isReportActive = location.pathname.startsWith("/ReportIssue");

  // ✅ LOGOUT ACTION (edit this depending on your auth)
  const handleLogout = () => {
    // Example: remove stored login/session
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");

    // redirect to login (or home)
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl border-4 border-primary/20">
            BT
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-primary text-lg leading-tight tracking-tight">
              BAYANTRACK +
            </span>
            <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest leading-none">
              MAMBOG II, BACOOR
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
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}

          {/* ===================== ANNOUNCEMENTS DROPDOWN ===================== */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1 text-sm font-semibold transition-colors py-1 focus:outline-none relative",
                  isAnnouncementsActive
                    ? "text-primary"
                    : "text-gray-500 hover:text-primary"
                )}
              >
                Announcements
                <ChevronDown className="w-4 h-4" />
                {isAnnouncementsActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-60 p-2">
              {announcementsItems.map((item) => (
                <DropdownMenuItem
                  key={item.label}
                  className="cursor-pointer font-medium py-2 rounded-md focus:bg-slate-50 focus:text-primary"
                  asChild
                >
                  <Link to={item.path} className="w-full">
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* ================================================================ */}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* ✅ Report Issue button with route */}
          <Link to="/ReportIssue">
            <Button
              variant="destructive"
              className={cn(
                "hidden sm:flex rounded-md font-bold px-6 h-10 bg-destructive hover:bg-destructive/90 transition-all shadow-sm",
                isReportActive && "ring-2 ring-destructive/30"
              )}
            >
              Report Issue
            </Button>
          </Link>

          {/* ✅ PROFILE ICON DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer hover:bg-slate-200 transition-colors border border-slate-200 focus:outline-none"
                aria-label="Open profile menu"
              >
                <User className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48 p-2">
              {/* ✅ Profile Settings route */}
              <DropdownMenuItem
                className="cursor-pointer font-medium py-2 rounded-md focus:bg-slate-50 focus:text-primary"
                asChild
              >
                <Link to="/ProfileSettings" className="w-full">
                  Profile Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* ✅ Logout action */}
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer font-medium py-2 rounded-md text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 p-4 absolute w-full shadow-lg">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={cn(
                  "text-sm font-semibold py-2",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-gray-500"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* ✅ Mobile Announcements */}
            <div className="py-2 border-t border-gray-50">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                Announcements
              </span>

              <div className="grid grid-cols-1 gap-2">
                {announcementsItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={cn(
                      "text-sm font-medium py-1",
                      location.pathname === item.path
                        ? "text-primary"
                        : "text-gray-500 hover:text-primary"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* ✅ Mobile Report Issue */}
            <Link to="/ReportIssue" onClick={() => setIsMenuOpen(false)}>
              <Button variant="destructive" className="w-full mt-2 font-bold">
                Report Issue
              </Button>
            </Link>

            {/* ✅ Mobile Profile quick links */}
            <div className="py-2 border-t border-gray-50">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                Account
              </span>

              <Link
                to="/profile"
                className="text-sm font-medium text-gray-500 hover:text-primary py-1 block"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile Settings
              </Link>

              <button
                type="button"
                className="text-sm font-medium text-red-600 hover:text-red-700 py-1 block text-left"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}