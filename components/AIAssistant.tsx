
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
      text: 'আসসালামু আলাইকুম! আমি সুলতানা। এন সুলতান রেস্টুরেন্টের পক্ষ থেকে আপনাকে স্বাগত জানাচ্ছি। আজ আপনার জন্য কী করতে পারি?', 
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [trxInput, setTrxInput] = useState('');
  const [pendingOrder, setPendingOrder] = useState<any>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const processResponse = async (userText: string) => {
    if (isTyping) return;
    setIsTyping(true);

    try {
      // Strictly following initialization guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: userText }] }
        ],
        config: {
          systemInstruction: `আপনি 'সুলতানা', এন সুলতান (N Sultan) রেস্টুরেন্টের একজন অত্যন্ত প্রফেশনাল এবং বিনয়ী সার্ভিস গার্ল। 
          ১. সব সময় 'আসসালামু আলাইকুম' বলে কথা শুরু করবেন।
          ২. শুধুমাত্র শুদ্ধ বাংলা ভাষায় কথা বলবেন।
          ৩. কাস্টমার যদি মেনু দেখতে চায় বা খাবারের তালিকা চায়, তবে তাকে মেনু অপশন দিবেন।
          ৪. ডেলিভারি চার্জ সব সময় ৫০ টাকা।
          ৫. পেমেন্ট করতে বললে বিকাশ নম্বর ০১৩৪৬-৬৪৬০৭৫ দিবেন।
          ৬. কাস্টমারকে খাবারের গুণাগুণ এবং আভিজাত্য সম্পর্কে অনুপ্রাণিত করবেন।`,
        },
      });

      const responseText = response.text;
      
      if (responseText) {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'model', 
          text: responseText, 
          timestamp: new Date() 
        }]);
      }

      // Detection for UI elements
      const lowerText = userText.toLowerCase();
      if (lowerText.includes('মেনু') || lowerText.includes('খাবার') || lowerText.includes('menu')) {
        setMessages(prev => [...prev, { 
          id: 'menu-'+Date.now(), 
          role: 'model', 
          text: 'সুলতানি হেঁশেলের সেরা কিছু আয়োজন আপনার জন্য এখানে দেওয়া হলো:', 
          type: 'menu', 
          data: menuItems, 
          timestamp: new Date() 
        }]);
      }
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, { 
        id: 'err-'+Date.now(), 
        role: 'model', 
        text: 'দুঃখিত, সংযোগে সামান্য সমস্যা হয়েছে। অনুগ্রহ করে কিছু সময় পর আবার চেষ্টা করুন অথবা আমাদের কল করুন।', 
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
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: `${item.nameBn} টি অর্ডার করতে চাই।`, timestamp: new Date() }]);
    
    const total = item.price + 50;
    const orderPreview = { customerName: 'সম্মানিত সুলতান', phone: '', address: '', items: [item], total };
    setPendingOrder(orderPreview);
    
    setMessages(prev => [...prev, { 
      id: 'pay-'+Date.now(), 
      role: 'model', 
      text: `অপূর্ব পছন্দ! **${item.nameBn}** আমাদের অন্যতম সেরা সৃষ্টি। ডেলিভারি চার্জসহ আপনার মোট বিল **${total} টাকা**। নিচে পেমেন্ট করার তথ্য দেওয়া হলো:`, 
      type: 'payment', 
      data: orderPreview, 
      timestamp: new Date() 
    }]);
    
    processResponse(`${item.nameEn} এর স্বাদ কেমন হবে আমাকে বলো।`);
  };

  const confirmFinalOrder = () => {
    if (trxInput.length < 4) return;
    onNewOrder({ ...pendingOrder, trxId: trxInput, status: 'pending', timestamp: new Date().toISOString() });
    setMessages(prev => [...prev, { id: 'success-'+Date.now(), role: 'model', text: 'আপনার অর্ডারটি নিশ্চিত করা হয়েছে। সুলতানি স্বাদের খাবার খুব শীঘ্রই আপনার দরজায় পৌঁছে যাবে। ইনশাআল্লাহ!', type: 'success', timestamp: new Date() }]);
    setTrxInput('');
    setPendingOrder(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4">
      <div className="w-full max-w-[500px] h-[95vh] sm:h-[85vh] bg-[#050505] sm:rounded-[40px] rounded-t-[40px] border border-white/10 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-6 bg-zinc-900/80 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="relative">
                 <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop" className="w-12 h-12 rounded-full border-2 border-amber-600/50 object-cover" alt="Sultana" />
                 <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-4 border-zinc-900 animate-pulse"></div>
              </div>
              <div>
                 <h4 className="text-white font-black text-lg tracking-tighter uppercase">SULTANA AI</h4>
                 <p className="text-[10px] text-green-500 font-black uppercase tracking-widest">Always Active</p>
              </div>
           </div>
           <button onClick={onClose} className="p-3 bg-white/5 hover:bg-red-600 text-white rounded-full transition-all">
              <X size={20} />
           </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gradient-to-b from-amber-600/5 to-transparent custom-scrollbar">
           {messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                <div className={`max-w-[85%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                   <div 
                     className={`p-5 rounded-3xl text-sm sm:text-base leading-relaxed shadow-xl ${
                       msg.role === 'user' 
                       ? 'bg-amber-600 text-black font-black rounded-tr-none' 
                       : 'bg-zinc-900 border border-white/5 text-gray-100 font-bangla rounded-tl-none'
                     }`}
                     dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }}
                   />

                   {msg.type === 'menu' && (
                     <div className="grid grid-cols-1 gap-2 w-full mt-2">
                        {msg.data.slice(0, 5).map((item: FoodItem) => (
                          <div 
                            key={item.id} 
                            onClick={() => handleItemClick(item)}
                            className="bg-black border border-white/5 p-3 rounded-2xl flex gap-4 hover:border-amber-600 transition-all cursor-pointer group"
                          >
                             <img src={item.image} className="w-12 h-12 rounded-xl object-cover" />
                             <div className="flex-1">
                                <h5 className="text-white font-black text-[10px] uppercase tracking-tighter">{item.nameEn}</h5>
                                <p className="text-amber-500 font-black text-sm">৳{item.price}</p>
                             </div>
                             <ChevronRight className="text-zinc-800 group-hover:text-amber-600 self-center" size={16} />
                          </div>
                        ))}
                     </div>
                   )}

                   {msg.type === 'payment' && (
                     <div className="mt-2 w-full bg-zinc-900 border border-amber-600/20 p-6 rounded-[35px] space-y-4">
                        <div className="flex justify-between items-center text-amber-500 font-black text-[10px] tracking-[0.3em]">
                           <span>PAYMENT PORTAL</span>
                           <CreditCard size={14} />
                        </div>
                        <div className="bg-black/50 p-4 rounded-2xl border border-white/5 text-center">
                           <p className="text-[10px] text-zinc-600 font-bold uppercase mb-1">bKash Number (Send Money)</p>
                           <p className="text-2xl font-black text-white">01346-646075</p>
                        </div>
                        <input 
                          type="text" 
                          placeholder="TrxID..."
                          className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-white text-center font-black focus:border-amber-600 outline-none uppercase"
                          value={trxInput}
                          onChange={e => setTrxInput(e.target.value.toUpperCase())}
                        />
                        <button 
                          onClick={confirmFinalOrder}
                          className="w-full bg-amber-600 hover:bg-amber-500 text-black py-4 rounded-2xl font-black text-sm uppercase transition-all shadow-xl active:scale-95"
                        >
                          CONFIRM & ORDER
                        </button>
                     </div>
                   )}

                   {msg.type === 'success' && (
                     <div className="mt-2 w-full bg-green-500/10 border border-green-500/20 p-6 rounded-[35px] text-center space-y-2">
                        <CheckCircle2 size={40} className="text-green-500 mx-auto" />
                        <h5 className="text-white font-black text-base uppercase">PAYMENT SUCCESS</h5>
                        <p className="font-bangla text-xs text-gray-500">অর্ডার প্রসেসিং হচ্ছে...</p>
                     </div>
                   )}
                </div>
             </div>
           ))}
           {isTyping && (
             <div className="flex justify-start">
                <div className="bg-white/5 px-4 py-2 rounded-full flex gap-1">
                   <div className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-pulse"></div>
                   <div className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                   <div className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
             </div>
           )}
           <div ref={chatEndRef} />
        </div>

        {/* Input Field */}
        <div className="p-5 bg-zinc-900 border-t border-white/5">
           <div className="flex items-center gap-3">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message Sultana..." 
                className="flex-1 bg-black border border-white/10 rounded-full px-6 py-4 text-white text-sm focus:border-amber-600 outline-none transition-all font-bangla"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="p-4 bg-amber-600 hover:bg-amber-500 text-black rounded-full transition-all active:scale-95 shadow-xl shadow-amber-600/20"
              >
                 <Send size={18} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
