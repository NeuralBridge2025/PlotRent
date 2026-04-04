import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Navigation, Settings2, Ruler, MapPin, Star, List } from 'lucide-react';
import { PLOTS } from '../constants';
import { motion } from 'motion/react';

export default function Explore() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="hover:bg-stone-100/50 transition-colors active:scale-95 duration-150 p-2 rounded-full">
              <ArrowLeft className="w-6 h-6 text-primary" />
            </button>
            <h1 className="font-headline font-black text-primary tracking-tighter text-2xl">PlotRent</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="hover:bg-stone-100/50 transition-colors active:scale-95 duration-150 p-2 rounded-full">
              <Bell className="w-6 h-6 text-primary" />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-[72px]">
        {/* Map Section */}
        <section className="h-[530px] w-full relative overflow-hidden bg-surface-container">
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover opacity-60 grayscale-[0.2]" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKN7nmd_2FYLmvizyS0qDxWCkeRvf1E5AV3YrP1ukPzwjL3GIN9MEQvIlWXxQbZPQvbyJ-W1gOPXLerykV2-ooAlMVK9IAnH8MS6RqkdhimoMuhYvQ3cxifjHlkLS3VoUJU_34eeEBvE6bWKnVcYG9nlYoqHiTIsBXvMjgMfhHiMpnAJMwn8CQUxE1rpBrxVqhMLH7dGjPrvGk32BRzAwuKFQTMjCp4V-xtygiyr3euVdHBTI5vyaLagSnKQ_POMiTIREX0U9Qf0g7"
              alt="Map"
            />
          </div>

          {/* Interactive Pins */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[30%] left-[40%] pointer-events-auto cursor-pointer flex flex-col items-center">
              <div className="bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white">
                <MapPin className="w-4 h-4 fill-current" />
              </div>
              <div className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg mt-1 text-[10px] font-bold text-primary shadow-sm">12 Plots</div>
            </div>
            <div className="absolute top-[55%] left-[25%] pointer-events-auto cursor-pointer">
              <div className="bg-primary text-white h-10 w-10 flex items-center justify-center rounded-full shadow-lg border-2 border-white active:scale-90 transition-transform">
                <span className="font-bold text-xs">$45</span>
              </div>
            </div>
            <div className="absolute top-[42%] left-[68%] pointer-events-auto cursor-pointer">
              <div className="bg-primary-container text-white h-10 w-10 flex items-center justify-center rounded-full shadow-lg border-2 border-white active:scale-90 transition-transform">
                <span className="font-bold text-xs">$32</span>
              </div>
            </div>
          </div>

          {/* Map Overlays */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-3">
              <Navigation className="w-5 h-5 text-primary" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Current Location</p>
                <p className="text-sm font-semibold text-on-surface">North Quarter District</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="bg-surface py-6 px-6">
          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2">
            <button className="flex-shrink-0 bg-primary-container text-on-primary-container px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              Filters
            </button>
            <button className="flex-shrink-0 bg-surface-container-highest px-5 py-2.5 rounded-full text-sm font-medium hover:bg-surface-container-high transition-colors">Distance</button>
            <button className="flex-shrink-0 bg-surface-container-highest px-5 py-2.5 rounded-full text-sm font-medium hover:bg-surface-container-high transition-colors">Plot Size</button>
            <button className="flex-shrink-0 bg-secondary-fixed text-on-secondary-fixed-variant px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2">
              $ Price Range
            </button>
          </div>
        </section>

        {/* List Section */}
        <section className="px-6 space-y-8">
          <div className="flex justify-between items-baseline">
            <h2 className="font-headline font-bold text-2xl text-primary tracking-tight">Available Plots</h2>
            <span className="text-sm text-stone-400 font-medium">128 results near you</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PLOTS.map((plot) => (
              <motion.article 
                key={plot.id}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/plot/${plot.id}`)}
                className="group relative bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    src={plot.image}
                    alt={plot.title}
                  />
                  <div className="absolute top-4 right-4 bg-secondary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                    Instant Book
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-xs font-bold">{plot.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-headline font-bold text-xl text-on-surface">{plot.title}</h3>
                    <p className="text-primary font-bold text-lg">${plot.price}<span className="text-xs text-stone-400 font-medium">/mo</span></p>
                  </div>
                  <div className="flex items-center gap-4 text-stone-500 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Ruler className="w-4 h-4" />
                      <span>{plot.size}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{plot.distance}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {plot.tags.map((tag) => (
                      <span key={tag} className="bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-32 right-6 z-40 bg-gradient-to-br from-primary to-primary-container text-white rounded-full flex items-center gap-2 px-6 py-4 shadow-2xl active:scale-95 transition-all">
        <List className="w-5 h-5" />
        <span className="font-bold tracking-tight">List View</span>
      </button>
    </div>
  );
}
