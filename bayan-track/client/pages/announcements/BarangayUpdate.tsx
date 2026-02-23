import React, { useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Chatbot } from "@/components/Chatbot";

// TODO: Uncomment these imports in your local environment based on your project structure:
 import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
// import { Reveal } from "@/components/Reveal"; 

// --- Mock components for Canvas preview environment to compile successfully ---

const Reveal = ({ children, delay }: any) => <div style={{ animationDelay: `${delay || 0}ms` }} className="animate-fade-in h-full">{children}</div>;

// Specific mock data tailored for the Barangay Updates view
const MOCK_DB = {
  barangayUpdates: [
    { 
      id: 1, 
      category: 'Event', 
      coverText: 'General Assembly',
      title: 'Barangay General Assembly 2026', 
      date: '2026-03-15', 
      content: 'Pursuant to the Local Government Code, all residents are invited to the bi-annual assembly. Agenda: Annual Budget Presentation, Peace & Order Report, and Infrastructure Projects. Venue: Mambog II Covered Court.', 
      source: 'Barangay Council' 
    },
    { 
      id: 2, 
      category: 'Health', 
      coverText: 'Pet Vaccination',
      title: 'Free Anti-Rabies Vaccination', 
      date: '2026-03-20', 
      content: 'Bring your pets to the Barangay Hall this Saturday for free vaccination. Part of our responsible pet ownership campaign.', 
      source: 'Health Center' 
    },
    { 
      id: 3, 
      category: 'Advisory', 
      coverText: 'Road Work',
      title: 'Road Closure: Purok 1', 
      date: '2026-03-22', 
      content: 'Road re-blocking ongoing at Purok 1. Please take alternate routes via Molino Boulevard access roads.', 
      source: 'Barangay Office' 
    },
    { 
      id: 4, 
      category: 'Advisory', 
      coverText: 'Project Update 11',
      title: 'Community Development: Phase 1', 
      date: '2026-02-28', 
      content: 'The Sangguniang Barangay is committed to transparency. Ongoing drainage improvements and street lighting projects are being monitored by the Committee on Infrastructure. Please report any defects to the Barangay Admin.', 
      source: 'Barangay Council' 
    },
    { 
      id: 5, 
      category: 'Alert', 
      coverText: 'Water Interruption',
      title: 'Scheduled Water Service Interruption', 
      date: '2026-03-25', 
      content: 'Maynilad will conduct pipe maintenance. Expect low pressure to no water from 10:00 PM to 4:00 AM the following day.', 
      source: 'Barangay Admin' 
    },
    { 
      id: 6, 
      category: 'Event', 
      coverText: 'Youth Sports Fest',
      title: 'SK Inter-Purok Basketball League', 
      date: '2026-04-05', 
      content: 'Calling all youth athletes! Registration for the annual summer basketball league is now open at the SK Office.', 
      source: 'SK Council' 
    }
  ]
};
// ---------------------------------------------------------------------------

export default function BarangayUpdate() {
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  
  const ITEMS_PER_PAGE = 6;
  const categories = ['All', 'Advisory', 'Event', 'Alert', 'Health', 'Fact Check'];

  // Filter logic
  const filtered = MOCK_DB.barangayUpdates.filter(a => {
    return filter === 'All' ? true : a.category === filter;
  });

  const paginated = filtered.slice(0, page * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <Header />
      
      <main className="flex-grow container mx-auto px-6 py-12 max-w-6xl">
        <Reveal>
          <div className="mb-8">
            <h1 className="text-[28px] md:text-3xl font-bold text-[#395886] mb-3 uppercase tracking-wide">
              BARANGAY UPDATES
            </h1>
            <p className="text-[15px] text-gray-700 max-w-3xl">
              Official notices, event schedules, and resolutions directly from the Barangay Council.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap border ${
                  filter === cat 
                    ? 'bg-[#395886] text-white border-[#395886] shadow-md' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        {paginated.length === 0 ? (
          <div className="text-center py-16 text-gray-500 bg-white rounded-[14px] border border-gray-200 shadow-sm">
            No updates found for this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {paginated.map((item, idx) => (
              <Reveal key={item.id} delay={idx * 50}>
                <div className="bg-white rounded-[14px] shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col group">
                  
                  {/* Top Cover Block (Replaces the placeholder image) */}
                  <div className="h-[200px] w-full bg-[#395886] relative flex items-center justify-center p-6 text-center">
                    <h2 className="text-white text-3xl md:text-4xl font-bold tracking-tight">
                      {item.coverText}
                    </h2>
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm uppercase tracking-wider ${
                      item.category === 'Event' ? 'bg-[#f97316]' : 'bg-white/10 backdrop-blur-md border border-white/20'
                    }`}>
                      {item.category}
                    </div>
                  </div>

                  {/* Bottom Content Block */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-[12px] text-gray-500 mb-3 flex items-center font-medium">
                      <Calendar size={13} className="mr-1.5 text-gray-400 shrink-0"/> {item.date}
                      <span className="text-[#395886] font-medium ml-1.5 shrink-0">• {item.source}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mt-1 mb-3 line-clamp-2 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[14px] text-gray-600 line-clamp-3 mb-6 leading-relaxed flex-1">
                      {item.content}
                    </p>
                    <span className="text-[#395886] text-[13px] font-bold flex items-center gap-1.5 hover:underline w-fit">
                      Read Details <ArrowRight size={14}/>
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {paginated.length < filtered.length && (
          <button 
            onClick={() => setPage(p => p + 1)}
            className="w-full py-4 bg-white text-[#395886] font-bold rounded-[14px] hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
          >
            Load More Updates
          </button>
        )}
      </main>

      <Footer />
            <Chatbot />
    </div>
  );
}