import React, { useState } from 'react';
import { AlertTriangle, Upload, CheckCircle } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { Chatbot } from "@/components/Chatbot";


// TODO: Uncomment these imports in your local environment based on your project structure:
 import { Header } from "@/components/Header";
 import { Footer } from "@/components/Footer";

// --- Mock components for Canvas preview environment to compile successfully ---


export default function ReportIssue() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    address: '',
    category: '',
    description: ''
  });

  const categories = [
    'Garbage / Sanitation',
    'Potholes / Road Damage',
    'Streetlight Defect',
    'Noise Complaint',
    'Suspicious Activity',
    'Stray Animal'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const refNo = `BT-RPT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setReferenceNumber(refNo);
      setIsSubmitting(false);
      setIsSuccessModalOpen(true);
      
      // Reset form
      setFormData({
        fullName: '',
        contactNumber: '',
        address: '',
        category: '',
        description: ''
      });
    }, 1500);
  };

  return (
   
    <div className="flex flex-col min-h-screen bg-[#e8ecf4]">
      <Header />
       <Reveal>
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6">
        
        {/* Main Form Card */}
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 md:p-10">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-[#ffcccc] text-[#b91c1c] rounded-full flex items-center justify-center shrink-0">
              <AlertTriangle size={32} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">Report An Issue</h1>
              <p className="text-sm text-gray-600">Your report helps keep Mambog II safe and clean.</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-900">Full Name</label>
                <input 
                  required
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#395886] transition-shadow"
                />
              </div>

              {/* Contact Number */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-900">Contact Number</label>
                <input 
                  required
                  type="text" 
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#395886] transition-shadow"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-900">Complete Address / Purok</label>
              <input 
                required
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#395886] transition-shadow"
              />
            </div>

            {/* Issue Category */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-900">Issue Category</label>
              <select 
                required
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#395886] transition-shadow text-gray-700 bg-white"
              >
                <option value="" disabled>Select Category...</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-900">Description</label>
              <textarea 
                required
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the issue in details..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#395886] transition-shadow resize-none"
              ></textarea>
            </div>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
              <Upload className="text-gray-400 mb-2" size={32} />
              <p className="text-sm font-bold text-gray-600">Upload Photo Evidence (Required)</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG (Max 5MB)</p>
            </div>

            <p className="text-[11px] text-gray-500 text-center">
              Do not upload sensitive personal IDs here. For emergencies, call 911.
            </p>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#a91e1e] hover:bg-[#8b1818] text-white font-bold py-3.5 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-[15px]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>

          </form>
        </div>
        

      </main>
</Reveal>
      <Footer />

      {/* Confirmation Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e293b]/90 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-[400px] shadow-2xl p-8 text-center flex flex-col items-center">
            
            <div className="w-16 h-16 bg-[#dcfce7] rounded-full flex items-center justify-center mb-6 text-[#16a34a]">
              <CheckCircle size={32} strokeWidth={2.5} />
            </div>
            
            <h2 className="text-2xl font-bold text-[#3b4b72] mb-3">Report Submitted</h2>
            <p className="text-gray-600 text-[14px] leading-relaxed mb-6 px-2">
              Your report has been recorded. Please keep this reference number for tracking.
            </p>
            
            {/* Reference Number Box */}
            <div className="bg-[#e0e7ff] w-full rounded-xl p-5 mb-6">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">REFERENCE NUMBER</p>
              <p className="text-[#3b4b72] text-xl font-bold tracking-wide">{referenceNumber}</p>
            </div>
            
            <button 
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full bg-[#3b4b72] hover:bg-[#2d3a5c] text-white font-bold py-3.5 rounded-xl transition-colors shadow-md"
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