
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const processResponse = async (userText: string) => {
    if (isTyping) return;
    setIsTyping(true);

    try {
      // Create AI instance directly inside the handler for maximum reliability
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        console.error("CRITICAL: API_KEY is undefined in process.env. Please check Vercel settings.");
      }
      
      const ai = new GoogleGenAI({ apiKey: apiKey || '' });
      
      // Manually build history for the model
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
          systemInstruction: `আপনি 'সুলতানা', এন সুলতান (N Sultan) রেস্টুরেন্টের একজন অত্যন্ত প্রফেশনাল সার্ভিস গার্ল। 
          ১. সব সময় 'আসসালামু আলাইকুম' বলে কথা শুরু করবেন।
          ২. শুধুমাত্র শুদ্ধ বাংলা ভাষায় কথা বলবেন।
          ৩. কাস্টমার যদি মেনু দেখতে চায় বা খাবারের তালিকা চায়, তবে তাকে মেনু অপশন দিবেন।
          ৪. ডেলিভারি চার্জ সব সময় ৫০ টাকা।
          ৫. পেমেন্ট করতে বললে বিকাশ নম্বর ০১৩৪৬-৬৪৬০৭৫ দিবেন।
          ৬. আপনি খুব বিনয়ী এবং সাহায্যকারী।`,
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
      if (lowerText.includes('মেনু') || lowerText.includes('খাবার') || lowerText.includes('menu') || lowerText.includes('list')) {
        setMessages(prev => [...prev, { 
          id: 'menu-'+Date.now(), 
          role: 'model', 
          text: 'এখানে আমাদের সেরা কিছু খাবারের তালিকা দেওয়া হলো:', 
          type: 'menu', 
          data: menuItems, 
          timestamp: new Date() 
        }]);
      }
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      // Detailed error logging for the user to debug Vercel issues
      const errorMsg = error?.message || "Unknown error";
      setMessages(prev => [...prev, { 
        id: 'err-'+Date.now(), 
        role: 'model', 
        text: `দুঃখিত, সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়েছে। (Error: ${errorMsg.slice(0, 50)}...). দয়া করে আবার চেষ্টা করুন।`, 
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
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: `${item.nameBn} টি নিতে চাই।`, timestamp: new Date() }]);
    
    const total = item.price + 50;
    const orderPreview = { customerName: 'সম্মানিত অতিথি', phone: '', address: '', items: [item], total };
    setPendingOrder(orderPreview);
    
    setMessages(prev => [...prev, { 
      id: 'pay-'+Date.now(), 
      role: 'model', 
      text: `চমৎকার পছন্দ! **${item.nameBn}** এর স্বাদ আপনাকে মুগ্ধ করবে। ডেলিভারি চার্জসহ আপনার মোট বিল **${total} টাকা**। নিচে পেমেন্ট করার তথ্য দেওয়া হলো:`, 
      type: 'payment', 
      data: orderPreview, 
      timestamp: new Date() 
    }]);
    
    processResponse(`${item.nameEn} নিয়ে কিছু রাজকীয় কথা বলো।`);
  };

  const confirmFinalOrder = () => {
    if (trxInput.length < 4) return;
    onNewOrder({ ...pendingOrder, trxId: trxInput, status: 'pending', timestamp: new Date().toISOString() });
    setMessages(prev => [...prev, { id: 'success-'+Date.now(), role: 'model', text: 'আলহামদুলিল্লাহ! আপনার অর্ডারটি নিশ্চিত করা হয়েছে। খুব দ্রুত আপনার কাছে খাবার পৌঁছে যাবে।', type: 'success', timestamp: new Date() }]);
    setTrxInput('');
    setPendingOrder(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 transition-all duration-500">
      <div className="w-full max-w-[500px] h-[95vh] sm:h-[85vh] bg-[#050505] sm:rounded-[40px] rounded-t-[40px] border border-white/10 flex flex-col overflow-hidden shadow-[0_0_100px_rgba(217,119,6,0.2)]">
        
        {/* Header */}
        <div className="p-6 bg-zinc-900/80 border-b border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="relative">
                 <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop" className="w-12 h-12 rounded-full border-2 border-amber-600/50 object-cover shadow-2xl" alt="Sultana" />
                 <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-4 border-zinc-900 animate-pulse"></div>
              </div>
              <div>
                 <h4 className="text-white font-black text-lg tracking-tighter">SULTANA AI</h4>
                 <p className="text-[10px] text-green-500 font-black uppercase tracking-widest">Active Now</p>
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
                     className={`p-5 rounded-3xl text-sm sm:text-base leading-relaxed shadow-2xl ${
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
                                <h5 className="text-white font-black text-xs uppercase tracking-tighter">{item.nameEn}</h5>
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
                           <span>PAYMENT VERIFICATION</span>
                           <CreditCard size={14} />
                        </div>
                        <div className="bg-black/50 p-4 rounded-2xl border border-white/5 text-center">
                           <p className="text-[10px] text-zinc-600 font-bold uppercase mb-1">bKash Number</p>
                           <p className="text-2xl font-black text-white">01346-646075</p>
                        </div>
                        <input 
                          type="text" 
                          placeholder="TrxID (e.g. 8N6...)"
                          className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-white text-center font-black focus:border-amber-600 outline-none uppercase"
                          value={trxInput}
                          onChange={e => setTrxInput(e.target.value.toUpperCase())}
                        />
                        <button 
                          onClick={confirmFinalOrder}
                          disabled={trxInput.length < 4}
                          className="w-full bg-amber-600 hover:bg-amber-500 text-black py-4 rounded-2xl font-black text-sm uppercase transition-all shadow-xl active:scale-95"
                        >
                          CONFIRM PAYMENT
                        </button>
                     </div>
                   )}

                   {msg.type === 'success' && (
                     <div className="mt-2 w-full bg-green-500/10 border border-green-500/20 p-6 rounded-[35px] text-center space-y-2">
                        <CheckCircle2 size={40} className="text-green-500 mx-auto" />
                        <h5 className="text-white font-black text-base uppercase">PAYMENT SUCCESS</h5>
                        <p className="font-bangla text-xs text-gray-500">আপনার রাজকীয় ভোজ এখন প্রস্তুত হচ্ছে।</p>
                     </div>
                   )}
                </div>
             </div>
           ))}
           {isTyping && (
             <div className="flex justify-start animate-pulse">
                <div className="bg-white/5 px-4 py-2 rounded-full flex gap-1">
                   <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                   <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                   <div className="w-1.5 h-1.5 bg-amber-600 rounded-full"></div>
                </div>
             </div>
           )}
           <div ref={chatEndRef} />
        </div>

        {/* Input */}
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
