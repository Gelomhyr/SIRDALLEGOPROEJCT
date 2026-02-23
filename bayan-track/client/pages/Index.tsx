import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { QuickActions } from "@/components/QuickActions";
import { CommunityProfile } from "@/components/CommunityProfile";
import { GovernanceSection } from "@/components/GovernanceSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { LocationSection } from "@/components/LocationSection";
import { FacilitiesSection } from "@/components/FacilitiesSection";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";

export default function Index() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Header />
      <main>
        <Hero />
        <QuickActions />
        <CommunityProfile />
        <GovernanceSection />
        <ProjectsSection />
        <LocationSection />
        <FacilitiesSection />
        
        {/* Newsletter Section */}
        <section className="bg-slate-50 py-24 border-y border-gray-100">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <div className="inline-block p-3 rounded-2xl bg-blue-50 text-blue-600 mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 tracking-tight">Stay Updated</h2>
            <p className="text-gray-500 mb-10 max-w-2xl mx-auto text-lg font-medium">
              Subscribe to our newsletter to receive the latest news, announcements, and emergency alerts from Barangay Mambog II.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto bg-white p-2 rounded-2xl shadow-xl border border-gray-100">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-6 py-4 rounded-xl focus:outline-none font-medium text-slate-700"
              />
              <button className="bg-[#3b528a] text-white px-10 py-4 rounded-xl font-extrabold hover:bg-[#2e4170] transition-all shadow-lg active:scale-95">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
