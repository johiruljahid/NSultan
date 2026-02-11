
import React from 'react';
import { ChevronRight, CalendarDays, Crown, ShoppingBag } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onBooking: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExplore, onBooking }) => {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-32 pb-20 md:pt-48">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 items-center gap-12 lg:gap-24 z-10">
        
        {/* Left Content Column */}
        <div className="space-y-10 md:space-y-14 preserve-3d order-2 lg:order-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-amber-600/30 bg-amber-600/5 text-amber-500 text-[10px] md:text-xs font-black tracking-[0.6em] uppercase animate-pulse mx-auto lg:mx-0 shadow-[0_0_30px_rgba(217,119,6,0.1)]">
            <Crown size={14} className="animate-bounce" /> THE EMPIRE OF EXTRAORDINARY TASTE
          </div>
          
          <div className="relative">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[11.5rem] font-black leading-[0.8] text-white tracking-tighter drop-shadow-2xl mb-4">
              <span className="block text-3d transition-transform hover:scale-[1.02] cursor-default">N SULTAN</span>
              <span className="block italic text-amber-600 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-8xl mt-6 opacity-95 tracking-normal">
                Legendary <span className="text-white">Cravings</span>
              </span>
            </h1>
            <div className="absolute -top-16 -left-16 text-[10rem] md:text-[20rem] font-black text-white/[0.02] select-none -z-10 pointer-events-none hidden xl:block uppercase">
              Royal
            </div>
          </div>
          
          <div className="max-w-xl space-y-8 mx-auto lg:mx-0">
            <p className="text-2xl md:text-3xl text-gray-300 leading-relaxed font-light tracking-tight">
              Don't just eat; <span className="text-white font-black italic underline decoration-amber-600 decoration-4 underline-offset-8">surrender</span> to the Sultan's secret spices. A sensory explosion that defines <span className="text-amber-500 font-bold">Bangladeshi Excellence</span>.
            </p>
            <div className="space-y-6">
              <p className="font-bangla text-3xl md:text-6xl text-amber-600 font-black leading-tight drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-left duration-1000">
                জিভের ডগায় রাজকীয় উন্মাদনা, প্রতিটি লোকমায় আভিজাত্যের নেশা।
              </p>
              <p className="font-bangla text-xl md:text-3xl text-gray-400 font-medium italic leading-relaxed">
                সুলতানি স্বাদের সম্মোহনী মায়ায় আজই নিজেকে বিলিয়ে দিন, সেরা তৃপ্তির খোঁজে।
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-8 md:gap-10 pt-10 justify-center lg:justify-start">
            <button 
              onClick={onExplore}
              className="group relative flex items-center justify-center gap-6 bg-amber-600 text-black px-10 md:px-12 py-6 md:py-8 rounded-[30px] font-black text-lg md:text-xl transition-all hover:scale-105 hover:bg-amber-500 shadow-[0_30px_80px_rgba(217,119,6,0.4)] active:scale-95 overflow-hidden"
            >
              <ShoppingBag className="relative z-10" size={24} />
              <span className="relative z-10 font-bangla">হোম ডেলিভারির জন্য অর্ডার করুন</span>
              <ChevronRight className="relative z-10 group-hover:translate-x-2 transition-transform" size={24} />
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            
            <button 
              onClick={onBooking}
              className="flex items-center justify-center gap-6 text-white hover:text-amber-500 transition-all font-black group"
            >
              <span className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full border-2 border-white/10 group-hover:border-amber-600 group-hover:scale-110 transition-all shadow-[0_0_40px_rgba(255,255,255,0.05)] bg-white/5 backdrop-blur-md">
                <CalendarDays size={24} className="group-hover:text-amber-500" />
              </span>
              <span className="font-bangla text-xl tracking-wider">টেবিল অথবা পার্টি বুকিং</span>
            </button>
          </div>
        </div>

        {/* Right Image Column */}
        <div className="relative perspective-2000 order-1 lg:order-2 lg:mt-48 xl:mt-64">
          <div className="relative animate-3d-float preserve-3d">
            <div className="absolute inset-0 bg-amber-600/10 blur-[150px] rounded-full scale-125 pointer-events-none"></div>
            
            <div className="relative z-10 w-full max-w-[600px] mx-auto aspect-square rounded-[80px] md:rounded-[100px] overflow-hidden shadow-[0_80px_150px_rgba(0,0,0,0.9)] border border-white/5 group cursor-pointer transition-transform duration-1000 hover:rotate-y-12">
               <img 
                 src="https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1200&auto=format&fit=crop" 
                 alt="The Sultan Special"
                 className="w-full h-full object-cover transform scale-105 group-hover:scale-115 transition-transform duration-[3s]"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
               
               <div className="absolute bottom-10 left-10 right-10 md:bottom-16 md:left-16 md:right-16 flex justify-between items-end">
                  <div className="bg-black/90 backdrop-blur-3xl p-8 md:p-12 rounded-[40px] md:rounded-[50px] border border-white/5 transform translate-z-60 shadow-2xl">
                     <p className="text-amber-500 text-[10px] md:text-sm font-black tracking-[0.5em] uppercase mb-2">Signature Dish</p>
                     <h3 className="text-4xl md:text-6xl font-black text-white italic font-serif">Shahi Kacchi</h3>
                     <p className="font-bangla text-white/40 text-lg md:text-xl mt-2">সেরা বাসমতি ও কচি মাটনের মেলবন্ধন</p>
                  </div>
                  <div className="w-20 h-20 md:w-28 md:h-28 bg-amber-600 rounded-full flex flex-col items-center justify-center text-black font-black shadow-[0_20px_40px_rgba(217,119,6,0.4)] animate-bounce-slow">
                    <span className="text-2xl md:text-4xl">10%</span>
                    <span className="text-[8px] md:text-[10px] uppercase tracking-tighter">OFF NOW</span>
                  </div>
               </div>
            </div>
            
            <div className="absolute -top-10 -right-10 md:-top-16 md:-right-16 bg-white/5 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[40px] md:rounded-[50px] z-20 shadow-[0_40px_80px_rgba(0,0,0,0.5)] transform translate-z-100 rotate-12 pointer-events-none">
                <span className="text-5xl md:text-7xl block animate-pulse">🌶️</span>
                <p className="text-[10px] md:text-xs text-amber-500 font-black uppercase mt-6 tracking-[0.4em] text-center">Spice Level: Royal</p>
            </div>

            <div className="absolute -bottom-10 -left-10 text-white/5 text-8xl font-black italic -z-10 pointer-events-none">
               Seductive
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
