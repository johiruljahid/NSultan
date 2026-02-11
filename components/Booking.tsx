
import React, { useState } from 'react';
import { Calendar, Users, Clock, Send, Crown, Sparkles, CheckCircle2, Home, MapPin, Star, Timer, ChevronDown, X, Sun, Moon, Coffee, Utensils } from 'lucide-react';

interface BookingProps {
  onSubmitBooking?: (data: { name: string; phone: string; guests: string; date: string; time: string; type: 'table' | 'party' }) => void;
  onNavigateToMenu?: () => void;
}

const GUEST_OPTIONS = [
  { value: '2', label: '2 Royal Guests', color: 'from-amber-400 to-amber-600', icon: '👑', desc: 'Perfect for couples' },
  { value: '4', label: '4 Royal Guests', color: 'from-orange-400 to-orange-600', icon: '🍷', desc: 'Family dining' },
  { value: '6', label: '6 Royal Guests', color: 'from-red-400 to-red-600', icon: '🥘', desc: 'Grand feast' },
  { value: '8', label: '8 Royal Guests', color: 'from-rose-500 to-rose-700', icon: '🕯️', desc: 'Royal banquet' },
  { value: '12', label: 'Elite Banquet (12)', color: 'from-purple-500 to-amber-600', icon: '🏛️', desc: 'Exclusive event' },
  { value: '20+', label: 'Grand Festival (20+)', color: 'from-red-600 via-amber-500 to-red-600', icon: '🔥', desc: 'Sultanate celebration' },
];

const TIME_SLOTS = [
  { value: '12:00 PM', label: 'Lunch Royal', icon: <Coffee size={20} />, color: 'from-cyan-500 to-blue-600' },
  { value: '02:00 PM', label: 'Mid-Day Feast', icon: <Sun size={20} />, color: 'from-amber-400 to-orange-500' },
  { value: '07:00 PM', label: 'Sultanate Dinner', icon: <Sparkles size={20} />, color: 'from-purple-600 to-indigo-700' },
  { value: '09:00 PM', label: 'Late Night Glory', icon: <Moon size={20} />, color: 'from-blue-800 to-black' },
];

const getUpcomingDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    dates.push({
      full: d.toISOString().split('T')[0],
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
    });
  }
  return dates;
};

