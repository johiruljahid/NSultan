
import React, { useState } from 'react';
import { Plus, Flame, ShoppingCart } from 'lucide-react';
import { FoodItem } from '../types';

interface MenuCardProps {
  item: FoodItem;
  onAddToCart: (item: FoodItem) => void;
  onViewDetails: (item: FoodItem) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onAddToCart, onViewDetails }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    setRotate({ x: rotateX, y: rotateY });
  };

  return (
    <div 
      className="group relative perspective-2000 h-[500px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
    >
      <div 
        className="relative h-full w-full preserve-3d transition-transform duration-300 ease-out cursor-pointer"
        style={{ transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` }}
        onClick={() => onViewDetails(item)}
      >
        <div className="absolute inset-0 glass-panel rounded-[50px] overflow-hidden group-hover:shadow-[0_40px_100px_rgba(217,119,6,0.2)] transition-all flex flex-col border border-white/5">
          
          {/* Seductive Image Section */}
          <div className="relative h-[65%] w-full overflow-hidden">
             <img 
               src={item.image} 
               alt={item.nameEn}
               className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-125"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80"></div>
             
             {item.isPopular && (
               <div className="absolute top-6 left-6 bg-red-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl z-20">
                 <Flame size={12} fill="currentColor" /> MUST TRY
               </div>
             )}
          </div>

          {/* Text Content */}
          <div className="p-8 space-y-4 flex-1 flex flex-col justify-end bg-gradient-to-t from-black to-transparent">
            <div className="flex justify-between items-end">
               <div>
                 <h3 className="text-3xl font-black text-white leading-none tracking-tighter mb-1">{item.nameEn}</h3>
                 <p className="font-bangla text-amber-500 text-lg">{item.nameBn}</p>
               </div>
               <div className="text-4xl font-black text-amber-500 drop-shadow-lg">৳{item.price}</div>
            </div>
            
            <p className="text-gray-400 text-xs line-clamp-2 font-light tracking-wide">
              {item.descriptionEn}
            </p>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(item);
              }}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-amber-600 text-black py-5 rounded-[25px] font-black text-sm uppercase tracking-widest transition-all transform hover:translate-y-[-5px] active:scale-95 shadow-xl"
            >
              <ShoppingCart size={18} /> ADD TO CART
            </button>
          </div>
        </div>
        
        {/* Floating depth effect */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-600/20 rounded-full blur-3xl group-hover:bg-amber-600/40 transition-all"></div>
      </div>
    </div>
  );
};

export default MenuCard;
