import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, User, HelpCircle, ShieldCheck, ArrowRight, Leaf } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function BookingReview() {
  const navigate = useNavigate();
  const [insurance, setInsurance] = useState(true);

  const basePrice = 45.00;
  const serviceFee = 3.50;
  const insuranceFee = insurance ? 5.00 : 0;
  const securityDeposit = 50.00;
  const total = basePrice + serviceFee + insuranceFee + securityDeposit;

  return (
    <div className="bg-surface min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-stone-100/50 transition-colors active:scale-95 duration-150">
              <ArrowLeft className="w-6 h-6 text-primary" />
            </button>
            <h1 className="font-headline font-black text-primary tracking-tighter text-2xl">PlotRent</h1>
          </div>
          <button className="p-2 rounded-full hover:bg-stone-100/50 transition-colors active:scale-95 duration-150">
            <Bell className="w-6 h-6 text-primary" />
          </button>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="space-y-2">
          <h2 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight leading-tight">Review your rental</h2>
          <p className="text-on-surface-variant font-medium">Please verify the details before completing your booking.</p>
        </div>

        {/* Summary Card */}
        <section className="bg-surface-container-low rounded-3xl p-4 md:p-6 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-40 h-40 rounded-2xl overflow-hidden shrink-0">
              <img 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuABf7-FTKepSvKC54OZMbSMl1N6gJVNhdzxLcOtddNysXXulLBT5fUX2764omXxVdB9V-71Ml3tycK-v0pSGaAQODjLPyHFwTmhPz4IvJyJyBeFTdIsxx_7X6v3VOBC3IReZb7wbywlP_eFHnGlfRGIgucsXQlmtG5sLPTv4AxsiLNWxV-w6k4YmE2QBkBOiuH9zzs_h3UhpP_6IWW9-GRr0gcbkEFFmO92kmOAYmDHtDwbngCcOR2Xvc9tRxCK_3hPbma0zMXFMqKU" 
                alt="Plot"
              />
            </div>
            <div className="flex flex-col justify-center space-y-2">
              <span className="inline-flex items-center gap-1.5 bg-secondary-fixed text-on-secondary-fixed-variant px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit">
                <Leaf className="w-3 h-3 fill-current" />
                Active Season
              </span>
              <h3 className="font-headline font-bold text-2xl text-on-surface">The Willow Creek Patch</h3>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <User className="w-4 h-4" />
                <p className="font-medium text-sm">Hosted by Sarah Jenkins</p>
              </div>
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Calendar className="w-4 h-4" />
                <p className="text-sm">April 01 - September 30</p>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Period */}
        <section className="space-y-4">
          <h4 className="font-headline font-bold text-lg px-2">Booking Period</h4>
          <div className="bg-surface-container-lowest border-outline-variant/20 border rounded-3xl p-6">
            <div className="grid grid-cols-7 gap-y-4 text-center text-sm font-medium">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-on-surface-variant/60 font-bold uppercase text-[10px] tracking-widest">{day}</div>
              ))}
              {[29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((day, i) => (
                <div key={i} className={`py-2 relative ${day >= 1 && day <= 18 ? 'bg-primary/10' : 'text-on-surface-variant/30'}`}>
                  {day === 1 && <div className="absolute inset-y-0 left-1/2 right-0 bg-primary/10"></div>}
                  <div className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full mx-auto ${day === 1 ? 'bg-primary text-white' : ''}`}>
                    {day}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center gap-6 border-t border-outline-variant/10 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-xs font-semibold text-on-surface-variant">Reserved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary/10"></div>
                <span className="text-xs font-semibold text-on-surface-variant">Range</span>
              </div>
            </div>
          </div>
        </section>

        {/* Price Breakdown */}
        <section className="space-y-4">
          <h4 className="font-headline font-bold text-lg px-2">Price Breakdown</h4>
          <div className="bg-surface-container rounded-3xl p-6 space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant font-medium">Monthly Rental</span>
              <span className="font-bold text-on-surface">${basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant font-medium">Platform Service Fee</span>
              <span className="font-bold text-on-surface">${serviceFee.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-2xl">
              <div className="flex flex-col">
                <span className="font-bold text-on-surface">Insurance Add-on</span>
                <span className="text-xs text-on-surface-variant">Covers crop damage & theft</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-on-surface">${insuranceFee.toFixed(2)}</span>
                <button 
                  onClick={() => setInsurance(!insurance)}
                  className={`w-12 h-7 rounded-full relative flex items-center px-1 transition-colors ${insurance ? 'bg-primary' : 'bg-stone-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${insurance ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-1.5">
                <span className="text-on-surface-variant font-medium">Security Deposit</span>
                <HelpCircle className="w-4 h-4 text-on-surface-variant/60" />
              </div>
              <span className="font-bold text-on-surface">${securityDeposit.toFixed(2)} <span className="text-[10px] text-on-surface-variant font-normal uppercase ml-1 tracking-wider">(Refundable)</span></span>
            </div>
            <div className="h-px bg-outline-variant/20 my-2"></div>
            <div className="flex justify-between items-center">
              <span className="font-headline font-extrabold text-xl text-on-surface">Total</span>
              <span className="font-headline font-extrabold text-2xl text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* Trust Block */}
        <div className="bg-surface-container-lowest/50 border border-outline-variant/30 rounded-2xl p-5 flex gap-4 items-start">
          <ShieldCheck className="w-10 h-10 text-primary bg-primary/10 p-2 rounded-xl fill-current" />
          <div className="space-y-1">
            <p className="font-bold text-sm text-on-surface leading-tight">Protected by PlotRent Guarantee</p>
            <p className="text-sm text-on-surface-variant leading-snug">Free cancellation within 48 hours of booking. Reliable support for your growing season.</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="pt-4">
          <button 
            onClick={() => navigate('/profile')}
            className="w-full bg-gradient-to-br from-primary to-primary-container text-white font-headline font-extrabold text-lg py-5 rounded-full shadow-[0_12px_24px_rgba(50,99,46,0.2)] transition-all active:scale-95 duration-150 flex items-center justify-center gap-3"
          >
            Confirm & Pay
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </main>
    </div>
  );
}