const Booking: React.FC<BookingProps> = ({ onSubmitBooking, onNavigateToMenu }) => {
  const [submitted, setSubmitted] = useState(false);
  const [activePicker, setActivePicker] = useState<'guests' | 'date' | 'time' | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guests: '2',
    date: getUpcomingDates()[0].full,
    time: '07:00 PM',
    type: 'table' as 'table' | 'party'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (onSubmitBooking) {
      onSubmitBooking(formData);
    }
  };

  const selectedGuest = GUEST_OPTIONS.find(opt => opt.value === formData.guests);
  const UPCOMING_DATES = getUpcomingDates();
  const selectedDateObj = UPCOMING_DATES.find(d => d.full === formData.date) || UPCOMING_DATES[0];

  const closePickers = () => setActivePicker(null);

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
        <div className="relative max-w-2xl w-full glass-panel p-12 md:p-20 rounded-[60px] border-amber-600/30 shadow-[0_50px_100px_rgba(217,119,6,0.2)] text-center preserve-3d">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-600 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(217,119,6,0.6)] animate-bounce-slow border-4 border-black">
             <CheckCircle2 size={60} className="text-black" />
          </div>
          <div className="space-y-10 mt-8">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase">
              ROYAL <span className="text-amber-600 italic">GATEWAY</span> OPENED
            </h2>
            <div className="space-y-6">
              <p className="font-bangla text-3xl md:text-5xl text-amber-500 font-black leading-tight">
                আপনার রাজকীয় আসনটি নিশ্চিত করা হয়েছে! 
              </p>
              <p className="font-bangla text-xl md:text-2xl text-gray-400 font-medium italic leading-relaxed">
                ঐতিহ্যের স্বাদ আর রাজকীয় আপ্যায়নের অপেক্ষায় থাকুন। আমাদের প্রতিনিধি শীঘ্রই যোগাযোগ করবেন।
              </p>
            </div>
            <div className="flex flex-col gap-6 pt-10">
              <button 
                onClick={onNavigateToMenu} 
                className="w-full bg-white text-black px-12 py-6 rounded-3xl font-black text-xl hover:bg-amber-600 transition-all active:scale-95 flex items-center justify-center gap-4 group shadow-2xl"
              >
                <Utensils size={24} className="group-hover:scale-110 transition-transform" /> 
                <span className="font-bangla">আমাদের ফুড মেনু দেখুন</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-48 pb-40 container mx-auto px-6 animate-in fade-in duration-1000">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-12">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full border border-amber-600/30 bg-amber-600/5 text-amber-500 text-xs font-black tracking-[0.5em] uppercase">
             <Crown size={16} className="animate-pulse" /> Imperial Reservation System
          </div>
          <h2 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.85]">
            SELECT YOUR <br />
            <span className="text-amber-600 italic">LEGACY</span>
          </h2>
          <div className="space-y-8">
             <p className="text-2xl text-gray-300 font-light leading-relaxed">
               Every detail of your visit is a masterpiece in progress. Select your date and time with royal precision.
             </p>
             <div className="space-y-6">
                <p className="font-bangla text-4xl md:text-6xl text-amber-600 font-black leading-tight drop-shadow-xl">
                   আপনার মাহেন্দ্রক্ষণ বুক করুন আজই।
                </p>
             </div>
          </div>
        </div>

        <div className="relative perspective-2000">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-amber-600/5 blur-[150px] -z-10 rounded-full"></div>
           
           <div className="glass-panel p-10 md:p-16 rounded-[60px] border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] preserve-3d">
              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="flex p-2 bg-white/5 rounded-[30px] border border-white/5 mb-4">
                    <button type="button" onClick={() => setFormData({...formData, type: 'table'})} className={`flex-1 py-5 rounded-[25px] font-black text-xs md:text-sm uppercase tracking-widest transition-all ${formData.type === 'table' ? 'bg-amber-600 text-black shadow-2xl scale-105' : 'text-gray-500 hover:text-white'}`}>Book a Table</button>
                    <button type="button" onClick={() => setFormData({...formData, type: 'party'})} className={`flex-1 py-5 rounded-[25px] font-black text-xs md:text-sm uppercase tracking-widest transition-all ${formData.type === 'party' ? 'bg-amber-600 text-black shadow-2xl scale-105' : 'text-gray-500 hover:text-white'}`}>Plan a Party</button>
                 </div>

                 <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] ml-6 flex items-center gap-2">
                             <Star size={10} fill="currentColor" /> Full Name
                           </label>
                           <input required type="text" placeholder="Name" className="w-full bg-white/5 border border-white/10 rounded-[30px] px-10 py-5 text-white text-lg focus:outline-none focus:border-amber-600" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] ml-6 flex items-center gap-2">
                             <MapPin size={10} fill="currentColor" /> Phone
                           </label>
                           <input required type="tel" placeholder="Phone" className="w-full bg-white/5 border border-white/10 rounded-[30px] px-10 py-5 text-white text-lg focus:outline-none focus:border-amber-600" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Improved Visibility Royal Date Picker */}
                        <div className="space-y-2 relative z-[80]">
                           <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] ml-6 flex items-center gap-2">
                              <Calendar size={10} fill="currentColor" /> Royal Date
                           </label>
                           <button type="button" onClick={() => setActivePicker(activePicker === 'date' ? null : 'date')} className="w-full bg-white/10 border border-white/20 rounded-[30px] px-10 py-5 flex items-center justify-between text-white text-lg hover:border-amber-600 transition-all group">
                             <div className="flex items-center gap-4">
                               <Calendar size={20} className="text-amber-500" />
                               <span className="font-bold">{selectedDateObj.month} {selectedDateObj.date}, {selectedDateObj.day}</span>
                             </div>
                             <ChevronDown className={`text-amber-500 transition-transform ${activePicker === 'date' ? 'rotate-180' : ''}`} size={20} />
                           </button>

                           {activePicker === 'date' && (
                             <div className="absolute top-full left-0 right-0 mt-4 z-[100] bg-[#0c0c0c] ring-2 ring-amber-600/50 rounded-[40px] p-8 shadow-[0_60px_120px_rgba(0,0,0,1)] animate-in fade-in zoom-in duration-300">
                               <div className="flex items-center justify-between mb-6 px-2">
                                  <h4 className="text-[12px] font-black text-amber-500 uppercase tracking-widest">Select Imperial Date</h4>
                                  <button onClick={closePickers} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} className="text-gray-400" /></button>
                               </div>
                               <div className="grid grid-cols-4 gap-4">
                                  {UPCOMING_DATES.map((d) => (
                                    <button
                                      key={d.full}
                                      type="button"
                                      onClick={() => { setFormData({...formData, date: d.full}); closePickers(); }}
                                      className={`flex flex-col items-center justify-center p-5 rounded-[25px] transition-all duration-300 border-2 ${formData.date === d.full ? 'bg-amber-600 border-amber-400 text-black shadow-[0_15px_30px_rgba(217,119,6,0.4)] scale-110 z-10' : 'bg-white/5 border-transparent text-gray-200 hover:bg-white/10 hover:text-white'}`}
                                    >
                                       <span className="text-[10px] font-black uppercase mb-1">{d.day}</span>
                                       <span className="text-2xl font-black">{d.date}</span>
                                       <span className="text-[10px] font-bold uppercase opacity-60">{d.month}</span>
                                    </button>
                                  ))}
                               </div>
                             </div>
                           )}
                        </div>

                        {/* Improved Visibility Royal Time Picker */}
                        <div className="space-y-2 relative z-[80]">
                           <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] ml-6 flex items-center gap-2">
                              <Clock size={10} fill="currentColor" /> Arrival Time
                           </label>
                           <button type="button" onClick={() => setActivePicker(activePicker === 'time' ? null : 'time')} className="w-full bg-white/10 border border-white/20 rounded-[30px] px-10 py-5 flex items-center justify-between text-white text-lg hover:border-amber-600 transition-all group">
                             <div className="flex items-center gap-4">
                               <Clock size={20} className="text-amber-500" />
                               <span className="font-bold">{formData.time}</span>
                             </div>
                             <ChevronDown className={`text-amber-500 transition-transform ${activePicker === 'time' ? 'rotate-180' : ''}`} size={20} />
                           </button>

                           {activePicker === 'time' && (
                             <div className="absolute top-full left-0 right-0 mt-4 z-[100] bg-[#0c0c0c] ring-2 ring-amber-600/50 rounded-[40px] p-8 shadow-[0_60px_120px_rgba(0,0,0,1)] animate-in fade-in zoom-in duration-300">
                               <div className="flex items-center justify-between mb-6 px-2">
                                  <h4 className="text-[12px] font-black text-amber-500 uppercase tracking-widest">Select Feasting Slot</h4>
                                  <button onClick={closePickers} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} className="text-gray-400" /></button>
                               </div>
                               <div className="grid grid-cols-1 gap-3">
                                  {TIME_SLOTS.map((slot) => (
                                    <button
                                      key={slot.value}
                                      type="button"
                                      onClick={() => { setFormData({...formData, time: slot.value}); closePickers(); }}
                                      className={`flex items-center justify-between p-5 rounded-[25px] transition-all duration-300 border-2 ${formData.time === slot.value ? 'bg-white/20 border-amber-600 text-white' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-white'}`}
                                    >
                                       <div className="flex items-center gap-4">
                                          <div className={`p-3 rounded-xl bg-gradient-to-br ${slot.color} text-white shadow-lg`}>{slot.icon}</div>
                                          <div className="text-left">
                                             <p className="text-sm font-black uppercase tracking-tight">{slot.label}</p>
                                             <p className="text-[11px] text-amber-500 font-black">{slot.value}</p>
                                          </div>
                                       </div>
                                       {formData.time === slot.value && <div className="w-3 h-3 rounded-full bg-amber-600 animate-pulse shadow-[0_0_10px_#d97706]"></div>}
                                    </button>
                                  ))}
                               </div>
                             </div>
                           )}
                        </div>
                    </div>

                    <div className="space-y-4 relative z-[60]">
                       <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] ml-6 flex items-center gap-2">
                          <Users size={10} fill="currentColor" /> Number of Guests
                       </label>
                       <div className="relative">
                          <button type="button" onClick={() => setActivePicker(activePicker === 'guests' ? null : 'guests')} className="w-full bg-white/10 border border-white/20 rounded-[30px] px-10 py-6 flex items-center justify-between text-white text-lg hover:border-amber-600 transition-all group">
                             <div className="flex items-center gap-6">
                                <span className="text-3xl group-hover:scale-125 transition-transform">{selectedGuest?.icon || '👑'}</span>
                                <div className="text-left">
                                   <span className="block font-black uppercase tracking-widest text-sm">{selectedGuest?.label || 'Select Guests'}</span>
                                   <span className="text-[10px] text-gray-500 font-bangla">{selectedGuest?.desc || 'রাজকীয় নির্বাচন করুন'}</span>
                                </div>
                             </div>
                             <ChevronDown className={`text-amber-500 transition-transform ${activePicker === 'guests' ? 'rotate-180' : ''}`} size={24} />
                          </button>

                          {activePicker === 'guests' && (
                            <div className="absolute top-full left-0 right-0 mt-6 z-[100] bg-[#0c0c0c] ring-2 ring-amber-600/50 rounded-[50px] p-8 shadow-[0_60px_120px_rgba(0,0,0,1)] animate-in fade-in zoom-in duration-300">
                               <div className="flex items-center justify-between mb-6 px-4">
                                  <h4 className="text-xs font-black text-amber-500 uppercase tracking-[0.5em]">Select Guest Count</h4>
                                  <button onClick={closePickers} className="p-2 hover:bg-white/10 rounded-full"><X size={20} className="text-gray-400" /></button>
                               </div>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                  {GUEST_OPTIONS.map((opt) => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => { setFormData({...formData, guests: opt.value}); closePickers(); }}
                                      className={`relative group h-24 rounded-[30px] overflow-hidden transition-all duration-500 border-2 ${formData.guests === opt.value ? 'bg-white/20 border-amber-600 shadow-[0_15px_30px_rgba(0,0,0,0.5)]' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                                    >
                                       <div className={`absolute inset-0 bg-gradient-to-br ${opt.color} opacity-10 group-hover:opacity-30 transition-opacity`}></div>
                                       <div className="relative z-10 h-full flex items-center px-6 gap-5">
                                          <div className="w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">{opt.icon}</div>
                                          <div className="text-left">
                                             <p className={`text-sm font-black uppercase tracking-wider ${formData.guests === opt.value ? 'text-amber-500' : 'text-white'}`}>{opt.label}</p>
                                             <p className="text-[10px] text-gray-500 font-bangla mt-0.5">{opt.desc}</p>
                                          </div>
                                       </div>
                                    </button>
                                  ))}
                               </div>
                            </div>
                          )}
                       </div>
                    </div>
                 </div>

                 <button type="submit" className="relative z-10 w-full group bg-amber-600 hover:bg-amber-500 text-black py-8 rounded-[35px] font-black text-2xl uppercase tracking-[0.2em] transition-all shadow-[0_30px_60px_rgba(217,119,6,0.4)] active:scale-95 flex items-center justify-center gap-4 mt-4 overflow-hidden">
                    <span className="relative z-10 flex items-center gap-4">CONFIRM ROYAL BOOKING <Send size={24} className="group-hover:translate-x-2 transition-transform" /></span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                 </button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
