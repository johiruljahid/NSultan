
import React, { useState, useRef } from 'react';
import { LayoutDashboard, Utensils, ShoppingBag, CalendarCheck, Plus, Trash2, Edit, X, LogOut, TrendingUp, Users, DollarSign, Package, CheckCircle, Clock, AlertCircle, Star, PlusCircle, CheckCircle2, Timer, MapPin, Phone, User, ReceiptText, Image as ImageIcon, Calendar, Upload, ImagePlus, Save, Link as LinkIcon } from 'lucide-react';
import { FoodItem, Order, BookingRequest, GalleryImage } from '../types';

interface AdminProps {
  menuItems: FoodItem[];
  galleryImages: GalleryImage[];
  categories: string[];
  orders: Order[];
  bookings: BookingRequest[];
  onAddMenuItem: (item: FoodItem) => void;
  onUpdateMenuItem: (item: FoodItem) => void;
  onDeleteMenuItem: (id: string) => void;
  onAddGalleryImage: (img: GalleryImage) => void;
  onDeleteGalleryImage: (id: string) => void;
  onAddCategory: (cat: string) => void;
  onExit: () => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updateBookingStatus: (id: string, status: BookingRequest['status']) => void;
}

const Admin: React.FC<AdminProps> = ({ 
  menuItems, 
  galleryImages, 
  categories, 
  orders, 
  bookings, 
  onAddMenuItem, 
  onUpdateMenuItem,
  onDeleteMenuItem, 
  onAddGalleryImage, 
  onDeleteGalleryImage, 
  onAddCategory, 
  onExit, 
  updateOrderStatus, 
  updateBookingStatus 
}) => {
  const [activeTab, setActiveTab] = useState<'dash' | 'menu' | 'gallery' | 'orders' | 'bookings'>('dash');
  const [orderSubTab, setOrderSubTab] = useState<'active' | 'completed'>('active');
  const [bookingSubTab, setBookingSubTab] = useState<'pending' | 'granted'>('pending');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [showGalleryAddForm, setShowGalleryAddForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const [newItem, setNewItem] = useState<Partial<FoodItem>>({
    category: categories[0] || 'main',
    image: ''
  });
  
  const [newGalleryItem, setNewGalleryItem] = useState<Partial<GalleryImage>>({
    category: 'interior',
    url: ''
  });

  const menuFileInputRef = useRef<HTMLInputElement>(null);
  const editMenuFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const resizeAndCompressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_DIM = 1200;
          if (width > height) {
            if (width > MAX_DIM) {
              height *= MAX_DIM / width;
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width *= MAX_DIM / height;
              height = MAX_DIM;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'menu' | 'gallery' | 'edit') => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await resizeAndCompressImage(file);
        if (type === 'menu') {
          setNewItem(prev => ({ ...prev, image: compressedBase64 }));
        } else if (type === 'edit') {
          setEditingItem(prev => prev ? ({ ...prev, image: compressedBase64 }) : null);
        } else {
          setNewGalleryItem(prev => ({ ...prev, url: compressedBase64 }));
        }
      } catch (error) {
        console.error("Image Processing Failed:", error);
        alert("ইমেজ প্রসেস করতে সমস্যা হয়েছে।");
      }
    }
    if (e.target) e.target.value = '';
  };

  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing');
  const completedOrders = orders.filter(o => o.status === 'delivered');
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const grantedBookings = bookings.filter(b => b.status === 'confirmed');

  const StatCard = ({ title, value, icon: Icon, trend }: any) => (
    <div className="glass-panel p-8 rounded-[40px] border-white/5 shadow-2xl group hover:border-amber-600/30 transition-all preserve-3d">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">{title}</p>
          <h4 className="text-4xl font-black text-white">{value}</h4>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 text-amber-500 group-hover:scale-110 transition-transform">
          <Icon size={28} />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-2 text-[10px] text-green-500 font-bold uppercase tracking-widest">
        <TrendingUp size={12} /> {trend || 'Organic Growth'}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020202] text-white flex animate-in fade-in duration-500">
      <aside className="w-80 border-r border-white/5 bg-[#050505] p-10 flex flex-col gap-12 sticky top-0 h-screen">
        <div className="flex items-center gap-4">
          <div className="bg-amber-600 p-3 rounded-2xl rotate-12">
            <Utensils className="text-black" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter">SULTAN CONTROL</span>
        </div>
        <nav className="flex-1 space-y-4">
          {[
            { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'menu', label: 'Menu Assets', icon: Utensils },
            { id: 'gallery', label: 'Gallery', icon: ImageIcon },
            { id: 'orders', label: 'Order Requests', icon: ShoppingBag, count: pendingOrders.length },
            { id: 'bookings', label: 'Reservations', icon: CalendarCheck, count: pendingBookings.length },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between p-5 rounded-3xl font-black text-sm uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-amber-600 text-black shadow-2xl scale-105' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} />
                {item.label}
              </div>
              {item.count ? <span className="bg-red-600 text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center animate-pulse">{item.count}</span> : null}
            </button>
          ))}
        </nav>
        <button onClick={onExit} className="mt-auto flex items-center gap-4 text-zinc-600 hover:text-red-500 transition-colors font-black uppercase tracking-[0.2em] text-xs group">
          <LogOut size={20} className="group-hover:-translate-x-2 transition-transform" /> TERMINATE SESSION
        </button>
      </aside>

      <main className="flex-1 p-12 md:p-20 overflow-y-auto max-h-screen custom-scrollbar relative">
        {activeTab === 'dash' && (
          <div className="space-y-20 animate-in slide-in-from-bottom duration-700">
            <header className="space-y-4">
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none">IMPERIAL <br/><span className="text-amber-600 italic">DASHBOARD</span></h2>
              <p className="text-gray-500 text-xl font-light">Real-time surveillance of the Sultanate's performance.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard title="Total Revenue (Delivered)" value={`৳${totalRevenue}`} icon={DollarSign} trend="Realized Income" />
              <StatCard title="Active Requests" value={pendingOrders.length} icon={Package} trend="Awaiting Processing" />
              <StatCard title="Total Bookings" value={bookings.length} icon={Users} trend="Table Occupation" />
              <StatCard title="Gallery Assets" value={galleryImages.length} icon={ImageIcon} trend="Visual Wealth" />
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-12 animate-in slide-in-from-bottom duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              <div className="space-y-4">
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none">FOOD <br/><span className="text-amber-600 italic">ASSETS</span></h2>
                <p className="text-gray-500 text-xl font-light">Inventory management for the Sultanate's treasury.</p>
              </div>
              <button 
                onClick={() => {
                  setNewItem({ category: categories[0] || 'main', image: '' });
                  setShowAddForm(true);
                }}
                className="bg-white text-black px-12 py-6 rounded-[30px] font-black text-xl hover:bg-amber-600 transition-all flex items-center gap-4 shadow-2xl active:scale-95"
              >
                <Plus size={28} /> AUTHORIZE NEW DISH
              </button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {menuItems.map(item => (
                <div key={item.id} className="glass-panel p-8 rounded-[50px] border-white/5 group relative overflow-hidden preserve-3d">
                  <div className="flex gap-8">
                    <div className="w-32 h-32 rounded-[30px] overflow-hidden border border-white/10 shrink-0">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" alt="" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-2xl font-black truncate text-white uppercase tracking-tighter">{item.nameEn}</h4>
                      <p className="text-amber-500 font-bangla text-lg mb-4">{item.nameBn}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-3xl font-black text-white">৳{item.price}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">{item.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => setEditingItem(item)} className="p-4 bg-amber-600 text-black hover:bg-amber-500 rounded-2xl transform hover:scale-110 shadow-lg"><Edit size={20} /></button>
                    <button onClick={() => onDeleteMenuItem(item.id)} className="p-4 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-2xl transform hover:scale-110 shadow-lg"><Trash2 size={20} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-12 animate-in slide-in-from-bottom duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              <div className="space-y-4">
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none">VISUAL <br/><span className="text-amber-600 italic">GALLERY</span></h2>
                <p className="text-gray-500 text-xl font-light">Curate the Sultanate's aesthetic heritage.</p>
              </div>
              <button 
                onClick={() => {
                  setNewGalleryItem({ category: 'interior', url: '' });
                  setShowGalleryAddForm(true);
                }}
                className="bg-white text-black px-12 py-6 rounded-[30px] font-black text-xl hover:bg-amber-600 transition-all flex items-center gap-4 shadow-2xl active:scale-95"
              >
                <Plus size={28} /> ADD TO GALLERY
              </button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {galleryImages.map(img => (
                <div key={img.id} className="glass-panel p-6 rounded-[40px] border-white/5 group relative overflow-hidden h-[400px]">
                  <img src={img.url} className="w-full h-full object-cover rounded-[30px] group-hover:scale-110 transition-transform duration-700" alt="" />
                  <div className="absolute inset-x-10 bottom-10 bg-black/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 transform translate-y-4 group-hover:translate-y-0 transition-all">
                    <h4 className="text-xl font-black text-white truncate">{img.title}</h4>
                    <p className="text-amber-500 font-bangla text-sm">{img.titleBn}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2">{img.category}</p>
                  </div>
                  <button onClick={() => onDeleteGalleryImage(img.id)} className="absolute top-10 right-10 p-4 bg-red-600/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-2xl hover:scale-110"><Trash2 size={20} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-12 animate-in slide-in-from-bottom duration-700">
            <header className="space-y-4">
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none">ORDER <br/><span className="text-amber-600 italic">REQUESTS</span></h2>
              <div className="flex flex-wrap items-center gap-6 mt-10">
                <button onClick={() => setOrderSubTab('active')} className={`px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all ${orderSubTab === 'active' ? 'bg-amber-600 text-black shadow-xl' : 'text-gray-500 hover:text-white bg-white/5'}`}>Active Requests ({pendingOrders.length})</button>
                <button onClick={() => setOrderSubTab('completed')} className={`px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all ${orderSubTab === 'completed' ? 'bg-amber-600 text-black shadow-xl' : 'text-gray-500 hover:text-white bg-white/5'}`}>Delivered Archive ({completedOrders.length})</button>
              </div>
            </header>
            <div className="space-y-10">
              {(orderSubTab === 'active' ? pendingOrders : completedOrders).map(order => (
                <div key={order.id} className="glass-panel p-12 rounded-[60px] border-white/5 grid md:grid-cols-12 gap-12 items-center relative overflow-hidden group">
                  <div className="md:col-span-3 space-y-3">
                    <p className="text-amber-500 font-black text-xs uppercase tracking-widest flex items-center gap-2"><Clock size={12} /> ID: #{order.id.slice(-6)}</p>
                    <h4 className="text-4xl font-black text-white uppercase tracking-tighter">{order.customerName}</h4>
                    <p className="text-gray-400 font-bold text-lg">{order.phone}</p>
                  </div>
                  <div className="md:col-span-4 space-y-6 border-l border-white/5 pl-12">
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.4em]">Items in Selection</p>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-lg">
                          <span className="font-bold text-white">{item.nameEn} <span className="text-amber-600">x{item.quantity}</span></span>
                          <span className="text-gray-500 font-black">৳{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-3 border-l border-white/5 pl-12">
                    <div className="p-6 rounded-[30px] border bg-amber-600/10 border-amber-600/30 text-amber-500">
                      <p className="text-lg font-black font-mono">TrxID: {order.trxId}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-4">
                    {order.status === 'pending' && <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="w-full bg-amber-600 text-black py-6 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl active:scale-95">PREPARE MEAL</button>}
                    {order.status === 'preparing' && <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="w-full bg-green-600 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-green-500 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2">MARK DONE <CheckCircle size={14} /></button>}
                    <button onClick={() => setSelectedOrder(order)} className="w-full bg-white/5 text-gray-500 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:text-white transition-all border border-white/5">Full Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-12 animate-in slide-in-from-bottom duration-700">
             <header className="space-y-4">
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none">TABLE <br/><span className="text-amber-600 italic">RESERVATIONS</span></h2>
              <div className="flex flex-wrap items-center gap-6 mt-10">
                <button onClick={() => setBookingSubTab('pending')} className={`px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all ${bookingSubTab === 'pending' ? 'bg-amber-600 text-black shadow-xl' : 'text-gray-500 hover:text-white bg-white/5'}`}>Pending ({pendingBookings.length})</button>
                <button onClick={() => setBookingSubTab('granted')} className={`px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all ${bookingSubTab === 'granted' ? 'bg-amber-600 text-black shadow-xl' : 'text-gray-500 hover:text-white bg-white/5'}`}>Granted ({grantedBookings.length})</button>
              </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {(bookingSubTab === 'pending' ? pendingBookings : grantedBookings).map(b => (
                <div key={b.id} className="glass-panel p-10 rounded-[60px] border-white/5 flex flex-col gap-8 group hover:border-amber-600/20 transition-all">
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-amber-600/10 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner"><Users size={32} /></div>
                         <div>
                            <h4 className="text-3xl font-black uppercase tracking-tight text-white">{b.name}</h4>
                            <p className="text-amber-500 text-xs font-black uppercase tracking-[0.4em]">{b.type} CATEGORY</p>
                         </div>
                      </div>
                      <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] ${b.status === 'confirmed' ? 'bg-green-600 text-black shadow-lg shadow-green-500/20' : 'bg-amber-600/20 text-amber-500 animate-pulse border border-amber-600/30'}`}>{b.status === 'pending' ? 'AWAITING' : 'GRANTED'}</div>
                   </div>
                   <div className="grid grid-cols-3 gap-6 border-y border-white/5 py-10">
                      <div className="text-center"><p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Guest Count</p><p className="text-3xl font-black text-white">{b.guests}</p></div>
                      <div className="text-center border-x border-white/5"><p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Target Date</p><p className="text-3xl font-black text-white">{b.date}</p></div>
                      <div className="text-center"><p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Time Slot</p><p className="text-3xl font-black text-white">{b.time}</p></div>
                   </div>
                   <div className="flex gap-6">
                      {b.status === 'pending' ? <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="flex-1 bg-amber-600 text-black py-6 rounded-[30px] font-black text-xs uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl active:scale-95">CONFIRM ROYALTY</button> : <div className="flex-1 bg-white/5 text-green-500 py-6 rounded-[30px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 border border-green-500/20">SELECTION GRANTED <CheckCircle2 size={16} /></div>}
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal: Authorized Item Entry */}
      {showAddForm && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8 animate-in fade-in duration-500 overflow-y-auto">
           <div className="max-w-4xl w-full glass-panel p-12 md:p-16 rounded-[60px] border-amber-600/30 shadow-2xl relative overflow-hidden my-auto">
              <button onClick={() => setShowAddForm(false)} className="absolute top-10 right-10 text-gray-500 hover:text-red-500 transition-colors"><X size={32} /></button>
              <div className="space-y-12">
                 <div className="space-y-2 text-center"><h3 className="text-5xl font-black text-white tracking-tighter uppercase">ADD TO <span className="text-amber-600 italic">TREASURY</span></h3></div>
                 <div className="grid md:grid-cols-2 gap-10">
                    <div className="md:col-span-2 space-y-4">
                       <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-6">Visual Asset (Upload or Link)</label>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div 
                            onClick={() => menuFileInputRef.current?.click()}
                            className="w-full h-48 bg-white/5 border-2 border-dashed border-white/10 rounded-[30px] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-amber-600 hover:bg-white/[0.08] transition-all group overflow-hidden relative"
                          >
                             {newItem.image && newItem.image.startsWith('data:') ? <img src={newItem.image} className="absolute inset-0 w-full h-full object-cover" alt="Preview" /> : <div className="flex flex-col items-center"><Upload size={24} className="text-amber-500 mb-2"/><p className="text-[10px] font-black uppercase tracking-widest">Upload File</p></div>}
                             <input ref={menuFileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'menu')} />
                          </div>
                          <div className="space-y-4">
                             <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-[30px] px-6 py-4 focus-within:border-amber-600 transition-all">
                                <LinkIcon size={20} className="text-amber-500" />
                                <input type="text" placeholder="Paste Image URL" className="bg-transparent border-none outline-none flex-1 text-sm font-bold text-white" value={newItem.image || ''} onChange={e => setNewItem({...newItem, image: e.target.value})} />
                             </div>
                             {newItem.image && !newItem.image.startsWith('data:') && (
                                <div className="w-full h-24 rounded-2xl overflow-hidden border border-white/10"><img src={newItem.image} className="w-full h-full object-cover" alt="Preview" /></div>
                             )}
                          </div>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-6">Dish Name (EN)</label>
                       <input type="text" className="w-full bg-white/5 border border-white/10 rounded-full px-10 py-6 focus:border-amber-600 outline-none text-lg font-bold" placeholder="Sultan's Secret" value={newItem.nameEn || ''} onChange={e => setNewItem({...newItem, nameEn: e.target.value})} />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-6">Dish Name (BN)</label>
                       <input type="text" className="w-full bg-white/5 border border-white/10 rounded-full px-10 py-6 focus:border-amber-600 outline-none text-lg font-bangla font-bold" placeholder="সুলতানি রহস্য" value={newItem.nameBn || ''} onChange={e => setNewItem({...newItem, nameBn: e.target.value})} />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-6">Price (৳ BDT)</label>
                       <input type="number" className="w-full bg-white/5 border border-white/10 rounded-full px-10 py-6 focus:border-amber-600 outline-none text-xl font-black" placeholder="Amount" value={newItem.price || ''} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-6">Category</label>
                       <select className="w-full bg-white/5 border border-white/10 rounded-full px-10 py-6 focus:border-amber-600 outline-none text-lg font-bold" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                          {categories.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
                       </select>
                    </div>
                 </div>
                 <button disabled={!newItem.image || !newItem.nameEn || !newItem.price} onClick={() => { onAddMenuItem({ id: Date.now().toString(), nameEn: newItem.nameEn || 'Royal Dish', nameBn: newItem.nameBn || 'রাজকীয় খাবার', descriptionEn: 'Exquisite royal preparation.', descriptionBn: 'রাজকীয় আয়োজন।', price: newItem.price || 0, image: newItem.image || '', category: newItem.category || 'main' }); setShowAddForm(false); setNewItem({ category: categories[0] || 'main', image: '' }); }} className="w-full bg-white hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-black py-8 rounded-full font-black text-2xl uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95">AUTHORIZE NEW ASSET</button>
              </div>
           </div>
        </div>
      )}

      {/* Modal: Edit Item Entry */}
      {editingItem && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8 animate-in fade-in duration-500 overflow-y-auto">
           <div className="max-w-4xl w-full glass-panel p-12 md:p-16 rounded-[60px] border-amber-600/30 shadow-2xl relative overflow-hidden my-auto">
              <button onClick={() => setEditingItem(null)} className="absolute top-10 right-10 text-gray-500 hover:text-red-500 transition-colors"><X size={32} /></button>
              <div className="space-y-12">
                 <div className="space-y-2 text-center"><h3 className="text-5xl font-black text-white tracking-tighter uppercase">UPDATE <span className="text-amber-600 italic">ASSET</span></h3></div>
                 <div className="grid md:grid-cols-2 gap-10">
                    <div className="md:col-span-2 space-y-4">
                       <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-6">Visual Asset (Upload or Link)</label>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div onClick={() => editMenuFileInputRef.current?.click()} className="w-full h-48 bg-white/5 border-2 border-dashed border-white/10 rounded-[30px] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-amber-600 hover:bg-white/[0.08] transition-all group overflow-hidden relative">
                             <img src={editingItem.image} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Preview" />
                             <div className="relative z-10 flex flex-col items-center"><Upload size={24} className="text-white mb-2"/><p className="text-[10px] font-black uppercase text-white">Change File</p></div>
                             <input ref={editMenuFileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'edit')} />
                          </div>
                          <div className="space-y-4">
                             <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-[30px] px-6 py-4 focus-within:border-amber-600 transition-all">
                                <LinkIcon size={20} className="text-amber-500" />
                                <input type="text" placeholder="Update Image URL" className="bg-transparent border-none outline-none flex-1 text-sm font-bold text-white" value={editingItem.image || ''} onChange={e => setEditingItem({...editingItem, image: e.target.value})} />
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-4"><label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-6">Name (EN)</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-full px-10 py-6 focus:border-amber-600 outline-none text-lg font-bold text-white" value={editingItem.nameEn} onChange={e => setEditingItem({...editingItem, nameEn: e.target.value})} /></div>
                    <div className="space-y-4"><label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-6">Name (BN)</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-full px-10 py-6 focus:border-amber-600 outline-none text-lg font-bangla font-bold text-white" value={editingItem.nameBn} onChange={e => setEditingItem({...editingItem, nameBn: e.target.value})} /></div>
                    <div className="space-y-4"><label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-6">Price</label><input type="number" className="w-full bg-white/5 border border-white/10 rounded-full px-10 py-6 focus:border-amber-600 outline-none text-xl font-black text-white" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: Number(e.target.value)})} /></div>
                    <div className="space-y-4"><label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-6">Category</label><select className="w-full bg-white/5 border border-white/10 rounded-full px-10 py-6 focus:border-amber-600 outline-none text-lg font-bold text-white" value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})}>{categories.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}</select></div>
                 </div>
                 <div className="flex gap-4"><button onClick={() => setEditingItem(null)} className="flex-1 bg-zinc-900 text-gray-400 py-8 rounded-full font-black text-xl uppercase tracking-[0.2em] transition-all hover:bg-zinc-800">CANCEL</button><button onClick={() => { onUpdateMenuItem(editingItem); setEditingItem(null); }} className="flex-[2] bg-amber-600 hover:bg-amber-500 text-black py-8 rounded-full font-black text-2xl uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4"><Save size={28} /> SAVE CHANGES</button></div>
              </div>
           </div>
        </div>
      )}

      {/* Modal: Add to Gallery */}
      {showGalleryAddForm && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8 animate-in fade-in duration-500 overflow-y-auto">
           <div className="max-w-4xl w-full glass-panel p-12 md:p-16 rounded-[60px] border-amber-600/30 shadow-2xl relative overflow-hidden my-auto">
              <button onClick={() => setShowGalleryAddForm(false)} className="absolute top-10 right-10 text-gray-500 hover:text-red-500 transition-colors"><X size={32} /></button>
              <div className="space-y-12">
                 <div className="space-y-2 text-center"><h3 className="text-5xl font-black text-white tracking-tighter uppercase">GALLERY <span className="text-amber-600 italic">PORTAL</span></h3></div>
                 <div className="grid md:grid-cols-2 gap-10">
                    <div className="md:col-span-2 space-y-4">
                       <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-6">Visual Asset (Upload or Link)</label>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div onClick={() => galleryFileInputRef.current?.click()} className="w-full h-48 bg-white/5 border-2 border-dashed border-white/10 rounded-[30px] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-amber-600 hover:bg-white/[0.08] transition-all group overflow-hidden relative">
                             {newGalleryItem.url && newGalleryItem.url.startsWith('data:') ? <img src={newGalleryItem.url} className="absolute inset-0 w-full h-full object-cover" alt="Preview" /> : <div className="flex flex-col items-center"><ImagePlus size={24} className="text-amber-500 mb-2"/><p className="text-[10px] font-black uppercase tracking-widest">Upload File</p></div>}
                             <input ref={galleryFileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'gallery')} />
                          </div>
                          <div className="space-y-4">
                             <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-[30px] px-6 py-4 focus-within:border-amber-600 transition-all">
                                <LinkIcon size={20} className="text-amber-500" />
                                <input type="text" placeholder="Paste Image URL" className="bg-transparent border-none outline-none flex-1 text-sm font-bold text-white" value={newGalleryItem.url || ''} onChange={e => setNewGalleryItem({...newGalleryItem, url: e.target.value})} />
                             </div>
                             {newGalleryItem.url && !newGalleryItem.url.startsWith('data:') && (
                                <div className="w-full h-24 rounded-2xl overflow-hidden border border-white/10"><img src={newGalleryItem.url} className="w-full h-full object-cover" alt="Preview" /></div>
                             )}
                          </div>
                       </div>
                    </div>
                    <div className="space-y-4"><label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-6">Image Title (EN)</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-full px-10 py-6 focus:border-amber-600 outline-none text-lg font-bold" placeholder="Interior View" value={newGalleryItem.title || ''} onChange={e => setNewGalleryItem({...newGalleryItem, title: e.target.value})} /></div>
                    <div className="space-y-4"><label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-6">Image Title (BN)</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-full px-10 py-6 focus:border-amber-600 outline-none text-lg font-bangla font-bold" placeholder="অন্দরসজ্জা" value={newGalleryItem.titleBn || ''} onChange={e => setNewGalleryItem({...newGalleryItem, titleBn: e.target.value})} /></div>
                 </div>
                 <button disabled={!newGalleryItem.url || !newGalleryItem.title} onClick={() => { onAddGalleryImage({ id: `G-${Date.now()}`, title: newGalleryItem.title || 'Untitled', titleBn: newGalleryItem.titleBn || 'নামহীন', url: newGalleryItem.url || '', category: newGalleryItem.category || 'interior' }); setShowGalleryAddForm(false); setNewGalleryItem({ category: 'interior', url: '' }); }} className="w-full bg-white hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-black py-8 rounded-full font-black text-2xl uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95">AUTHORIZE ASSET UPLOAD</button>
              </div>
           </div>
        </div>
      )}

      {selectedOrder && (
         <div className="fixed inset-0 z-[1100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-in fade-in duration-500">
           <div className="max-w-6xl w-full max-h-[90vh] glass-panel rounded-[80px] border-amber-600/30 shadow-2xl overflow-hidden flex flex-col relative">
              <button onClick={() => setSelectedOrder(null)} className="absolute top-12 right-12 z-10 p-6 bg-white/5 hover:bg-red-600 text-white rounded-full transition-all"><X size={32} /></button>
              <div className="flex-1 overflow-y-auto p-12 md:p-20 custom-scrollbar">
                  <div className="grid lg:grid-cols-2 gap-20">
                    <div className="space-y-16">
                       <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">ORDER <br/><span className="text-amber-600 italic">#{selectedOrder.id.slice(-6)}</span></h2>
                       <div className="grid gap-10">
                          <div className="flex items-center gap-8"><User size={32} className="text-amber-500"/><p className="text-3xl font-black text-white uppercase">{selectedOrder.customerName}</p></div>
                          <div className="flex items-center gap-8"><Phone size={32} className="text-amber-500"/><p className="text-3xl font-black text-white">{selectedOrder.phone}</p></div>
                       </div>
                    </div>
                  </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
