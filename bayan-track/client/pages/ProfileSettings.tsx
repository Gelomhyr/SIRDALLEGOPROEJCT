import React, { useState, useEffect } from 'react';
import { User, Info, History } from 'lucide-react';
import { Chatbot } from "@/components/Chatbot";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Reveal } from "@/components/Reveal";

// --- Mock components for Canvas preview environment to compile successfully ---

// ---------------------------------------------------------------------------

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [localActivity, setLocalActivity] = useState<any[]>([]);
  
  // Form State initialized with placeholder data matching the screenshot
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    address: '',
    preferredMethod: 'SMS / Text'
  });

  // Simulate loading from local storage on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/auth/user', {
          headers: { 'x-auth-token': token }
        });
        
        // Combine names for display
        const user = res.data;
        const fullName = `${user.firstName} ${user.middleName ? user.middleName + ' ' : ''}${user.lastName}`;
        
        setFormData(prev => ({
          ...prev,
          fullName: fullName,
          email: user.email,
          contactNumber: user.contactNumber,
          address: user.address
        }));
      } catch (err) {
        console.error("Failed to fetch profile", err);
        // If token is invalid, redirect to login
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
        }
      }
    };

    fetchUser();
    
    // Check for any saved local activities (like submitted reports or forms)
    const activities = JSON.parse(localStorage.getItem('bayantrack_contact_messages') || '[]');
    setLocalActivity(activities);
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    
    // Split full name back into parts for the database
    const nameParts = formData.fullName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    // Middle name is everything in between
    const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';

    try {
      await axios.put('http://localhost:5000/api/auth/user', {
        firstName,
        middleName,
        lastName,
        email: formData.email,
        contactNumber: formData.contactNumber,
        address: formData.address
      }, {
        headers: { 'x-auth-token': token }
      });

      // Show success toast
      setShowToast(true);
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      alert("Failed to update profile: " + (err.response?.data?.msg || "Server Error"));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f5f9] relative">
      <Header />

      {/* Success Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-4 md:right-8 z-50 animate-fade-in">
          <div className="bg-[#e6fce5] border border-[#22c55e] text-[#166534] px-5 py-3 rounded-md shadow-md text-sm">
            <span className="font-bold">Success!</span> Profile updated successfully.
          </div>
        </div>
      )}
        <Reveal>
      <main className="flex-grow flex items-start justify-center py-10 px-4 sm:px-6">
      
        {/* Main Card */}
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-sm border border-gray-200 p-6 md:p-10">
          
          {/* Section 1: Profile Settings */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-[#395886] flex items-center gap-2 mb-4">
              <User size={22} strokeWidth={2.5} /> Profile Settings
            </h1>

            {/* Info Banner */}
            <div className="bg-[#f4f7fb] border border-[#e2e8f0] rounded-md p-4 flex gap-3 mb-8 items-start">
              <Info className="text-gray-500 shrink-0 mt-0.5" size={16} />
              <p className="text-[13px] text-gray-600 leading-relaxed">
                Your information is stored locally on this device for demo purposes. It will be used to auto-fill forms. Do not enter sensitive IDs.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#395886] text-sm text-gray-700"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-800">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#395886] text-sm text-gray-700"
                  />
                </div>

                {/* Contact Number */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-800">Contact Number</label>
                  <input 
                    type="text" 
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#395886] text-sm text-gray-700"
                  />
                </div>
              </div>

              {/* Address / Purok */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">Address / Purok</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#395886] text-sm text-gray-700"
                />
              </div>

              {/* Preferred Contact Method */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">Preferred Contact Method</label>
                <select 
                  name="preferredMethod"
                  value={formData.preferredMethod}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#395886] text-sm text-gray-700 bg-white"
                >
                  <option value="SMS / Text">SMS / Text</option>
                  <option value="Email">Email</option>
                  <option value="Phone Call">Phone Call</option>
                </select>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full bg-[#395886] hover:bg-[#2c456b] text-white font-bold py-3 rounded-md transition-colors text-sm shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <hr className="my-8 border-gray-200" />

          {/* Section 2: Local Activity */}
          <div>
            <h2 className="text-[17px] font-bold text-[#395886] flex items-center gap-2 mb-2">
              <History size={18} strokeWidth={2.5} /> My Local Activity
            </h2>
            <p className="text-[13px] text-gray-600 mb-4">
              Recent tracking numbers saved on this browser.
            </p>

            {localActivity.length === 0 ? (
              <div className="bg-[#f9fafb] border border-gray-100 rounded-md p-6 text-center">
                <p className="text-[13px] text-gray-400 italic">
                  No recent submissions found in local history.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {localActivity.map((activity, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-md p-4 flex justify-between items-center hover:shadow-sm transition-shadow">
                    <div>
                      <p className="text-sm font-bold text-gray-800">{activity.referenceNo}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.department || 'Form Submission'}</p>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
       
      </main>
       </Reveal>
 <Chatbot />
      <Footer />
    </div>
  );
}