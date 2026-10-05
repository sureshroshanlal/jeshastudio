'use client';

import React from 'react';
import { Feather, Ruler, Smile, MessageCircle } from 'lucide-react';
import { generateGeneralConciergeUrl } from '@/lib/whatsapp';

export default function StudioHallmarks() {
  const hallmarks = [
    {
      icon: Feather,
      title: '100% Mulmul Linings',
      desc: 'Pure breathable cotton inside; zero scratchy seams or zari on tender skin.',
    },
    {
      icon: Ruler,
      title: 'True Sizes 16 to 40',
      desc: 'Exact chest & length measurements on every piece so you order with confidence.',
    },
    {
      icon: Smile,
      title: 'Room to Twirl & Play',
      desc: 'Kid-tested ergonomics, non-pinching waists, and +2" alteration margins.',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Concierge',
      desc: 'Send your child’s height and our Hyderabad team confirms the fit before dispatch.',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-3xl bg-white border border-amber-200/80 p-6 sm:p-8 shadow-soft">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hallmarks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-stone-900">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
