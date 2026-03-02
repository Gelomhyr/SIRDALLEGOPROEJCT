import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

type AnnouncementItem = {
  _id: string;
  title: string;
  content: string;
  module: string;
};

interface FacilityCardProps {
  title: string;
  description: string;
  module: string;
}

function FacilityCard({ title, description, module }: FacilityCardProps) {
  const target = module === "emergency-hotlines" ? "/announcements/emergency-hotlines" : module === "phivolcs-alerts" ? "/announcements/phivolcs-alerts" : module === "fact-check" ? "/announcements/fact-check" : "/announcements/barangay-updates";
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-50 shadow-sm transition-all hover:shadow-xl hover:translate-y-[-4px] group">
      <div className="aspect-[4/3] bg-[#3b528a] flex items-center justify-center p-8">
        <h4 className="text-white text-2xl font-bold text-center tracking-tight">{title}</h4>
      </div>
      <div className="p-8">
        <h5 className="font-bold text-primary mb-2">{title}</h5>
        <p className="text-xs text-gray-500 mb-6 leading-relaxed line-clamp-2">{description}</p>
        <Link to={target} className="flex items-center gap-1 text-[#3b528a] font-bold text-[10px] uppercase tracking-widest hover:underline group-hover:gap-2 transition-all">
          View Details
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

export function FacilitiesSection() {
  const [items, setItems] = useState<AnnouncementItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/announcements?limit=4");
        setItems(res.data || []);
      } catch {
        setItems([]);
      }
    };
    void load();
  }, []);

  const cards = items.length > 0 ? items.map((item) => ({ title: item.title, description: item.content, module: item.module })) : [
    { title: "Barangay Feed", description: "Announcements will appear here once published.", module: "barangay-updates" },
    { title: "News Feed", description: "Community updates connected to your live database.", module: "all-news-updates" },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-3 tracking-tight">Community Facilities</h2>
            <p className="text-gray-500 font-medium text-sm">Live preview of current community announcements.</p>
          </div>
          <Link to="/announcements" className="flex items-center gap-1 text-primary font-bold text-sm hover:underline">
            View All Updates
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((facility, idx) => (
            <FacilityCard key={`${facility.title}-${idx}`} {...facility} />
          ))}
        </div>
      </div>
    </section>
  );
}
