'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Shirt, 
  Boxes, 
  ShoppingCart, 
  Printer, 
  ExternalLink, 
  ShieldCheck, 
  RefreshCw,
  LogOut,
  Lock
} from 'lucide-react';
import { useJeshaStore } from '@/lib/store';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import AdminAuthGate from '@/components/admin/AdminAuthGate';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { resetToFactoryDefaults } = useJeshaStore();
  const { isAuthenticated, isLoading, currentUser, logout } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center font-serif text-lg text-charcoal-800">
        Verifying Admin Access...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminAuthGate />;
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products & Images', href: '/admin/products', icon: Shirt },
    { label: 'Live Inventory', href: '/admin/inventory', icon: Boxes },
    { label: 'WhatsApp & Sales Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Billing & Shipping (PDF)', href: '/admin/billing', icon: Printer },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-charcoal-900 flex flex-col font-sans">
      {/* Admin Top Header */}
      <header className="bg-charcoal-900 text-ivory-100 border-b border-charcoal-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-serif font-bold text-lg tracking-wider text-white uppercase group-hover:text-rose-300 transition-colors">
                  Jesha Studio
                </span>
                <span className="text-[10px] tracking-widest text-ivory-400 uppercase block -mt-1 font-sans">
                  Studio Admin Portal
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* User Profile Pill */}
            {currentUser && (
              <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-charcoal-800/90 border border-charcoal-700 text-xs">
                {currentUser.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-400"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-charcoal-900 font-bold flex items-center justify-center text-[10px]">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <div className="text-left">
                  <div className="text-white font-medium text-[11px] leading-tight flex items-center gap-1">
                    <span>{currentUser.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="text-[10px] text-amber-200/70 font-sans leading-tight">
                    {currentUser.role}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if (confirm('Reset catalog, orders, and stock to initial factory defaults?')) {
                  resetToFactoryDefaults();
                  alert('Reset complete! Refreshing...');
                  window.location.reload();
                }
              }}
              className="text-xs text-ivory-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-charcoal-700 hover:border-charcoal-600 transition-colors flex items-center gap-1.5"
              title="Reset test data to initial seed catalog"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Seed</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-ivory-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-charcoal-700"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Lock Admin Portal & Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="bg-charcoal-900/90 border-t border-charcoal-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-ivory-100 text-charcoal-900 font-semibold shadow-sm'
                      : 'text-ivory-300 hover:text-white hover:bg-charcoal-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-500' : 'text-ivory-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="py-4 border-t border-ivory-300 text-center text-xs text-charcoal-600 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Authorized Session Active &bull; Jesha Studio Admin Suite</span>
      </footer>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  );
}
