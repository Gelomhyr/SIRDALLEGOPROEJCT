import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProjectsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-3 tracking-tight">
              Projects & Activities
            </h2>
            <p className="text-gray-500 font-medium">
              Latest updates on infrastructure, health, and youth programs.
            </p>
          </div>
          <Link to="/announcements" className="flex items-center gap-1 text-primary font-bold text-sm hover:underline">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Featured Project Card */}
        <div className="relative rounded-3xl overflow-hidden aspect-[21/9] min-h-[400px] shadow-2xl group">
          {/* Gradient/Image Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2e3b82] to-[#6d7eb8]" />
          
          {/* Content */}
          <div className="absolute inset-0 p-12 flex flex-col justify-end text-white z-10">
            <Badge className="w-fit bg-blue-400 hover:bg-blue-500 text-white border-none px-3 py-1 mb-6 uppercase text-[10px] font-bold tracking-widest">
              Advisory
            </Badge>
            <h3 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight max-w-2xl drop-shadow-md">
              Scheduled Power Interruption
            </h3>
            <p className="text-white/80 text-lg mb-8 max-w-xl leading-relaxed">
              Maintenance activities on Mambog II feeder from 9AM to 4PM affecting Purok 3 and 4 due to line reconductoring.
            </p>
            <Button size="lg" className="w-fit bg-white text-primary hover:bg-white/90 font-bold px-8 rounded-xl h-14">
              Read Full Story
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Navigation Dots/Arrows */}
          <div className="absolute bottom-12 right-12 flex items-center gap-6 z-10">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-2 rounded-full transition-all ${i === 1 ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
              ))}
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper to keep Link working since it's used in the component
import { Link } from "react-router-dom";
