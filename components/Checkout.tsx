
import React, { useState, useRef } from 'react';
import { CreditCard, MapPin, Phone, User, Send, ChevronLeft, Crown, CheckCircle2, Download, ShoppingBag, Trash2, Home, Sparkles, ArrowRight, Utensils } from 'lucide-react';
import { CartItem } from '../types';
import html2canvas from 'html2canvas';

interface CheckoutProps {
  items: CartItem[];
  onBack: () => void;
  onOrderSuccess: () => void;
  onNavigateToMenu: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, onBack, onOrderSuccess, onNavigateToMenu }) => {
  const [step, setStep] = useState<'billing' | 'payment' | 'success'>('billing');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    trxId: ''
  });
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 50;
  const grandTotal = total + deliveryFee;

  const downloadInvoice = async () => {
    if (invoiceRef.current) {
      // Ensure images are loaded before capture
      const images = invoiceRef.current.getElementsByTagName('img');
      // Fix: Cast the element to HTMLImageElement to resolve TS errors on complete, onload, and onerror
      const promises = Array.from(images).map((img) => {
        const image = img as HTMLImageElement;
        if (image.complete) return Promise.resolve();
        return new Promise((resolve) => {
          image.onload = resolve;
          image.onerror = resolve;
        });
      });
      
      await Promise.all(promises);

      const canvas = await html2canvas(invoiceRef.current, {
        backgroundColor: '#050505',
        scale: 3, // Higher scale for ultra-sharp 3D look
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `NSultan_Royal_Invoice_${Date.now()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 1.0);
      link.click();
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
    onOrderSuccess();
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500">
        <div className="absolute inset-0 bg-glow opacity-20 pointer-events-none"></div>
        
        <div className="relative max-w-2xl w-full glass-panel p-8 md:p-16 rounded-[50px] border-amber-600/40 shadow-[0_0_150px_rgba(217,119,6,0.2)] text-center animate-in zoom-in duration-500 overflow-hidden">
           {/* Decorative corner */}
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-600/10 rounded-full blur-3xl"></div>
           
           <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-700 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(217,119,6,0.6)] mb-8 animate-bounce-slow">
                 <CheckCircle2 size={48} className="text-black" />
              </div>

              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-6">
                ORDER <span className="text-amber-600 italic">PLACED!</span>
              </h2>
              
              <div className="space-y-6 mb-12">
                 <p className="font-bangla text-2xl md:text-3xl text-gray-100 font-bold leading-tight">
                   অভিনন্দন! আপনার রাজকীয় ভোজের প্রস্তুতি শুরু হয়েছে।
                 </p>
                 <p className="font-bangla text-lg text-amber-500/90 italic leading-relaxed">
                   "আপনার প্রতিটি পছন্দের কদর করতে আমরা প্রতিশ্রুতিবদ্ধ। সুলতানি স্বাদের এই মায়াজালে আপনাকে পুনরায় আমন্ত্রণ।"
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                 <button 
                   onClick={downloadInvoice}
                   className="flex items-center justify-center gap-3 bg-white hover:bg-amber-600 text-black px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 group"
                 >
                   <Download size={20} className="group-hover:-translate-y-1 transition-transform" />
                   GET ROYAL INVOICE
                 </button>
                 <button 
                   onClick={onNavigateToMenu}
                   className="flex items-center justify-center gap-3 bg-amber-600/10 border border-amber-600/30 text-amber-500 hover:bg-amber-600 hover:text-black px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 group"
                 >
                   <Utensils size={20} className="group-hover:rotate-12 transition-transform" />
                   MORE ORDERS
                 </button>
              </div>
           </div>
        </div>

        {/* --- LUXURY 3D INVOICE TEMPLATE (Hidden from UI, used for capture) --- */}
        <div className="fixed left-[-9999px]">
          <div ref={invoiceRef} className="w-[1000px] p-24 bg-[#050505] text-white overflow-hidden relative" style={{ fontFamily: 'Playfair Display, serif' }}>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[150px]"></div>
            
            {/* Header Section */}
            <div className="flex justify-between items-end border-b-4 border-amber-600/20 pb-16 relative z-10">
               <div className="space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="bg-amber-600 p-4 rounded-2xl rotate-12">
                        <Utensils className="text-black" size={40} />
                     </div>
                     <h1 className="text-8xl font-black tracking-tighter text-white">N SULTAN RESTAURANT</h1>
                  </div>
                  <p className="text-2xl uppercase tracking-[0.8em] text-amber-600/60 font-sans">Imperial Gastronomy</p>
               </div>
               <div className="text-right space-y-2">
                  <h3 className="text-4xl font-black text-amber-500 uppercase tracking-widest">OFFICIAL INVOICE</h3>
                  <p className="text-xl text-gray-500 font-sans">No: #NS-{Math.floor(Math.random()*900000 + 100000)}</p>
                  <p className="text-xl text-gray-500 font-sans">Date: {new Date().toLocaleDateString('en-GB')}</p>
               </div>
            </div>

            {/* Client Info Section */}
            <div className="py-20 grid grid-cols-2 gap-24 relative z-10">
               <div className="space-y-6">
                  <h4 className="text-amber-500 font-black uppercase tracking-[0.4em] text-lg font-sans">The Royal Guest</h4>
                  <div className="space-y-2">
                    <p className="text-5xl font-bold tracking-tight">{formData.name}</p>
                    <p className="text-2xl text-gray-400 font-sans">{formData.phone}</p>
                    <p className="text-2xl text-gray-400 font-sans leading-relaxed max-w-md">{formData.address}</p>
                  </div>
               </div>
               <div className="space-y-6 text-right">
                  <h4 className="text-amber-500 font-black uppercase tracking-[0.4em] text-lg font-sans">Payment Verification</h4>
                  <div className="glass-panel p-8 rounded-3xl border-green-500/30 inline-block bg-green-500/5">
                    <p className="text-3xl font-black text-green-500 uppercase tracking-tighter mb-2">bKash Transaction Verified</p>
                    <p className="text-xl text-gray-400 font-mono">TrxID: {formData.trxId}</p>
                  </div>
               </div>
            </div>

            {/* Items Section with Images */}
            <div className="relative z-10">
               <div className="grid grid-cols-12 gap-8 border-b-2 border-white/10 pb-6 mb-8 text-amber-600 font-black uppercase tracking-widest text-lg font-sans">
                  <div className="col-span-7">Imperial Selection</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-3 text-right">Royal Amount</div>
               </div>
               
               <div className="space-y-10">
                  {items.map(item => (
                    <div key={item.id} className="grid grid-cols-12 gap-8 items-center group">
                       <div className="col-span-7 flex items-center gap-8">
                          <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/5 shrink-0">
                             <img src={item.image} className="w-full h-full object-cover" crossOrigin="anonymous" alt="" />
                          </div>
                          <div>
                             <p className="text-4xl font-black text-white leading-none mb-2">{item.nameEn}</p>
                             <p className="text-2xl text-gray-500 font-bangla">{item.nameBn}</p>
                          </div>
                       </div>
                       <div className="col-span-2 text-center text-4xl font-black text-gray-300">x{item.quantity}</div>
                       <div className="col-span-3 text-right text-4xl font-black text-white">৳{item.price * item.quantity}</div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Total Section */}
            <div className="mt-20 pt-16 border-t-4 border-amber-600/20 relative z-10">
               <div className="max-w-md ml-auto space-y-6">
                  <div className="flex justify-between text-2xl text-gray-500 font-sans uppercase tracking-widest">
                     <span>Subtotal</span>
                     <span>৳{total}</span>
                  </div>
                  <div className="flex justify-between text-2xl text-gray-500 font-sans uppercase tracking-widest">
                     <span>Royal Delivery Charge</span>
                     <span>৳{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between items-end pt-10 border-t border-white/10">
                     <div className="text-left">
                        <p className="text-amber-600 font-black uppercase tracking-[0.4em] text-sm font-sans mb-1">Grand Total</p>
                        <p className="text-2xl text-gray-400 font-sans">Payable Amount</p>
                     </div>
                     <span className="text-8xl font-black text-amber-500 tracking-tighter">৳{grandTotal}</span>
                  </div>
               </div>
            </div>

            {/* Footer Seal */}
            <div className="mt-32 flex justify-between items-center relative z-10 opacity-60">
               <div className="space-y-2">
                  <p className="text-xl font-bold uppercase tracking-widest">N Sultan Restaurant</p>
                  <p className="text-lg text-gray-500 font-sans">Habiganj Sadar, Bangladesh, 3300</p>
               </div>
               <div className="text-center">
                  <div className="w-32 h-32 border-4 border-amber-600/30 rounded-full flex items-center justify-center p-4">
                     <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">The Sultanate Certified</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-2xl font-bangla italic text-amber-600">"আভিজাত্যের প্রতিটি কামড়ে আমাদের ভালোবাসা"</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-48 pb-40 container mx-auto px-6 animate-in fade-in duration-1000">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
         
         {/* Left Side: Forms */}
         <div className="flex-1 space-y-12">
            <button 
              onClick={onBack}
              className="group flex items-center gap-4 text-amber-600 font-black uppercase tracking-widest text-xs hover:text-white transition-colors"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-2 transition-transform" /> BACK TO CART
            </button>

            <div className="space-y-6">
               <div className="flex items-center gap-4 px-6 py-2 bg-amber-600/5 border border-amber-600/30 rounded-full w-fit">
                  <Crown size={14} className="text-amber-500" />
                  <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.6em]">Secure Imperial Checkout</span>
               </div>
               <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
                 ORDER <br /> <span className="text-amber-600 italic">DETAILS</span>
               </h2>
            </div>

            {step === 'billing' ? (
              <div className="glass-panel p-10 md:p-16 rounded-[60px] border-white/10 shadow-2xl preserve-3d space-y-10">
                 <h3 className="text-3xl font-black text-white flex items-center gap-4">
                    <MapPin className="text-amber-600" /> Delivery Information
                 </h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] ml-6">Full Name</label>
                       <input 
                         required
                         type="text" 
                         placeholder="Enter Name"
                         className="w-full bg-white/5 border border-white/10 rounded-[30px] px-10 py-6 text-white text-lg focus:border-amber-600 transition-all outline-none"
                         value={formData.name}
                         onChange={e => setFormData({...formData, name: e.target.value})}
                       />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] ml-6">Phone Number</label>
                       <input 
                         required
                         type="tel" 
                         placeholder="017..."
                         className="w-full bg-white/5 border border-white/10 rounded-[30px] px-10 py-6 text-white text-lg focus:border-amber-600 transition-all outline-none"
                         value={formData.phone}
                         onChange={e => setFormData({...formData, phone: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] ml-6">Detailed Address</label>
                    <textarea 
                      required
                      placeholder="Floor, House, Area..."
                      className="w-full bg-white/5 border border-white/10 rounded-[30px] px-10 py-6 text-white text-lg focus:border-amber-600 transition-all outline-none min-h-[150px] resize-none"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                 </div>

                 <button 
                   disabled={!formData.name || !formData.phone || !formData.address}
                   onClick={() => setStep('payment')}
                   className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-black py-8 rounded-[35px] font-black text-2xl uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4"
                 >
                   CONTINUE TO PAYMENT <ArrowRight size={24} />
                 </button>
              </div>
            ) : (
              <div className="glass-panel p-10 md:p-16 rounded-[60px] border-white/10 shadow-2xl preserve-3d space-y-12">
                 <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-black text-white flex items-center gap-4">
                       <CreditCard className="text-amber-600" /> Payment Method
                    </h3>
                    <div className="bg-amber-600/10 px-4 py-2 rounded-full text-amber-500 text-[10px] font-black uppercase tracking-widest">
                       bKash Preferred
                    </div>
                 </div>

                 <div className="bg-zinc-900/50 p-10 rounded-[40px] border border-white/5 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-pink-600/10 blur-[60px]"></div>
                    <div className="flex items-center gap-8">
                       <div className="w-24 h-24 bg-pink-600 rounded-3xl flex items-center justify-center shadow-xl">
                          <img src="https://www.logo.wine/a/logo/BKash/BKash-Logo.wine.svg" className="w-20 invert grayscale brightness-[5]" alt="bkash" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-pink-500 font-black uppercase tracking-[0.3em] text-xs">Payment Number</p>
                          <p className="text-4xl font-black text-white tracking-tighter">01346-646075</p>
                          <p className="text-xs text-gray-500 uppercase tracking-widest">Account Type: Merchant/Personal</p>
                       </div>
                    </div>

                    <div className="space-y-4 border-t border-white/5 pt-8">
                       <p className="text-gray-400 font-medium italic">Please pay exactly <span className="text-white font-bold">৳{grandTotal}</span> to the number above using 'Send Money' or 'Payment' option and enter your TrxID below.</p>
                    </div>
                 </div>

                 <form onSubmit={handleFinish} className="space-y-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] ml-6">bKash Transaction ID (TrxID)</label>
                       <input 
                         required
                         type="text" 
                         placeholder="Enter TrxID (e.g. 8N6...)"
                         className="w-full bg-white/5 border border-white/10 rounded-[30px] px-10 py-6 text-white text-2xl font-black tracking-widest focus:border-amber-600 transition-all outline-none text-center uppercase"
                         value={formData.trxId}
                         onChange={e => setFormData({...formData, trxId: e.target.value.toUpperCase()})}
                       />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-500 text-black py-8 rounded-[35px] font-black text-2xl uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4"
                    >
                      CONFIRM & FINISH FEAST <Sparkles size={24} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => setStep('billing')}
                      className="w-full text-gray-500 font-black uppercase tracking-widest text-xs py-4 hover:text-white transition-colors"
                    >
                      GO BACK TO BILLING
                    </button>
                 </form>
              </div>
            )}
         </div>

         {/* Right Side: Summary Card */}
         <div className="lg:w-[450px] shrink-0">
            <div className="sticky top-48 glass-panel p-10 rounded-[50px] border-white/10 shadow-2xl space-y-10">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-600/10 rounded-2xl flex items-center justify-center">
                     <ShoppingBag className="text-amber-600" size={24} />
                  </div>
                  <h4 className="text-2xl font-black text-white">Summary</h4>
               </div>

               <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4">
                       <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                          <img src={item.image} className="w-full h-full object-cover" alt={item.nameEn} />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-white font-black truncate">{item.nameEn}</p>
                          <div className="flex justify-between items-center mt-1">
                             <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                             <p className="text-amber-500 font-bold text-sm">৳{item.price * item.quantity}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="pt-8 border-t border-white/5 space-y-4">
                  <div className="flex justify-between text-gray-400 text-sm">
                     <span>Items Subtotal</span>
                     <span>৳{total}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm">
                     <span>Royal Delivery</span>
                     <span>৳{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-3xl font-black text-white pt-6 border-t border-white/10">
                     <span>Total</span>
                     <span className="text-amber-500">৳{grandTotal}</span>
                  </div>
               </div>

               <div className="bg-amber-600/5 p-6 rounded-3xl border border-amber-600/20">
                  <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.3em] mb-2">Delivery Estimate</p>
                  <p className="text-white font-medium">Expected Arrival: <span className="font-black">45-60 Minutes</span></p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Checkout;
