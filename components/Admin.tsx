
import React, { useState, useRef } from 'react';
import { LayoutDashboard, Utensils, ShoppingBag, CalendarCheck, Plus, Trash2, Edit, X, LogOut, TrendingUp, Users, DollarSign, Package, CheckCircle, Clock, AlertCircle, Star, PlusCircle, CheckCircle2, Timer, MapPin, Phone, User, ReceiptText, Image as ImageIcon, Calendar, Upload, ImagePlus, Save, Link as LinkIcon, Menu } from 'lucide-react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const navItems = [
    { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu Assets', icon: Utensils },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'orders', label: 'Order Requests', icon: ShoppingBag, count: pendingOrders.length },
    { id: 'bookings', label: 'Reservations', icon: CalendarCheck, count: pendingBookings.length },
  ];

  const StatCard = ({ title, value, icon: Icon, trend }: any) => (
    <div className="glass-panel p-6 md:p-8 rounded-[30px] md:rounded-[40px] border-white/5 shadow-2xl group hover:border-amber-600/30 transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-widest mb-2">{title}</p>
          <h4 className="text-2xl md:text-4xl font-black text-white">{value}</h4>
        </div>
        <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-zinc-900 border border-white/5 text-amber-500">
          <Icon size={24} />
        </div>
      </div>
      <div className="mt-4 md:mt-6 flex items-center gap-2 text-[8px] md:text-[10px] text-green-500 font-bold uppercase tracking-widest">
        <TrendingUp size={10} /> {trend || 'Organic Growth'}
      </div>
    </div>
  );

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col lg:flex-row animate-in fade-in duration-500">
      
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[100] bg-[#050505] border-b border-white/5 px-6 py-4 flex items-center justify-between backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="bg-amber-600 p-2 rounded-lg">
            <Utensils className="text-black" size={18} />
          </div>
          <span className="text-lg font-black tracking-tighter">SULTAN CONTROL</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-white/5 rounded-lg text-amber-500"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - Desktop & Mobile Overlay */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110] w-80 bg-[#050505] border-r border-white/5 p-10 flex flex-col gap-12 transition-transform duration-500
        lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-[0_0_100px_rgba(217,119,6,0.2)]' : '-translate-x-full'}
      `}>
        <div className="hidden lg:flex items-center gap-4">
          <div className="bg-amber-600 p-3 rounded-2xl rotate-12">
            <Utensils className="text-black" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter">SULTAN CONTROL</span>
        </div>

        <nav className="flex-1 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center justify-between p-5 rounded-3xl font-black text-sm uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-amber-600 text-black shadow-2xl scale-105' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} />
                {item.label}
              </div>
              {item.count ? <span className="bg-red-600 text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center">{item.count}</span> : null}
            </button>
          ))}
        </nav>

        <button onClick={onExit} className="mt-auto flex items-center gap-4 text-zinc-600 hover:text-red-500 transition-colors font-black uppercase tracking-[0.2em] text-xs group">
          <LogOut size={20} /> TERMINATE SESSION
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 lg:p-20 overflow-y-auto max-h-screen custom-scrollbar pt-24 lg:pt-20">
        
        {activeTab === 'dash' && (
          <div className="space-y-12 md:space-y-20 animate-in slide-in-from-bottom duration-700">
            <header className="space-y-2 md:space-y-4">
              <h2 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white uppercase leading-none">IMPERIAL <br/><span className="text-amber-600 italic">DASHBOARD</span></h2>
              <p className="text-gray-500 text-base md:text-xl font-light">Real-time surveillance of the performance.</p>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              <StatCard title="Revenue" value={`৳${totalRevenue}`} icon={DollarSign} trend="Realized" />
              <StatCard title="Active Orders" value={pendingOrders.length} icon={Package} trend="Awaiting" />
              <StatCard title="Bookings" value={bookings.length} icon={Users} trend="Total" />
              <StatCard title="Gallery" value={galleryImages.length} icon={ImageIcon} trend="Visuals" />
            </div>

            <div className="glass-panel p-6 md:p-10 rounded-[30px] md:rounded-[50px] border-white/5 bg-gradient-to-br from-amber-600/5 to-transparent">
              <h3 className="text-xl md:text-2xl font-black mb-6 md:mb-10 uppercase tracking-tight">Recent Orders</h3>
              <div className="space-y-4 md:space-y-6">
                {orders.slice(0, 5).map(o => (
                  <div key={o.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 md:p-6 rounded-[20px] md:rounded-[30px] bg-white/5 border border-white/5">
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-white text-base md:text-lg truncate">{o.customerName}</p>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">#{o.id.slice(-6)} • {new Date(o.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto sm:text-right gap-4">
                      <p className="font-black text-xl md:text-2xl text-amber-500">৳{o.total}</p>
                      <span className={`text-[8px] uppercase font-black px-3 py-1 rounded-full ${o.status === 'delivered' ? 'bg-green-500 text-black' : 'bg-amber-600 text-black'}`}>{o.status}</span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-center text-gray-700 py-10 uppercase text-xs tracking-widest">No Recent Requests</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-10 md:space-y-12 animate-in slide-in-from-bottom duration-700">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 md:gap-8">
              <div className="space-y-2 md:space-y-4">
                <h2 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white uppercase leading-none">FOOD <br/><span className="text-amber-600 italic">ASSETS</span></h2>
                <p className="text-gray-500 text-base md:text-xl font-light">Inventory management.</p>
              </div>
              <button 
                onClick={() => {
                  setNewItem({ category: categories[0] || 'main', image: '' });
                  setShowAddForm(true);
                }}
                className="w-full sm:w-auto bg-white text-black px-8 md:px-12 py-4 md:py-6 rounded-2xl md:rounded-[30px] font-black text-sm md:text-xl hover:bg-amber-600 transition-all flex items-center justify-center gap-3 md:gap-4 shadow-2xl"
              >
                <Plus size={24} /> AUTHORIZE DISH
              </button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
              {menuItems.map(item => (
                <div key={item.id} className="glass-panel p-6 md:p-8 rounded-[30px] md:rounded-[50px] border-white/5 group relative overflow-hidden">
                  <div className="flex gap-4 md:gap-8">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-[30px] overflow-hidden border border-white/10 shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-lg md:text-2xl font-black truncate text-white uppercase tracking-tighter">{item.nameEn}</h4>
                      <p className="text-amber-500 font-bangla text-sm md:text-lg mb-2 md:mb-4">{item.nameBn}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl md:text-3xl font-black text-white">৳{item.price}</span>
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-500 px-3 py-1 bg-white/5 rounded-full border border-white/10">{item.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2 sm:opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => setEditingItem(item)} className="p-3 bg-amber-600 text-black hover:bg-amber-500 rounded-xl shadow-lg"><Edit size={16} /></button>
                    <button onClick={() => onDeleteMenuItem(item.id)} className="p-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl shadow-lg"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-10 md:space-y-12 animate-in slide-in-from-bottom duration-700">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 md:gap-8">
              <div className="space-y-2 md:space-y-4">
                <h2 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white uppercase leading-none">VISUAL <br/><span className="text-amber-600 italic">GALLERY</span></h2>
                <p className="text-gray-500 text-base md:text-xl font-light">Visual heritage curation.</p>
              </div>
              <button 
                onClick={() => {
                  setNewGalleryItem({ category: 'interior', url: '' });
                  setShowGalleryAddForm(true);
                }}
                className="w-full sm:w-auto bg-white text-black px-8 md:px-12 py-4 md:py-6 rounded-2xl md:rounded-[30px] font-black text-sm md:text-xl hover:bg-amber-600 transition-all flex items-center justify-center gap-3 md:gap-4 shadow-2xl"
              >
                <Plus size={24} /> ADD TO GALLERY
              </button>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
              {galleryImages.map(img => (
                <div key={img.id} className="glass-panel p-4 md:p-6 rounded-[30px] md:rounded-[40px] border-white/5 group relative overflow-hidden h-[300px] md:h-[400px]">
                  <img src={img.url} className="w-full h-full object-cover rounded-[20px] md:rounded-[30px]" alt="" />
                  <div className="absolute inset-x-6 md:inset-x-10 bottom-6 md:bottom-10 bg-black/80 backdrop-blur-xl p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/10">
                    <h4 className="text-lg md:text-xl font-black text-white truncate">{img.title}</h4>
                    <p className="text-amber-500 font-bangla text-xs md:text-sm">{img.titleBn}</p>
                  </div>
                  <button onClick={() => onDeleteGalleryImage(img.id)} className="absolute top-8 right-8 p-3 bg-red-600/80 text-white rounded-full sm:opacity-0 group-hover:opacity-100 transition-all shadow-2xl"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-10 md:space-y-12 animate-in slide-in-from-bottom duration-700">
            <header className="space-y-4 md:space-y-6">
              <h2 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white uppercase leading-none">ORDER <br/><span className="text-amber-600 italic">REQUESTS</span></h2>
              <div className="flex flex-wrap items-center gap-3 md:gap-6 mt-6 md:mt-10">
                <button onClick={() => setOrderSubTab('active')} className={`flex-1 sm:flex-none px-6 md:px-10 py-3 md:py-5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest transition-all ${orderSubTab === 'active' ? 'bg-amber-600 text-black shadow-xl' : 'text-gray-500 hover:text-white bg-white/5'}`}>Active ({pendingOrders.length})</button>
                <button onClick={() => setOrderSubTab('completed')} className={`flex-1 sm:flex-none px-6 md:px-10 py-3 md:py-5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest transition-all ${orderSubTab === 'completed' ? 'bg-amber-600 text-black shadow-xl' : 'text-gray-500 hover:text-white bg-white/5'}`}>Archive ({completedOrders.length})</button>
              </div>
            </header>
            <div className="space-y-6 md:space-y-10">
              {(orderSubTab === 'active' ? pendingOrders : completedOrders).map(order => (
                <div key={order.id} className="glass-panel p-6 md:p-12 rounded-[30px] md:rounded-[60px] border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 items-center relative overflow-hidden group">
                  <div className="lg:col-span-3 space-y-2">
                    <p className="text-amber-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Clock size={12} /> ID: #{order.id.slice(-6)}</p>
                    <h4 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">{order.customerName}</h4>
                    <p className="text-gray-400 font-bold text-base md:text-lg">{order.phone}</p>
                  </div>
                  <div className="lg:col-span-4 space-y-4 md:space-y-6 lg:border-l border-white/5 lg:pl-12">
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Feast Details</p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm md:text-lg">
                          <span className="font-bold text-white">{item.nameEn} <span className="text-amber-600">x{item.quantity}</span></span>
                          <span className="text-gray-500 font-black">৳{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-3 lg:border-l border-white/5 lg:pl-12">
                    <div className="p-4 md:p-6 rounded-2xl md:rounded-[30px] border bg-amber-600/10 border-amber-600/30 text-amber-500">
                      <p className="text-sm md:text-lg font-black font-mono truncate">TrxID: {order.trxId}</p>
                    </div>
                  </div>
                  <div className="lg:col-span-2 flex flex-col gap-3">
                    {order.status === 'pending' && <button onClick={() => updateOrderStatus(order.id, 'preparing')} className="w-full bg-amber-600 text-black py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-amber-500 transition-all">PREPARE</button>}
                    {order.status === 'preparing' && <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="w-full bg-green-600 text-white py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-green-500 transition-all">DELIVERED</button>}
                    <button onClick={() => setSelectedOrder(order)} className="w-full bg-white/5 text-gray-500 py-3 md:py-4 rounded-2xl md:rounded-3xl font-black text-[10px] uppercase tracking-widest border border-white/5">Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-10 md:space-y-12 animate-in slide-in-from-bottom duration-700">
             <header className="space-y-4 md:space-y-6">
              <h2 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white uppercase leading-none">TABLE <br/><span className="text-amber-600 italic">RESERVATIONS</span></h2>
              <div className="flex flex-wrap items-center gap-3 md:gap-6 mt-6 md:mt-10">
                <button onClick={() => setBookingSubTab('pending')} className={`flex-1 sm:flex-none px-6 md:px-10 py-3 md:py-5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest transition-all ${bookingSubTab === 'pending' ? 'bg-amber-600 text-black shadow-xl' : 'text-gray-500 hover:text-white bg-white/5'}`}>Pending ({pendingBookings.length})</button>
                <button onClick={() => setBookingSubTab('granted')} className={`flex-1 sm:flex-none px-6 md:px-10 py-3 md:py-5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest transition-all ${bookingSubTab === 'granted' ? 'bg-amber-600 text-black shadow-xl' : 'text-gray-500 hover:text-white bg-white/5'}`}>Granted ({grantedBookings.length})</button>
              </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              {(bookingSubTab === 'pending' ? pendingBookings : grantedBookings).map(b => (
                <div key={b.id} className="glass-panel p-6 md:p-10 rounded-[30px] md:rounded-[60px] border-white/5 flex flex-col gap-6 md:gap-8 transition-all">
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4 md:gap-6">
                         <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-600/10 rounded-xl md:rounded-2xl flex items-center justify-center text-amber-500"><Users size={24} /></div>
                         <div>
                            <h4 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white">{b.name}</h4>
                            <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest">{b.type}</p>
                         </div>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest ${b.status === 'confirmed' ? 'bg-green-600 text-black' : 'bg-amber-600/20 text-amber-500'}`}>{b.status === 'pending' ? 'AWAITING' : 'GRANTED'}</div>
                   </div>
                   <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-6 md:py-10">
                      <div className="text-center"><p className="text-[8px] md:text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Guests</p><p className="text-xl md:text-3xl font-black text-white">{b.guests}</p></div>
                      <div className="text-center border-x border-white/5"><p className="text-[8px] md:text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Date</p><p className="text-xl md:text-3xl font-black text-white">{b.date}</p></div>
                      <div className="text-center"><p className="text-[8px] md:text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Slot</p><p className="text-xl md:text-3xl font-black text-white">{b.time}</p></div>
                   </div>
                   <div className="flex flex-col sm:flex-row gap-3 md:gap-6">
                      {b.status === 'pending' ? <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="flex-1 bg-amber-600 text-black py-4 md:py-6 rounded-2xl md:rounded-[30px] font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-amber-500 transition-all">CONFIRM</button> : <div className="flex-1 bg-white/5 text-green-500 py-4 md:py-6 rounded-2xl md:rounded-[30px] font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-green-500/20">GRANTED <CheckCircle2 size={16} /></div>}
                      <button className="flex-1 bg-white/5 text-gray-500 py-4 md:py-6 rounded-2xl md:rounded-[30px] font-black text-[10px] md:text-xs uppercase tracking-widest hover:text-white transition-all border border-white/5">DENY</button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Reusable Modal Layer for Mobile Forms */}
      {(showAddForm || editingItem || showGalleryAddForm || selectedOrder) && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl lg:p-8 flex items-center justify-center overflow-y-auto animate-in fade-in duration-300">
           {/* Close Button Mobile */}
           <button 
             onClick={() => {
               setShowAddForm(false);
               setEditingItem(null);
               setShowGalleryAddForm(false);
               setSelectedOrder(null);
             }} 
             className="fixed top-6 right-6 z-[210] p-4 bg-white/10 rounded-full text-white lg:hidden"
           >
             <X size={24} />
           </button>

           <div className="w-full max-w-4xl min-h-screen lg:min-h-0 glass-panel lg:p-16 p-6 rounded-none lg:rounded-[60px] border-amber-600/30 shadow-2xl relative">
              <button 
                onClick={() => {
                  setShowAddForm(false);
                  setEditingItem(null);
                  setShowGalleryAddForm(false);
                  setSelectedOrder(null);
                }} 
                className="hidden lg:block absolute top-10 right-10 text-gray-500 hover:text-red-500"
              >
                <X size={32} />
              </button>

              {/* Form Content Logic based on active modal state */}
              {showAddForm && (
                <div className="space-y-8 md:space-y-12 pb-10">
                  <div className="text-center"><h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">ADD TO <span className="text-amber-600 italic">TREASURY</span></h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div className="md:col-span-2 space-y-4">
                      <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-4">Visual Asset</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div onClick={() => menuFileInputRef.current?.click()} className="w-full h-40 md:h-48 bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden">
                          {newItem.image && newItem.image.startsWith('data:') ? <img src={newItem.image} className="absolute inset-0 w-full h-full object-cover" alt="" /> : <div className="flex flex-col items-center text-amber-500"><Upload size={24} /><p className="text-[8px] font-black uppercase">Upload</p></div>}
                          <input ref={menuFileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'menu')} />
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                            <LinkIcon size={16} className="text-amber-500" />
                            <input type="text" placeholder="Image URL" className="bg-transparent border-none outline-none flex-1 text-xs font-bold text-white" value={newItem.image || ''} onChange={e => setNewItem({...newItem, image: e.target.value})} />
                          </div>
                          {newItem.image && !newItem.image.startsWith('data:') && <div className="h-20 rounded-xl overflow-hidden"><img src={newItem.image} className="h-full w-full object-cover" alt="" /></div>}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-4">Name (EN)</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-white font-bold" value={newItem.nameEn || ''} onChange={e => setNewItem({...newItem, nameEn: e.target.value})} /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-4">Name (BN)</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-white font-bangla font-bold" value={newItem.nameBn || ''} onChange={e => setNewItem({...newItem, nameBn: e.target.value})} /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-4">Price</label><input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-white font-black" value={newItem.price || ''} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-4">Category</label><select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-white font-bold" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>{categories.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}</select></div>
                  </div>
                  <button disabled={!newItem.image || !newItem.nameEn || !newItem.price} onClick={() => { onAddMenuItem({ id: Date.now().toString(), nameEn: newItem.nameEn || 'Royal Dish', nameBn: newItem.nameBn || 'রাজকীয় খাবার', descriptionEn: 'Exquisite royal preparation.', descriptionBn: 'রাজকীয় আয়োজন।', price: newItem.price || 0, image: newItem.image || '', category: newItem.category || 'main' }); setShowAddForm(false); setNewItem({ category: categories[0] || 'main', image: '' }); }} className="w-full bg-white hover:bg-amber-600 disabled:bg-zinc-800 text-black py-6 md:py-8 rounded-2xl md:rounded-full font-black text-xl md:text-2xl uppercase tracking-widest shadow-2xl">AUTHORIZE DISH</button>
                </div>
              )}

              {editingItem && (
                <div className="space-y-8 md:space-y-12 pb-10">
                  <div className="text-center"><h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">UPDATE <span className="text-amber-600 italic">ASSET</span></h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div className="md:col-span-2 space-y-4">
                       <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-4">Visual Asset</label>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div onClick={() => editMenuFileInputRef.current?.click()} className="w-full h-40 md:h-48 bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden">
                             <img src={editingItem.image} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="" />
                             <div className="relative z-10 flex flex-col items-center text-white"><Upload size={24} /><p className="text-[8px] font-black uppercase">Change</p></div>
                             <input ref={editMenuFileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'edit')} />
                          </div>
                          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 self-center">
                            <LinkIcon size={16} className="text-amber-500" />
                            <input type="text" placeholder="Update Image URL" className="bg-transparent border-none outline-none flex-1 text-xs font-bold text-white" value={editingItem.image || ''} onChange={e => setEditingItem({...editingItem, image: e.target.value})} />
                          </div>
                       </div>
                    </div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-4">Name (EN)</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-white font-bold" value={editingItem.nameEn} onChange={e => setEditingItem({...editingItem, nameEn: e.target.value})} /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-4">Name (BN)</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-white font-bangla font-bold" value={editingItem.nameBn} onChange={e => setEditingItem({...editingItem, nameBn: e.target.value})} /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-4">Price</label><input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-white font-black" value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: Number(e.target.value)})} /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-4">Category</label><select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-white font-bold" value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})}>{categories.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}</select></div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button onClick={() => setEditingItem(null)} className="flex-1 bg-zinc-900 text-gray-400 py-4 md:py-6 rounded-2xl font-black text-sm uppercase tracking-widest">CANCEL</button>
                    <button onClick={() => { onUpdateMenuItem(editingItem); setEditingItem(null); }} className="flex-[2] bg-amber-600 text-black py-4 md:py-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"><Save size={18} /> SAVE CHANGES</button>
                  </div>
                </div>
              )}

              {showGalleryAddForm && (
                <div className="space-y-8 md:space-y-12 pb-10">
                  <div className="text-center"><h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">GALLERY <span className="text-amber-600 italic">PORTAL</span></h3></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div className="md:col-span-2 space-y-4">
                       <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-4">Visual Asset</label>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div onClick={() => galleryFileInputRef.current?.click()} className="w-full h-40 md:h-48 bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer relative overflow-hidden">
                             {newGalleryItem.url && newGalleryItem.url.startsWith('data:') ? <img src={newGalleryItem.url} className="absolute inset-0 w-full h-full object-cover" alt="" /> : <div className="flex flex-col items-center text-amber-500"><ImagePlus size={24} /><p className="text-[8px] font-black uppercase">Upload</p></div>}
                             <input ref={galleryFileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'gallery')} />
                          </div>
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                              <LinkIcon size={16} className="text-amber-500" />
                              <input type="text" placeholder="Paste Image URL" className="bg-transparent border-none outline-none flex-1 text-xs font-bold text-white" value={newGalleryItem.url || ''} onChange={e => setNewGalleryItem({...newGalleryItem, url: e.target.value})} />
                            </div>
                            {newGalleryItem.url && !newGalleryItem.url.startsWith('data:') && <div className="h-20 rounded-xl overflow-hidden"><img src={newGalleryItem.url} className="h-full w-full object-cover" alt="" /></div>}
                          </div>
                       </div>
                    </div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-4">Title (EN)</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-white font-bold" value={newGalleryItem.title || ''} onChange={e => setNewGalleryItem({...newGalleryItem, title: e.target.value})} /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-4">Title (BN)</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-white font-bangla font-bold" value={newGalleryItem.titleBn || ''} onChange={e => setNewGalleryItem({...newGalleryItem, titleBn: e.target.value})} /></div>
                  </div>
                  <button disabled={!newGalleryItem.url || !newGalleryItem.title} onClick={() => { onAddGalleryImage({ id: `G-${Date.now()}`, title: newGalleryItem.title || 'Untitled', titleBn: newGalleryItem.titleBn || 'নামহীন', url: newGalleryItem.url || '', category: newGalleryItem.category || 'interior' }); setShowGalleryAddForm(false); setNewGalleryItem({ category: 'interior', url: '' }); }} className="w-full bg-white text-black py-6 md:py-8 rounded-2xl md:rounded-full font-black text-xl md:text-2xl uppercase tracking-widest shadow-2xl">AUTHORIZE UPLOAD</button>
                </div>
              )}

              {selectedOrder && (
                <div className="flex flex-col gap-10 pb-10">
                   <div className="space-y-4">
                      <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">ORDER <br/><span className="text-amber-600 italic">#{selectedOrder.id.slice(-6)}</span></h2>
                      <div className="grid gap-4 md:gap-8 pt-6">
                         <div className="flex items-center gap-4 md:gap-8"><User size={24} className="text-amber-500"/><p className="text-xl md:text-3xl font-black text-white uppercase">{selectedOrder.customerName}</p></div>
                         <div className="flex items-center gap-4 md:gap-8"><Phone size={24} className="text-amber-500"/><p className="text-xl md:text-3xl font-black text-white">{selectedOrder.phone}</p></div>
                         <div className="flex items-center gap-4 md:gap-8"><MapPin size={24} className="text-amber-500"/><p className="text-sm md:text-xl font-bold text-gray-300 leading-relaxed">{selectedOrder.address}</p></div>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">Feast Summary</h3>
                      <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar border-t border-white/5 pt-6">
                         {selectedOrder.items.map((item, idx) => (
                           <div key={idx} className="flex gap-4 md:gap-8 items-center bg-white/5 p-3 rounded-2xl">
                              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0"><img src={item.image} className="w-full h-full object-cover" alt="" /></div>
                              <div className="flex-1 min-w-0">
                                 <h4 className="text-base md:text-xl font-black text-white uppercase truncate">{item.nameEn}</h4>
                                 <div className="flex justify-between items-center"><span className="text-zinc-500 font-black text-xs">Qty: {item.quantity}</span><span className="text-base md:text-xl font-black text-white">৳{item.price * item.quantity}</span></div>
                              </div>
                           </div>
                         ))}
                      </div>
                      <div className="p-6 rounded-2xl md:rounded-[30px] bg-green-500/5 border border-green-500/20 text-green-500 text-center">
                         <p className="text-[10px] uppercase tracking-widest mb-1 font-black">Financial Verified ID</p>
                         <p className="text-xl md:text-3xl font-black font-mono break-all">{selectedOrder.trxId}</p>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
