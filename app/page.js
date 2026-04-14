'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-5 py-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0f0c29 0%, #1E1B4B 50%, #24215a 100%)',
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '8%',
          left: '-10%',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '12%',
          right: '-8%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: '45%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Top bar */}
      <div className="relative z-10 w-full max-w-sm flex justify-between items-center">
        <span
          className="font-baloo font-extrabold text-2xl"
          style={{ color: '#F59E0B' }}
        >
          📚 ParentPal
        </span>
        <span
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{ background: 'rgba(245,158,11,0.15)', color: '#FCD34D' }}
        >
          FREE
        </span>
      </div>

      {/* Hero section */}
      <div
        className={`relative z-10 flex flex-col items-center text-center w-full max-w-sm transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Mascot */}
        <div
          className="animate-bounce-soft mb-5"
          style={{
            fontSize: '88px',
            lineHeight: 1,
            filter: 'drop-shadow(0 0 28px rgba(245,158,11,0.55))',
          }}
        >
          🧑‍🏫
        </div>

        {/* Headline */}
        <h1
          className="font-baloo font-extrabold text-5xl text-white leading-tight mb-3"
          style={{ letterSpacing: '-0.5px' }}
        >
          Homework
          <br />
          <span style={{ color: '#F59E0B' }}>Made Easy</span>
        </h1>

        <p className="text-base mb-8" style={{ color: '#A5B4FC' }}>
          📸 Photo in → Step-by-step answer out
          <br />
          <span style={{ color: '#818CF8' }}>in under 30 seconds</span>
        </p>

        {/* CTA Button */}
        <button
          onClick={() => router.push('/upload')}
          className="w-full py-5 font-baloo font-extrabold text-2xl rounded-2xl transition-transform active:scale-95 animate-pulse-glow mb-6"
          style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
            color: '#1E1B4B',
            boxShadow: '0 8px 32px rgba(245,158,11,0.35)',
            letterSpacing: '-0.3px',
          }}
        >
          📸 Upload Homework
        </button>

        {/* Feature badges */}
        <div className="grid grid-cols-3 gap-3 w-full mb-8">
          {[
            { icon: '⚡', label: 'Instant' },
            { icon: '🧠', label: 'AI-Powered' },
            { icon: '🇮🇳', label: 'For India' },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center py-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)' }}
            >
              <span className="text-3xl mb-1">{icon}</span>
              <span className="text-white text-xs font-bold">{label}</span>
            </div>
          ))}
        </div>

        {/* Subject tags */}
        <div className="flex flex-wrap justify-center gap-2">
          {['📐 Math', '📖 English', '🔬 Science'].map((s) => (
            <span
              key={s}
              className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#C7D2FE' }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center">
        <p className="text-xs" style={{ color: '#6366F1' }}>
          Class 2–8 · English & Hindi · Free Forever
        </p>
      </div>
    </div>
  );
}
