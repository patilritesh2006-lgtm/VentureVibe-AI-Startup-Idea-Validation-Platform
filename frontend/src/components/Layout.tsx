import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { LogOut, LayoutDashboard, Trophy, Rocket } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    ...(isAuthenticated ? [{ label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <header className="frosted-nav">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1 bg-[#0071E3] rounded-lg shadow-sm">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="text-[19px] font-semibold text-[#1D1D1F] tracking-tight">
              VentureVibe
            </span>
          </Link>

          <nav className="flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-[13px] font-medium transition-colors",
                  location.pathname === item.path 
                    ? "text-[#0071E3]" 
                    : "text-[#1D1D1F]/70 hover:text-[#1D1D1F]"
                )}
              >
                {item.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-[13px] font-medium text-[#FF453A]/80 hover:text-[#FF453A] transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login" className="text-[13px] font-medium text-[#1D1D1F]/70 hover:text-[#1D1D1F] transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full text-[13px] font-medium transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow pt-16 pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          {children}
        </div>
      </main>

      <footer className="py-12 border-t border-black/[0.05] bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-black/5 rounded-md">
                <Rocket className="w-3 h-3 text-apple-gray" />
              </div>
              <span className="text-sm font-semibold text-apple-black">VentureVibe</span>
            </div>
            <div className="text-apple-gray text-[13px]">
              Built using AI on Mattr during Launch Rush 2026.
            </div>
            <div className="text-apple-gray text-[12px]">
              © 2026 VentureVibe. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};