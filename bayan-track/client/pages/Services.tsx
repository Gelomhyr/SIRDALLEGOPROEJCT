import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";

import React, { useState } from 'react';
import { CheckCircle, Clock, FileText, ArrowRight } from 'lucide-react';


const Reveal = ({ children, delay }: any) => <div style={{ animationDelay: `${delay || 0}ms` }} className="animate-fade-in">{children}</div>;
const FadeIn = ({ children }: any) => <div className="animate-fade-in">{children}</div>;
const MOCK_DB = {
  services: [
    { id: 1, title: 'Barangay Clearance', desc: 'Official document certifying good moral character and residency.', usage: 'Employment, Bank Accounts', requirements: ['Valid ID', 'Recent Cedula'], time: '15 Mins', icon: FileText },
    { id: 2, title: 'Certificate of Indigency', desc: 'Certification of financial status for assistance programs.', usage: 'Medical Assistance, Scholarships', requirements: ['Valid ID', 'Purok Leader Endorsement'], time: '15 Mins', icon: FileText },
    { id: 3, title: 'Business Clearance', desc: 'Clearance required for operating a business within the barangay.', usage: 'Mayor\'s Permit, Business Renewal', requirements: ['DTI/SEC Registration', 'Contract of Lease'], time: '30 Mins', icon: FileText }
  ]
};
// ---------------------------------------------------------------------------

export default function Services() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const activeService = MOCK_DB.services.find(s => s.id === activeId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setSuccess(`BT-SVC-2026-${Math.floor(Math.random()*10000)}`);
    }, 1500);
  };

  // Helper function to render the correct view state while keeping Header/Footer intact
  const renderContent = () => {
    if (success) {
      return (
        <div className="container mx-auto px-6 py-20 text-center animate-fade-in">
           <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border-t-4 border-green-500">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600"><CheckCircle size={32} /></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Submitted!</h2>
            <p className="text-gray-500 mb-4">Please save your reference number for tracking.</p>
            <div className="bg-gray-100 p-4 rounded-lg font-mono text-xl font-bold text-[#395886] tracking-widest mb-6">{success}</div>
            <div className="text-sm text-gray-500 mb-6 bg-blue-50 p-4 rounded text-left">
              <strong>Next Steps:</strong>
              <ul className="list-decimal pl-4 mt-2 space-y-1 text-xs">
                <li>Wait for SMS confirmation (within 24 hours).</li>
                <li>Prepare your requirements.</li>
                <li>Visit Barangay Hall with your ID and payment.</li>
              </ul>
            </div>
            <button onClick={() => { setSuccess(null); setActiveId(null); }} className="text-[#395886] font-bold hover:underline">New Request</button>
          </div>
        </div>
      );
    }

    if (activeService) {
      return (
        <div className="container mx-auto px-6 py-12 animate-fade-in bg-slate-50 min-h-screen">
          <button onClick={() => setActiveId(null)} className="text-gray-400 hover:text-[#395886] mb-6 flex items-center gap-2 text-sm font-bold">← Back to Services</button>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-[#D5DEEF]">
              <h1 className="text-2xl font-bold text-[#395886] mb-2">{activeService.title} Request</h1>
              <p className="text-gray-500 mb-6 text-sm">{activeService.desc}</p>
              <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm text-blue-800 border border-blue-100">
                <strong>Note:</strong> This certificate is commonly used for: {activeService.usage}.
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input required type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#638ECB] outline-none"/>
                <input required type="text" placeholder="Address in Mambog II" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#638ECB] outline-none"/>
                <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#638ECB] outline-none text-gray-700">
                  <option value="">Purpose of Request...</option>
                  <option value="employment">Employment</option>
                  <option value="school">School Requirement</option>
                  <option value="business">Business Requirement</option>
                  <option value="other">Other</option>
                </select>
                <button type="submit" className="w-full bg-[#395886] text-white font-bold py-3 rounded-lg hover:bg-[#2c456b] transition-colors mt-4">Submit Request</button>
              </form>
            </div>
            <div className="w-full lg:w-80 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-[#D5DEEF] shadow-sm">
                <h3 className="font-bold text-[#395886] mb-4">Requirements Checklist</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  {activeService.requirements.map((r, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <CheckCircle size={16} className="text-[#638ECB] shrink-0 mt-0.5"/> 
                      <span className="leading-snug">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl border border-[#D5DEEF] shadow-sm">
                <h3 className="font-bold text-gray-700 mb-2">Processing Time</h3>
                <p className="text-2xl font-bold text-[#395886]">{activeService.time}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-6 py-12">
        <FadeIn>
          <div className="bg-[#395886] text-white p-10 rounded-2xl mb-12 flex flex-col md:flex-row items-center gap-8 shadow-lg">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">Online Services Portal</h1>
              <p className="text-blue-100 text-lg mb-6 max-w-2xl">Skip the line! Request your certificates online. Ensure your profile information matches your valid IDs.</p>
              <div className="grid grid-cols-2 gap-4 max-w-lg">
                 <div className="flex items-center gap-2 text-sm bg-white/10 p-2 rounded font-medium"><CheckCircle size={16}/> Valid ID Required</div>
                 <div className="flex items-center gap-2 text-sm bg-white/10 p-2 rounded font-medium"><CheckCircle size={16}/> Correct Address</div>
                 <div className="flex items-center gap-2 text-sm bg-white/10 p-2 rounded font-medium"><CheckCircle size={16}/> Privacy Protected</div>
                 <div className="flex items-center gap-2 text-sm bg-white/10 p-2 rounded font-medium"><CheckCircle size={16}/> Trackable Requests</div>
              </div>
            </div>
            <div className="flex flex-col gap-4 text-sm font-bold bg-white/5 p-6 rounded-xl border border-white/10 min-w-[250px]">
              <div className="flex items-center gap-3">
                <Clock size={24} className="text-[#638ECB]"/> 
                <div>
                  <div className="uppercase text-xs text-blue-200">Office Hours</div>
                  <div>Mon - Fri, 8AM - 5PM</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText size={24} className="text-[#638ECB]"/> 
                <div>
                  <div className="uppercase text-xs text-blue-200">Application</div>
                  <div>No Cut-off Time</div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_DB.services.map((s, idx) => (
            <Reveal key={s.id} delay={idx * 50}>
              <div onClick={() => setActiveId(s.id)} className="bg-white p-6 rounded-xl border border-[#D5DEEF] hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1 h-full flex flex-col">
                <div className="w-14 h-14 bg-[#F0F3FA] rounded-full flex items-center justify-center text-[#395886] mb-6 group-hover:bg-[#395886] group-hover:text-white transition-colors">
                  <s.icon size={28} />
                </div>
                <h3 className="font-bold text-xl text-[#395886] mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-1">{s.desc}</p>
                
                <div className="bg-gray-50 p-3 rounded-lg mb-4 text-xs space-y-1">
                   <div className="font-bold text-gray-700">Commonly used for:</div>
                   <div className="text-gray-600">{s.usage}</div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs font-bold text-gray-400">
                   <span className="flex items-center gap-1"><Clock size={12}/> {s.time}</span>
                   <span className="text-[#638ECB] flex items-center gap-1 group-hover:gap-2 transition-all">Start Request <ArrowRight size={14}/></span>
                </div>
              </div>
            </Reveal>
          ))}
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