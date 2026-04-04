import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Bell, FlaskConical, Video, Truck, Droplets } from 'lucide-react';
import { SERVICES } from '../constants';
import { motion } from 'motion/react';

export default function Services() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface min-h-screen pb-32">
      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="hover:bg-stone-100/50 transition-colors p-2 rounded-full active:scale-95 duration-150 text-primary">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <span className="font-manrope font-black text-primary tracking-tighter text-2xl">PlotRent</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="hover:bg-stone-100/50 transition-colors p-2 rounded-full active:scale-95 duration-150 text-primary">
              <ShoppingCart className="w-6 h-6" />
            </button>
            <button className="hover:bg-stone-100/50 transition-colors p-2 rounded-full active:scale-95 duration-150 text-primary">
              <Bell className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 px-6 max-w-screen-xl mx-auto">
        {/* Hero Editorial Section */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-on-surface leading-none mb-4">
            Grow Better.
          </h1>
          <p className="text-on-surface-variant max-w-2xl font-body text-lg">
            Equip your urban plot with professional-grade tools and expert services curated for modern agrarian success.
          </p>
        </header>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-8 no-scrollbar">
          <button className="bg-secondary-fixed text-on-secondary-fixed-variant px-6 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap active:scale-95 transition-transform">All Services</button>
          <button className="bg-surface-container-highest text-on-surface-variant px-6 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap hover:bg-surface-container-high transition-colors">Tools</button>
          <button className="bg-surface-container-highest text-on-surface-variant px-6 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap hover:bg-surface-container-high transition-colors">Consulting</button>
          <button className="bg-surface-container-highest text-on-surface-variant px-6 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap hover:bg-surface-container-high transition-colors">Maintenance</button>
        </div>

        {/* Marketplace Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <motion.div 
              key={service.id}
              whileHover={{ y: -5 }}
              className="bg-surface-container-lowest rounded-xl p-4 flex flex-col group shadow-sm"
            >
              <div className="relative overflow-hidden rounded-xl aspect-[4/3] mb-5">
                <img 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  src={service.image} 
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {service.tag}
                </span>
              </div>
              <div className="px-2 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-on-surface">{service.title}</h3>
                  <span className="text-secondary font-bold text-lg">${service.price}{service.unit}</span>
                </div>
                <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">{service.description}</p>
              </div>
              <button className="w-full py-4 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-bold tracking-wide active:scale-95 transition-all">
                {service.tag === 'Expert Help' ? 'Book Now' : 'Add to Cart'}
              </button>
            </motion.div>
          ))}
        </section>

        {/* Newsletter Section */}
        <section className="mt-16 bg-surface-container rounded-[2rem] p-8 md:p-12 text-center overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-on-surface mb-4">Want specialized advice?</h2>
            <p className="text-on-surface-variant max-w-lg mx-auto mb-8 font-body">Join our "Agrarian Insights" list for seasonal planting guides and exclusive discounts on service packages.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input className="flex-grow bg-surface-container-lowest border-none rounded-full px-6 py-4 focus:ring-2 focus:ring-primary/30 transition-all font-body outline-none" placeholder="Enter your email" type="email"/>
              <button className="bg-secondary text-white font-bold rounded-full px-8 py-4 active:scale-95 transition-all">Join</button>
            </div>
          </div>
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary-container/10 rounded-full blur-3xl"></div>
        </section>
      </main>
    </div>
  );
}
