import React from 'react';
import { Activity, AlertTriangle } from 'lucide-react';
import { Chatbot } from "@/components/Chatbot";

// TODO: Uncomment these imports in your local environment based on your project structure:
 import { Header } from "@/components/Header";
 import { Footer } from "@/components/Footer";
// import { Reveal } from "@/components/Reveal"; 
// import { FadeIn } from "@/components/FadeIn";

// --- Mock components for Canvas preview environment to compile successfully ---

const Reveal = ({ children, delay }: any) => <div style={{ animationDelay: `${delay || 0}ms` }} className="animate-fade-in h-full">{children}</div>;
const FadeIn = ({ children }: any) => <div className="animate-fade-in h-full">{children}</div>;

const MOCK_PHIVOLCS = [
  { id: 201, type: 'Earthquake', title: 'Earthquake Information No. 1', details: 'Mag: 3.4 | Depth: 12km | Loc: 015 km N 45° W of Calatagan (Batangas)', guidance: 'No damage or aftershocks expected.', date: '2026-03-16 08:30 AM', fullDetails: 'This is a tectonic earthquake. No tsunami threat exists. Residents in nearby Cavite areas may have felt Intensity I or II.' },
  { id: 202, type: 'Volcano', title: 'Taal Volcano Bulletin', details: 'Alert Level 1 (Low Level of Unrest)', guidance: 'Steam-driven or phreatic explosions, volcanic earthquakes, minor ashfall, and lethal accumulations or expulsions of volcanic gas can occur.', date: '2026-03-16 05:00 AM', fullDetails: 'The public is reminded that the entire Taal Volcano Island is a Permanent Danger Zone (PDZ). Entry into the TVI is strictly prohibited.' },
  { id: 203, type: 'Earthquake', title: 'Earthquake Information No. 3', details: 'Mag: 5.1 | Depth: 24km | Loc: Castillejos (Zambales)', guidance: 'Aftershocks expected. Damage possible near epicenter.', date: '2026-03-15 02:15 PM', fullDetails: 'Felt Intensity III in parts of Metro Manila and Cavite. Check buildings for cracks.' },
  { id: 204, type: 'Tsunami', title: 'Tsunami Information No. 1', details: 'No Tsunami Threat', guidance: 'No destructive tsunami threat exists based on available data.', date: '2026-03-15 02:20 PM', fullDetails: 'This is for the earthquake event in Zambales. No coastal evacuation is necessary.' },
  { id: 205, type: 'Volcano', title: 'Mayon Volcano Advisory', details: 'Alert Level 2 (Decreased from 3)', guidance: 'Moderate level of unrest. Avoid 6km Permanent Danger Zone.', date: '2026-03-14 08:00 AM', fullDetails: 'Lowering of alert status does not mean the volcano has ceased activity. Sudden explosions may still occur.' },
  { id: 206, type: 'Earthquake', title: 'Earthquake Information No. 2', details: 'Mag: 2.1 | Depth: 005km | Loc: Ternate (Cavite)', guidance: 'No damage or aftershocks expected.', date: '2026-03-13 11:45 PM', fullDetails: 'Minor local fault movement. Not felt by most residents.' }
];
// ---------------------------------------------------------------------------

export default function PHIVOLCS() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-6 py-12 max-w-7xl">
           <FadeIn>
             {/* Hero Section */}
             <div className="bg-slate-900 text-white p-12 rounded-2xl text-center mb-12 shadow-xl border border-slate-800 relative overflow-hidden">
               <div className="relative z-10">
                 <Activity size={64} className="mx-auto mb-4 text-red-400 animate-pulse"/>
                 <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">PHIVOLCS Alerts</h1>
                 <p className="max-w-2xl mx-auto text-gray-300 text-base md:text-lg">
                   Official seismic and volcanic advisories to keep Mambog II residents prepared and safe.
                 </p>
               </div>
             </div>
           </FadeIn>

           {/* Alerts Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {MOCK_PHIVOLCS.map((item, idx) => (
               <Reveal key={item.id} delay={idx * 50}>
                 <div className="bg-white border border-[#D5DEEF] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                   
                   {/* Type Badge & Date */}
                   <div className="flex justify-between items-start mb-4">
                     <div className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm uppercase tracking-wider ${
                        item.type === 'Earthquake' ? 'bg-amber-600' : 
                        item.type === 'Volcano' ? 'bg-red-600' : 'bg-blue-600'
                     }`}>
                       {item.type}
                     </div>
                     <span className="text-xs text-gray-400 font-medium">{item.date}</span>
                   </div>
                   
                   {/* Title & Quick Details */}
                   <h3 className="font-bold text-[#395886] text-xl mb-2 leading-tight">{item.title}</h3>
                   <p className="text-gray-800 font-semibold text-sm mb-3 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                     {item.details}
                   </p>
                   
                   {/* Full Details */}
                   <p className="text-gray-600 text-[14px] mb-6 flex-1 leading-relaxed">
                     {item.fullDetails}
                   </p>
                   
                   {/* Guidance Box */}
                   <div className="bg-red-50 p-4 rounded-lg border border-red-100 mt-auto">
                     <p className="text-xs font-bold text-red-800 flex items-center gap-2 mb-1.5 uppercase tracking-wide">
                       <AlertTriangle size={14} strokeWidth={2.5}/> Official Guidance
                     </p>
                     <p className="text-[13px] text-red-700 leading-snug font-medium">{item.guidance}</p>
                   </div>

                 </div>
               </Reveal>
             ))}
           </div>
        </div>
      </main>

      <Footer />
            <Chatbot />
    </div>
  );
}