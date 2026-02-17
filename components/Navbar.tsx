
import React from 'react';
import { ShoppingCart, Utensils, Home, Info, Phone, Camera, CalendarDays } from 'lucide-react';
import { COLORS } from '../constants';

interface NavbarProps {
  onNavigate: (view: 'home' | 'menu' | 'cart' | 'gallery' | 'booking') => void;
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, cartCount }) => {
  const logoUrl = "https://scontent.fdac196-1.fna.fbcdn.net/v/t39.30808-6/528811349_122106066848963801_3624772175835850926_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=5QYkjT2BEIkQ7kNvwEi2YKj&_nc_oc=AdmSoax2OvSZfzvUWQ41ja-PZidV0kH3HLY8IvBDw4xEq9aWPvRLxoUkr_GftxIQY2A&_nc_zt=23&_nc_ht=scontent.fdac196-1.fna&_nc_gid=n91avAKPR6Wvvzx5UKxlgg&oh=00_AftpAzixSn_OnYWbv6JnTrrBCziX41p-jcr9TPXm-6os6A&oe=6999D1EA";

  const navItemClass = "hover:text-amber-500 transition-all duration-300 hover:scale-110 hover:text-3d active:scale-95 px-2 py-1";

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="glass-panel rounded-full px-4 md:px-8 py-3 flex items-center justify-between shadow-2xl shadow-amber-900/20 border-white/10">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-600 shadow-lg group-hover:scale-110 transition-transform duration-500">
             <img src={logoUrl} alt="N Sultan Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase group-hover:text-3d transition-all">N SULTAN <span className="text-amber-600 hidden sm:inline">RESTAURANT</span></span>
        </div>

        <div className="hidden lg:flex items-center gap-10 font-black text-sm uppercase tracking-[0.3em] text-gray-400">
          <button onClick={() => onNavigate('home')} className={navItemClass}>Home</button>
          <button onClick={() => onNavigate('menu')} className={navItemClass}>Menu</button>
          <button onClick={() => onNavigate('gallery')} className={navItemClass}>
             Gallery
          </button>
          <button onClick={() => onNavigate('booking')} className={navItemClass}>
             Bookings
          </button>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <button 
            onClick={() => onNavigate('cart')}
            className="relative p-3 md:p-4 bg-white/5 rounded-full hover:bg-amber-600 hover:text-black transition-all duration-300 group border border-white/5 shadow-inner"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full animate-pulse shadow-lg border-2 border-black">
                {cartCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => onNavigate('booking')}
            className="bg-amber-600 text-black px-5 md:px-8 py-3 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl shadow-amber-600/20 active:scale-95 border border-amber-400/20"
          >
            RESERVE
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
