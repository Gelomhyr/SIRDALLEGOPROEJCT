import React, { useState } from 'react';
import { Shield, AlertTriangle, Calendar, ArrowRight, Activity } from 'lucide-react';
import { Chatbot } from "@/components/Chatbot";

// TODO: Uncomment these imports in your local environment based on your project structure:
 import { Header } from "@/components/Header";
 import { Footer } from "@/components/Footer";
// import { Reveal } from "@/components/Reveal"; 
// import { FadeIn } from "@/components/FadeIn";
// import { NewsCarousel } from "@/components/NewsCarousel";
// import { EmergencyView } from "@/views/EmergencyView";
// import { MOCK_DB } from "@/utils/mockDb";

// --- Mock components for Canvas preview environment to compile successfully ---

const Reveal = ({ children, delay }: any) => <div style={{ animationDelay: `${delay || 0}ms` }} className="animate-fade-in">{children}</div>;
const FadeIn = ({ children }: any) => <div className="animate-fade-in">{children}</div>;
const EmergencyView = () => <div className="p-12 text-center text-xl font-bold text-red-600 bg-white rounded-xl shadow-sm m-6">Emergency Hotlines View (Mock)</div>;
const NewsCarousel = () => <div className="bg-slate-200 h-64 rounded-xl mb-12 flex items-center justify-center text-slate-500 font-bold">News Carousel Placeholder</div>;

