import { NavLink } from 'react-router-dom';
import { Map, Sprout, MessageSquare, User, LayoutList } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { to: '/explore', icon: Map, label: 'Explore' },
    { to: '/host', icon: LayoutList, label: 'Listings' },
    { to: '/chat', icon: MessageSquare, label: 'Messages' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-end px-4 pb-6 pt-3 bg-surface/90 backdrop-blur-xl shadow-[0_-4px_24px_rgba(28,28,25,0.06)] rounded-t-[2rem]">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center transition-all active:scale-90 p-2 ${
              isActive
                ? 'bg-gradient-to-br from-primary to-primary-container text-white rounded-2xl px-5 py-2.5 shadow-lg'
                : 'text-stone-400 hover:text-primary'
            }`
          }
        >
          <item.icon className="w-6 h-6" />
          <span className="font-inter text-[11px] font-semibold uppercase tracking-wider mt-1">
            {item.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}
