/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Explore from './pages/Explore';
import HostDashboard from './pages/HostDashboard';
import BookingReview from './pages/BookingReview';
import PlotDetails from './pages/PlotDetails';
import Profile from './pages/Profile';
import Services from './pages/Services';
import Chat from './pages/Chat';
import BottomNav from './components/BottomNav';

function AppContent() {
  const location = useLocation();
  const hideNav = ['/', '/chat', '/booking'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/host" element={<HostDashboard />} />
          <Route path="/booking" element={<BookingReview />} />
          <Route path="/plot/:id" element={<PlotDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/services" element={<Services />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
