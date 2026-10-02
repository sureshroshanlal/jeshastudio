'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Sparkles,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminAuthGate() {
  const { login, authorizedAccounts } = useAdminAuth();
  
  const [identifier, setIdentifier] = useState('admin@jeshastudio.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await login({ identifier, password, rememberMe });
      if (res.success) {
        setLoginSuccess(true);
      } else {
        setErrorMsg(res.message || 'Invalid credentials. Please check your credentials.');
        setIsSubmitting(false);
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred during authentication.');
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (acc: { email: string; role: string }, pass: string) => {
    setIdentifier(acc.email);
    setPassword(pass);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-warm-ivory to-rose-50/40 flex flex-col items-center justify-center p-4 selection:bg-rose-200">
      {/* Decorative backdrop glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-300/25 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl border border-amber-200/60 shadow-2xl overflow-hidden relative z-10 animate-slide-up">
        
        {/* Header with Luxury Brand Identity */}
        <div className="bg-gradient-to-b from-stone-900 via-stone-850 to-stone-900 text-white p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-rose-500/20 rounded-full blur-2xl" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 mb-4 shadow-inner ring-4 ring-amber-400/10">
              <Lock className="w-7 h-7" />
            </div>
            
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-100 to-amber-100">
              Jesha Studio
            </span>
            <span className="text-[11px] tracking-[0.3em] text-amber-200/70 uppercase block font-sans mt-1">
              Studio Management Portal
            </span>
            
            <div className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-stone-800/80 text-[11px] text-emerald-300 border border-emerald-500/30 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Secure Role-Based Authentication</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-7 sm:p-8 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="font-serif text-xl font-semibold text-stone-900">
              Staff Portal Sign In
            </h3>
            <p className="text-xs text-stone-500">
              Enter your verified staff credentials to manage collections, inventory, and orders.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder="admin@jeshastudio.com or jesha"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className={`w-full pl-10 pr-4 py-3 text-sm bg-stone-50/80 rounded-2xl border transition-all focus:outline-none focus:ring-2 ${
                    errorMsg
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                      : 'border-stone-200 focus:border-amber-600 focus:ring-amber-500/20'
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className={`w-full pl-10 pr-11 py-3 text-sm bg-stone-50/80 rounded-2xl border transition-all focus:outline-none focus:ring-2 ${
                    errorMsg
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/30'
                      : 'border-stone-200 focus:border-amber-600 focus:ring-amber-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span>Remember this device session</span>
              </label>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3 animate-fade-in font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !identifier || !password}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 hover:from-amber-700 hover:to-rose-700 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loginSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
                  <span>Authenticated! Entering Studio...</span>
                </>
              ) : isSubmitting ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick Staff Demo Accounts */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-2.5">
            <div className="flex items-center justify-between text-stone-800 font-semibold">
              <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Demo Staff Profiles (Click to fill):
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => handleQuickFill(authorizedAccounts[0] || { email: 'admin@jeshastudio.com', role: 'Admin' }, 'admin123')}
                className="flex items-center justify-between p-2 rounded-xl bg-white border border-amber-200/80 hover:border-amber-500 text-left transition-all hover:shadow-sm group"
              >
                <div>
                  <div className="font-semibold text-stone-800 text-[11px] group-hover:text-amber-700">Master Admin</div>
                  <div className="text-[10px] text-stone-500 font-mono">admin@jeshastudio.com</div>
                </div>
                <UserCheck className="w-3.5 h-3.5 text-amber-500 opacity-60 group-hover:opacity-100" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill(authorizedAccounts[1] || { email: 'curator@jeshastudio.com', role: 'Curator' }, 'jesha2026')}
                className="flex items-center justify-between p-2 rounded-xl bg-white border border-amber-200/80 hover:border-amber-500 text-left transition-all hover:shadow-sm group"
              >
                <div>
                  <div className="font-semibold text-stone-800 text-[11px] group-hover:text-rose-700">Founder Curator</div>
                  <div className="text-[10px] text-stone-500 font-mono">jesha / jesha2026</div>
                </div>
                <UserCheck className="w-3.5 h-3.5 text-rose-500 opacity-60 group-hover:opacity-100" />
              </button>
            </div>
          </div>

          {/* Public Storefront Link */}
          <div className="pt-1 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 transition-colors font-medium hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Storefront</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
