import { AlertTriangle, FileText, Megaphone, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ActionCardProps {
  icon: React.ElementType;
  title: string;
  colorClass: string;
  iconColorClass: string;
  bgColorClass: string;
  onClick: () => void;
}

function ActionCard({ icon: Icon, title, colorClass, iconColorClass, bgColorClass, onClick }: ActionCardProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 rounded-xl transition-all hover:scale-105 cursor-pointer shadow-md border-b-4",
      bgColorClass,
      colorClass
    )} onClick={onClick}>
      <div className={cn("p-4 rounded-full mb-4", iconColorClass)}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="font-bold text-lg text-slate-800">{title}</h3>
    </div>
  );
}

export function QuickActions() {
  const navigate = useNavigate();
  const actions = [
    {
      title: "Report Issue",
      icon: AlertTriangle,
      colorClass: "border-red-500",
      iconColorClass: "text-red-600 bg-red-100",
      bgColorClass: "bg-[#fef2f2]",
      onClick: () => navigate("/ReportIssue"),
    },
    {
      title: "Certificates",
      icon: FileText,
      colorClass: "border-blue-500",
      iconColorClass: "text-blue-600 bg-blue-100",
      bgColorClass: "bg-[#eff6ff]",
      onClick: () => navigate("/services"),
    },
    {
      title: "News & Alerts",
      icon: Megaphone,
      colorClass: "border-amber-500",
      iconColorClass: "text-amber-600 bg-amber-100",
      bgColorClass: "bg-[#fffbeb]",
      onClick: () => navigate("/announcements"),
    },
    {
      title: "Hotlines",
      icon: Phone,
      colorClass: "border-green-500",
      iconColorClass: "text-green-600 bg-green-100",
      bgColorClass: "bg-[#f0fdf4]",
      onClick: () => navigate("/announcements/emergency-hotlines"),
    },
  ];

  return (
    <section className="relative z-10 -mt-20 container mx-auto px-4 max-w-6xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action) => (
          <ActionCard key={action.title} {...action} />
        ))}
      </div>
    </section>
  );
}
