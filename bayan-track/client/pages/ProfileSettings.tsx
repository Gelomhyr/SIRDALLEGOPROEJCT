import { useState, useEffect } from 'react';
import { User, Info, Clock } from 'lucide-react';
import { Chatbot } from "@/components/Chatbot";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { api, authHeaders } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { Reveal } from "@/components/Reveal";

type Activity = {
  _id: string;
  title: string;
  type: string;
  referenceNo?: string;
  createdAt: string;
};

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    address: '',
    preferredMethod: 'SMS / Text',
    avatarImage: '',
  });

  const fetchProfile = async () => {
    try {
      const [userRes, activityRes] = await Promise.all([
        api.get('/api/auth/user', { headers: authHeaders() }),
        api.get('/api/admin/activity/me', { headers: authHeaders() }),
      ]);

      const user = userRes.data;
      const fullName = `${user.firstName} ${user.middleName ? `${user.middleName} ` : ''}${user.lastName}`;

      setFormData((prev) => ({
        ...prev,
        fullName,
        email: user.email,
        contactNumber: user.contactNumber,
        address: user.address,
        avatarImage: user.avatarImage || '',
      }));

      setActivities(activityRes.data || []);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveProgress(20);

    const nameParts = formData.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';

    try {
      await api.put(
        '/api/auth/user',
        {
          firstName,
          middleName,
          lastName,
          email: formData.email,
          contactNumber: formData.contactNumber,
          address: formData.address,
          avatarImage: formData.avatarImage,
        },
        { headers: authHeaders() },
      );

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      await fetchProfile();
    } catch (err: any) {
      alert(err.response?.data?.msg || 'Failed to update profile');
    } finally {
      setSaveProgress(100);
      setTimeout(() => { setSaving(false); setSaveProgress(0); }, 280);
    }
  };

  useEffect(() => {
    if (!saving) return;
    const t = setInterval(() => setSaveProgress((p) => (p >= 90 ? p : p + 10)), 220);
    return () => clearInterval(t);
  }, [saving]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      alert('Profile image must be 2MB or below.');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, avatarImage: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-[#f1f5f9]">
      <Header />

      {showToast && (
        <div className="fixed right-4 top-24 z-50 animate-fade-in md:right-8">
          <div className="rounded-md border border-[#22c55e] bg-[#e6fce5] px-5 py-3 text-sm text-[#166534] shadow-md">
            <span className="font-bold">Success!</span> Profile updated successfully.
          </div>
        </div>
      )}

      <Reveal>
        <main className="flex flex-grow items-start justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-10">
            <div className="mb-6">
              <h1 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#395886]">
                <User size={22} strokeWidth={2.5} /> Profile Settings
              </h1>

              <div className="mb-8 flex items-start gap-3 rounded-md border border-[#e2e8f0] bg-[#f4f7fb] p-4">
                <Info className="mt-0.5 shrink-0 text-gray-500" size={16} />
                <p className="text-[13px] leading-relaxed text-gray-600">
                  Your profile and activity are linked to your account in MongoDB.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {saving && (
                  <div>
                    <p className="mb-1 text-xs text-gray-500">Saving changes... {saveProgress}%</p>
                    <div className="h-2 rounded bg-gray-200"><div className="h-2 rounded bg-[#395886] transition-all" style={{ width: `${saveProgress}%` }} /></div>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-800">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <img
                      src={formData.avatarImage || "https://placehold.co/100x100/e2e8f0/475569?text=User"}
                      alt="Profile"
                      className="h-16 w-16 rounded-full border border-gray-200 object-cover"
                    />
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="text-xs" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-800">Full Name</label>
                  <input className="w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-700" name="fullName" value={formData.fullName} onChange={handleInputChange} />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-800">Email Address</label>
                    <input className="w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-700" name="email" value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-800">Contact Number</label>
                    <input className="w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-700" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-800">Address / Purok</label>
                  <input className="w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-700" name="address" value={formData.address} onChange={handleInputChange} />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-800">Preferred Contact Method</label>
                  <select className="w-full rounded-md border border-gray-300 bg-white p-2.5 text-sm text-gray-700" name="preferredMethod" value={formData.preferredMethod} onChange={handleInputChange}>
                    <option value="SMS / Text">SMS / Text</option>
                    <option value="Email">Email</option>
                    <option value="Phone Call">Phone Call</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button disabled={saving} className="w-full rounded-md bg-[#395886] py-3 text-sm font-bold text-white shadow-sm disabled:opacity-60" type="submit">
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>

            <hr className="my-8 border-gray-200" />

            <div className="rounded-[24px] border border-gray-100 bg-white p-8 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[20px] font-bold text-[#1e3a8a]">
                  <Clock size={24} /> My Activity
                </div>
                <div className="rounded-full bg-blue-50 px-3 py-1 text-[12px] font-semibold text-[#1e3a8a]">Recent</div>
              </div>

              <div className="mb-4 w-full border-b border-gray-100" />

              {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-gray-200 p-12 text-gray-400">
                  <Clock className="mb-4 opacity-20" size={48} />
                  <p className="text-[14px] italic">No recent account activity found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={activity._id} className="flex items-center justify-between rounded-[16px] border border-gray-200 bg-gray-50 p-4">
                      <div>
                        <p className="text-sm font-bold text-[#1e3a8a]">{activity.referenceNo || activity.type}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{activity.title}</p>
                      </div>
                      <span className="rounded border border-gray-100 bg-white px-2 py-1 text-[11px] font-medium text-slate-400">
                        {new Date(activity.createdAt).toLocaleDateString()}
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
