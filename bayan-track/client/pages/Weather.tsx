import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Chatbot } from "@/components/Chatbot";

import React from 'react';
import { 
  CloudRain, 
  MapPin, 
  Droplet, 
  Wind, 
  Sun, 
  Thermometer, 
  AlertTriangle,
  Cloud,
  CloudLightning
} from 'lucide-react';


const MOCK_DB = {
  weather: {
    current: {
      temp: "32°C",
      condition: "Partly Cloudy",
      heatIndex: "38°C",
      humidity: "65%",
      wind: "12 km/h NE",
      uv: "High (6)",
      sunrise: "5:45 AM",
      sunset: "6:15 PM"
    },
    hourly: [
      { time: "Now", icon: Sun, temp: "32°C" },
      { time: "1 PM", icon: Sun, temp: "33°C" },
      { time: "2 PM", icon: Cloud, temp: "33°C" },
      { time: "3 PM", icon: CloudRain, temp: "31°C" },
      { time: "4 PM", icon: CloudLightning, temp: "29°C" },
      { time: "5 PM", icon: CloudRain, temp: "28°C" },
      { time: "6 PM", icon: Cloud, temp: "28°C" }
    ],
    forecast: [
      { day: "Today", icon: CloudRain, temp: "33° / 26°" },
      { day: "Tomorrow", icon: CloudLightning, temp: "32° / 25°" },
      { day: "Wed", icon: Sun, temp: "34° / 26°" },
      { day: "Thu", icon: Sun, temp: "35° / 27°" },
      { day: "Fri", icon: Cloud, temp: "33° / 26°" },
      { day: "Sat", icon: CloudRain, temp: "31° / 25°" },
      { day: "Sun", icon: Sun, temp: "33° / 26°" }
    ]
  }
};
// ---------------------------------------------------------------------------

export default function Weather() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      
      <main className="flex-grow">
        <div className="min-h-screen bg-slate-50">
          <div className="bg-gradient-to-br from-blue-600 to-blue-400 text-white p-8 pb-32 relative overflow-hidden">
            <CloudRain size={200} className="absolute -right-20 -top-20 opacity-20"/>
            <div className="container mx-auto px-6 relative z-10 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
                <div>
                  <div className="flex items-center gap-2 mb-2 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold">
                    <MapPin size={12}/> Mambog II, Bacoor, Cavite
                  </div>
                  <h1 className="text-6xl font-bold mb-2 tracking-tighter">{MOCK_DB.weather.current.temp}</h1>
                  <p className="text-2xl font-medium opacity-90">{MOCK_DB.weather.current.condition}</p>
                  <p className="text-sm text-blue-100 mt-2">Feels like {MOCK_DB.weather.current.heatIndex}</p>
                </div>
                <div className="text-right mt-8 md:mt-0 space-y-1">
                   <div className="text-sm font-bold opacity-80">Last Updated: Just Now</div>
                   <div className="text-xs opacity-60">Source: PAGASA DOST</div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-6 -mt-24 relative z-20">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Droplet, label: 'Humidity', value: MOCK_DB.weather.current.humidity },
                { icon: Wind, label: 'Wind', value: MOCK_DB.weather.current.wind },
                { icon: Sun, label: 'UV Index', value: MOCK_DB.weather.current.uv },
                { icon: Thermometer, label: 'Heat Index', value: MOCK_DB.weather.current.heatIndex },
              ].map((m, i) => (
                <Reveal>
                  <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
                     <div className="bg-blue-50 text-blue-600 p-2 rounded-full"><m.icon size={20}/></div>
                     <div>
                       <div className="text-xs text-gray-500 uppercase font-bold">{m.label}</div>
                       <div className="font-bold text-gray-800">{m.value}</div>
                     </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal >
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h3 className="font-bold text-gray-700 mb-6 border-b pb-2">Hourly Forecast</h3>
                <div className="flex overflow-x-auto pb-4 gap-8 no-scrollbar">
                  {MOCK_DB.weather.hourly.map((h, i) => (
                    <div key={i} className="text-center min-w-[60px] flex-shrink-0">
                      <p className="text-sm text-gray-500 mb-2">{h.time}</p>
                      <h.icon className="mx-auto text-[#638ECB] mb-2" size={24}/>
                      <p className="font-bold text-gray-800">{h.temp}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
               <Reveal>
                 <div className="bg-white rounded-2xl shadow-sm p-6">
                   <h3 className="font-bold text-gray-800 mb-4">7-Day Forecast</h3>
                   <div className="space-y-4">
                     {MOCK_DB.weather.forecast.map((d, i) => (
                       <div key={i} className="flex justify-between items-center text-sm">
                         <span className="text-gray-500 w-20">{d.day}</span>
                         <d.icon size={18} className="text-gray-400"/>
                         <span className="font-bold text-gray-800">{d.temp}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               </Reveal>

               <div className="md:col-span-2 space-y-6">
                  <Reveal>
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-xl">
                       <h3 className="font-bold text-orange-800 flex items-center gap-2 mb-2"><AlertTriangle size={18}/> Weather Safety Tips</h3>
                       <ul className="list-disc pl-5 space-y-2 text-sm text-orange-900">
                         <li>Stay hydrated and avoid prolonged sun exposure between 10AM - 3PM.</li>
                         <li>Keep umbrellas or rain gear handy due to possible afternoon showers.</li>
                         <li>Monitor official PAGASA updates for sudden weather changes.</li>
                       </ul>
                    </div>
                  </Reveal>
                  
                  <Reveal>
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                      <h3 className="font-bold text-[#395886] mb-4">Sun & Moon</h3>
                      <div className="flex justify-between items-center">
                         <div className="flex items-center gap-3">
                           <Sun className="text-orange-400" size={32}/>
                           <div>
                             <div className="text-xs text-gray-500 uppercase">Sunrise</div>
                             <div className="font-bold">{MOCK_DB.weather.current.sunrise}</div>
                           </div>
                         </div>
                         <div className="flex items-center gap-3">
                           <div className="bg-slate-800 rounded-full p-1"><div className="w-6 h-6 bg-slate-200 rounded-full"></div></div>
                           <div>
                             <div className="text-xs text-gray-500 uppercase">Sunset</div>
                             <div className="font-bold">{MOCK_DB.weather.current.sunset}</div>
                           </div>
                         </div>
                      </div>
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