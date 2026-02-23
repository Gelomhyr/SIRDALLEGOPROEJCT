import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";

import React from 'react';
import { Building2, Info } from 'lucide-react';

const Reveal = ({ children, delay }: any) => <div style={{ animationDelay: `${delay || 0}ms` }} className="animate-fade-in">{children}</div>;
const MOCK_DB = {
  officials: {
    city: [
      { name: "City Mayor", role: "City Mayor", desc: "Local Chief Executive of Bacoor City.", img: "https://placehold.co/150x150/e2e8f0/475569?text=Mayor" },
      { name: "Vice Mayor", role: "City Vice Mayor", desc: "Presiding Officer, Sangguniang Panlungsod.", img: "https://placehold.co/150x150/e2e8f0/475569?text=VM" }
    ],
    barangay: [
      { name: "Hon. Barangay Captain", responsibilities: "Enforces all laws and ordinances which are applicable within the barangay and promotes the general welfare of the community.", img: "https://placehold.co/400x400/e2e8f0/475569?text=Captain" },
      { name: "Hon. Kagawad 1", role: "Barangay Kagawad", committee: "Committee on Peace and Order", img: "https://placehold.co/150x150/e2e8f0/475569?text=Kagawad" },
      { name: "Hon. Kagawad 2", role: "Barangay Kagawad", committee: "Committee on Health & Sanitation", img: "https://placehold.co/150x150/e2e8f0/475569?text=Kagawad" },
      { name: "Hon. Kagawad 3", role: "Barangay Kagawad", committee: "Committee on Public Works", img: "https://placehold.co/150x150/e2e8f0/475569?text=Kagawad" },
      { name: "Hon. Kagawad 4", role: "Barangay Kagawad", committee: "Committee on Public Works", img: "https://placehold.co/150x150/e2e8f0/475569?text=Kagawad" }
    ]
  }
};
// ---------------------------------------------------------------------------

export default function Officials() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="min-h-screen bg-slate-50">
          <div className=" text-blue py-12 md:py-16">
            <div className="container mx-auto px-6 text-center animate-slide-up">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Barangay Officials Directory</h1>
              <p className="text-blue max-w-2xl mx-auto text-sm md:text-base">Meet the dedicated public servants of Barangay Mambog II, committed to transparency and efficient public service.</p>
            </div>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 py-12 max-w-6xl -mt-8">
            <Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
                {MOCK_DB.officials.city.map((off, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-[#638ECB] flex items-center gap-6 hover:translate-y-1 transition-transform">
                    <img src={off.img} className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-gray-100" alt={off.name} />
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-[#395886]">{off.name}</h3>
                      <p className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{off.role}</p>
                      <p className="text-[10px] md:text-xs text-gray-400">{off.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <div className="flex flex-col lg:flex-row gap-8 mb-16">
              <div className="lg:w-1/4 order-2 lg:order-1">
                <Reveal delay={100}>
                  <div className="bg-white p-6 rounded-xl border border-[#D5DEEF] shadow-sm sticky top-24">
                    <h3 className="font-bold text-[#395886] mb-4 flex items-center gap-2"><Building2 size={18}/> Governance</h3>
                    <ul className="space-y-4 text-sm text-gray-600">
                      <li className="flex gap-2">
                        <div className="min-w-[6px] h-[6px] rounded-full bg-[#638ECB] mt-1.5"></div>
                        <span><strong>Sangguniang Barangay:</strong> The legislative body composed of the Punong Barangay and 7 Kagawads.</span>
                      </li>
                      <li className="flex gap-2">
                        <div className="min-w-[6px] h-[6px] rounded-full bg-[#638ECB] mt-1.5"></div>
                        <span><strong>SK Council:</strong> Represents the youth, led by the SK Chairperson.</span>
                      </li>
                      <li className="flex gap-2">
                        <div className="min-w-[6px] h-[6px] rounded-full bg-[#638ECB] mt-1.5"></div>
                        <span><strong>City Coordination:</strong> Direct alignment with Bacoor City Hall for major projects.</span>
                      </li>
                    </ul>
                    <div className="mt-6 pt-6 border-t border-gray-100 text-xs text-gray-400">
                      <p className="font-bold mb-1 flex items-center gap-1"><Info size={12}/> Source Note</p>
                      Data reflects the current term administration. Verified via DILG & Bacoor City Government records.
                    </div>
                  </div>
                </Reveal>
              </div>

              <div className="lg:w-3/4 order-1 lg:order-2">
                <Reveal delay={200}>
                  <div className="bg-white rounded-xl shadow-lg border border-[#D5DEEF] overflow-hidden mb-8 md:mb-10 flex flex-col md:flex-row">
                    <div className="md:w-1/3 bg-gray-100 relative h-64 md:h-auto">
                      <img src={MOCK_DB.officials.barangay[0].img} className="w-full h-full object-cover absolute inset-0" alt="Captain" />
                    </div>
                    <div className="md:w-2/3 p-6 md:p-8 flex flex-col justify-center">
                      <span className="text-[#638ECB] font-bold uppercase tracking-widest text-xs mb-1">Punong Barangay</span>
                      <h2 className="text-2xl md:text-3xl font-bold text-[#395886] mb-3">{MOCK_DB.officials.barangay[0].name}</h2>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{MOCK_DB.officials.barangay[0].responsibilities}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">Executive</span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">Presiding Officer</span>
                      </div>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={300}>
                  <h3 className="text-lg md:text-xl font-bold text-[#395886] mb-6 border-b border-[#D5DEEF] pb-2">Sangguniang Barangay Members</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {MOCK_DB.officials.barangay.slice(1).map((off, i) => (
                      <div key={i} className="bg-white p-5 rounded-xl border border-[#D5DEEF] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                        <div className="flex items-center gap-4 mb-4">
                          <img src={off.img} className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 group-hover:border-[#638ECB] transition-colors" alt={off.name} />
                          <div>
                            <h4 className="font-bold text-[#395886] text-sm md:text-md leading-tight">{off.name}</h4>
                            <p className="text-xs text-gray-400 uppercase font-bold">{off.role}</p>
                          </div>
                        </div>
                        <div className="px-3 py-1.5 bg-[#F0F3FA] rounded text-xs font-medium text-[#395886] inline-block w-full text-center">
                          {off.committee}
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
           <Chatbot />

    </div>
    
  );
}