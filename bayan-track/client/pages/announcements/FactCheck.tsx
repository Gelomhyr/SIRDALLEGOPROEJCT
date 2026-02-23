import React, { useState } from 'react';
import { Shield, AlertCircle, Search, Upload, CheckCircle, ArrowRight } from 'lucide-react';
import { Chatbot } from "@/components/Chatbot";

// TODO: Uncomment these imports in your local environment based on your project structure:
 import { Header } from "@/components/Header";
 import { Footer } from "@/components/Footer";
// import { Reveal } from "@/components/Reveal"; 

// --- Mock components for Canvas preview environment to compile successfully ---

const Reveal = ({ children, delay }: any) => <div style={{ animationDelay: `${delay || 0}ms` }} className="animate-fade-in h-full">{children}</div>;

const MOCK_FACT_CHECKS = [
  { id: 101, status: 'FALSE', category: 'Public Safety', title: 'Evacuation order due to gas leak', claim: 'Residents of Purok 3 are ordered to evacuate immediately due to a massive chemical gas leak.', verdict: 'There is NO gas leak in Purok 3. The BFP Bacoor has verified that the smell was from a controlled burning of garbage which has been apprehended.', date: '2026-03-10' },
  { id: 104, status: 'TRUE', category: 'Health', title: 'Free Medical Mission Schedule', claim: 'There will be a free medical and dental mission at the Covered Court on Saturday.', verdict: 'CONFIRMED. The medical mission is a project of the City Health Office in coordination with the Barangay council. 8AM-12NN.', date: '2026-03-12' },
  { id: 102, status: 'MISLEADING', category: 'Disaster', title: '7.5 Magnitude Earthquake Prediction', claim: 'A 7.5 magnitude earthquake is predicted to hit Cavite tomorrow at exactly 2:56 PM.', verdict: 'PHIVOLCS has stated that earthquakes cannot be predicted with such precision. Always rely on official PHIVOLCS advisories for seismic updates.', date: '2026-03-08' },
  { id: 103, status: 'FALSE', category: 'Public Safety', title: 'Evacuation order due to gas leak', claim: 'Residents of Purok 3 are ordered to evacuate immediately due to a massive chemical gas leak.', verdict: 'There is NO gas leak in Purok 3. The BFP Bacoor has verified that the smell was from a controlled burning of garbage which has been apprehended.', date: '2026-03-10' },
  { id: 105, status: 'FALSE', category: 'Public Safety', title: 'Evacuation order due to gas leak', claim: 'Residents of Purok 2 are ordered to evacuate immediately due to a massive chemical gas leak.', verdict: 'There is NO gas leak in Purok 2. The BFP Bacoor has verified that the smell was from a controlled burning of garbage which has been apprehended.', date: '2026-03-10' },
  { id: 106, status: 'FALSE', category: 'Public Safety', title: 'Evacuation order due to gas leak', claim: 'Residents of Purok 3 are ordered to evacuate immediately due to a massive chemical gas leak.', verdict: 'There is NO gas leak in Purok 3. The BFP Bacoor has verified that the smell was from a controlled burning of garbage which has been apprehended.', date: '2026-03-10' },
];
// ---------------------------------------------------------------------------

