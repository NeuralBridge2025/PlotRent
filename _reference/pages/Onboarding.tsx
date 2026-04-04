import { useNavigate } from 'react-router-dom';
import { Flower, Mountain, Apple, Chrome } from 'lucide-react';
import { motion } from 'motion/react';

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full flex flex-col justify-end bg-onboarding-hero overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(50, 99, 46, 0.4), rgba(28, 28, 25, 0.9)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuAvKQ-6bXjdX5nyZx6qh9hXMu6Ma7_gGJw9LQduhKCRm0kBhyErrc30wbqsOjzf73JKBDbVsxvbMphMU0S3knFzo0LLFPzzoGujN5ZnG7LTnUqHj_tIk3YcrbUq8ZktCinDn3Su-o4uggq9ITbeplEpeCxf7E51WGMj3_R_mJA6AHnJ_5MdgDUoA4WOc1cUfqx0l3bDxpRGqAFplaq5SSa4lD3zEocoATTSczYt4H1KDJTW_g_BvOSFDPbDyUC4yNCMwAHz20eL0Pfc)`
        }}
      />

      {/* Top Branding */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-center md:justify-start">
        <h1 className="font-headline font-black text-white text-3xl tracking-tighter opacity-90">PlotRent</h1>
      </div>

      {/* Content Overlay Area */}
      <div className="relative w-full max-w-xl mx-auto px-6 pb-12 flex flex-col gap-8">
        {/* Headline Group */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className="font-headline font-extrabold text-white text-4xl leading-tight tracking-tight md:text-5xl">
            Find your patch <br/> of earth
          </h2>
          <p className="font-body text-surface-bright/80 text-lg max-w-[85%] leading-relaxed">
            Rent a garden plot near you. Grow your own food. Connect with your community through soil and sun.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 w-full">
          <button 
            onClick={() => navigate('/explore')}
            className="w-full h-16 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold text-lg flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-transform"
          >
            <Flower className="w-6 h-6" />
            I want to grow
          </button>
          <button 
            onClick={() => navigate('/host')}
            className="w-full h-16 rounded-full bg-secondary text-white font-headline font-bold text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-transform"
          >
            <Mountain className="w-6 h-6" />
            I have land to share
          </button>
        </div>

        {/* Social Auth Options */}
        <div className="mt-4 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 w-full">
            <div className="h-[1px] flex-1 bg-white/20"></div>
            <span className="text-white/40 font-label text-xs uppercase tracking-widest">or sign in with</span>
            <div className="h-[1px] flex-1 bg-white/20"></div>
          </div>
          <div className="flex gap-4 w-full">
            <button className="flex-1 h-14 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-white font-medium hover:bg-white/10 transition-colors">
              <Chrome className="w-5 h-5" />
              Google
            </button>
            <button className="flex-1 h-14 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-white font-medium hover:bg-white/10 transition-colors">
              <Apple className="w-5 h-5" />
              Apple
            </button>
          </div>
          <p className="text-white/30 text-[10px] uppercase tracking-tighter text-center max-w-xs leading-relaxed">
            By continuing, you agree to our <span className="underline text-white/50">Terms of Service</span> and <span className="underline text-white/50">Privacy Policy</span>.
          </p>
        </div>
      </div>

      {/* Decorative Organic Shape */}
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
}
