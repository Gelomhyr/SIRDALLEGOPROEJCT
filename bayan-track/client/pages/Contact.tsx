import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Send, CheckCircle } from 'lucide-react';

import { Chatbot } from "@/components/Chatbot";


// TODO: Uncomment these imports in your local environment based on your project structure:
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
// import { Reveal } from "@/components/Reveal"; 

// --- Mock components for Canvas preview environment to compile successfully ---


const Reveal = ({ children, delay }: any) => <div style={{ animationDelay: `${delay || 0}ms` }} className="animate-fade-in">{children}</div>;

// Simple inline mock for SuccessModal since it wasn't provided in the snippet
const SuccessModal = ({ title, body, referenceNo, onClose }: any) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center relative">
       <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
         <CheckCircle size={32} />
       </div>
       <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
       <p className="text-gray-500 mb-4 text-sm">{body}</p>
       <div className="bg-gray-100 p-4 rounded-lg font-mono text-lg font-bold text-[#395886] tracking-widest mb-6">
         {referenceNo}
       </div>
       <button onClick={onClose} className="w-full bg-[#395886] text-white font-bold py-3 rounded-lg hover:bg-[#2c456b] transition-colors">
         Close
       </button>
    </div>
  </div>
);
// ---------------------------------------------------------------------------

export default function Contact() {
  const [form, setForm] = useState({ name: '', contact: '', department: 'General Inquiry', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<string | null>(null);

  // Auto-fill logic
  useEffect(() => {
    const savedProfile = localStorage.getItem('bayantrack_profile');
    if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setForm(prev => ({
            ...prev,
            name: profile.fullName || '',
            contact: profile.contactNumber || profile.email || ''
        }));
    }
  }, []);

  const validate = () => {
    let tempErrors: Record<string, string> = {};
    if (!form.name) tempErrors.name = "Name is required.";
    if (!form.message) tempErrors.message = "Message is required.";
    // Simple check: require either contact or email (assuming contact field acts as either)
    if (!form.contact) tempErrors.contact = "Contact info (email or phone) is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const refNo = `BT-MSG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Mock Storage
      const newMessage = { ...form, referenceNo: refNo, timestamp: new Date().toISOString() };
      const existingMessages = JSON.parse(localStorage.getItem('bayantrack_contact_messages') || '[]');
      localStorage.setItem('bayantrack_contact_messages', JSON.stringify([...existingMessages, newMessage]));

      setLoading(false);
      setSuccessData(refNo);
      setForm({ name: '', contact: '', department: 'General Inquiry', message: '' });
      setErrors({});
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-6 py-12 relative">
          {successData && (
            <SuccessModal 
              title="Message Sent"
              body="Thank you! Your message has been received by Barangay Mambog II."
              referenceNo={successData}
              onClose={() => setSuccessData(null)}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <Reveal>
                <div>
                  <h1 className="text-3xl font-bold text-[#395886] mb-4">Contact Us</h1>
                  <p className="text-gray-500 text-lg">We are here to serve you. Reach out via phone, email, or visit our barangay hall.</p>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Reveal delay={100}>
                  <div className="bg-[#F0F3FA] p-6 rounded-xl border border-[#D5DEEF] hover:border-[#638ECB] transition-colors">
                    <Clock className="text-[#395886] mb-4" size={32}/>
                    <h3 className="font-bold text-gray-800 text-lg mb-2">Office Hours</h3>
                    <p className="text-sm text-gray-600 mb-1">Monday - Friday</p>
                    <p className="font-bold text-[#395886]">8:00 AM - 5:00 PM</p>
                    <p className="text-xs text-gray-500 mt-2 italic">Best time to visit: 9:00 AM - 11:00 AM</p>
                  </div>
                </Reveal>
                <Reveal delay={200}>
                  <div className="bg-[#F0F3FA] p-6 rounded-xl border border-[#D5DEEF] hover:border-[#638ECB] transition-colors">
                    <MapPin className="text-[#395886] mb-4" size={32}/>
                    <h3 className="font-bold text-gray-800 text-lg mb-2">Location</h3>
                    <p className="text-sm text-gray-600">Barangay Mambog II Hall</p>
                    <p className="text-sm text-gray-600">Bacoor City, Cavite 4102</p>
                    <p className="text-xs text-gray-500 mt-2 italic">Near Mambog Elementary School</p>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={300}>
                 <h2 className="text-2xl font-bold text-[#395886] mb-6">Department Directory</h2>
                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                   <table className="w-full text-left text-sm">
                     <thead className="bg-gray-50 border-b">
                       <tr>
                         <th className="p-4 font-bold text-gray-600">Department</th>
                         <th className="p-4 font-bold text-gray-600">Contact Person (Placeholder)</th>
                         <th className="p-4 font-bold text-gray-600">Local No.</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y">
                       <tr><td className="p-4">Office of the Captain</td><td className="p-4">Ms. Admin Staff</td><td className="p-4">101</td></tr>
                       <tr><td className="p-4">Barangay Secretary</td><td className="p-4">Sec. Aquino</td><td className="p-4">102</td></tr>
                       <tr><td className="p-4">Health Center</td><td className="p-4">Dr. Health Officer</td><td className="p-4">103</td></tr>
                       <tr><td className="p-4">Senior Citizen Desk</td><td className="p-4">Head OSCA</td><td className="p-4">104</td></tr>
                       <tr><td className="p-4">Disaster / DRRM</td><td className="p-4">Officer on Duty</td><td className="p-4">105</td></tr>
                     </tbody>
                   </table>
                 </div>
              </Reveal>
            </div>

            <div className="lg:col-span-1">
              <Reveal delay={400}>
                <div className="bg-white p-8 rounded-xl shadow-lg border border-[#D5DEEF] sticky top-24">
                  <h2 className="text-xl font-bold text-[#395886] mb-6">Send us a Message</h2>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">Your Name</label>
                      <input 
                        type="text" 
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#638ECB]'}`}
                        placeholder="Full Name"
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                      />
                      {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">Email / Phone</label>
                      <input 
                        type="text" 
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.contact ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#638ECB]'}`}
                        placeholder="Contact Info"
                        value={form.contact}
                        onChange={(e) => setForm({...form, contact: e.target.value})}
                      />
                      {errors.contact && <p className="text-red-500 text-xs">{errors.contact}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">Department</label>
                      <select 
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#638ECB] outline-none text-gray-700"
                        value={form.department}
                        onChange={(e) => setForm({...form, department: e.target.value})}
                      >
                         <option>General Inquiry</option>
                         <option>Complaint</option>
                         <option>Health</option>
                         <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">Message</label>
                      <textarea 
                        rows={4} 
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.message ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#638ECB]'}`}
                        placeholder="How can we help?"
                        value={form.message}
                        onChange={(e) => setForm({...form, message: e.target.value})}
                      ></textarea>
                      {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className={`w-full bg-[#395886] text-white font-bold py-3 rounded-lg hover:bg-[#2c456b] transition-colors flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Sending...' : <><Send size={18}/> Send Message</>}
                    </button>
                  </form>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </main>

      <Footer />
            <Chatbot />
    </div>
  );
}