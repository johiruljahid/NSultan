
import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ items, isOpen, onClose, onUpdateQuantity, onRemove, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = items.length > 0 ? 50 : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg h-full bg-[#0a0a0a] border-l border-white/10 flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)]">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <ShoppingBag className="text-amber-500" size={32} />
              <h2 className="text-3xl font-black tracking-tight">Your Order Bag</h2>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={28} />
           </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
           {items.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center">
                   <ShoppingBag size={48} className="text-zinc-700" />
                </div>
                <div>
                   <h3 className="text-2xl font-bold">Your bag is empty</h3>
                   <p className="text-gray-500 mt-2">Add something delicious to start!</p>
                </div>
                <button 
                  onClick={onClose}
                  className="bg-amber-600 text-black px-8 py-3 rounded-xl font-bold"
                >
                  START ORDERING
                </button>
             </div>
           ) : (
             items.map(item => (
               <div key={item.id} className="group relative flex gap-6 p-4 rounded-3xl hover:bg-white/5 transition-colors">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                     <img src={item.image} alt={item.nameEn} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <h4 className="text-xl font-black truncate">{item.nameEn}</h4>
                     <p className="text-sm text-amber-600 font-bangla mb-4">{item.nameBn}</p>
                     
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 bg-black border border-white/10 rounded-full px-4 py-2">
                           <button onClick={() => onUpdateQuantity(item.id, -1)} className="hover:text-amber-500"><Minus size={14}/></button>
                           <span className="font-bold text-lg w-4 text-center">{item.quantity}</span>
                           <button onClick={() => onUpdateQuantity(item.id, 1)} className="hover:text-amber-500"><Plus size={14}/></button>
                        </div>
                        <div className="text-xl font-black text-white">৳{item.price * item.quantity}</div>
                     </div>
                  </div>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="absolute -top-2 -right-2 bg-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
               </div>
             ))
           )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="p-8 bg-zinc-900/50 border-t border-white/10 space-y-6">
             <div className="space-y-3">
                <div className="flex justify-between text-gray-400">
                   <span>Subtotal</span>
                   <span>৳{total}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                   <span>Home Delivery Fee</span>
                   <span>৳{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-3xl font-black text-white pt-4 border-t border-white/5">
                   <span>Total</span>
                   <span className="text-amber-500">৳{total + deliveryFee}</span>
                </div>
             </div>

             <button 
                onClick={onCheckout}
                className="w-full bg-amber-600 hover:bg-amber-500 text-black py-6 rounded-3xl font-black text-2xl flex items-center justify-center gap-4 group transition-all transform active:scale-[0.98] shadow-2xl shadow-amber-600/30"
             >
                PROCEED TO CHECKOUT
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
             </button>
             
             <p className="text-center text-[10px] text-gray-500 uppercase tracking-[0.2em]">
                Secure payment & Fast Delivery in Dhaka
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
