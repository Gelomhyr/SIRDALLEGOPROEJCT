import React from 'react';
import { Phone, MapPin, Info, Map, Siren } from 'lucide-react';
import { Chatbot } from "@/components/Chatbot";
// TODO: Uncomment these imports in your local environment based on your project structure:
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal"; 

// --- Mock components for Canvas preview environment to compile successfully ---



const HOTLINES_DATA = [
  { 
    name: 'Barangay Mambog II Hall', 
    type: 'ADMIN', 
    number: '(046) 417-0000', 
    desc: 'General inquiries, barangay clearance, disputes.', 
    when: ['Business hours concerns', 'Certificate follow-ups'], 
    prepare: ['Name', 'Address', 'Nature of inquiry'] 
  },
  { 
    name: 'Bacoor PNP', 
    type: 'POLICE', 
    number: '(046) 417-6366', 
    desc: 'Crime reporting, immediate police assistance.', 
    when: ['Crime in progress', 'Suspicious persons', 'Traffic accidents'], 
    prepare: ['Location', 'Description of suspect/incident'] 
  },
  { 
    name: 'BFP Bacoor (Fire)', 
    type: 'FIRE', 
    number: '(046) 417-6060', 
    desc: 'Fire emergencies and rescue operations.', 
    when: ['Smoke or fire visible', 'Chemical spills'], 
    prepare: ['Exact address', 'Type of building'] 
  },
  { 
    name: 'Bacoor DRRMO', 
    type: 'RESCUE', 
    number: '(046) 417-0683', 
    desc: 'Disaster response, flood rescue, ambulance.', 
    when: ['Flood evacuation', 'Medical emergency', 'Trapped individuals'], 
    prepare: ['Number of people', 'Injury details'] 
  },
  { 
    name: 'Bacoor District Hospital', 
    type: 'MEDICAL', 
    number: '(046) 417-3693', 
    desc: 'Nearest public hospital for emergencies.', 
    when: ['Severe injury', 'Critical illness'], 
    prepare: ['Patient history', 'Insurance/PhilHealth'] 
  },
  { 
    name: 'Meralco Emergency', 
    type: 'UTILITY', 
    number: '16211', 
    desc: 'Power outages and electrical hazards.', 
    when: ['Sparking lines', 'Fallen posts', 'No power'], 
    prepare: ['Service ID Number (SIN)', 'Pole number'] 
  },
  { 
    name: 'Maynilad Water', 
    type: 'UTILITY', 
    number: '1626', 
    desc: 'Water interruptions and leaks.', 
    when: ['Pipe burst', 'No water supply'], 
    prepare: ['Account number'] 
  },
  { 
    name: 'National Emergency', 
    type: 'GENERAL', 
    number: '911', 
    desc: 'National emergency hotline.', 
    when: ['Life-threatening situations'], 
    prepare: ['Location', 'Nature of emergency'] 
  },
];

