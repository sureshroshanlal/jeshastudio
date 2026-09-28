'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, ShieldCheck, ArrowRight, ArrowLeft, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminAuthGate() {
  const { login } = useAdminAuth();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setIsSubmitting(true);

    setTimeout(() => {
      const success = login(passcode);
      if (!success) {
        setError(true);
        setIsSubmitting(false);
      }
    }, 300);
  };

  const handleQuickPin = (pin: string) => {
    setPasscode(pin);
    const success = login(pin);
    if (!success) setError(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] flex flex-col items-center justify-center p-4">
      
      {/* Decorative backdrop */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-ivory-300 shadow-xl overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="bg-charcoal-900 text-white p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pistachio-500/10 rounded-full blur-2xl" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-rose-300 mb-4 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            
            <span className="font-serif text-2xl font-bold tracking-widest uppercase">
              Jesha Studio
            </span>
            <span className="text-[11px] tracking-[0.25em] text-ivory-300 uppercase block font-sans mt-0.5">
              Atelier Management Portal
            </span>
            
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal-800 text-[11px] text-pistachio-300 border border-charcoal-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Restricted Access Gate</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="font-serif text-lg font-semibold text-charcoal-900">
              Enter Atelier Passcode
            </h3>
            <p className="text-xs text-charcoal-600">
              Please enter your authorized security key to access inventory, product creation, and sales records.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter passcode (e.g. jesha2026)"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (error) setError(false);
                  }}
                  className={`w-full pl-10 pr-4 py-3 text-sm bg-ivory-50 rounded-2xl border transition-all focus:outline-none ${
                    error
                      ? 'border-rose-400 focus:border-rose-500 bg-rose-50/50'
                      : 'border-ivory-300 focus:border-charcoal-900'
                  }`}
                />
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-2 animate-fade-in font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Invalid passcode. Please try again.</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !passcode}
              className="w-full py-3.5 rounded-2xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Verifying...' : 'Unlock Admin Studio'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="p-3.5 rounded-2xl bg-ivory-100 border border-ivory-300 text-xs space-y-2">
            <div className="flex items-center justify-between text-charcoal-700 font-semibold">
              <span className="flex items-center gap-1 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Authorized Passcodes:
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickPin('jesha2026')}
                className="px-2.5 py-1 rounded-lg bg-white border border-ivory-300 hover:border-charcoal-400 text-charcoal-800 font-mono text-[11px] transition-colors"
              >
                jesha2026
              </button>
              <button
                type="button"
                onClick={() => handleQuickPin('admin')}
                className="px-2.5 py-1 rounded-lg bg-white border border-ivory-300 hover:border-charcoal-400 text-charcoal-800 font-mono text-[11px] transition-colors"
              >
                admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickPin('1234')}
                className="px-2.5 py-1 rounded-lg bg-white border border-ivory-300 hover:border-charcoal-400 text-charcoal-800 font-mono text-[11px] transition-colors"
              >
                1234
              </button>
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-charcoal-600 hover:text-charcoal-900 transition-colors font-medium"
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
