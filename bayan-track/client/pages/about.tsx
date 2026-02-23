import React, { useState, useEffect } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";3


import { 
  Info, 
  TrendingUp, 
  Gavel, 
  Leaf, 
  Heart, 
  Shield, 
  
} from 'lucide-react';

export default function About() {
  // Simulating data state that would normally be fetched from your Express backend
  const [data, setData] = useState({
    snapshot: {
      region: "CALABARZON (Region IV-A)",
      city: "Bacoor city, Cavite",
      postalCode: "4102",
      coordinates: "14.4239°N, 120.9523°E",
      population: "~7,129 Residents",
      shareOfBacoor: "Approx. 1.07%",
      elevation: "~12.7 meters ASL",
      classification: "Urban / Residential"
    },
    trends: [
      { year: "1990", label: "1990 Census", value: "~2,500" },
      { year: "2010", label: "2010 Census", value: "~5,800" },
      { year: "2020", label: "2020 Census", value: "~7,129", highlight: true }
    ],
    governance: [
      { title: "Barangay Assembly", desc: "Biannual meetings for resident consultation." },
      { title: "Committees", desc: "Peace & Order, Health, Finance, Youth, Infrastructure." },
      { title: "Transparency", desc: "Full disclosure of budget and projects." }
    ],
    programs: [
      {
        id: 'environmental',
        title: "Environmental",
        desc: "Regular \"Tapat Ko, Linis Ko\" drives and strict waste segregation enforcement in coordination with CENRO.",
        icon: 'leaf',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      },
      {
        id: 'health',
        title: "Health & Social",
        desc: "Weekly medical missions, senior citizen wellness monitoring, and PWD assistance programs.",
        icon: 'heart',
        color: 'text-red-500',
        bgColor: 'bg-red-100'
      },
      {
        id: 'peace',
        title: "Peace & Order",
        desc: "24/7 Barangay Tanod patrols, CCTV monitoring of major streets, and Lupong Tagapamayapa dispute resolution.",
        icon: 'shield',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      }
    ]
  });

  // Example of how you would integrate with your Express Middleware API
  useEffect(() => {
    /* const fetchData = async () => {
      try {
        const response = await fetch('/api/barangay/mambog-ii');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch data from Express backend:", error);
      }
    };
    fetchData();
    */
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        
        {/* Dashboard Container */}
        <div className="rounded-2xl p-6 md:p-10 lg:p-12 font-sans text-[#2c3338] relative overflow-hidden shadow-sm">
          
          {/* Top Section */}
          <div className="flex flex-col lg:flex-row gap-10 mb-10 relative z-10">
            
            {/* Left: Snapshot */}
            <div className="flex-1 flex">
              {/* Decorative thick bracket/line */}
              <div className="w-2 bg-[#3f4b8c] rounded-full mr-6 py-2 shadow-sm shrink-0"></div>
              
              <div className="flex-1 pt-1">
                <h2 className="flex items-center gap-2 text-2xl font-semibold text-[#3f4b8c] mb-6">
                  <Info size={24} className="text-[#3f4b8c] stroke-[2.5]" />
                  Barangay Snapshot
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm md:text-base font-medium">
                  <div className="flex"><span className="w-32 font-bold shrink-0">Region</span><span>: {data.snapshot.region}</span></div>
                  <div className="flex"><span className="w-40 font-bold shrink-0">Population (2020)</span><span>: {data.snapshot.population}</span></div>
                  <div className="flex"><span className="w-32 font-bold shrink-0">City</span><span>: {data.snapshot.city}</span></div>
                  <div className="flex"><span className="w-40 font-bold shrink-0">Share of Bacoor</span><span>: {data.snapshot.shareOfBacoor}</span></div>
                  <div className="flex"><span className="w-32 font-bold shrink-0">Postal Code</span><span>: {data.snapshot.postalCode}</span></div>
                  <div className="flex"><span className="w-40 font-bold shrink-0">Elevation</span><span>: {data.snapshot.elevation}</span></div>
                  <div className="flex"><span className="w-32 font-bold shrink-0">Coordinates</span><span>: {data.snapshot.coordinates}</span></div>
                  <div className="flex"><span className="w-40 font-bold shrink-0">Classification</span><span>: {data.snapshot.classification}</span></div>
                </div>
              </div>
            </div>

            {/* Right: Info Cards */}
            <div className="w-full lg:w-96 flex flex-col gap-5">
              {/* Population Trend Card */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="flex items-center gap-2 text-[#3f4b8c] font-semibold mb-4 text-sm">
                  <TrendingUp size={18} className="stroke-[2.5]" /> Population Trend
                </h3>
                <div className="space-y-2 text-xs md:text-sm text-gray-600">
                  {data.trends.map((item, index) => (
                    <div 
                      key={index} 
                      className={`flex justify-between items-center px-2 py-1.5 ${item.highlight ? 'bg-blue-100/60 font-bold text-[#3f4b8c] rounded' : ''}`}
                    >
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[10px] text-gray-400 leading-tight">
                  *Reflects consistent urban migration and residential development.
                </p>
              </div>

              {/* Core Governance Card */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="flex items-center gap-2 text-[#3f4b8c] font-semibold mb-4 text-sm">
                  <Gavel size={18} className="stroke-[2.5]" /> Core Governance
                </h3>
                <ul className="space-y-3 text-xs md:text-sm text-gray-700">
                  {data.governance.map((item, index) => (
                    <li key={index} className="leading-snug">
                      <span className="font-bold text-gray-900">• {item.title}: </span>
                      {item.desc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Middle Text Section */}
          <div className="space-y-6 text-[15px] md:text-base text-gray-800 leading-relaxed mb-16 pr-0 lg:pr-[25%] relative z-10">
            <p>
              <strong>Mambog II</strong> is one of the 73 barangays comprising the City of Bacoor. Historically an agricultural area known for its "Mambog" trees, it has transformed into a vibrant urban community. As part of Bacoor's rapid urbanization since the 1990s, Mambog II serves as a key residential hub, hosting various subdivisions and providing essential services to thousands of Caviteños working in Metro Manila and local industries.
            </p>
            <p>
              <strong>Governance & Development:</strong> The barangay operates under the Local Government Code of 1991, managed by a Sangguniang Barangay headed by the Punong Barangay. We prioritize peace and order, health services, and infrastructure development to support our growing population.
            </p>
          </div>

          {/* Bottom Section: Community Programs */}
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-[#3f4b8c] text-center mb-8">
              Community Programs
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.programs.map((prog) => (
                <div key={prog.id} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-start transition-transform hover:-translate-y-1 duration-300 cursor-pointer">
                  <div className={`p-3 rounded-full mb-4 ${prog.bgColor} ${prog.color}`}>
                    {prog.icon === 'leaf' && <Leaf size={20} strokeWidth={2.5} />}
                    {prog.icon === 'heart' && <Heart size={20} strokeWidth={2.5} />}
                    {prog.icon === 'shield' && <Shield size={20} strokeWidth={2.5} />}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{prog.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {prog.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>




        </div>

      </main>
      <Footer />
      <Chatbot />

    </div>
  );
}