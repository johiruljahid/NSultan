
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import MenuCard from './components/MenuCard.tsx';
import FoodDetail from './components/FoodDetail.tsx';
import Cart from './components/Cart.tsx';
import Background3D from './components/Background3D.tsx';
import Booking from './components/Booking.tsx';
import Checkout from './components/Checkout.tsx';
import Admin from './components/Admin.tsx';
import { MENU_ITEMS as INITIAL_MENU } from './constants.tsx';
import { FoodItem, CartItem, AppView, Order, BookingRequest, GalleryImage } from './types.ts';
import { Sparkles, MapPin, ArrowRight, UtensilsCrossed, Crown, Camera, Users, Building, Armchair, X, Settings, ShieldCheck, Lock, ArrowRightCircle, Facebook, Instagram, MessageCircle, Mic, Headset } from 'lucide-react';

const INITIAL_GALLERY: GalleryImage[] = [
  { id: 'g1', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop', title: 'Royal Dining Hall', titleBn: 'রাজকীয় ডাইনিং হল', category: 'interior' },
  { id: 'g2', url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop', title: 'Our Expert Chefs', titleBn: 'আমাদের বিশেষজ্ঞ শেফ', category: 'staff' },
  { id: 'g3', url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1200&auto=format&fit=crop', title: 'Executive Lounge', titleBn: 'এক্সিকিউটিভ লাউঞ্জ', category: 'interior' },
  { id: 'g4', url: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=1200&auto=format&fit=crop', title: 'The Sultan Kitchen', titleBn: 'সুলতানি রান্নাঘর', category: 'office' },
  { id: 'g5', url: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c3d?q=80&w=1200&auto=format&fit=crop', title: 'Reception Staff', titleBn: 'রিসেপশন স্টাফ', category: 'staff' },
  { id: 'g6', url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop', title: 'Outdoor Seating', titleBn: 'আউটডোর সিটিং', category: 'interior' },
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [menuItems, setMenuItems] = useState<FoodItem[]>(INITIAL_MENU);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(INITIAL_GALLERY);
  const [categories, setCategories] = useState<string[]>(['main', 'starter', 'dessert', 'drinks']);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<GalleryImage | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  const handleNavigate = useCallback((v: AppView | 'cart') => {
    if (v === 'cart') {
      setIsCartOpen(true);
    } else {
      setView(v as AppView);
    }
  }, []);

  const addToCart = (item: FoodItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const filteredMenu = filter === 'all' ? menuItems : menuItems.filter(i => i.category === filter);

  const startCheckout = () => {
    setIsCartOpen(false);
    setView('checkout');
  };

  const clearCartAndToMenu = () => {
    setCartItems([]);
    setView('menu');
  };

  const handleNewOrder = (orderData: Partial<Order>) => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerName: orderData.customerName || 'Guest',
      phone: orderData.phone || '',
      address: orderData.address || '',
      items: orderData.items || [],
      total: orderData.total || 0,
      trxId: orderData.trxId || 'PENDING',
      timestamp: orderData.timestamp || new Date().toISOString(),
      status: orderData.status || 'pending'
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleNewBooking = (bookingData: Omit<BookingRequest, 'id' | 'status'>) => {
    const newBooking: BookingRequest = {
      ...bookingData,
      id: `BOK-${Date.now()}`,
      status: 'pending'
    };
    setBookings(prev => [newBooking, ...prev]);
  };

  const handleAddMenuItem = (item: FoodItem) => {
    setMenuItems(prev => [item, ...prev]);
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => id !== item.id));
  };

  const handleAddGalleryImage = (img: GalleryImage) => {
    setGalleryImages(prev => [img, ...prev]);
  };

  const handleDeleteGalleryImage = (id: string) => {
    setGalleryImages(prev => prev.filter(img => img.id !== id));
  };

  const handleAddCategory = (cat: string) => {
    setCategories(prev => prev.includes(cat) ? prev : [...prev, cat]);
  };

  const verifyAdminAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (authCode === 'Jahid') {
      setView('admin');
      setIsAdminAuthOpen(false);
      setAuthCode('');
      setAuthError(false);
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-amber-600 selection:text-black overflow-x-hidden">
      <Background3D />
      
      {view !== 'admin' && (
        <Navbar 
          onNavigate={handleNavigate} 
          cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)} 
        />
      )}

      {isAdminAuthOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl" onClick={() => setIsAdminAuthOpen(false)}></div>
          
          <div className="relative w-full max-w-xl glass-panel p-12 md:p-16 rounded-[60px] border-amber-600/30 shadow-[0_50px_100px_rgba(217,119,6,0.2)] text-center animate-in zoom-in duration-500 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-600/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-8">
              <div className="w-24 h-24 bg-zinc-900 rounded-3xl flex items-center justify-center shadow-2xl border border-white/5 group">
                <ShieldCheck size={48} className="text-amber-500 group-hover:scale-110 transition-transform" />
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase">PORTAL <span className="text-amber-600 italic">VERIFICATION</span></h2>
                <p className="text-gray-500 font-medium tracking-wide">Enter the Sultan's access code to manage the empire.</p>
              </div>

              <form onSubmit={verifyAdminAccess} className="w-full space-y-6">
                <div className="relative group">
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 text-amber-500">
                    <Lock size={20} />
                  </div>
                  <input 
                    autoFocus
                    type="password"
                    placeholder="Verification Code"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    className={`w-full bg-white/5 border ${authError ? 'border-red-600 animate-shake' : 'border-white/10'} rounded-full pl-16 pr-10 py-6 text-white text-xl font-black tracking-[0.5em] focus:border-amber-600 outline-none transition-all placeholder:tracking-normal placeholder:font-medium placeholder:text-zinc-700`}
                  />
                </div>

                {authError && <p className="text-red-500 text-xs font-black uppercase tracking-widest animate-pulse">Incorrect Access Key</p>}

                <button 
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-500 text-black py-6 rounded-full font-black text-xl uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 group"
                >
                  ACCESS CONTROL <ArrowRightCircle size={24} className="group-hover:translate-x-2 transition-transform" />
                </button>

                <button 
                  type="button"
                  onClick={() => setIsAdminAuthOpen(false)}
                  className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors"
                >
                  CANCEL REQUEST
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {view === 'home' && (
        <div className="animate-in fade-in duration-1000">
          <Hero 
            onExplore={() => setView('menu')} 
            onBooking={() => setView('booking')}
          />
          <section className="py-20 md:py-40 container mx-auto px-6 relative">
             <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/5 blur-[150px] -z-10"></div>
             <div className="grid lg:grid-cols-2 gap-16 md:gap-32 items-center">
                <div className="order-2 lg:order-1 perspective-2000">
                   <div className="relative animate-3d-float">
                      <div className="absolute inset-0 bg-red-600/20 blur-[100px]"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=1000&auto=format&fit=crop" 
                        className="relative z-10 w-full rounded-[40px] md:rounded-[60px] shadow-2xl border border-white/5 -rotate-3 md:-rotate-6 group hover:rotate-0 transition-transform duration-700"
                        alt="Beef Kala Bhuna"
                      />
                   </div>
                </div>
                <div className="order-1 lg:order-2 space-y-8 md:space-y-10">
                   <div className="flex items-center gap-4 text-red-500 font-black tracking-[0.3em] uppercase">
                      <div className="w-8 md:w-12 h-[2px] bg-red-600"></div> Seductive Flavors
                   </div>
                   <h2 className="text-5xl md:text-9xl font-black tracking-tighter leading-none text-white">
                      The Art of <br/> <span className="text-amber-600 italic">Royal Spices</span>
                   </h2>
                   <p className="text-lg md:text-2xl text-gray-400 font-light leading-relaxed">
                     At N Sultan, we don't just cook; we weave a <span className="text-white font-bold">spell of flavors</span> that surrender your senses to the ultimate royal banquet. 
                   </p>
                   <p className="font-bangla text-2xl md:text-4xl text-gray-200 leading-relaxed italic border-l-4 md:border-l-8 border-amber-600 pl-6 md:pl-10 shadow-sm">
                     এন সুলতানে রান্না হয় না, বরং রাজকীয় স্বাদের এক জাদুকরী মহাকাব্য রচিত হয়।
                   </p>
                   <button 
                     onClick={() => setView('menu')}
                     className="group flex items-center gap-4 bg-white text-black px-8 md:px-12 py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-lg md:text-xl hover:bg-amber-600 transition-all shadow-2xl active:scale-95 self-start"
                   >
                     EXPLORE THE MENU
                     <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                   </button>
                </div>
             </div>
          </section>
        </div>
      )}
      
      {view === 'menu' && (
        <div className="pt-32 md:pt-48 pb-20 md:pb-40 container mx-auto px-6 animate-in slide-in-from-bottom duration-1000">
          <div className="relative mb-20 md:mb-32 flex flex-col gap-12">
            <div className="absolute -top-32 left-0 w-full text-[18vw] font-black text-white/[0.02] select-none pointer-events-none uppercase tracking-tighter whitespace-nowrap overflow-hidden">
              {filter === 'all' ? 'FEASTING' : filter}
            </div>
            <div className="relative z-10 space-y-6 md:space-y-8">
               <div className="flex items-center gap-4 md:gap-6">
                  <div className="p-2 md:p-3 bg-amber-600/20 border border-amber-600/40 rounded-xl md:rounded-2xl">
                     <Crown className="text-amber-500" size={20} />
                  </div>
                  <div className="space-y-1">
                     <p className="text-amber-500 font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-[8px] md:text-[10px]">Imperial Selection</p>
                     <p className="font-bangla text-gray-400 text-xs md:text-sm">সুলতানি রাজকীয় আয়োজন</p>
                  </div>
               </div>
               <h2 className="text-5xl md:text-[11rem] font-black tracking-tighter leading-[0.85] text-white">
                 THE ROYAL <br />
                 <span className="text-amber-600 italic font-serif flex items-center gap-4 md:gap-8">
                   FEAST
                   <span className="font-bangla text-3xl md:text-7xl font-bold not-italic text-white opacity-40 ml-2 md:ml-4">ভোজসভা</span>
                 </span>
               </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 p-2 md:p-4 bg-zinc-900/50 backdrop-blur-3xl rounded-[20px] md:rounded-[40px] border border-white/5 shadow-2xl self-start overflow-x-auto no-scrollbar max-w-full">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 md:px-10 py-3 md:py-5 rounded-[15px] md:rounded-[30px] font-black text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all duration-500 ${
                  filter === 'all' 
                    ? 'bg-amber-600 text-black shadow-xl scale-105' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                ALL
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 md:px-10 py-3 md:py-5 rounded-[15px] md:rounded-[30px] font-black text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all duration-500 whitespace-nowrap ${
                    filter === cat 
                      ? 'bg-amber-600 text-black shadow-xl scale-105' 
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16 relative z-10">
            {filteredMenu.map(item => (
              <MenuCard key={item.id} item={item} onAddToCart={addToCart} onViewDetails={(food) => setSelectedFood(food)} />
            ))}
          </div>
        </div>
      )}

      {view === 'gallery' && (
        <div className="pt-32 md:pt-48 pb-20 md:pb-40 container mx-auto px-6 animate-in fade-in zoom-in duration-1000">
           <h2 className="text-5xl md:text-9xl font-black text-white tracking-tighter mb-20 uppercase leading-none">THE ROYAL <br/><span className="text-amber-600 italic">ESTATE</span></h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
             {galleryImages.map((img) => (
               <div key={img.id} onClick={() => setSelectedGalleryImg(img)} className="group relative h-[400px] md:h-[600px] rounded-[30px] md:rounded-[60px] overflow-hidden cursor-pointer shadow-2xl">
                  <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-10 left-10">
                     <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">{img.title}</h3>
                     <p className="text-amber-500 font-bangla text-lg">{img.titleBn}</p>
                  </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {view === 'booking' && (
        <Booking 
          onSubmitBooking={(data) => handleNewBooking(data)}
          onNavigateToMenu={() => setView('menu')}
        />
      )}

      {view === 'checkout' && (
        <Checkout 
          items={cartItems} 
          onBack={() => setView('menu')} 
          onOrderSuccess={() => handleNewOrder({ items: cartItems, total: cartItems.reduce((s, i) => s + (i.price * i.quantity), 0) + 50 })}
          onNavigateToMenu={clearCartAndToMenu}
        />
      )}

      {view === 'admin' && (
        <Admin 
          menuItems={menuItems}
          galleryImages={galleryImages}
          categories={categories}
          orders={orders}
          bookings={bookings}
          onAddMenuItem={handleAddMenuItem}
          onDeleteMenuItem={handleDeleteMenuItem}
          onAddGalleryImage={handleAddGalleryImage}
          onDeleteGalleryImage={handleDeleteGalleryImage}
          onAddCategory={handleAddCategory}
          onExit={() => setView('home')}
          updateOrderStatus={(id, status) => setOrders(prev => prev.map(o => o.id === id ? {...o, status} : o))}
          updateBookingStatus={(id, status) => setBookings(prev => prev.map(b => b.id === id ? {...b, status} : b))}
        />
      )}

      {selectedFood && <FoodDetail item={selectedFood} onClose={() => setSelectedFood(null)} onAddToCart={addToCart} />}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onUpdateQuantity={updateCartQuantity} onRemove={removeFromCart} onCheckout={startCheckout} />

      {view !== 'admin' && (
        <footer className="bg-[#020202] border-t border-white/5 py-20 md:py-40">
           <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20">
              <div className="space-y-6 md:space-y-10">
                 <h4 className="text-4xl md:text-5xl font-black tracking-tighter text-3d">N SULTAN</h4>
                 <p className="text-gray-500 text-lg md:text-xl font-light">Redefining boundaries of culinary art. Tradition meets future.</p>
                 <div className="flex gap-4">
                   <a href="#" className="p-3 bg-white/5 rounded-xl text-amber-500 hover:bg-amber-600 hover:text-black transition-all"><Facebook size={20} /></a>
                   <a href="#" className="p-3 bg-white/5 rounded-xl text-amber-500 hover:bg-amber-600 hover:text-black transition-all"><Instagram size={20} /></a>
                   <a href="#" className="p-3 bg-white/5 rounded-xl text-amber-500 hover:bg-amber-600 hover:text-black transition-all"><MessageCircle size={20} /></a>
                 </div>
                 <button onClick={() => setIsAdminAuthOpen(true)} className="flex items-center gap-2 text-zinc-700 hover:text-amber-600 transition-colors text-[10px] font-black uppercase tracking-[0.4em] group">
                   <Settings size={12} className="group-hover:rotate-90 transition-transform duration-500" /> Portal Access
                 </button>
              </div>
              <div>
                 <h5 className="font-black uppercase tracking-[0.4em] text-amber-500 text-sm mb-8">Reach Us</h5>
                 <ul className="space-y-4 text-gray-400">
                    <li className="flex items-center gap-4"><MapPin size={18} className="text-amber-600"/> Habiganj Sadar, 3300</li>
                    <li className="flex items-center gap-4">Phone: 01346-646075</li>
                 </ul>
              </div>
           </div>
           <div className="container mx-auto px-6 mt-20 md:mt-40 pt-16 border-t border-white/5 text-center text-gray-700 text-[8px] md:text-[10px] font-black tracking-[0.4em] md:tracking-[0.6em] uppercase">
            &copy; 2024 N SULTAN RESTAURANT | THE ULTIMATE 3D EXPERIENCE
           </div>
        </footer>
      )}
    </div>
  );
};

export default App;