export default function FactCheck() {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  
  // Form State
  const [claim, setClaim] = useState('');
  const [source, setSource] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filters = ['All', 'True', 'False', 'Misleading'];

  const filteredData = MOCK_FACT_CHECKS.filter(item => {
    const matchesFilter = filter === 'All' || item.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.claim.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claim.trim()) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const refNo = `Ref: BT-FC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setReferenceNumber(refNo);
      setIsSubmitting(false);
      setIsReportModalOpen(false);
      setIsSuccessModalOpen(true);
      
      // Reset form
      setClaim('');
      setSource('');
    }, 1200);
  };

  const getStatusColors = (status: string) => {
    switch(status) {
      case 'FALSE': return 'bg-[#ffe4e6] text-[#e11d48]'; // Red
      case 'TRUE': return 'bg-[#dcfce7] text-[#16a34a]';   // Green
      case 'MISLEADING': return 'bg-[#ffedd5] text-[#d97706]'; // Orange/Yellow
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#eff2f9]">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 md:px-6 py-10 max-w-7xl">
        <Reveal>
          {/* Hero Section */}
          <div className="bg-[#212b46] rounded-2xl p-10 md:p-14 text-center shadow-lg relative overflow-hidden mb-8">
            <div className="relative z-10 flex flex-col items-center">
              <Shield size={56} strokeWidth={1.5} className="text-[#eab308] mb-4" />
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                BayanTrack Fact Check
              </h1>
              <p className="text-[#94a3b8] text-base md:text-lg max-w-2xl mx-auto mb-8">
                Combatting misinformation in our community. We verify rumors so you stay informed with the truth.
              </p>
              <button 
                onClick={() => setIsReportModalOpen(true)}
                className="bg-[#9f1239] hover:bg-[#881337] text-white font-medium py-3 px-8 rounded-full flex items-center gap-2 transition-colors shadow-lg"
              >
                <AlertCircle size={20} />
                Report a Rumor
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-full shadow-sm p-2 flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
            <div className="flex items-center w-full md:w-1/2 px-4 py-2">
              <Search className="text-gray-400 mr-3" size={20} />
              <input 
                type="text" 
                placeholder="Search Claims..." 
                className="w-full outline-none text-gray-700 bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto px-2 pb-2 md:pb-0 no-scrollbar shrink-0">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                    filter === f 
                      ? 'bg-[#3b4b72] text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Fact Check Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item, idx) => (
            <Reveal key={idx} delay={idx * 50}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                
                {/* Header (Status, Category, Date) */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-wider ${getStatusColors(item.status)}`}>
                      {item.status}
                    </span>
                    <span className="text-[11px] font-bold text-[#638ECB] uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {item.date}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold text-gray-900 mb-4 leading-tight">
                  {item.title}
                </h2>

                {/* Claim Box (Light Purple) */}
                <div className="bg-[#f0f4ff] rounded-2xl p-5 mb-5 border border-[#e0e7ff] relative">
                  <p className="text-[#3b4b72] text-[14.5px] font-medium leading-relaxed italic">
                    "{item.claim}"
                  </p>
                </div>

                {/* Verdict */}
                <div className="text-[14px] text-gray-700 leading-relaxed flex-1 mb-6">
                  <span className="font-bold text-[#212b46]">Verdict: </span>
                  {item.verdict}
                </div>

                {/* Read More Link */}
                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-center">
                  <button className="text-[#638ECB] font-semibold text-sm flex items-center gap-1.5 hover:text-[#3b4b72] transition-colors">
                    Read Full Details <ArrowRight size={14} />
                  </button>
                </div>

              </div>
            </Reveal>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-sm">
            No fact checks found matching your criteria.
          </div>
        )}
      </main>

      <Footer />

      {/* ---------------- MODALS ---------------- */}

      {/* Report Misinformation Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e293b]/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-[420px] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-[#3b4b72] mb-6">Report Misinformation</h2>
              
              <form onSubmit={handleReportSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Rumor / Claim</label>
                  <textarea 
                    required
                    rows={4}
                    value={claim}
                    onChange={(e) => setClaim(e.target.value)}
                    placeholder="What did you hear or see?"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#638ECB] resize-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Where did you see this?</label>
                  <input 
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="Facebook, Group chat, etc.."
                    className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#638ECB] text-sm"
                  />
                </div>

                {/* Upload Box */}
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="text-gray-400 mb-2" size={28} />
                  <span className="text-sm text-gray-500 font-medium">Upload Screenshot (optional)</span>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="flex-1 bg-[#e2e8f0] hover:bg-[#cbd5e1] text-gray-700 font-bold py-3.5 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#9f1239] hover:bg-[#881337] text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e293b]/90 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-[400px] shadow-2xl overflow-hidden p-8 text-center flex flex-col items-center">
            
            <div className="w-20 h-20 bg-[#dcfce7] rounded-full flex items-center justify-center mb-6 text-[#16a34a]">
              <CheckCircle size={40} strokeWidth={2.5} />
            </div>
            
            <h2 className="text-2xl font-black text-[#3b4b72] mb-3">Report Received</h2>
            <p className="text-gray-600 text-[15px] leading-relaxed mb-8">
              Thank you for helping us fight misinformation. We will verify this claim shortly.
            </p>
            
            {/* Reference Number Box */}
            <div className="bg-[#e0e7ff] w-full rounded-xl p-5 mb-8">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">REFERENCE NUMBER</p>
              <p className="text-[#3b4b72] text-lg font-bold tracking-wide">{referenceNumber}</p>
            </div>
            
            <button 
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full bg-[#3b4b72] hover:bg-[#2d3a5c] text-white font-bold py-4 rounded-xl transition-colors text-lg shadow-md"
            >
              Close
            </button>
            
          </div>
        </div>
      )}
            <Chatbot />

    </div>
  );
}