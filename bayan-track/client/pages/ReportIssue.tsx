import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { Chatbot } from "@/components/Chatbot";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api, authHeaders } from '@/lib/api';

export default function ReportIssue() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [submitProgress, setSubmitProgress] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    address: '',
    category: '',
    description: '',
  });

  const categories = [
    'Garbage / Sanitation',
    'Potholes / Road Damage',
    'Streetlight Defect',
    'Noise Complaint',
    'Suspicious Activity',
    'Stray Animal',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitProgress(20);

    try {
      const res = await api.post('/api/reports', formData, { headers: authHeaders() });
      setReferenceNumber(res.data.referenceNo);
      setIsSuccessModalOpen(true);
      setFormData({ fullName: '', contactNumber: '', address: '', category: '', description: '' });
    } catch (err: any) {
      alert(err.response?.data?.msg || 'Failed to submit report');
    } finally {
      setSubmitProgress(100);
      setTimeout(() => { setIsSubmitting(false); setSubmitProgress(0); }, 250);
    }
  };

  useEffect(() => {
    if (!isSubmitting) return undefined;
    const t = setInterval(() => setSubmitProgress((p) => (p >= 90 ? p : p + 12)), 220);
    return () => clearInterval(t);
  }, [isSubmitting]);

  return (
    <div className="flex min-h-screen flex-col bg-[#e8ecf4]">
      <Header />
      <Reveal>
        <main className="flex flex-grow items-center justify-center px-4 py-12 sm:px-6">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg md:p-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ffcccc] text-[#b91c1c]">
                <AlertTriangle size={32} strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Report An Issue</h1>
                <p className="text-sm text-gray-600">Reports are stored in MongoDB and reflected in admin/superadmin.</p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {isSubmitting && <div><p className="mb-1 text-xs text-gray-500">Submitting report... {submitProgress}%</p><div className="h-2 rounded bg-gray-200"><div className="h-2 rounded bg-[#a91e1e] transition-all" style={{ width: `${submitProgress}%` }} /></div></div>}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-900">Full Name</label>
                  <input required className="w-full rounded-md border border-gray-300 p-3" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-900">Contact Number</label>
                  <input required className="w-full rounded-md border border-gray-300 p-3" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-900">Complete Address / Purok</label>
                <input required className="w-full rounded-md border border-gray-300 p-3" name="address" value={formData.address} onChange={handleInputChange} />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-900">Issue Category</label>
                <select required className="w-full rounded-md border border-gray-300 p-3" name="category" value={formData.category} onChange={handleInputChange}>
                  <option value="" disabled>Select Category...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-gray-900">Description</label>
                <textarea required rows={4} className="w-full resize-none rounded-md border border-gray-300 p-3" name="description" value={formData.description} onChange={handleInputChange} />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-[#a91e1e] py-3.5 text-[15px] font-bold text-white disabled:opacity-70">
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </div>
        </main>
      </Reveal>

      <Footer />

      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1e293b]/90 p-4 backdrop-blur-sm">
          <div className="flex w-full max-w-[400px] flex-col items-center rounded-[24px] bg-white p-8 text-center shadow-2xl">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#dcfce7] text-[#16a34a]">
              <CheckCircle size={32} strokeWidth={2.5} />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-[#3b4b72]">Report Submitted</h2>
            <p className="mb-6 px-2 text-[14px] leading-relaxed text-gray-600">Your report is now saved and visible for admin/superadmin handling.</p>
            <div className="mb-6 w-full rounded-xl bg-[#e0e7ff] p-5">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-gray-500">REFERENCE NUMBER</p>
              <p className="text-xl font-bold tracking-wide text-[#3b4b72]">{referenceNumber}</p>
            </div>
            <button className="w-full rounded-xl bg-[#3b4b72] py-3.5 font-bold text-white" onClick={() => setIsSuccessModalOpen(false)} type="button">
              Close
            </button>
          </div>
        </div>
      )}

      <Chatbot />
    </div>
  );
}
