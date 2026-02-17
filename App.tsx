
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
import { Sparkles, MapPin, ArrowRight, UtensilsCrossed, Crown, Camera, Users, Building, Armchair, X, Settings, ShieldCheck, Lock, ArrowRightCircle, Facebook, Instagram, MessageCircle, Mic, Headset, Phone, Mail, Clock } from 'lucide-react';

// Firestore Imports
import { db } from './firebase.ts';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  setDoc,
  getDocs
} from 'firebase/firestore';

const LOGO_URL = "https://scontent.fdac196-1.fna.fbcdn.net/v/t39.30808-6/528811349_122106066848963801_3624772175835850926_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=5QYkjT2BEIkQ7kNvwEi2YKj&_nc_oc=AdmSoax2OvSZfzvUWQ41ja-PZidV0kH3HLY8IvBDw4xEq9aWPvRLxoUkr_GftxIQY2A&_nc_zt=23&_nc_ht=scontent.fdac196-1.fna&_nc_gid=n91avAKPR6Wvvzx5UKxlgg&oh=00_AftpAzixSn_OnYWbv6JnTrrBCziX41p-jcr9TPXm-6os6A&oe=6999D1EA";

const INITIAL_GALLERY: GalleryImage[] = [
  { id: 'g1', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop', title: 'Royal Dining Hall', titleBn: 'রাজকীয় ডাইনিং হল', category: 'interior' },
  { id: 'g2', url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop', title: 'Our Expert Chefs', titleBn: 'আমাদের বিশেষজ্ঞ শেফ', category: 'staff' },
  { id: 'g3', url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1200&auto=format&fit=crop', title: 'Executive Lounge', titleBn: 'এক্সিকিউটিভ লাউঞ্জ', category: 'interior' },
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<string[]>(['main', 'starter', 'dessert', 'drinks']);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState(false);

  // Firestore Real-time Listeners
  useEffect(() => {
    const unsubMenu = onSnapshot(collection(db, 'menu'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FoodItem));
      if (items.length === 0 && isLoading) {
        INITIAL_MENU.forEach(async (item) => {
          await setDoc(doc(db, 'menu', item.id), item);
        });
      }
      setMenuItems(items);
    });

    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snapshot) => {
      const imgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage));
      if (imgs.length === 0 && isLoading) {
        INITIAL_GALLERY.forEach(async (img) => {
          await setDoc(doc(db, 'gallery', img.id), img);
        });
      }
      setGalleryImages(imgs);
    });

    const qOrders = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    });

    const unsubBookings = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BookingRequest)));
    });

    setIsLoading(false);
    return () => {
      unsubMenu();
      unsubGallery();
      unsubOrders();
      unsubBookings();
    };
  }, []);

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

  const handleNewOrder = async (orderData: any) => {
    const orderPayload = {
      customerName: orderData.name || 'Guest',
      phone: orderData.phone || '',
      address: orderData.address || '',
      items: cartItems,
      total: cartItems.reduce((s, i) => s + (i.price * i.quantity), 0) + 50,
      trxId: orderData.trxId || 'PENDING',
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    await addDoc(collection(db, 'orders'), orderPayload);
  };

  const handleNewBooking = async (bookingData: Omit<BookingRequest, 'id' | 'status'>) => {
    const bookingPayload = {
      ...bookingData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    await addDoc(collection(db, 'bookings'), bookingPayload);
  };

  const handleAddMenuItem = async (item: FoodItem) => {
    await setDoc(doc(db, 'menu', item.id), item);
  };

  const handleDeleteMenuItem = async (id: string) => {
    await deleteDoc(doc(db, 'menu', id));
  };

  const handleAddGalleryImage = async (img: GalleryImage) => {
    await setDoc(doc(db, 'gallery', img.id), img);
  };

  const handleDeleteGalleryImage = async (id: string) => {
    await deleteDoc(doc(db, 'gallery', id));
  };

  const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
    await updateDoc(doc(db, 'orders', id), { status });
  };

  const handleUpdateBookingStatus = async (id: string, status: BookingRequest['status']) => {
    await updateDoc(doc(db, 'bookings', id), { status });
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
                <p className="text-gray-500 font-medium tracking-wide">Enter the Sultan's access code.</p>
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

                <button 
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-500 text-black py-6 rounded-full font-black text-xl uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 group"
                >
                  ACCESS CONTROL <ArrowRightCircle size={24} className="group-hover:translate-x-2 transition-transform" />
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
        </div>
      )}
      
      {view === 'menu' && (
        <div className="pt-32 md:pt-48 pb-20 md:pb-40 container mx-auto px-6 animate-in slide-in-from-bottom duration-1000">
          <div className="relative mb-20 md:mb-32 flex flex-col gap-12 text-center md:text-left">
            <h2 className="text-5xl md:text-[11rem] font-black tracking-tighter leading-[0.85] text-white">
              THE ROYAL <br />
              <span className="text-amber-600 italic font-serif flex items-center justify-center md:justify-start gap-4 md:gap-8">FEAST</span>
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4 p-2 md:p-4 bg-zinc-900/50 backdrop-blur-3xl rounded-[20px] md:rounded-[40px] border border-white/5 shadow-2xl self-center md:self-start overflow-x-auto no-scrollbar max-w-full">
              <button onClick={() => setFilter('all')} className={`px-6 md:px-10 py-3 md:py-5 rounded-[15px] md:rounded-[30px] font-black text-[9px] md:text-[11px] uppercase tracking-[0.2em] transition-all ${filter === 'all' ? 'bg-amber-600 text-black shadow-xl' : 'text-gray-500 hover:text-white'}`}>ALL</button>
              {categories.map((cat) => (
                <button key={cat} onClick={() => setFilter(cat)} className={`px-6 md:px-10 py-3 md:py-5 rounded-[15px] md:rounded-[30px] font-black text-[9px] md:text-[11px] uppercase tracking-[0.2em] transition-all ${filter === cat ? 'bg-amber-600 text-black shadow-xl' : 'text-gray-500 hover:text-white'}`}>{cat}</button>
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
               <div key={img.id} className="group relative h-[400px] md:h-[600px] rounded-[30px] md:rounded-[60px] overflow-hidden cursor-pointer shadow-2xl">
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
          onSubmitBooking={handleNewBooking}
          onNavigateToMenu={() => setView('menu')}
        />
      )}

      {view === 'checkout' && (
        <Checkout 
          items={cartItems} 
          onBack={() => setView('menu')} 
          onOrderSuccess={handleNewOrder}
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
          updateOrderStatus={handleUpdateOrderStatus}
          updateBookingStatus={handleUpdateBookingStatus}
        />
      )}

      {selectedFood && <FoodDetail item={selectedFood} onClose={() => setSelectedFood(null)} onAddToCart={addToCart} />}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onUpdateQuantity={updateCartQuantity} onRemove={removeFromCart} onCheckout={startCheckout} />

      {view !== 'admin' && (
        <footer className="bg-[#020202] border-t border-white/5 pt-32 pb-20 overflow-hidden relative">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gradient-to-r from-transparent via-amber-600/50 to-transparent"></div>
           
           <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
                 {/* Brand Identity */}
                 <div className="space-y-10">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-600 shadow-[0_0_30px_rgba(217,119,6,0.3)]">
                          <img src={LOGO_URL} alt="N Sultan Logo" className="w-full h-full object-cover" />
                       </div>
                       <h4 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">N SULTAN <br/><span className="text-amber-600">RESTAURANT</span></h4>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed font-medium">
                      The ultimate destination for royal Bangladeshi gastronomy. Experience the legacy of the Sultanate in every bite.
                    </p>
                    <div className="flex gap-4">
                      <a href="https://www.facebook.com/nsultanrestaurant" target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 rounded-2xl text-amber-500 hover:bg-amber-600 hover:text-black transition-all shadow-xl"><Facebook size={20} /></a>
                      <a href="#" className="p-4 bg-white/5 rounded-2xl text-amber-500 hover:bg-amber-600 hover:text-black transition-all shadow-xl"><Instagram size={20} /></a>
                      <a href="#" className="p-4 bg-white/5 rounded-2xl text-amber-500 hover:bg-amber-600 hover:text-black transition-all shadow-xl"><MessageCircle size={20} /></a>
                    </div>
                 </div>

                 {/* Quick Links */}
                 <div className="space-y-10">
                    <h5 className="text-amber-600 font-black uppercase tracking-[0.4em] text-xs">Explore</h5>
                    <ul className="space-y-4 font-black uppercase text-[10px] tracking-widest text-gray-500">
                       <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setView('home')}>Imperial Home</li>
                       <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setView('menu')}>Royal Menu</li>
                       <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setView('gallery')}>Visual Estate</li>
                       <li className="hover:text-white transition-colors cursor-pointer" onClick={() => setView('booking')}>Reservations</li>
                    </ul>
                 </div>

                 {/* Contact Information */}
                 <div className="space-y-10">
                    <h5 className="text-amber-600 font-black uppercase tracking-[0.4em] text-xs">Direct Lines</h5>
                    <div className="space-y-6">
                       <div className="flex items-start gap-4 text-gray-400 group">
                          <div className="p-3 bg-white/5 rounded-xl group-hover:bg-amber-600 group-hover:text-black transition-all"><Phone size={16} /></div>
                          <div>
                             <p className="text-[10px] uppercase font-black text-amber-500 tracking-widest mb-1">Call Us</p>
                             <p className="text-white font-bold">+880 1346 646075</p>
                          </div>
                       </div>
                       <div className="flex items-start gap-4 text-gray-400 group">
                          <div className="p-3 bg-white/5 rounded-xl group-hover:bg-amber-600 group-hover:text-black transition-all"><Mail size={16} /></div>
                          <div>
                             <p className="text-[10px] uppercase font-black text-amber-500 tracking-widest mb-1">Email</p>
                             <p className="text-white font-bold">royal@nsultan.com</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Location & Hours */}
                 <div className="space-y-10">
                    <h5 className="text-amber-600 font-black uppercase tracking-[0.4em] text-xs">Operating Hours</h5>
                    <div className="space-y-6">
                       <div className="flex items-start gap-4 text-gray-400 group">
                          <div className="p-3 bg-white/5 rounded-xl group-hover:bg-amber-600 group-hover:text-black transition-all"><Clock size={16} /></div>
                          <div>
                             <p className="text-[10px] uppercase font-black text-amber-500 tracking-widest mb-1">Daily Service</p>
                             <p className="text-white font-bold">11:00 AM - 11:00 PM</p>
                          </div>
                       </div>
                       <div className="flex items-start gap-4 text-gray-400 group">
                          <div className="p-3 bg-white/5 rounded-xl group-hover:bg-amber-600 group-hover:text-black transition-all"><MapPin size={16} /></div>
                          <div>
                             <p className="text-[10px] uppercase font-black text-amber-500 tracking-widest mb-1">Visit Us</p>
                             <p className="text-white font-bold">court station Road, Habiganj</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                 <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">
                    © 2024 N SULTAN RESTAURANT. ALL SOVEREIGN RIGHTS RESERVED.
                 </p>
                 <button onClick={() => setIsAdminAuthOpen(true)} className="flex items-center gap-2 text-zinc-800 hover:text-amber-600 transition-colors text-[10px] font-black uppercase tracking-[0.4em] group">
                    <Settings size={12} className="group-hover:rotate-90 transition-transform duration-500" /> Administrative Access
                 </button>
              </div>
           </div>
        </footer>
      )}
    </div>
  );
};

export default App;