export default function EmergencyHotlines() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f1f5f9]">
      <Header />
      
      <main className="flex-grow container mx-auto px-6 py-10 max-w-6xl">
        <Reveal>
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-[#de2a2a] to-[#c62828] rounded-[20px] p-8 md:p-10 text-white mb-10 shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 flex items-center gap-3">
                <Siren size={36} /> Emergency Hotlines
              </h1>
              <p className="text-red-100 text-sm md:text-base">
                Keep these numbers saved. Know what to do before you call.
              </p>
            </div>
            {/* Decorative background shape */}
            <div className="absolute -right-20 -top-40 w-96 h-96 bg-white opacity-5 rounded-full transform rotate-45"></div>
          </div>
        </Reveal>

        {/* Hotlines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {HOTLINES_DATA.map((hotline, idx) => (
            <Reveal>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 border-l-[6px] border-l-[#de2a2a] p-6 md:p-8 h-full flex flex-col relative hover:shadow-md transition-shadow">
                
                {/* Phone Icon top right */}
                <div className="absolute top-6 right-6 text-[#de2a2a]">
                  <Phone size={24} strokeWidth={2} />
                </div>

                {/* Header */}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">
                    {hotline.name}
                  </h2>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    {hotline.type}
                  </span>
                </div>

                {/* Number */}
                <div className="text-[28px] font-bold text-[#de2a2a] mb-3 tracking-tight">
                  {hotline.number}
                </div>

                {/* Description */}
                <p className="text-[13px] text-gray-600 italic mb-6">
                  {hotline.desc}
                </p>

                {/* Two Columns for Instructions */}
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  {/* When to call */}
                  <div className="bg-[#fff1f2] p-4 rounded-lg">
                    <h4 className="text-[11px] font-bold text-[#9f1239] mb-2 uppercase">When to call</h4>
                    <ul className="text-[12px] text-gray-800 space-y-1.5 list-disc pl-4">
                      {hotline.when.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Prepare info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-[11px] font-bold text-gray-700 mb-2 uppercase">Prepare info:</h4>
                    <ul className="text-[12px] text-gray-700 space-y-1.5 list-disc pl-4">
                      {hotline.prepare.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            </Reveal>
          ))}
        </div>

        {/* Evacuation & Safety Section */}
        <Reveal>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#395886] mb-6">Evacuation & Safety</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Evacuation Centers */}
              <div className="bg-white rounded-[14px] p-6 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="text-[#395886]" size={18} /> Evacuation Centers
                </h3>
                <div className="space-y-3">
                  <div className="bg-[#f0f4f8] p-3 rounded-lg">
                    <div className="text-[14px] font-bold text-[#395886]">Mambog II Elementary School</div>
                    <div className="text-[11px] text-gray-500 mt-1">Cap: 200 Families • Main Road</div>
                  </div>
                  <div className="bg-[#f0f4f8] p-3 rounded-lg">
                    <div className="text-[14px] font-bold text-[#395886]">Barangay Covered Court</div>
                    <div className="text-[11px] text-gray-500 mt-1">Cap: 100 Families • Near Hall</div>
                  </div>
                </div>
              </div>

              {/* Emergency Steps */}
              <div className="bg-white rounded-[14px] p-6 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Info className="text-[#395886]" size={18} /> Emergency Steps
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <span className="bg-[#ffedd5] text-[#9a3412] text-[10px] font-bold px-2 py-1 rounded">FIRE</span>
                    <p className="text-[12px] text-gray-700 leading-tight">Evacuate immediately. Do not re-enter. Crawl if there is smoke.</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="bg-[#dbeafe] text-[#1e40af] text-[10px] font-bold px-2 py-1 rounded">FLOOD</span>
                    <p className="text-[12px] text-gray-700 leading-tight">Turn off main power. Move to higher ground. Prepare Go-Bag.</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="bg-[#fef3c7] text-[#92400e] text-[10px] font-bold px-2 py-1 rounded">QUAKE</span>
                    <p className="text-[12px] text-gray-700 leading-tight">Duck, Cover, and Hold. Move to open area after shaking stops.</p>
                  </div>
                </div>
              </div>

              {/* View Safe Zones Map Link */}
              <div className="bg-[#1e293b] rounded-[14px] p-6 shadow-md text-center flex flex-col items-center justify-center">
                <Map className="text-[#638ECB] mb-4" size={42} strokeWidth={1.5} />
                <h3 className="text-lg font-bold text-white mb-2">View Safe Zones</h3>
                <p className="text-slate-300 text-[12px] mb-6 px-4">
                  Open the digital map to see evacuation routes and pick-up points.
                </p>
                <button className="bg-[#638ECB] hover:bg-[#4b6f9f] text-white text-sm font-bold py-2.5 px-6 rounded-lg transition-colors w-full max-w-[200px]">
                  Open Google Maps
                </button>
              </div>

            </div>
          </div>
        </Reveal>

      </main>

      <Footer />
          <Chatbot />

    </div>
  );
}