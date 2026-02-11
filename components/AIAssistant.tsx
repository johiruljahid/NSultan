
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { X, Send, ShoppingBag, CheckCircle2, CreditCard, Star, Utensils, Clock, MapPin, ChevronRight, MessageCircle } from 'lucide-react';
import { FoodItem, Order } from '../types';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  type?: 'text' | 'menu' | 'payment' | 'success' | 'booking_success';
  data?: any;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: FoodItem[];
  orders: Order[];
  onNewOrder: (order: any) => void;
  onNewBooking: (booking: any) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, menuItems, orders, onNewOrder, onNewBooking }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'model', 
      text: 'আসসালামু আলাইকুম! আমি সুলতানা। এন সুলতান রেস্টুরেন্টে আপনাকে স্বাগতম। আজ আপনার রাজকীয় ভোজের জন্য কী সেবা করতে পারি?', 
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [trxInput, setTrxInput] = useState('');
  const [pendingOrder, setPendingOrder] = useState<any>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && !chatInstanceRef.current) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatInstanceRef.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `আপনি 'সুলতানা', এন সুলতান রেস্টুরেন্টের একজন প্রফেশনাল এবং মিষ্টি সার্ভিস গার্ল।
          
          আপনার আচরণ:
          - প্রতিটি সেশন শুরু করবেন 'আসসালামু আলাইকুম' বলে।
          - বাংলা ভাষায় খুব সুন্দর ও সাবলীলভাবে কথা বলবেন।
          - যখন কোনো নির্দিষ্ট খাবারের কথা আসবে, সেটির স্বাদ নিয়ে লোভনীয় বর্ণনা দেবেন।
          - মেনু দেখাতে 'show_menu' টুল ব্যবহার করুন।
          - অর্ডার প্রসেস করতে 'place_order' টুল ব্যবহার করুন (নাম, ফোন, ঠিকানা, আইটেম প্রয়োজন)।
          - পেমেন্টের জন্য বিকাশ নম্বর ০১৩৪৬-৬৪৬০৭৫ উল্লেখ করবেন।
          - ডেলিভারি চার্জ ফিক্সড ৫০ টাকা।`,
          tools: [{
            functionDeclarations: [
              { name: 'show_menu', parameters: { type: Type.OBJECT, properties: {} } },
              { name: 'place_order', parameters: { 
                type: Type.OBJECT, 
                properties: { 
                  name: { type: Type.STRING }, 
                  phone: { type: Type.STRING }, 
                  address: { type: Type.STRING }, 
                  items: { type: Type.ARRAY, items: { type: Type.STRING } } 
                }, 
                required: ['name', 'phone', 'address', 'items'] 
              }},
              { name: 'make_reservation', parameters: { 
                type: Type.OBJECT, 
                properties: { 
                  name: { type: Type.STRING }, 
                  phone: { type: Type.STRING }, 
                  date: { type: Type.STRING }, 
                  time: { type: Type.STRING }, 
                  guests: { type: Type.STRING } 
                }, 
                required: ['name', 'phone', 'date', 'time', 'guests'] 
              }}
            ]
          }]
        }
      });
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const processResponse = async (userText: string) => {
    if (isTyping) return;
    setIsTyping(true);

    try {
      const result = await chatInstanceRef.current.sendMessage({ message: userText });
      const text = result.text;
      
      if (text) {
        const styledText = text
          .replace(/(\d+ টাকা)/g, '<span class="text-amber-500 font-bold">$1</span>')
          .replace(/(০১৩৪৬-৬৪৬০৭৫)/g, '<span class="text-pink-500 font-bold">$1</span>');

        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: styledText, timestamp: new Date() }]);
      }

      if (result.functionCalls) {
        for (const fc of result.functionCalls) {
          let toolResult = "ok";
          if (fc.name === 'show_menu') {
            setMessages(prev => [...prev, { id: 'menu-'+Date.now(), role: 'model', text: 'আমাদের বিশেষ মেনু কার্ডটি নিচে দেখুন। পছন্দমতো আইটেমে ক্লিক করুন:', type: 'menu', data: menuItems, timestamp: new Date() }]);
            toolResult = "মেনু দেখানো হয়েছে।";
          } else if (fc.name === 'place_order') {
            const { name, phone, address, items } = fc.args as any;
            const matchedItems = (items as string[]).map(itemName => 
              menuItems.find(mi => mi.nameEn.toLowerCase().includes(itemName.toLowerCase()) || mi.nameBn.includes(itemName))
            ).filter(Boolean);
            const subtotal = matchedItems.reduce((s, i: any) => s + i.price, 0);
            const total = subtotal + 50;
            const orderPreview = { customerName: name, phone, address, items: matchedItems, total };
            setPendingOrder(orderPreview);
            setMessages(prev => [...prev, { id: 'pay-'+Date.now(), role: 'model', text: 'আপনার অর্ডার সামারি তৈরি করা হয়েছে:', type: 'payment', data: orderPreview, timestamp: new Date() }]);
            toolResult = `বিল তৈরি। মোট বিল ${total} টাকা।`;
          }
          await chatInstanceRef.current.sendMessage({ message: `Tool result for ${fc.name}: ${toolResult}` });
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: 'err', role: 'model', text: 'দুঃখিত, কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।', timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const text = inputValue;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text, timestamp: new Date() }]);
    setInputValue('');
    processResponse(text);
  };

  const handleItemClick = (item: FoodItem) => {
    const text = `আমাকে ${item.nameEn} সম্পর্কে বলো এবং আমি এটি অর্ডার দিতে চাই।`;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: `${item.nameBn} সম্পর্কে জানতে চাই`, timestamp: new Date() }]);
    processResponse(text);
  };

  const confirmFinalOrder = () => {
    if (trxInput.length < 4) return;
    onNewOrder({ ...pendingOrder, trxId: trxInput, status: 'pending', timestamp: new Date().toISOString() });
    setMessages(prev => [...prev, { id: 'success-'+Date.now(), role: 'model', text: 'আলহামদুলিল্লাহ! আপনার অর্ডারটি গৃহীত হয়েছে।', type: 'success', timestamp: new Date() }]);
    setTrxInput('');
    setPendingOrder(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-[500px] h-full sm:h-[80vh] bg-[#050505] rounded-t-[30px] sm:rounded-[30px] border-none sm:border border-white/10 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header - Balanced & Compact */}
        <div className="p-4 border-b border-white/5 bg-zinc-900/40 backdrop-blur-xl flex items-center justify-between sticky top-0 z-50">
           <div className="flex items-center gap-3">
              <div className="relative">
                 <img 
                   src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop" 
                   className="w-10 h-10 rounded-full object-cover border-2 border-amber-600/40 shadow-lg" 
                   alt="Sultana" 
                 />
                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
              </div>
              <div>
                 <h3 className="text-white font-black text-sm uppercase tracking-tighter">SULTANA <span className="text-amber-600">AI</span></h3>
                 <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Active Now</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 bg-white/5 hover:bg-red-600 text-white rounded-full transition-all active:scale-90">
              <X size={20} />
           </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6 bg-[radial-gradient(circle_at_50%_0%,rgba(217,119,6,0.05),transparent)]">
           {messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`w-full ${msg.role === 'user' ? 'max-w-[80%]' : 'max-w-full'} flex flex-col gap-3`}>
                   
                   <div 
                     className={`p-4 rounded-[20px] text-sm sm:text-base leading-relaxed ${
                       msg.role === 'user' 
                       ? 'bg-amber-600 text-black font-bold rounded-tr-none self-end' 
                       : 'bg-white/5 border border-white/10 text-white font-bangla rounded-tl-none'
                     }`}
                     dangerouslySetInnerHTML={{ __html: msg.text }}
                   />

                   {/* Components inside stream */}
                   {msg.type === 'menu' && (
                     <div className="grid grid-cols-1 gap-3 mt-1">
                        {msg.data.map((item: FoodItem) => (
                          <div 
                            key={item.id} 
                            onClick={() => handleItemClick(item)}
                            className="bg-zinc-900/50 border border-white/5 p-3 rounded-2xl flex gap-4 hover:border-amber-600 transition-all cursor-pointer active:scale-95 group"
                          >
                             <img src={item.image} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                             <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <h5 className="text-white font-bold text-xs truncate uppercase">{item.nameEn}</h5>
                                <p className="text-amber-500 font-bangla text-base font-black">৳{item.price}</p>
                             </div>
                             <ChevronRight className="text-zinc-700 group-hover:text-amber-600 self-center" size={16} />
                          </div>
                        ))}
                     </div>
                   )}

                   {msg.type === 'payment' && (
                     <div className="w-full mt-2 animate-in zoom-in-95">
                        <div className="bg-zinc-900/80 p-6 rounded-3xl border border-amber-600/20 space-y-4">
                           <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <h4 className="text-xs font-black text-amber-500 uppercase">ORDER SUMMARY</h4>
                              <CreditCard size={14} className="text-pink-500" />
                           </div>
                           <div className="space-y-2">
                              {msg.data.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between text-xs font-medium text-zinc-400">
                                   <span>{item.nameEn}</span>
                                   <span>৳{item.price}</span>
                                </div>
                              ))}
                              <div className="flex justify-between text-[10px] text-zinc-600 pt-1">
                                 <span>Delivery Fee</span>
                                 <span>৳৫০</span>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                                 <span className="text-sm font-black text-white">TOTAL BILL</span>
                                 <span className="text-xl font-black text-amber-500">৳{msg.data.total}</span>
                              </div>
                           </div>
                           <div className="pt-4 space-y-3">
                              <p className="font-bangla text-[11px] text-zinc-500 text-center italic">বিকাশ <b className="text-white">০১৩৪৬-৬৪৬০৭৫</b> নম্বরে পেমেন্ট করে TrxID দিন।</p>
                              <input 
                                type="text" 
                                placeholder="Enter TrxID" 
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-center text-lg font-black focus:border-amber-600 outline-none uppercase placeholder:text-zinc-800" 
                                value={trxInput}
                                onChange={(e) => setTrxInput(e.target.value.toUpperCase())}
                              />
                              <button 
                                onClick={confirmFinalOrder}
                                disabled={trxInput.length < 4}
                                className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-30 text-black py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all"
                              >
                                CONFIRM ORDER
                              </button>
                           </div>
                        </div>
                     </div>
                   )}

                   {msg.type === 'success' && (
                     <div className="mt-2 flex flex-col items-center gap-3 p-6 bg-green-500/5 rounded-3xl border border-green-500/20 text-center animate-in zoom-in">
                        <CheckCircle2 size={32} className="text-green-500" />
                        <h4 className="text-lg font-black text-white uppercase tracking-tight">Confirmed!</h4>
                        <p className="font-bangla text-xs text-zinc-400 italic">রান্নাঘরে প্রস্তুতি শুরু হয়েছে।</p>
                     </div>
                   )}
                </div>
             </div>
           ))}
           {isTyping && (
             <div className="flex justify-start">
                <div className="bg-white/5 p-3 px-5 rounded-2xl flex gap-1.5 items-center">
                   <div className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                   <div className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
             </div>
           )}
           <div ref={chatEndRef} />
        </div>

        {/* Input Footer - Compact & Professional */}
        <div className="p-4 bg-zinc-900/60 border-t border-white/5 backdrop-blur-3xl sticky bottom-0">
           <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="সুলতানাকে কিছু বলুন..." 
                className="flex-1 bg-black border border-white/10 rounded-full px-5 py-3 text-white outline-none focus:border-amber-600 transition-all font-bangla text-sm sm:text-base placeholder:opacity-30"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="p-3 bg-amber-600 hover:bg-amber-500 text-black rounded-full transition-all disabled:opacity-30 active:scale-90 shadow-lg shadow-amber-600/20"
              >
                 <Send size={18} />
              </button>
           </div>
           <div className="mt-3 flex justify-center items-center gap-2 opacity-30 select-none">
              <span className="text-[7px] font-black uppercase tracking-[0.3em] text-white">Sultana AI Engine v5.0</span>
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AIAssistant;
