
import React from 'react';
import { ShoppingCart, Utensils, Home, Info, Phone, Camera, CalendarDays } from 'lucide-react';
import { COLORS } from '../constants';

interface NavbarProps {
  onNavigate: (view: 'home' | 'menu' | 'cart' | 'gallery' | 'booking') => void;
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, cartCount }) => {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl">
      <div className="glass-panel rounded-full px-8 py-4 flex items-center justify-between shadow-2xl shadow-amber-900/20">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="bg-amber-600 p-2 rounded-lg rotate-12 group-hover:rotate-0 transition-transform duration-500">
             <Utensils className="text-black" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">N SULTAN</span>
        </div>

        <div className="hidden md:flex items-center gap-8 font-semibold text-sm uppercase tracking-widest text-gray-300">
          <button onClick={() => onNavigate('home')} className="hover:text-amber-500 transition-all hover:-translate-y-1">Home</button>
          <button onClick={() => onNavigate('menu')} className="hover:text-amber-500 transition-all hover:-translate-y-1">Menu</button>
          <button onClick={() => onNavigate('gallery')} className="flex items-center gap-2 hover:text-amber-500 transition-all hover:-translate-y-1">
            <Camera size={16} className="text-amber-600" /> Gallery
          </button>
          <button onClick={() => onNavigate('booking')} className="flex items-center gap-2 hover:text-amber-500 transition-all hover:-translate-y-1">
            <CalendarDays size={16} className="text-amber-600" /> Bookings
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('cart')}
            className="relative p-3 bg-white/10 rounded-full hover:bg-amber-600 hover:text-black transition-all duration-300 group"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => onNavigate('booking')}
            className="bg-amber-600 text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-amber-500 transition-all shadow-lg shadow-amber-600/30 active:scale-95"
          >
            RESERVE NOW
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
