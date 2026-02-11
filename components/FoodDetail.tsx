
import React, { useState } from 'react';
import { X, ShoppingBag, Flame, Star, Minus, Plus, Share2, MapPin } from 'lucide-react';
import { FoodItem } from '../types';

interface FoodDetailProps {
  item: FoodItem;
  onClose: () => void;
  onAddToCart: (item: FoodItem) => void;
}

const FoodDetail: React.FC<FoodDetailProps> = ({ item, onClose, onAddToCart }) => {
  const [qty, setQty] = useState(1);

  return (
    <div className="fixed inset-0 z-[200] bg-black overflow-y-auto">
      <div className="min-h-screen relative flex flex-col lg:flex-row">
        
        {/* Navigation Overlays */}
        <button 
          onClick={onClose}
          className="fixed top-10 right-10 z-[210] bg-white/5 hover:bg-red-600 text-white p-6 rounded-full transition-all backdrop-blur-xl border border-white/10"
        >
          <X size={40} />
        </button>

        {/* Left Side: Massive Immersive Image */}
        <div className="lg:w-[55%] h-[70vh] lg:h-screen relative sticky top-0 overflow-hidden">
           <img 
             src={item.image} 
             className="w-full h-full object-cover transition-transform duration-[10s] scale-110 hover:scale-125"
             alt={item.nameEn}
           />
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black"></div>
           
           {/* Floating Info Boxes on Image */}
           <div className="absolute bottom-16 left-16 space-y-6">
              <div className="glass-panel p-8 rounded-[40px] animate-3-float border-amber-600/30">
                 <p className="text-amber-500 font-black uppercase tracking-widest text-xs mb-2">Freshly Prepared</p>
                 <h4 className="text-5xl font-black text-white italic font-serif">"Best Served Hot"</h4>
              </div>
           </div>
        </div>

        {/* Right Side: Detailed Content */}
        <div className="lg:w-[45%] p-10 lg:p-24 bg-black flex flex-col justify-center space-y-16">
          
          <div className="space-y-6">
            <div className="flex items-center gap-6">
               <span className="px-6 py-2 bg-amber-600 text-black rounded-full text-xs font-black uppercase tracking-widest">
                 {item.category} Selection
               </span>
               <div className="flex gap-2 text-amber-500">
                 {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
               </div>
            </div>
            
            <h1 className="text-7xl lg:text-9xl font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl">
              {item.nameEn}
            </h1>
            <h2 className="text-5xl font-bangla text-amber-600 font-bold opacity-80">
              {item.nameBn}
            </h2>
          </div>

          <div className="space-y-8 max-w-xl">
             <div className="flex gap-6 items-center">
                <div className="h-[3px] flex-1 bg-gradient-to-r from-amber-600 to-transparent"></div>
                <p className="text-amber-600 font-black uppercase tracking-[0.4em] text-sm shrink-0">Our Secret Recipe</p>
             </div>
             <p className="text-3xl text-gray-300 font-light leading-relaxed first-letter:text-7xl first-letter:font-black first-letter:text-amber-600 first-letter:mr-3 first-letter:float-left">
               {item.descriptionEn}
             </p>
             <p className="text-2xl font-bangla text-gray-500 leading-relaxed italic border-l-4 border-amber-600 pl-8">
               {item.descriptionBn}
             </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
             <div className="glass-panel p-10 rounded-[40px] border-white/5 hover:border-amber-600/30 transition-all group">
                <div className="w-16 h-16 bg-amber-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-600 transition-colors">
                  <Flame size={32} className="text-amber-600 group-hover:text-black" />
                </div>
                <h5 className="text-2xl font-black text-white mb-2">Authentic Heat</h5>
                <p className="text-gray-500 text-sm tracking-wide">Handpicked spices from the local markets of Sylhet.</p>
             </div>
             <div className="glass-panel p-10 rounded-[40px] border-white/5 hover:border-red-600/30 transition-all group">
                <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
                  <MapPin size={32} className="text-red-600 group-hover:text-white" />
                </div>
                <h5 className="text-2xl font-black text-white mb-2">Home Delivery</h5>
                <p className="text-gray-500 text-sm tracking-wide">Delivered in premium royal packaging within 45 mins.</p>
             </div>
          </div>

          <div className="pt-12 space-y-10">
            <div className="flex items-center gap-10">
               <div className="flex items-center gap-6 bg-white/5 border border-white/10 rounded-full px-8 py-4">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-gray-400 hover:text-white"><Minus size={24} /></button>
                  <span className="text-4xl font-black text-white w-12 text-center">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="text-gray-400 hover:text-white"><Plus size={24} /></button>
               </div>
               <div className="text-6xl font-black text-amber-500">৳{item.price * qty}</div>
            </div>

            <div className="flex gap-6">
              <button 
                onClick={() => {
                  onAddToCart({...item});
                  onClose();
                }}
                className="flex-1 bg-amber-600 hover:bg-amber-500 text-black px-16 py-8 rounded-[40px] font-black text-3xl transition-all shadow-[0_30px_100px_rgba(217,119,6,0.5)] active:scale-95 flex items-center justify-center gap-4"
              >
                <ShoppingBag size={32} /> ADD TO MY ROYAL BAG
              </button>
              <button className="p-8 bg-white/5 rounded-[40px] hover:bg-white/10 text-white transition-all">
                <Share2 size={32} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
