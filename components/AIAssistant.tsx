
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { X, Send, ShoppingBag, CheckCircle2, CreditCard, Clock, ChevronRight, MessageCircle } from 'lucide-react';
import { FoodItem, Order } from '../types.ts';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  type?: 'text' | 'menu' | 'payment' | 'success';
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

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, menuItems, onNewOrder, onNewBooking }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'model', 
      text: 'আসসালামু আলাইকুম! আমি সুলতানা। আজ আপনার সেবায় কীভাবে নিয়োজিত হতে পারি?', 
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

  // Initialize AI logic
  const initAI = () => {
    if (chatInstanceRef.current) return chatInstanceRef.current;

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        console.warn("API_KEY is missing. Ensure it is added in Vercel Environment Variables.");
      }

      const ai = new GoogleGenAI({ apiKey: apiKey || '' });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `আপনি 'সুলতানা', এন সুলতান রেস্টুরেন্টের একজন অত্যন্ত প্রফেশনাল এবং মিষ্টিভাষী সার্ভিস গার্ল। আপনার বৈশিষ্ট্য:
          - কথা শুরু করবেন 'আসসালামু আলাইকুম' দিয়ে।
          - শুধুমাত্র বাংলা ভাষায় কথা বলবেন।
          - খাবারের নাম আসলে সেটির স্বাদ নিয়ে লোভনীয় বর্ণনা দেবেন।
          - কাস্টমার খাবার চাইলে বা মেনু দেখতে চাইলে তাকে মেনু কার্ড দেখাবেন।
          - ডেলিভারি চার্জ ৫০ টাকা ফিক্সড।
          - পেমেন্টের জন্য বিকাশ নম্বর ০১৩৪৬-৬৪৬০৭৫ ব্যবহার করবেন।`,
        }
      });
      chatInstanceRef.current = chat;
      return chat;
    } catch (err) {
      console.error("AI Initialization Error:", err);
      return null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      initAI();
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const processResponse = async (userText: string) => {
    if (isTyping) return;
    setIsTyping(true);

    try {
      const chat = initAI();
      
      if (!chat) {
        throw new Error("AI could not be initialized");
      }

      const result = await chat.sendMessage({ message: userText });
      const responseText = result.text;
      
      if (responseText) {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'model', 
          text: responseText, 
          timestamp: new Date() 
        }]);
      }

      // Contextual UI triggers
      const lowerText = userText.toLowerCase();
      if (lowerText.includes('মেনু') || lowerText.includes('খাবার') || lowerText.includes('menu') || lowerText.includes('list')) {
        setMessages(prev => [...prev, { 
          id: 'menu-'+Date.now(), 
          role: 'model', 
          text: 'আমাদের সিগনেচার মেনুগুলো এখান থেকে দেখে আপনার পছন্দের খাবারটি বেছে নিন:', 
          type: 'menu', 
          data: menuItems, 
          timestamp: new Date() 
        }]);
      }
    } catch (error) {
      console.error("Chat Execution Error:", error);
      setMessages(prev => [...prev, { 
        id: 'err-'+Date.now(), 
        role: 'model', 
        text: 'দুঃখিত, সার্ভারের সাথে সংযোগে সামান্য সমস্যা হচ্ছে। দয়া করে আবার চেষ্টা করুন বা সরাসরি আমাদের নম্বরে কল করুন।', 
        timestamp: new Date() 
      }]);
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
    const userMsg = `${item.nameBn} সম্পর্কে জানতে চাই এবং এটি অর্ডার করতে চাই।`;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: `${item.nameBn} পছন্দ হয়েছে`, timestamp: new Date() }]);
    
    const total = item.price + 50;
    const orderPreview = { customerName: 'সম্মানিত সুলতান', phone: 'প্রয়োজন', address: 'প্রয়োজন', items: [item], total };
    setPendingOrder(orderPreview);
    
    setMessages(prev => [...prev, { 
      id: 'pay-'+Date.now(), 
      role: 'model', 
      text: `চমৎকার পছন্দ! আমাদের **${item.nameBn}** অত্যন্ত জনপ্রিয় এবং সুস্বাদু। এটি আপনার টেবিলে পৌঁছে দিতে ডেলিভারি চার্জসহ মোট বিল **${total} টাকা**। নিচে পেমেন্ট সম্পন্ন করার তথ্য দেওয়া হলো:`, 
      type: 'payment', 
      data: orderPreview, 
      timestamp: new Date() 
    }]);
    
    // Also trigger AI to talk about the food
    processResponse(userMsg);
  };

  const confirmFinalOrder = () => {
    if (trxInput.length < 4) return;
    onNewOrder({ ...pendingOrder, trxId: trxInput, status: 'pending', timestamp: new Date().toISOString() });
    setMessages(prev => [...prev, { id: 'success-'+Date.now(), role: 'model', text: 'আলহামদুলিল্লাহ! আপনার অর্ডারটি সিস্টেমে যুক্ত করা হয়েছে। খুব দ্রুত আমাদের ডেলিভারি সুলতান আপনার ঠিকানায় পৌঁছে যাবে। আমাদের সাথে থাকার জন্য ধন্যবাদ।', type: 'success', timestamp: new Date() }]);
    setTrxInput('');
    setPendingOrder(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-[480px] h-[95vh] sm:h-[85vh] bg-[#050505] sm:rounded-[40px] rounded-t-[40px] border border-white/10 flex flex-col overflow-hidden shadow-[0_0_100px_rgba(217,119,6,0.15)]">
        
        {/* Luxury Header */}
        <div className="p-5 bg-zinc-900/60 border-b border-white/5 flex items-center justify-between backdrop-blur-xl">
           <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                 <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop" className="w-12 h-12 rounded-full border-2 border-amber-600/40 group-hover:border-amber-500 transition-all shadow-lg shadow-amber-600/10" alt="Sultana" />
                 <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
              </div>
              <div>
                 <h4 className="text-white font-black text-base tracking-tighter uppercase">SULTANA <span className="text-amber-600">AI</span></h4>
                 <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <p className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.2em]">Ready to Serve</p>
                 </div>
              </div>
           </div>
           <button onClick={onClose} className="p-3 bg-white/5 hover:bg-red-600 text-white rounded-full transition-all active:scale-90">
              <X size={20} />
           </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-8 bg-[radial-gradient(circle_at_50%_0%,rgba(217,119,6,0.03),transparent)] custom-scrollbar">
           {messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-3 duration-500`}>
                <div className={`w-full ${msg.role === 'user' ? 'max-w-[85%]' : 'max-w-full'} flex flex-col gap-3`}>
                   <div 
                     className={`p-5 rounded-[25px] text-sm sm:text-base leading-relaxed ${
                       msg.role === 'user' 
                       ? 'bg-amber-600 text-black font-black rounded-tr-none self-end shadow-xl shadow-amber-600/10' 
                       : 'bg-zinc-900/50 border border-white/5 text-gray-100 font-bangla rounded-tl-none'
                     }`}
                     dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }}
                   />

                   {msg.type === 'menu' && (
                     <div className="grid grid-cols-1 gap-3 mt-1">
                        {msg.data.slice(0, 5).map((item: FoodItem) => (
                          <div 
                            key={item.id} 
                            onClick={() => handleItemClick(item)}
                            className="bg-zinc-900/80 border border-white/10 p-3 rounded-2xl flex gap-4 hover:border-amber-600 transition-all cursor-pointer active:scale-95 group shadow-lg"
                          >
                             <img src={item.image} className="w-14 h-14 rounded-xl object-cover" />
                             <div className="flex-1 flex flex-col justify-center">
                                <h5 className="text-white font-black text-xs truncate uppercase tracking-tight">{item.nameEn}</h5>
                                <p className="text-amber-500 font-black text-sm">৳{item.price}</p>
                             </div>
                             <ChevronRight className="text-zinc-700 group-hover:text-amber-600 self-center" size={16} />
                          </div>
                        ))}
                     </div>
                   )}

                   {msg.type === 'payment' && (
                     <div className="mt-2 bg-zinc-900 border border-amber-600/30 p-6 rounded-[35px] space-y-5 shadow-2xl animate-in zoom-in">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                           <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">ORDER BREAKDOWN</span>
                           <CreditCard size={16} className="text-pink-500" />
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between text-xs text-zinc-400">
                              <span>Total Bill</span>
                              <span className="text-white font-bold">৳{msg.data.total}</span>
                           </div>
                           <div className="flex justify-between items-center pt-2 border-t border-white/5">
                              <span className="text-xs font-black text-zinc-200">PAYABLE</span>
                              <span className="text-2xl font-black text-amber-500">৳{msg.data.total}</span>
                           </div>
                        </div>
                        <div className="space-y-4 pt-2">
                           <div className="bg-black/50 p-4 rounded-2xl border border-white/5 text-center">
                              <p className="text-[9px] text-zinc-500 font-bangla uppercase tracking-wider mb-1">বিকাশ পেমেন্ট নম্বর</p>
                              <p className="text-xl font-black text-white tracking-widest">০১৩৪৬-৬৪৬০৭৫</p>
                           </div>
                           <input 
                             type="text" 
                             placeholder="Enter TrxID" 
                             className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-white text-center font-black focus:border-amber-600 outline-none uppercase placeholder:text-zinc-800 tracking-widest" 
                             value={trxInput}
                             onChange={(e) => setTrxInput(e.target.value.toUpperCase())}
                           />
                           <button 
                             onClick={confirmFinalOrder}
                             disabled={trxInput.length < 4}
                             className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-20 text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-amber-600/20 active:scale-95"
                           >
                             PLACE ORDER NOW
                           </button>
                        </div>
                     </div>
                   )}

                   {msg.type === 'success' && (
                     <div className="mt-2 bg-green-500/5 border border-green-500/20 p-6 rounded-[35px] text-center space-y-3 animate-in zoom-in">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
                           <CheckCircle2 size={24} className="text-black" />
                        </div>
                        <h5 className="text-white font-black text-base uppercase">Confirmed!</h5>
                        <p className="font-bangla text-xs text-zinc-400">আপনার রাজকীয় ভোজ এখন আমাদের দায়িত্ব।</p>
                     </div>
                   )}
                </div>
             </div>
           ))}
           {isTyping && (
             <div className="flex justify-start">
                <div className="bg-white/5 px-6 py-3 rounded-full flex gap-2 items-center">
                   <div className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                   <div className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
             </div>
           )}
           <div ref={chatEndRef} />
        </div>

        {/* Floating Input Area */}
        <div className="p-5 bg-zinc-900 border-t border-white/5">
           <div className="flex items-center gap-3">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="সুলতানাকে কিছু জিজ্ঞাসা করুন..." 
                className="flex-1 bg-black border border-white/10 rounded-full px-6 py-4 text-white outline-none focus:border-amber-600 transition-all font-bangla text-sm placeholder:opacity-20"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="p-4 bg-amber-600 hover:bg-amber-500 text-black rounded-full transition-all disabled:opacity-20 active:scale-90 shadow-lg shadow-amber-600/20"
              >
                 <Send size={20} />
              </button>
           </div>
           <div className="mt-4 flex justify-center items-center gap-2 opacity-20">
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white">N SULTAN AI ENGINE 3.0</span>
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AIAssistant;
