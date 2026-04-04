import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Info, Camera, Send, Flower2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Message } from '../types';

export default function Chat() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'host',
      text: 'Welcome! I just took a photo of your plot today, everything is looking great.',
      timestamp: '10:42 AM'
    },
    {
      id: '2',
      sender: 'host',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwIOQBPa6b1KAQ_yhhySZGMdPsaV_6XpEtvdTfZGEUY6kMYGWOFxRHyw9logzqpnlHuVofKTy2uM4sjSK8td213qD4W0d5NE_7mvFF5BI7ezakgvo2ejEaNv8lp9Oy9kiFkzjKZxaQ4_fb-DpV_GJTyaP5lQ5_GrzxLTzbr-SklkaTixY4vYJhb2HaD8MrugcjPZlUKrU4-O_ojRpnmxn8orNvneQ_qp1uiDG4QjYMU7Vf7ow6rq1xbW8uKbJ88hmP2iJyNY6u7bWV',
      timestamp: '10:43 AM'
    },
    {
      id: '3',
      sender: 'user',
      text: 'Thanks Elena! The soil looks perfect.',
      timestamp: '10:45 AM'
    }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <div className="bg-surface min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-stone-100/50 transition-colors active:scale-95 duration-150 rounded-full">
              <ArrowLeft className="w-6 h-6 text-primary" />
            </button>
            <div className="flex items-center gap-3">
              <img 
                alt="Elena" 
                className="w-10 h-10 rounded-full object-cover border-2 border-primary-fixed" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsgcTAR1cqRFcuKylVY78laMjI7QO85P_hjaOOfF0ies5S6ch3acvjIfkL9FRqPvdEgWHsq1bB-Iej-73Gy-tEiaTdcPik5x-aqBk4D1dXM8juKcbgXD01XMr6rDt8v4PccIL7PhduWVndbLfBfUNoRZThm1imKg9njCLnR80K45zLlIkzkuLdPydYorBNwEEagNTm4ZAPm7FCWaGuBZmITSCJLzl5w0GbdzzIiOAwFQUGj1BTbalixT0PfSASORJdNl3SYLHzO_b2" 
              />
              <div>
                <h1 className="font-manrope font-bold text-on-surface text-lg leading-tight">Elena</h1>
                <p className="text-[11px] font-medium text-primary uppercase tracking-wide">Usually responds within 1 hour</p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full">
            <Flower2 className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-on-surface">The Apple Orchard Plot</span>
          </div>
          <button className="p-2 hover:bg-stone-100/50 transition-colors active:scale-95 duration-150 rounded-full">
            <Bell className="w-6 h-6 text-primary" />
          </button>
        </div>
      </header>

      {/* Main Chat Canvas */}
      <main className="flex-grow pt-24 pb-32 px-4 md:px-8 max-w-3xl mx-auto w-full flex flex-col">
        {/* Context Banner for Mobile */}
        <div className="md:hidden mb-6 px-4 py-3 bg-surface-container-low rounded-xl flex items-center gap-3">
          <Info className="w-5 h-5 text-primary" />
          <p className="text-sm font-medium text-on-surface">Discussing: <span className="font-bold">The Apple Orchard Plot</span></p>
        </div>

        {/* Chat History */}
        <div className="flex-grow space-y-6">
          <div className="flex justify-center">
            <span className="px-4 py-1 bg-surface-container-high rounded-full text-[10px] font-bold text-outline uppercase tracking-widest">Today</span>
          </div>

          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-end gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : ''}`}>
                <div className={`px-5 py-3 rounded-2xl shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-br from-primary to-primary-container text-white rounded-br-none' 
                    : 'bg-surface-container-highest text-on-surface rounded-bl-none'
                }`}>
                  {msg.text && <p className="text-sm leading-relaxed font-medium">{msg.text}</p>}
                  {msg.image && (
                    <div className="overflow-hidden rounded-xl">
                      <img src={msg.image} alt="Plot" className="w-full h-auto aspect-video object-cover" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-outline px-1">{msg.timestamp}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Bottom Input Area */}
      <div className="fixed bottom-0 left-0 w-full bg-background/90 backdrop-blur-xl px-4 pb-8 pt-4 z-50 border-t border-outline-variant/10">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button className="w-12 h-12 flex items-center justify-center bg-surface-container-high rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-colors active:scale-90">
            <Camera className="w-6 h-6" />
          </button>
          <div className="flex-grow relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-full py-3.5 px-6 text-sm font-medium placeholder:text-outline outline-none transition-all" 
              placeholder="Message Elena..." 
              type="text"
            />
          </div>
          <button 
            onClick={handleSend}
            className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full shadow-lg shadow-primary/20 active:scale-90 transition-transform"
          >
            <Send className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
