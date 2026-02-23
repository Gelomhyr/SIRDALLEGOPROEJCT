import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface FacilityCardProps {
  title: string;
  description: string;
}

function FacilityCard({ title, description }: FacilityCardProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-50 shadow-sm transition-all hover:shadow-xl hover:translate-y-[-4px] group">
      <div className="aspect-[4/3] bg-[#3b528a] flex items-center justify-center p-8">
        <h4 className="text-white text-2xl font-bold text-center tracking-tight">{title}</h4>
      </div>
      <div className="p-8">
        <h5 className="font-bold text-primary mb-2">{title}</h5>
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">{description}</p>
        <Link to="#" className="flex items-center gap-1 text-[#3b528a] font-bold text-[10px] uppercase tracking-widest hover:underline group-hover:gap-2 transition-all">
          View Details
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

export function FacilitiesSection() {
  const facilities = [
    {
      title: "Barangay Hall",
      description: "Main administrative center.",
    },
    {
      title: "Covered Court",
      description: "Sports and events venue.",
    },
    {
      title: "Health Center",
      description: "Primary healthcare services.",
    },
    {
      title: "Daycare Center",
      description: "Early childhood education.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-3 tracking-tight">
              Community Facilities
            </h2>
            <p className="text-gray-500 font-medium text-sm">
              Explore key facilities available in Barangay Mambog II.
            </p>
          </div>
          <Link to="/facilities" className="flex items-center gap-1 text-primary font-bold text-sm hover:underline">
            View All Facilities
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {facilities.map((facility) => (
            <FacilityCard key={facility.title} {...facility} />
          ))}
        </div>
      </div>
    </section>
  );
}
