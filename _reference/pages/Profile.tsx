import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Verified, Brain, Calendar, MapPin, Camera, Leaf, PartyPopper, CalendarDays } from 'lucide-react';
import { motion } from 'motion/react';

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface min-h-screen pb-32">
      {/* Top App Bar */}
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

      <main className="pt-24 pb-32 px-6 max-w-screen-xl mx-auto space-y-12">
        {/* Profile Header */}
        <section className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-primary to-primary-container">
              <img 
                alt="David Miller" 
                className="w-full h-full rounded-full object-cover border-4 border-surface" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS447VX6xqPAiEnyMeF8_AiU6ziImEu2owNOfRWj_PEQM5izKvySa_0a26c4M6gkeRknil3rqwtOADYFqH0SiCXc8kKT2VjSLN0KF-xMMWERpsmOr6AkNX6QW6Qr6DVGQOztKbFNDlb3uzjNXC8CY2cg1e_7qUAb4DLWQlgCGp8a-wL5hCT1jrmllXt33YERgp2mu6nRvQj6MLeYYKNZutOBRXFkNN50clDErxEx2iHNC6QOnWO6xTb-eiqEr9uQtfLGpScnCUz9kn"
              />
            </div>
            <div className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1 border-2 border-surface">
              <Verified className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="font-headline font-bold text-3xl tracking-tight">David Miller</h2>
            <p className="text-on-surface-variant text-sm font-medium">Member since 2024</p>
          </div>
          <div className="flex gap-2">
            <span className="bg-primary-container/20 text-on-primary-fixed-variant px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-4 h-4" />
              Beginner Grower
            </span>
          </div>
        </section>

        {/* Active Rentals */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="font-headline font-extrabold text-2xl tracking-tight">Active Rentals</h3>
            <button className="text-primary text-sm font-bold">View History</button>
          </div>
          <div className="bg-surface-container-low rounded-[2rem] p-4 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0">
              <img 
                alt="Urban Garden Plot" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFvqv3v38BsSnFYeA-4qPk8aOfvbDXm1eBWDBPhl5jPNFlyu6eNWyzCL44rlR0Zr_hBe3dgzx7UHiKZPRMlTn_HdYcF1q4jibvL2AfFXOLMgp-PVVLyczerLpdbOQKeoglERkFeKAuEKEYkeQ-GvuRFtf8PxrmuQzXgTTYQr8pztcsT2QTYAlhNop5WVl_yV4FXxq-d01DKf4X7ch2dp_p1TyVrzkkxGsXQexXqo1pG6jM5EPomzQJ3kjR5Bi5hRo4Hd5s1q-sRYTM"
              />
            </div>
            <div className="flex-grow space-y-2 text-center md:text-left">
              <h4 className="font-headline font-bold text-xl">The Sunnyside Corner</h4>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-on-surface-variant font-medium">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  14 days remaining
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  Brooklyn Heights
                </div>
              </div>
            </div>
            <button className="bg-gradient-to-br from-primary to-primary-container text-white px-6 py-3 rounded-full font-bold shadow-sm active:scale-95 transition-transform">
              Manage Plot
            </button>
          </div>
        </section>

        {/* Growing Diary */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="font-headline font-extrabold text-2xl tracking-tight">Growing Diary</h3>
            <button className="p-2 bg-surface-container-highest rounded-full active:scale-90 transition-transform">
              <Camera className="w-6 h-6 text-primary" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="group relative aspect-square rounded-3xl overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuArCkieYzQVXkaNgXZBOhhig2KJeVMmdkSLBF5IvSCzRVR1W55EbCZ476-9UY3WNg_933OoSSU_o7MjHpTm0h_MF0r_aIRXxV32QHHThqw4525jK_qc3IK6AcRqKWPcQ3J3dMo_2FkkKg9KyqUakRaNAaVcMTXlHwp3r3d76FERXcnvgN-7bamrwUSDHs7xf7ouK6isBVbxpKeM4JX4UsZqYSBGbC0VQR_wwdNqUvnQIFKcshDVV7cmp1cXSFhJI0zxY-HevCH6NSKN" alt="Diary 1" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">May 12</span>
                <p className="text-white font-bold text-sm">First sprouts!</p>
              </div>
            </div>
            <div className="group relative aspect-square rounded-3xl overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD94elpLpEMRRi6GNYUW9HMKwypVhuAijyc8pEbHuXBAFKfdbV3ANp8T3ArRKuKrQevEmWSJzBvyLpj2kleg5Fu-NbPvVV55nuHB71ZPSNFvWGbtaottSHPqvhQ14qZsK3Bo6ztg0pPDMtp7WPtZP_IBNJMuSQvJAxPckvPZX7GEkB7wDr4VTTiPIT4RVfgGKuI-zhF0pGc6ESqD-6xi8b77FzE33hIN3HI07__Y9-YYQXXT2gX2vkm1iQKN5P0hQmdzEF3-KaGhHO-" alt="Diary 2" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">May 28</span>
                <p className="text-white font-bold text-sm">Getting leafy</p>
              </div>
            </div>
            <div className="group relative aspect-square rounded-3xl overflow-hidden border-2 border-dashed border-outline-variant/30 flex items-center justify-center bg-surface-container">
              <div className="text-center">
                <PartyPopper className="w-8 h-8 text-outline-variant mb-2 mx-auto" />
                <p className="text-xs font-bold text-on-surface-variant">Next phase...</p>
              </div>
            </div>
            <div className="group relative aspect-square rounded-3xl overflow-hidden bg-surface-container-highest flex items-center justify-center">
              <CalendarDays className="w-10 h-10 text-outline-variant/40" />
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-6">
          <h3 className="font-headline font-extrabold text-2xl tracking-tight">Garden Achievements</h3>
          <div className="flex justify-around items-center bg-surface-container-low rounded-[2rem] p-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center shadow-lg">
                <Leaf className="w-8 h-8 text-on-secondary-fixed fill-current" />
              </div>
              <span className="text-[10px] font-black uppercase text-secondary tracking-widest text-center leading-tight">Organic<br/>Grower</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center shadow-lg">
                <PartyPopper className="w-8 h-8 text-on-primary-fixed fill-current" />
              </div>
              <span className="text-[10px] font-black uppercase text-primary tracking-widest text-center leading-tight">First<br/>Harvest</span>
            </div>
            <div className="flex flex-col items-center gap-3 opacity-30 grayscale">
              <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center">
                <CalendarDays className="w-8 h-8 text-outline" />
              </div>
              <span className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest text-center leading-tight">Full<br/>Season</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
