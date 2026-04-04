import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Heart, MapPin, Star, Ruler, Sun, Droplets, Recycle, Flower2, ShieldCheck, Microscope, Trees, Baby, Lock, MessageCircle } from 'lucide-react';
import { PLOTS } from '../constants';
import { motion } from 'motion/react';

export default function PlotDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const plot = PLOTS.find(p => p.id === id) || PLOTS[0];

  return (
    <div className="bg-surface min-h-screen pb-32">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-stone-100/50 transition-colors active:scale-95 duration-150">
              <ArrowLeft className="w-6 h-6 text-primary" />
            </button>
            <span className="font-manrope font-black text-primary tracking-tighter text-2xl">PlotRent</span>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-stone-100/50 transition-colors active:scale-95">
              <Share2 className="w-6 h-6 text-primary" />
            </button>
            <button className="p-2 rounded-full hover:bg-stone-100/50 transition-colors active:scale-95">
              <Heart className="w-6 h-6 text-primary" />
            </button>
          </div>
        </div>
      </header>

      <main className="pb-32 pt-16">
        {/* Hero Gallery */}
        <section className="relative w-full h-[442px] md:h-[574px] overflow-hidden group">
          <div className="flex h-full w-full overflow-x-auto snap-x snap-mandatory no-scrollbar">
            <div className="min-w-full h-full snap-start relative">
              <img className="w-full h-full object-cover" src={plot.image} alt={plot.title} />
            </div>
            <div className="min-w-full h-full snap-start relative">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxq9Idb4GSmJGM1S_zwQnLRyl6JRAGmWAxvXt42qqllcS3r23Bgi7tsRy6g2Ft_Yz4YJ8BTqSao-EiLGhLYsDMpOY0MsMDZJRF2AnWwmgK1MZzvFz630IPEaKgJ2tmtNKPdDcTzcGTLWwYBmF18OG3tlukK9kOrfvUADjjp06JvelXi9BYkQyBC4Izq4ZwlwVbcFw6jSzMKmoiSqvuzfT5dk5RVN4Uy_kyWYil2_IOMHDbP5uGnYIrhretTAGHRJNmQ8fueyk3HKj6" alt="Soil" />
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white/40"></div>
            <div className="w-2 h-2 rounded-full bg-white/40"></div>
          </div>
        </section>

        <div className="max-w-screen-xl mx-auto px-6 -mt-8 relative z-10">
          {/* Header Section Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-[0_24px_48px_-12px_rgba(28,28,25,0.08)]">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2 text-secondary font-semibold uppercase tracking-widest text-[10px]">
                  <MapPin className="w-3 h-3" />
                  {plot.location}
                </div>
                <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-on-surface tracking-tight leading-tight">
                  {plot.title}
                </h1>
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-3">
                    <img 
                      className="w-12 h-12 rounded-full border-2 border-primary-fixed object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1_ycINcyY8T7J6i4zvMB6Ng_dd8oGluJD2QSw08XZsgej7Ggqz1uRPGSG0tTTT3g7t0Ubv8924MXVKZe5cB7Iz3QUoFyCF9uOgw9rYud-L65N-Bbov7A3StvSZm3QB_G4q-RKGgBGDLpyNkJKPMaRVj7fWna_eOTLohVZtugiIZVP38nWlse69RlnyhwIU_-vtZqYeI3fehb1IlAoTRDQbwy_KlTWOOKKe9czaAFNRWUxQU5OIhjrMb3jtDB9DFWgQXYMc6MwiLc2" 
                      alt={plot.host}
                    />
                    <div>
                      <p className="text-xs text-on-surface-variant font-medium">Hosted by</p>
                      <p className="font-bold text-on-surface">{plot.host}</p>
                    </div>
                  </div>
                  <div className="h-10 w-[1px] bg-outline-variant/30"></div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-primary font-bold">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{plot.rating}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant underline decoration-dotted">12 reviews</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-right">
                  <p className="text-on-surface-variant text-sm mb-1">Weekly Rental</p>
                  <p className="text-3xl font-headline font-black text-primary">£{plot.price}<span className="text-base font-medium text-on-surface-variant">/week</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
            <div className="lg:col-span-8 space-y-12">
              {/* Details Section */}
              <section>
                <h2 className="font-headline font-bold text-2xl mb-6 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-primary-container"></span>
                  Plot Vitality
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-surface-container-low p-5 rounded-2xl flex flex-col gap-3">
                    <Ruler className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Size</p>
                      <p className="font-bold text-lg">{plot.size} Area</p>
                    </div>
                  </div>
                  <div className="bg-surface-container-low p-5 rounded-2xl flex flex-col gap-3">
                    <Sun className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Exposure</p>
                      <p className="font-bold text-lg">{plot.exposure}</p>
                    </div>
                  </div>
                  <div className="bg-surface-container-low p-5 rounded-2xl flex flex-col gap-3">
                    <Droplets className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Utility</p>
                      <p className="font-bold text-lg">Water Access</p>
                    </div>
                  </div>
                  <div className="bg-surface-container-low p-5 rounded-2xl flex flex-col gap-3">
                    <Recycle className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Soil</p>
                      <p className="font-bold text-lg">{plot.soilType}</p>
                    </div>
                  </div>
                  <div className="bg-surface-container-low p-5 rounded-2xl flex flex-col gap-3">
                    <Flower2 className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">Permitted</p>
                      <p className="font-bold text-lg">Veggies & Herbs</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Plot Passport Section */}
              <section className="bg-surface-container-highest/30 rounded-3xl p-8 border-2 border-dashed border-outline-variant/30">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-headline font-black text-2xl text-on-surface">Plot Passport™</h2>
                  <ShieldCheck className="w-10 h-10 text-primary-container" />
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="bg-secondary-fixed px-5 py-3 rounded-full flex items-center gap-2 shadow-sm">
                    <Microscope className="w-4 h-4 text-on-secondary-fixed-variant" />
                    <span className="text-on-secondary-fixed-variant font-bold text-sm">Soil Test: A+</span>
                  </div>
                  <div className="bg-primary-fixed px-5 py-3 rounded-full flex items-center gap-2 shadow-sm">
                    <Trees className="w-4 h-4 text-on-primary-fixed-variant" />
                    <span className="text-on-primary-fixed-variant font-bold text-sm">Organic Certified</span>
                  </div>
                  <div className="bg-surface-container-lowest px-5 py-3 rounded-full flex items-center gap-2 shadow-sm">
                    <Baby className="w-4 h-4 text-on-surface-variant" />
                    <span className="text-on-surface-variant font-bold text-sm">Child-Friendly</span>
                  </div>
                  <div className="bg-surface-container-lowest px-5 py-3 rounded-full flex items-center gap-2 shadow-sm">
                    <Lock className="w-4 h-4 text-on-surface-variant" />
                    <span className="text-on-surface-variant font-bold text-sm">Secure Perimeter</span>
                  </div>
                </div>
                <p className="mt-6 text-sm text-on-surface-variant leading-relaxed italic">
                  This plot has been verified by the PlotRent field team for biodiversity, nutrient levels, and secure accessibility. 
                </p>
              </section>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28 space-y-8">
                <div className="bg-surface-container rounded-3xl overflow-hidden">
                  <div className="p-6">
                    <h3 className="font-headline font-bold text-xl mb-4">The Neighborhood</h3>
                    <p className="text-sm text-on-surface-variant mb-4">Quiet residential area bordering the West Heath, excellent composting facilities on-site.</p>
                  </div>
                  <div className="relative h-64 bg-surface-variant">
                    <img className="w-full h-full object-cover grayscale opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvaQnjrGQxTSuzi8r2Tekl8C1dEPwvUAJOq6rumj9owY-X4XvBigVr7Nh-yYgpO84fsYEHlDqfxC4E3tvNEi3Cq9u0jFsYpje257jPconHicHonfBQYxL7fec-DUdBxCHgd-6TmJZ2nvXwd2dAkWTDCZH34WqjuDyrbw6FYvNG3CKHDAuR-r6soJha-0VAGmFdOATfY7-TdB8BWURfkvx8f-s9i4kCon9hz-SWUWSXVlRRC4fwlOZa9uJRUyDKLbPf42tvlN7hzfFP" alt="Map" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-primary text-white p-3 rounded-full shadow-lg">
                        <MapPin className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary-container text-on-primary-container p-6 rounded-3xl">
                  <h3 className="font-headline font-bold text-xl mb-3 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Host Insight
                  </h3>
                  <p className="text-sm leading-relaxed opacity-90">"The north-east corner gets the most morning dew—perfect for leafy greens. I have some spare organic mulch if you need it for your first plant-out."</p>
                  <button 
                    onClick={() => navigate('/chat')}
                    className="mt-6 w-full py-3 border border-on-primary-container/30 rounded-full font-bold hover:bg-white/10 transition-colors"
                  >
                    Message {plot.host.split(' ')[0]}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Booking Bar */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-background/90 backdrop-blur-xl shadow-[0_-4px_24px_rgba(28,28,25,0.06)] px-6 py-5">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="hidden sm:block">
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Total Price</p>
            <p className="text-2xl font-headline font-black text-primary">£{plot.price}<span className="text-sm font-medium text-on-surface-variant"> / week</span></p>
          </div>
          <button 
            onClick={() => navigate('/booking')}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-full font-headline font-bold text-lg shadow-lg active:scale-95 transition-all"
          >
            Book This Plot
          </button>
        </div>
      </div>
    </div>
  );
}