const MOCK_DB = {
  announcements: [
    { id: 1, type: 'barangay-updates', category: 'Event', title: 'Barangay General Assembly 2026', date: '2026-03-15', content: 'Pursuant to the Local Government Code, all residents are invited to the bi-annual assembly. Agenda: Annual Budget Presentation, Peace & Order Report, and Infrastructure Projects. Venue: Mambog II Covered Court.', source: 'Barangay Council', verified: true, image: 'https://placehold.co/800x400/395886/FFFFFF?text=General+Assembly' },
    { id: 2, type: 'pagasa-weather', category: 'Alert', title: 'Typhoon Signal No. 1 Raised', date: '2026-03-14', content: 'Signal No. 1 raised in Cavite. Expect light to moderate rains. Fisherfolks in coastal Bacoor areas are advised not to venture out to sea.', source: 'PAGASA', verified: true, image: 'https://placehold.co/800x400/8AAEE0/FFFFFF?text=Weather+Alert' },
    { id: 3, type: 'meralco-power', category: 'Advisory', title: 'Scheduled Power Interruption', date: '2026-03-18', content: 'Maintenance activities on Mambog II feeder from 9AM to 4PM affecting Purok 3 and 4 due to line reconductoring.', source: 'Meralco', verified: true, image: 'https://placehold.co/800x400/F0F3FA/395886?text=Power+Interruption' },
    { id: 4, type: 'bacoor-city-updates', category: 'Advisory', title: 'Real Property Tax Amnesty', date: '2026-03-10', content: 'The City Government of Bacoor extends real property tax amnesty until the end of the month. Visit the City Treasurer Office at the Bacoor Government Center.', source: 'Bacoor City Hall', verified: true, image: 'https://placehold.co/600x400/638ECB/FFFFFF?text=Tax+Amnesty' },
    { id: 5, type: 'pnp-safety-alerts', category: 'Alert', title: 'Curfew Enforcement Reminder', date: '2026-03-08', content: 'Strict implementation of curfew for minors (10PM - 4AM) pursuant to City Ordinance. Parents are advised to monitor their children.', source: 'Bacoor PNP', verified: true, image: 'https://placehold.co/600x400/395886/FFFFFF?text=Curfew+Alert' },
    { id: 6, type: 'bfp-fire-safety', category: 'Advisory', title: 'Fire Prevention Month Kick-off', date: '2026-03-01', content: 'Check your electrical wiring and LPG tanks regularly. Fire safety seminars will be held at the covered court for homeowners associations.', source: 'BFP Bacoor', verified: true, image: 'https://placehold.co/600x400/e11d48/FFFFFF?text=Fire+Safety' },
    { id: 7, type: 'barangay-updates', category: 'Health', title: 'Free Anti-Rabies Vaccination', date: '2026-03-20', content: 'Bring your pets to the Barangay Hall this Saturday for free vaccination. Part of our responsible pet ownership campaign.', source: 'Health Center', verified: true, image: 'https://placehold.co/600x400/395886/FFFFFF?text=Pet+Vaccination' },
    { id: 8, type: 'barangay-updates', category: 'Advisory', title: 'Road Closure: Purok 1', date: '2026-03-22', content: 'Road re-blocking ongoing at Purok 1. Please take alternate routes via Molino Boulevard access roads.', source: 'Barangay Office', verified: true, image: 'https://placehold.co/600x400/638ECB/FFFFFF?text=Road+Work' },
    { id: 9, type: 'bacoor-city-updates', category: 'Event', title: 'Bacoor Job Fair 2026', date: '2026-03-25', content: 'City-wide Job Fair at Strike Gymnasium. Bring your resumes. Local and overseas employment opportunities available.', source: 'PESO Bacoor', verified: true, image: 'https://placehold.co/600x400/395886/FFFFFF?text=Job+Fair' },
    { id: 10, type: 'pnp-safety-alerts', category: 'Alert', title: 'Anti-Criminality Checkpoint', date: '2026-03-28', content: 'Routine checkpoints established along Molino Blvd. Have your license and registration ready. implementation of "No Helmet, No Travel" policy.', source: 'Bacoor PNP', verified: true, image: 'https://placehold.co/600x400/395886/FFFFFF?text=Checkpoint' },
    ...Array.from({ length: 20 }).map((_, i) => ({
      id: 11 + i,
      type: i % 3 === 0 ? 'barangay-updates' : (i % 3 === 1 ? 'bacoor-city-updates' : 'health-updates'),
      category: i % 2 === 0 ? 'Advisory' : 'Project',
      title: `Community Development: Phase ${i + 1}`,
      date: `2026-02-${Math.max(1, 28 - i).toString().padStart(2, '0')}`,
      content: 'The Sangguniang Barangay is committed to transparency. Ongoing drainage improvements and street lighting projects are being monitored by the Committee on Infrastructure. Please report any defects to the Barangay Admin.',
      source: 'Barangay Council',
      verified: true,
      image: `https://placehold.co/600x400/395886/FFFFFF?text=Project+Update+${11 + i}`
    }))
  ],
  factChecks: [
    { id: 101, status: 'FALSE', category: 'Public Safety', title: 'Evacuation order due to gas leak', claim: 'Residents of Purok 3 are ordered to evacuate immediately due to a massive chemical gas leak.', verdict: 'There is NO gas leak in Purok 3. The BFP Bacoor has verified that the smell was from a controlled burning of garbage which has been apprehended.', source: 'BFP Bacoor Advisory', date: '2026-03-10' },
    { id: 102, status: 'MISLEADING', category: 'Disaster', title: '7.5 Magnitude Earthquake Prediction', claim: 'A 7.5 magnitude earthquake is predicted to hit Cavite tomorrow at exactly 2:00 PM.', verdict: 'PHIVOLCS has stated that earthquakes cannot be predicted with such precision. Always rely on official PHIVOLCS advisories for seismic updates.', source: 'PHIVOLCS Advisory', date: '2026-03-08' },
    { id: 103, status: 'FALSE', category: 'Scam', title: '₱10,000 Ayuda Registration Link', claim: 'Click this link to register for the new Barangay 10k Ayuda program.', verdict: 'This is a SCAM/Phishing link. There is no such program currently active. Official assistance programs are only announced via the Barangay Hall and verified pages.', source: 'Barangay Admin', date: '2026-03-05' },
    { id: 104, status: 'TRUE', category: 'Health', title: 'Free Medical Mission Schedule', claim: 'There will be a free medical and dental mission at the Covered Court on Saturday.', verdict: 'CONFIRMED. The medical mission is a project of the City Health Office in coordination with the Barangay Council. 8AM-12NN.', source: 'City Health Office', date: '2026-03-12' },
    { id: 105, status: 'TRUE', category: 'Utilities', title: 'Meralco Scheduled Outage', claim: 'Power interruption scheduled for March 18 from 9AM to 4PM.', verdict: 'VERIFIED. Meralco has issued a formal notice for line maintenance in Mambog II.', source: 'Meralco Advisory', date: '2026-03-13' },
    { id: 106, status: 'MISLEADING', category: 'Utilities', title: 'Water Interruption Rumor', claim: 'Water will be cut off for 3 days straight starting tomorrow.', verdict: 'Maynilad has only announced a pressure reduction for 4 hours during off-peak times, NOT a total 3-day cutoff.', source: 'Maynilad Advisory', date: '2026-03-11' },
  ],
  phivolcs: [
    { id: 201, type: 'Earthquake', title: 'Earthquake Information No. 1', details: 'Mag: 3.4 | Depth: 12km | Loc: 015 km N 45° W of Calatagan (Batangas)', guidance: 'No damage or aftershocks expected.', date: '2026-03-16 08:30 AM', fullDetails: 'This is a tectonic earthquake. No tsunami threat exists. Residents in nearby Cavite areas may have felt Intensity I or II.' },
    { id: 202, type: 'Volcano', title: 'Taal Volcano Bulletin', details: 'Alert Level 1 (Low Level of Unrest)', guidance: 'Steam-driven or phreatic explosions, volcanic earthquakes, minor ashfall, and lethal accumulations or expulsions of volcanic gas can occur.', date: '2026-03-16 05:00 AM', fullDetails: 'The public is reminded that the entire Taal Volcano Island is a Permanent Danger Zone (PDZ). Entry into the TVI is strictly prohibited.' },
    { id: 203, type: 'Earthquake', title: 'Earthquake Information No. 3', details: 'Mag: 5.1 | Depth: 24km | Loc: Castillejos (Zambales)', guidance: 'Aftershocks expected. Damage possible near epicenter.', date: '2026-03-15 02:15 PM', fullDetails: 'Felt Intensity III in parts of Metro Manila and Cavite. Check buildings for cracks.' },
    { id: 204, type: 'Tsunami', title: 'Tsunami Information No. 1', details: 'No Tsunami Threat', guidance: 'No destructive tsunami threat exists based on available data.', date: '2026-03-15 02:20 PM', fullDetails: 'This is for the earthquake event in Zambales. No coastal evacuation is necessary.' },
    { id: 205, type: 'Volcano', title: 'Mayon Volcano Advisory', details: 'Alert Level 2 (Decreased from 3)', guidance: 'Moderate level of unrest. Avoid 6km Permanent Danger Zone.', date: '2026-03-14 08:00 AM', fullDetails: 'Lowering of alert status does not mean the volcano has ceased activity. Sudden explosions may still occur.' },
    { id: 206, type: 'Earthquake', title: 'Earthquake Information No. 2', details: 'Mag: 2.1 | Depth: 005km | Loc: Ternate (Cavite)', guidance: 'No damage or aftershocks expected.', date: '2026-03-13 11:45 PM', fullDetails: 'Minor local fault movement. Not felt by most residents.' }
  ]
};
// ---------------------------------------------------------------------------

