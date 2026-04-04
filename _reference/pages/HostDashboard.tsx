import { Bell, TrendingUp, Sparkles, Plus, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

export default function HostDashboard() {
  const plots = [
    {
      id: '1',
      title: 'Loamy Sunbed',
      renters: 12,
      revenue: 180,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFYKi525BWB6mzLfgKQer_3cGJit4anV0RIDH_Oi5IMVMRoLNCR70IS6fEsoyNS7kJsWEGKbxaqG23rK_0pQP51VhnQwA-lDvxBkB-XFsWTvTYbKNcD8QMSAoFDJT_XhEmU1t5bo9I6hOSx_Mqq3vjFTnpUwkrolSMGw_hN2dy-UCLPXJoHiibM5fMBxN0xxu0XhbRZsdoJKK_LCnHYhLS52zsELC9mroOU2rZuPGKJTGiCrsgIYKQJjgq1MSH86MKm6av_OAAMUK9',
      tag: 'Loamy'
    },
    {
      id: '2',
      title: 'The Meadow Patch',
      renters: 8,
      revenue: 145,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoERXAVAx-URebEIEp-goIZE_Qh12I9h0nJybSz3OkBbBuZLxzxLXIWc2VhLMSTO4lQ3eQN4LlBXS7AQ4N8XdIghxgQhi7ghBEgIeQgVut49nWTF1ZH_A3-OGwDyTNnMduk2NZPWK-1Z4DmDiQsi-FzlKh-8Gt23zu78aSyd9C5lm56pczEwYx7OF4xTXAauaG9Oeuu7ysdMotImrUxbRhRVhE5hZ412DldhLVhlMjhFf672XmlNGOlIHXpU0zZJtzCaDfj483Ikxs',
      tag: 'Silty'
    }
  ];

  return (
    <div className="bg-surface min-h-screen pb-32">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-xl mx-auto">
          <h1 className="font-headline font-black text-primary tracking-tighter text-2xl">PlotRent</h1>
          <div className="flex items-center gap-4">
            <button className="hover:bg-stone-100/50 transition-colors p-2 rounded-full active:scale-95 duration-150">
              <Bell className="w-6 h-6 text-primary" />
            </button>
            <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border-2 border-primary-fixed">
              <img 
                alt="Sarah" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzr6OI-o2MlPAw-ayxT36ezT2bL4uMY6EYThUkn4ETpiOFj4qtzGICKlLF40rUN2m5w2K1yEcpYr67J6zgLUCFuCbww-qB8dIUe00eKCWR8L60Or1v62nUMBCKfuizzeSf3fvidC5O41XbqUtwgR9F4GHT4yyYcp_ez89k_kSZNBCm1DwlbJjN8KBBZtEMCJ9Jm6ssRZFlHQnUvHoo1PNhUacEJSrzMxdfnxc1zP7wE5O9t2oGHdvamdbSyuy-Z7uh2J8SQouBzRVT"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-screen-xl mx-auto">
        {/* Greeting Section */}
        <section className="mb-8">
          <h2 className="font-headline font-bold text-3xl tracking-tight text-primary">Hi, Sarah!</h2>
          <p className="text-on-surface-variant font-medium">Your garden plots are thriving today.</p>
        </section>

        {/* Earnings Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Main Earnings Card */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="md:col-span-2 bg-gradient-to-br from-primary to-primary-container rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl"
          >
            <div className="relative z-10">
              <p className="font-label uppercase tracking-widest text-[11px] opacity-80 mb-2">Earnings this month</p>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-5xl font-headline font-bold">$420</span>
                <div className="flex items-center text-primary-fixed text-sm font-bold">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>12%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/10">
                <div>
                  <p className="text-[11px] uppercase tracking-widest opacity-80 mb-1">Active Plots</p>
                  <p className="text-2xl font-headline font-bold">3</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-widest opacity-80 mb-1">Occupancy</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-headline font-bold">85%</p>
                    <TrendingUp className="w-4 h-4 text-primary-fixed" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          </motion.div>

          {/* Quick Action Card */}
          <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="font-headline font-bold text-xl mb-2">Host Insights</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">Your "Loamy Sunbed" is high in demand this week. Consider a 5% peak rate.</p>
            </div>
            <button className="w-full bg-secondary text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 mt-6 active:scale-95 transition-all">
              <span>Optimise Price</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Occupancy Calendar Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline font-bold text-2xl">Occupancy Calendar</h3>
            <div className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant cursor-pointer">
              <span>May 2024</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          <div className="bg-surface-container-low rounded-[2rem] p-6">
            <div className="grid grid-cols-7 gap-3 text-center mb-4">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <span key={i} className="text-[11px] font-bold text-stone-400">{day}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-3">
              {[29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((day, i) => (
                <div 
                  key={i} 
                  className={`h-10 w-full flex items-center justify-center rounded-xl text-sm font-bold ${
                    day >= 2 && day <= 11 && day !== 4 && day !== 5
                      ? 'bg-primary text-white' 
                      : day === 1 
                        ? 'bg-primary/20 text-primary'
                        : 'bg-surface-container-highest text-stone-400'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-xs font-semibold">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-surface-container-highest rounded-full"></div>
                <span className="text-xs font-semibold">Available</span>
              </div>
            </div>
          </div>
        </section>

        {/* Your Plots Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline font-bold text-2xl px-2">Your Plots</h3>
            <button className="text-primary font-bold text-sm hover:underline">Manage All</button>
          </div>
          <div className="flex gap-6 overflow-x-auto no-scrollbar px-2 -mx-2">
            {plots.map((plot) => (
              <div key={plot.id} className="min-w-[280px] bg-surface-container-lowest rounded-[2rem] overflow-hidden shadow-sm flex-shrink-0">
                <div className="h-44 w-full relative">
                  <img alt={plot.title} className="w-full h-full object-cover" src={plot.image} />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-secondary uppercase tracking-wider">
                    {plot.tag}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-headline font-bold text-lg mb-4">{plot.title}</h4>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Active Renters</p>
                      <p className="text-xl font-headline font-bold text-primary">{plot.renters}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Revenue</p>
                      <p className="text-xl font-headline font-bold text-on-surface">${plot.revenue}<span className="text-xs text-on-surface-variant font-medium">/mo</span></p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      <div className="fixed right-6 bottom-28 z-40">
        <button className="w-14 h-14 bg-secondary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
          <Plus className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
