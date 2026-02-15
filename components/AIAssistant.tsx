
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
  const [initError, setInitError] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInstanceRef = useRef<any>(null);

  // Robust Initialization
  useEffect(() => {
    if (isOpen && !chatInstanceRef.current) {
      try {
        const apiKey = process.env.API_KEY || (window as any).process?.env?.API_KEY;
        if (!apiKey) {
          console.error("API Key is missing. Check your Vercel Environment Variables.");
          // We don't throw, just allow local basic interaction if possible or show error in chat
          return;
        }

        const ai = new GoogleGenAI({ apiKey });
        chatInstanceRef.current = ai.chats.create({
          model: 'gemini-2.5-flash-lite-latest',
          config: {
            systemInstruction: `আপনি 'সুলতানা', এন সুলতান রেস্টুরেন্টের একজন প্রফেশনাল সার্ভিস গার্ল। কথা শুরু করবেন 'আসসালামু আলাইকুম' বলে। শুধু বাংলা ভাষায় কথা বলবেন। কাস্টমার মেনু দেখতে চাইলে 'মেনু' দেখান। ডেলিভারি চার্জ ৫০ টাকা। বিকাশ নম্বর ০১৩৪৬-৬৪৬০৭৫।`,
          }
        });
      } catch (err) {
        console.error("AI Initialization Failed:", err);
        setInitError("AI সার্ভিসটি এই মুহূর্তে কাজ করছে না। দয়া করে পরে চেষ্টা করুন।");
      }
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const processResponse = async (userText: string) => {
    if (isTyping) return;
    setIsTyping(true);

    try {
      if (!chatInstanceRef.current) {
        // Fallback simple response if AI is not ready
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'model', 
          text: 'দুঃখিত, আমি এই মুহূর্তে অনলাইনে নেই। আমাদের মেনু দেখতে এবং অর্ডার করতে ওয়েবসাইট ব্যবহার করুন।', 
          timestamp: new Date() 
        }]);
        setIsTyping(false);
        return;
      }

      const result = await chatInstanceRef.current.sendMessage({ message: userText });
      const responseText = result.text;
      
      if (responseText) {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'model', 
          text: responseText, 
          timestamp: new Date() 
        }]);
      }

      // Check for keywords manually if function calling fails or for simpler logic
      const lowerText = userText.toLowerCase();
      if (lowerText.includes('মেনু') || lowerText.includes('খাবার') || lowerText.includes('menu')) {
        setMessages(prev => [...prev, { 
          id: 'menu-'+Date.now(), 
          role: 'model', 
          text: 'আমাদের সিগনেচার মেনুগুলো নিচে দেওয়া হলো:', 
          type: 'menu', 
          data: menuItems, 
          timestamp: new Date() 
        }]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { id: 'err', role: 'model', text: 'দুঃখিত, সংযোগে ত্রুটি হয়েছে। আবার চেষ্টা করুন।', timestamp: new Date() }]);
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
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: `${item.nameBn} অর্ডার করতে চাই`, timestamp: new Date() }]);
    
    // Simulate order preview logic for now
    const total = item.price + 50;
    const orderPreview = { customerName: 'সম্মানিত কাস্টমার', phone: 'প্রয়োজন', address: 'প্রয়োজন', items: [item], total };
    setPendingOrder(orderPreview);
    
    setMessages(prev => [...prev, { 
      id: 'pay-'+Date.now(), 
      role: 'model', 
      text: `আপনি **${item.nameBn}** পছন্দ করেছেন। ডেলিভারি চার্জসহ মোট বিল ${total} টাকা। নিচে পেমেন্ট ডিটেইলস দেওয়া হলো:`, 
      type: 'payment', 
      data: orderPreview, 
      timestamp: new Date() 
    }]);
  };

  const confirmFinalOrder = () => {
    if (trxInput.length < 4) return;
    onNewOrder({ ...pendingOrder, trxId: trxInput, status: 'pending', timestamp: new Date().toISOString() });
    setMessages(prev => [...prev, { id: 'success-'+Date.now(), role: 'model', text: 'আলহামদুলিল্লাহ! আপনার অর্ডারটি নিশ্চিত করা হয়েছে। শীঘ্রই আমরা আপনার ঠিকানায় খাবার পৌঁছে দেবো।', type: 'success', timestamp: new Date() }]);
    setTrxInput('');
    setPendingOrder(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-all duration-300">
      <div className="w-full max-w-[480px] h-[90vh] sm:h-[80vh] bg-[#080808] sm:rounded-[30px] rounded-t-[30px] border border-white/10 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Compact Header */}
        <div className="p-4 bg-zinc-900/80 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="relative">
                 <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop" className="w-10 h-10 rounded-full border border-amber-600/50" alt="Sultana" />
                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
              </div>
              <div>
                 <h4 className="text-white font-bold text-sm tracking-tighter">SULTANA AI</h4>
                 <p className="text-[9px] text-zinc-500 font-bold uppercase">Online & Active</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 bg-white/5 hover:bg-red-600 text-white rounded-full transition-colors">
              <X size={18} />
           </button>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-amber-600/[0.02] to-transparent custom-scrollbar">
           {initError && (
             <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-2xl text-red-500 text-xs text-center font-bold">
               {initError}
             </div>
           )}
           {messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                <div className={`w-full ${msg.role === 'user' ? 'max-w-[80%]' : 'max-w-full'} flex flex-col gap-2`}>
                   <div 
                     className={`p-4 rounded-2xl text-sm leading-relaxed ${
                       msg.role === 'user' 
                       ? 'bg-amber-600 text-black font-bold rounded-tr-none self-end' 
                       : 'bg-white/5 border border-white/10 text-white font-bangla rounded-tl-none'
                     }`}
                     dangerouslySetInnerHTML={{ __html: msg.text }}
                   />

                   {msg.type === 'menu' && (
                     <div className="grid grid-cols-1 gap-2 mt-1">
                        {msg.data.slice(0, 4).map((item: FoodItem) => (
                          <div 
                            key={item.id} 
                            onClick={() => handleItemClick(item)}
                            className="bg-zinc-900 border border-white/5 p-2 rounded-xl flex gap-3 hover:border-amber-600 transition-all cursor-pointer active:scale-95 group"
                          >
                             <img src={item.image} className="w-12 h-12 rounded-lg object-cover" />
                             <div className="flex-1 flex flex-col justify-center overflow-hidden">
                                <h5 className="text-white font-bold text-[11px] truncate uppercase">{item.nameEn}</h5>
                                <p className="text-amber-500 font-black text-xs">৳{item.price}</p>
                             </div>
                             <ChevronRight className="text-zinc-700 group-hover:text-amber-600 self-center" size={14} />
                          </div>
                        ))}
                     </div>
                   )}

                   {msg.type === 'payment' && (
                     <div className="mt-2 bg-zinc-900/90 border border-amber-600/20 p-5 rounded-3xl space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                           <span className="text-[10px] font-black text-amber-500">PAYMENT SUMMARY</span>
                           <CreditCard size={14} className="text-pink-500" />
                        </div>
                        <div className="flex justify-between text-xs font-bold text-white">
                           <span>Total Payable</span>
                           <span className="text-amber-500 text-lg">৳{msg.data.total}</span>
                        </div>
                        <div className="space-y-3 pt-2">
                           <p className="text-[10px] text-zinc-500 text-center font-bangla leading-tight italic">বিকাশ <b className="text-white">০১৩৪৬-৬৪৬০৭৫</b> নম্বরে সেন্ড মানি করে TrxID দিন।</p>
                           <input 
                             type="text" 
                             placeholder="Enter TrxID" 
                             className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-center font-black focus:border-amber-600 outline-none uppercase" 
                             value={trxInput}
                             onChange={(e) => setTrxInput(e.target.value.toUpperCase())}
                           />
                           <button 
                             onClick={confirmFinalOrder}
                             disabled={trxInput.length < 4}
                             className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-20 text-black py-3 rounded-xl font-black text-xs uppercase transition-all"
                           >
                             CONFIRM ORDER
                           </button>
                        </div>
                     </div>
                   )}

                   {msg.type === 'success' && (
                     <div className="mt-2 bg-green-500/5 border border-green-500/20 p-5 rounded-3xl text-center space-y-2 animate-in zoom-in">
                        <CheckCircle2 size={30} className="text-green-500 mx-auto" />
                        <h5 className="text-white font-black text-sm uppercase">Order Received!</h5>
                        <p className="font-bangla text-[10px] text-zinc-400">আপনার ভোজসভা প্রস্তুতির কাজ শুরু হয়েছে।</p>
                     </div>
                   )}
                </div>
             </div>
           ))}
           {isTyping && (
             <div className="flex justify-start">
                <div className="bg-white/5 px-4 py-2 rounded-full flex gap-1 items-center">
                   <div className="w-1 h-1 bg-amber-600 rounded-full animate-bounce"></div>
                   <div className="w-1 h-1 bg-amber-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                   <div className="w-1 h-1 bg-amber-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
             </div>
           )}
           <div ref={chatEndRef} />
        </div>

        {/* Compact Footer Input */}
        <div className="p-4 bg-zinc-900 border-t border-white/5">
           <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="সুলতানাকে কিছু জিজ্ঞাসা করুন..." 
                className="flex-1 bg-black border border-white/10 rounded-full px-5 py-3 text-white outline-none focus:border-amber-600 transition-all font-bangla text-xs sm:text-sm"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="p-3 bg-amber-600 hover:bg-amber-500 text-black rounded-full transition-all disabled:opacity-20 active:scale-90"
              >
                 <Send size={16} />
              </button>
           </div>
           <p className="mt-3 text-[7px] text-center text-zinc-600 font-bold uppercase tracking-[0.3em]">AI Concierge System v5.1</p>
        </div>

      </div>
    </div>
  );
};

export default AIAssistant;