export default function Announcements({ slug }: { slug?: string }) {
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  
  const ITEMS_PER_PAGE = 6;

  // Helper text based on slug
  const getSlugContext = () => {
    switch(slug) {
      case 'barangay-updates': return "Official notices, event schedules, and resolutions directly from the Barangay Council.";
      case 'bacoor-city-updates': return "Important announcements from the City Government of Bacoor relevant to Mambog II residents.";
      case 'pnp-safety-alerts': return "Crime prevention tips, checkpoint schedules, and safety reminders from Bacoor PNP.";
      case 'bfp-fire-safety': return "Fire prevention tips and safety inspection schedules.";
      case 'pagasa-weather': return "Localized weather forecasts and typhoon warning signals.";
      case 'phivolcs-alerts': return "Official seismic and volcanic advisories to keep Mambog II residents prepared and safe.";
      case 'fact-check': return "Combatting misinformation in our community. We verify rumors so you stay informed with the truth.";
      default: return "Stay informed with the latest verified updates and community advisories.";
    }
  };

  const renderContent = () => {
    if (slug === 'emergency-hotlines') return <EmergencyView />;

    // DEDICATED VIEW: FACT CHECK
    if (slug === 'fact-check') {
      return (
        <div className="container mx-auto px-6 py-12">
          <FadeIn>
            <div className="bg-slate-900 text-white p-12 rounded-2xl text-center mb-12 shadow-xl border border-slate-800">
              <Shield size={64} className="mx-auto mb-4 text-yellow-400 animate-pulse"/>
              <h1 className="text-4xl font-bold mb-4">BayanTrack+ Fact Check</h1>
              <p className="max-w-2xl mx-auto text-gray-300 text-lg">Combatting misinformation in our community. We verify rumors so you stay informed with the truth.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {MOCK_DB.factChecks.map(item => (
               <Reveal key={item.id}>
                 <div className={`border rounded-xl p-6 flex flex-col sm:flex-row gap-4 shadow-sm hover:shadow-md transition-shadow h-full ${
                    item.status === 'FALSE' ? 'bg-red-50 border-red-200' : 
                    item.status === 'MISLEADING' ? 'bg-orange-50 border-orange-200' : 
                    'bg-green-50 border-green-200'
                 }`}>
                   <div className="shrink-0 pt-1">
                     <AlertTriangle className={
                        item.status === 'FALSE' ? 'text-red-600' : 
                        item.status === 'MISLEADING' ? 'text-orange-600' : 
                        'text-green-600'
                     }/>
                   </div>
                   <div className="flex-1 flex flex-col">
                     <h3 className={`font-bold text-xl mb-3 ${
                        item.status === 'FALSE' ? 'text-red-700' : 
                        item.status === 'MISLEADING' ? 'text-orange-700' : 
                        'text-green-700'
                     }`}>{item.title}</h3>
                     <div className="mb-4 text-sm bg-white/50 p-3 rounded-lg border border-black/5">
                       <p className="font-bold text-gray-800 mb-1">Claim:</p>
                       <p className="text-gray-600 italic">"{item.claim}"</p>
                     </div>
                     <div className="mb-4 text-sm flex-1">
                       <p className="font-bold text-gray-800 mb-1">Verdict:</p>
                       <p className="text-gray-700 leading-relaxed">{item.verdict}</p>
                     </div>
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-black/5">
                        <div className={`px-3 py-1 rounded inline-block text-xs font-bold border bg-white ${
                            item.status === 'FALSE' ? 'text-red-800 border-red-200' : 
                            item.status === 'MISLEADING' ? 'text-orange-800 border-orange-200' : 
                            'text-green-800 border-green-200'
                        }`}>
                          VERIFIED {item.status}
                        </div>
                        <p className="text-xs font-medium text-gray-500">{item.source} • {item.date}</p>
                     </div>
                   </div>
                 </div>
               </Reveal>
             ))}
          </div>
        </div>
      );
    }

    // DEDICATED VIEW: PHIVOLCS ALERTS
    if (slug === 'phivolcs-alerts') {
      return (
        <div className="container mx-auto px-6 py-12">
           <FadeIn>
             <div className="bg-slate-900 text-white p-12 rounded-2xl text-center mb-12 shadow-xl border border-slate-800">
               <Activity size={64} className="mx-auto mb-4 text-red-400 animate-pulse"/>
               <h1 className="text-4xl font-bold mb-4">PHIVOLCS Alerts</h1>
               <p className="max-w-2xl mx-auto text-gray-300 text-lg">{getSlugContext()}</p>
             </div>
           </FadeIn>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {MOCK_DB.phivolcs.map(item => (
               <Reveal key={item.id}>
                 <div className="bg-white border border-[#D5DEEF] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                   <div className="flex justify-between items-start mb-4">
                     <div className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
                        item.type === 'Earthquake' ? 'bg-amber-600' : 
                        item.type === 'Volcano' ? 'bg-red-600' : 'bg-blue-600'
                     }`}>
                       {item.type}
                     </div>
                     <span className="text-xs text-gray-400 font-medium">{item.date}</span>
                   </div>
                   <h3 className="font-bold text-[#395886] text-xl mb-2">{item.title}</h3>
                   <p className="text-gray-800 font-semibold text-sm mb-3 bg-gray-50 p-2 rounded">{item.details}</p>
                   <p className="text-gray-600 text-sm mb-6 flex-1 leading-relaxed">{item.fullDetails}</p>
                   <div className="bg-red-50 p-4 rounded-lg border border-red-100 mt-auto">
                     <p className="text-xs font-bold text-red-800 flex items-center gap-2 mb-1">
                       <AlertTriangle size={14}/> Official Guidance:
                     </p>
                     <p className="text-sm text-red-700 leading-snug">{item.guidance}</p>
                   </div>
                 </div>
               </Reveal>
             ))}
           </div>
        </div>
      );
    }

    // STANDARD ANNOUNCEMENTS VIEW
    const filtered = MOCK_DB.announcements.filter(a => {
      const matchSlug = slug ? a.type === slug : true;
      const matchFilter = filter === 'All' ? true : a.category === filter;
      return matchSlug && matchFilter;
    });

    const paginated = filtered.slice(0, page * ITEMS_PER_PAGE);
    const categories = ['All', 'Advisory', 'Event', 'Alert', 'Health', 'Fact Check'];

    return (
      <div className="container mx-auto px-6 py-12">
        {!slug && <NewsCarousel />}

        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <Reveal>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#395886] mb-2">
                  {slug ? slug.replace(/-/g, ' ').toUpperCase() : 'News & Updates'}
                </h2>
                <p className="text-gray-600">{getSlugContext()}</p>
              </div>

              <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                      filter === cat ? 'bg-[#395886] text-white shadow-md transform scale-105' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </Reveal>

            {paginated.length === 0 ? (
                <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm">
                    No announcements found for this category.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {paginated.map((item, idx) => (
                    <Reveal key={item.id} delay={idx * 50}>
                    <div className="bg-white rounded-xl shadow-sm border border-[#D5DEEF] overflow-hidden hover:shadow-xl transition-all group cursor-pointer h-full flex flex-col">
                        <div className="h-48 overflow-hidden relative">
                            <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title}/>
                            <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
                            item.category === 'Alert' ? 'bg-red-500' : item.category === 'Event' ? 'bg-orange-500' : 'bg-[#395886]'
                            }`}>
                            {item.category}
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                        <div className="text-xs text-gray-400 mb-3 flex items-center gap-2 font-medium">
                            <Calendar size={14}/> {item.date}
                            <span className="text-[#638ECB]">• {item.source}</span>
                        </div>
                        <h3 className="font-bold text-gray-800 text-xl mb-3 line-clamp-2 leading-tight group-hover:text-[#395886] transition-colors">{item.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-3 mb-6 leading-relaxed flex-1">{item.content}</p>
                        <span className="text-[#395886] text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">Read Details <ArrowRight size={16}/></span>
                        </div>
                    </div>
                    </Reveal>
                ))}
                </div>
            )}

            {paginated.length < filtered.length && (
              <button 
                onClick={() => setPage(p => p + 1)}
                className="w-full py-4 bg-white text-[#395886] font-bold rounded-xl hover:bg-gray-50 transition-colors border border-[#D5DEEF] shadow-sm"
              >
                Load More Stories
              </button>
            )}
          </div>

          {!slug && (
            <div className="w-full md:w-80 shrink-0 space-y-8">
              <Reveal delay={200}>
                <div className="bg-white p-6 rounded-xl border border-[#D5DEEF] shadow-sm sticky top-24">
                  <h3 className="font-bold text-[#395886] mb-6 flex items-center gap-2 text-lg"><Activity size={20}/> Trending Now</h3>
                  <div className="space-y-6">
                    {MOCK_DB.announcements.slice(0, 4).map((item, i) => (
                      <div key={i} className="flex gap-4 items-start group cursor-pointer">
                        <div className="text-3xl font-black text-gray-100 group-hover:text-[#638ECB] transition-colors">0{i+1}</div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-[#395886] leading-snug mb-1">{item.title}</h4>
                          <span className="text-xs text-gray-400">{item.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
         <Chatbot />
    </div>
  );
}