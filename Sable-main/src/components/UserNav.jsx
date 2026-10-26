import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, FolderKanban, Sparkles, ChevronDown } from 'lucide-react';

export default function UserNav() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        id="nav-login-btn"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 hover:border-white/60 bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-md text-white font-mono text-xs tracking-wider uppercase transition-all duration-200"
      >
        <User className="w-3.5 h-3.5 opacity-70" />
        <span>Sign In</span>
      </Link>
    );
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        id="user-profile-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-white/15 hover:border-white/40 bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-md text-white transition-all cursor-pointer"
      >
        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-mono font-bold text-[10px] text-white">
          {initials}
        </div>
        <span className="font-mono text-xs text-white/90 max-w-[100px] truncate hidden sm:inline">
          {user?.name || user?.email}
        </span>
        <ChevronDown className={`w-3 h-3 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          id="user-profile-dropdown"
          className="absolute right-0 mt-2 w-56 rounded-xl bg-[#090b10]/95 backdrop-blur-xl border border-white/15 shadow-2xl py-2 z-50 text-white animate-in fade-in"
        >
          {/* User Details header */}
          <div className="px-3 py-2 border-b border-white/10">
            <p className="font-mono text-xs font-bold text-white truncate m-0">
              {user?.name}
            </p>
            <p className="font-mono text-[10px] text-white/45 truncate m-0">
              {user?.email}
            </p>
          </div>

          {/* Links */}
          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/works');
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
            >
              <FolderKanban className="w-3.5 h-3.5 text-blue-400" />
              <span>My Saved Works</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/components');
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Components</span>
            </button>
          </div>

          {/* Sign Out */}
          <div className="pt-1 border-t border-white/10">
            <button
              type="button"
              id="user-logout-btn"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
