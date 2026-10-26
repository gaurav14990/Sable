import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Terminal,
  ShieldCheck
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, demoLogin, isAuthenticated, user } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  // Where to redirect after login (default to home or workspace if they came from prompt)
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!name.trim()) {
          throw new Error('Please enter your full name');
        }
        await register(name, email, password);
        setSuccess('Account created successfully! Welcome to Sable.');
      } else {
        await login(email, password);
        setSuccess('Welcome back! Logging you in...');
      }

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 700);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialDemo = async (provider) => {
    setError('');
    setSuccess('');
    setDemoLoading(true);

    try {
      await demoLogin(provider);
      setSuccess(`Signed in with ${provider.toUpperCase()} demo account!`);
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 700);
    } catch (err) {
      setError(err.message || 'Failed to authenticate demo account.');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#030407] text-white px-4 py-8 select-none">
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-25 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #5f8bff, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #a855f7, transparent 70%)' }}
      />

      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Top Header Bar */}
      <header className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <Link
          to="/"
          id="login-brand-logo"
          className="flex items-center gap-2 text-white no-underline group"
        >
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-mono font-black text-sm tracking-tighter group-hover:border-white/50 group-hover:scale-105 transition-all">
            S
          </div>
          <span className="font-mono font-bold tracking-widest text-sm text-white/90 group-hover:text-white transition-colors">
            SABLE
          </span>
        </Link>

        <Link
          to="/"
          id="back-to-home-link"
          className="font-mono text-xs text-white/50 hover:text-white transition-colors border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-md bg-white/[0.03] backdrop-blur-md"
        >
          ← Back to Studio
        </Link>
      </header>

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-md">
        <div
          className="relative rounded-2xl p-7 sm:p-8 backdrop-blur-xl border border-white/[0.12] shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
          style={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          }}
        >
          {/* Badge & Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 font-mono text-[11px] uppercase tracking-wider mb-3">
              <Sparkles className="w-3 h-3" />
              <span>Sable Studio Access</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-mono font-black tracking-tight text-white mb-1.5">
              {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-white/40 text-xs sm:text-sm font-sans">
              {mode === 'login'
                ? 'Sign in to access your saved landing pages and workspace.'
                : 'Build, deploy, and export AI-generated landing pages in seconds.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1 mb-6 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <button
              type="button"
              id="switch-to-login-tab"
              onClick={() => {
                setMode('login');
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 text-xs font-mono font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              id="switch-to-register-tab"
              onClick={() => {
                setMode('register');
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 text-xs font-mono font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Social / 1-Click Fast Logins */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              id="github-demo-login-btn"
              disabled={loading || demoLoading}
              onClick={() => handleSocialDemo('github')}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] hover:border-white/[0.25] text-xs font-mono font-medium text-white transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </button>

            <button
              type="button"
              id="google-demo-login-btn"
              disabled={loading || demoLoading}
              onClick={() => handleSocialDemo('google')}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] hover:border-white/[0.25] text-xs font-mono font-medium text-white transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-white/[0.08] w-full" />
            <span className="bg-[#0b0d14] px-3 font-mono text-[10px] text-white/35 uppercase tracking-wider absolute">
              or with email
            </span>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div
              id="login-error-alert"
              className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-mono mb-4 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              id="login-success-alert"
              className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono mb-4 animate-in fade-in"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block font-mono text-[11px] text-white/60 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/35">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="register-name-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-blue-500/60 focus:bg-white/[0.06] text-white placeholder-white/25 text-sm font-sans outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-mono text-[11px] text-white/60 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/35">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  id="login-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-blue-500/60 focus:bg-white/[0.06] text-white placeholder-white/25 text-sm font-sans outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-[11px] text-white/60 uppercase tracking-wider">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('designer@sable.ai');
                      setPassword('password123');
                    }}
                    className="text-[10px] font-mono text-blue-400/80 hover:text-blue-300 transition-colors"
                  >
                    Fill sample?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/35">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Min. 6 characters' : '••••••••'}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-blue-500/60 focus:bg-white/[0.06] text-white placeholder-white/25 text-sm font-sans outline-none transition-all"
                />
                <button
                  type="button"
                  id="toggle-password-visibility-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/35 hover:text-white/70 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading || demoLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-mono text-xs font-bold tracking-wider uppercase text-black bg-white hover:bg-white/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_24px_rgba(255,255,255,0.2)] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Studio' : 'Create My Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Button */}
          <div className="mt-5 pt-4 border-t border-white/[0.06] text-center">
            <button
              type="button"
              id="one-click-demo-btn"
              disabled={loading || demoLoading}
              onClick={() => handleSocialDemo('quick')}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-white/45 hover:text-white transition-colors cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant Test: Enter as Demo Designer</span>
            </button>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-2 mt-6 text-white/30 text-[11px] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-white/40" />
          <span>Encrypted with JWT & bcrypt tokens</span>
        </div>
      </div>
    </div>
  );
}
