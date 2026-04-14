'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/* ─────────────────────────────────────────────
   Confetti burst when result loads
───────────────────────────────────────────── */
function Confetti({ onDone }) {
  const COLORS = ['#F59E0B', '#10B981', '#6366F1', '#EF4444', '#8B5CF6', '#EC4899'];
  const pieces = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      left: Math.random() * 100,
      delay: (Math.random() * 1.5).toFixed(2),
      dur: (2.5 + Math.random() * 1.5).toFixed(2),
      size: Math.random() > 0.5 ? 8 : 6,
      round: Math.random() > 0.5,
    }))
  ).current;

  useEffect(() => {
    const t = setTimeout(onDone, 5000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: '-16px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            borderRadius: p.round ? '50%' : '2px',
            '--duration': `${p.dur}s`,
            '--delay': `${p.delay}s`,
            animation: `confetti-fall var(--duration) var(--delay) linear forwards`,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Processing / Loading screen
───────────────────────────────────────────── */
function LoadingScreen({ preview }) {
  const [step, setStep] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);

  const steps = [
    { icon: '📸', label: 'Reading image' },
    { icon: '🧠', label: 'Understanding question' },
    { icon: '✍️', label: 'Writing answer' },
  ];

  const msgs = [
    'Reading your homework… 📸',
    'Thinking hard… 🧠',
    'Almost there… ✨',
    'Writing your answer… ✍️',
  ];

  useEffect(() => {
    const stepTimer = setInterval(() => setStep((s) => Math.min(s + 1, 2)), 2000);
    const msgTimer = setInterval(
      () => setMsgIdx((m) => (m + 1) % msgs.length),
      1800
    );
    return () => {
      clearInterval(stepTimer);
      clearInterval(msgTimer);
    };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ background: '#F8F7FF' }}
    >
      {/* Header */}
      <div
        className="w-full px-5 pt-6 pb-5"
        style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)' }}
      >
        <h1 className="font-baloo font-extrabold text-white text-xl">
          Solving Homework…
        </h1>
        <p className="text-xs mt-0.5" style={{ color: '#A5B4FC' }}>
          AI is analysing your question
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center px-5 py-8 w-full max-w-sm">
        {/* Image preview with spinner overlay */}
        {preview && (
          <div className="relative w-full rounded-3xl overflow-hidden mb-6 shadow-lg">
            <img
              src={preview}
              alt="Homework"
              className="w-full object-contain"
              style={{ maxHeight: '220px', filter: 'blur(1px) brightness(0.5)' }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div
                className="w-14 h-14 rounded-full border-4 border-t-transparent animate-spin-slow mb-3"
                style={{ borderColor: '#F59E0B', borderTopColor: 'transparent' }}
              />
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div
          className="w-full h-2 rounded-full mb-6 overflow-hidden"
          style={{ background: 'rgba(99,102,241,0.15)' }}
        >
          <div
            className="h-full rounded-full shimmer-bg transition-all duration-700"
            style={{
              background: 'linear-gradient(90deg, #F59E0B, #FBBF24, #F59E0B)',
              backgroundSize: '200% 100%',
              width: `${((step + 1) / 3) * 100}%`,
            }}
          />
        </div>

        {/* Step pills */}
        <div className="flex gap-3 mb-8">
          {steps.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1.5 transition-all duration-500"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500"
                style={{
                  background:
                    i < step
                      ? 'rgba(16,185,129,0.15)'
                      : i === step
                      ? 'rgba(245,158,11,0.2)'
                      : 'rgba(99,102,241,0.08)',
                  boxShadow:
                    i === step
                      ? '0 0 16px rgba(245,158,11,0.3)'
                      : 'none',
                  transform: i === step ? 'scale(1.08)' : 'scale(1)',
                }}
              >
                {i < step ? '✅' : s.icon}
              </div>
              <span
                className="text-xs font-semibold text-center leading-tight"
                style={{
                  color:
                    i < step
                      ? '#10B981'
                      : i === step
                      ? '#F59E0B'
                      : '#C7D2FE',
                  maxWidth: '60px',
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Loading message */}
        <p
          className="font-baloo font-bold text-lg text-center"
          style={{ color: '#4338CA' }}
        >
          {msgs[msgIdx]}
        </p>
        <p className="text-sm mt-2 text-center" style={{ color: '#818CF8' }}>
          Usually takes 15–25 seconds
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Error screen
───────────────────────────────────────────── */
function ErrorScreen({ message, onRetry }) {
  const router = useRouter();
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: '#FFF5F5' }}
    >
      <div className="text-7xl mb-4">😅</div>
      <h2 className="font-baloo font-extrabold text-2xl mb-2" style={{ color: '#B91C1C' }}>
        Couldn't read this clearly!
      </h2>
      <p className="text-base mb-2" style={{ color: '#7F1D1D' }}>
        {message || 'The AI had trouble with this image.'}
      </p>
      <div
        className="rounded-2xl p-4 mb-8 text-left w-full max-w-sm"
        style={{ background: '#FEF2F2', border: '1.5px solid #FECACA' }}
      >
        <p className="font-bold text-sm mb-2" style={{ color: '#991B1B' }}>
          📸 Try these tips:
        </p>
        {[
          'Better lighting — go near a window',
          'Hold the camera steady — no blur',
          'Get closer to the text',
          'Make sure the full question is visible',
        ].map((t) => (
          <p key={t} className="text-sm mb-1" style={{ color: '#7F1D1D' }}>
            • {t}
          </p>
        ))}
      </div>
      <button
        onClick={onRetry || (() => router.push('/upload'))}
        className="w-full max-w-sm py-4 font-baloo font-bold text-xl rounded-2xl active:scale-95 transition-transform mb-3"
        style={{ background: '#F59E0B', color: '#1E1B4B' }}
      >
        📸 Try Again
      </button>
      <button
        onClick={() => router.push('/')}
        className="text-sm font-semibold"
        style={{ color: '#6B7280' }}
      >
        🏠 Go Home
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   History slide-up panel
───────────────────────────────────────────── */
function HistoryPanel({ history, onClose, onSelect, onClear }) {
  const ICONS = { Math: '🔢', English: '📖', Science: '🔬', Other: '📚' };

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col justify-end"
      style={{ background: 'rgba(15,12,41,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="rounded-t-3xl p-5 animate-slide-up safe-bottom"
        style={{ background: '#FFFFFF', maxHeight: '75vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full" style={{ background: '#E5E7EB' }} />
        </div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-baloo font-extrabold text-xl" style={{ color: '#1E1B4B' }}>
            📋 Recent Questions
          </h2>
          <button onClick={onClose} className="text-gray-400 text-2xl leading-none">
            ✕
          </button>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">🗒️</div>
            <p className="text-gray-500">No history yet this session</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <button
                key={item.id}
                className="w-full text-left rounded-2xl p-4 transition-all active:scale-98 flex items-start gap-3"
                style={{ background: '#F8F7FF', border: '1.5px solid #E0E7FF' }}
                onClick={() => onSelect(item)}
              >
                <span className="text-2xl flex-shrink-0">
                  {ICONS[item.subject] || '📚'}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-sm truncate"
                    style={{ color: '#1E1B4B' }}
                  >
                    {item.question}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#6366F1' }}>
                    {item.subject} · {item.timestamp}
                  </p>
                </div>
                <span
                  className="font-baloo font-bold text-lg flex-shrink-0"
                  style={{ color: '#10B981' }}
                >
                  {item.answer}
                </span>
              </button>
            ))}
          </div>
        )}

        {history.length > 0 && (
          <button
            className="w-full mt-4 py-3 text-sm font-semibold rounded-xl"
            style={{ background: '#FEF2F2', color: '#EF4444' }}
            onClick={onClear}
          >
            🗑️ Clear History
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Card wrapper with stagger animation
───────────────────────────────────────────── */
function Card({ idx, header, headerStyle, children }) {
  return (
    <div
      className={`bg-white rounded-3xl overflow-hidden shadow-sm card-${idx}`}
    >
      <div className="px-5 py-3.5" style={headerStyle}>
        <h2 className="font-baloo font-extrabold text-white text-base">{header}</h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Build WhatsApp share message
───────────────────────────────────────────── */
function buildShareMsg(result, lang) {
  if (lang === 'en') {
    const steps = result.steps
      .map((s, i) => `Step ${i + 1}: ${s}`)
      .join('\n');
    return (
      `📚 *ParentPal helped with homework today!*\n\n` +
      `❓ *Question:* ${result.questionDetected}\n\n` +
      `📝 *Steps:*\n${steps}\n\n` +
      `✅ *Answer:* ${result.answer}\n\n` +
      `👨‍👩‍👧 *Tell your child:*\n"${result.parentScript_en}"\n\n` +
      `🤖 Solved by ParentPal — parentpal.app`
    );
  } else {
    const steps = result.steps
      .map((s, i) => `Step ${i + 1}: ${s}`)
      .join('\n');
    return (
      `📚 *ParentPal ne aaj homework solve kiya!*\n\n` +
      `❓ *Sawaal:* ${result.questionDetected}\n\n` +
      `📝 *Steps:*\n${steps}\n\n` +
      `✅ *Jawab:* ${result.answer}\n\n` +
      `👨‍👩‍👧 *Bacche ko samjhao:*\n"${result.parentScript_hi}"\n\n` +
      `🤖 ParentPal dwara — parentpal.app`
    );
  }
}

/* ─────────────────────────────────────────────
   Main Result Page
───────────────────────────────────────────── */
const SUBJECT_ICONS = {
  Math: '🔢',
  English: '📖',
  Science: '🔬',
  Other: '📚',
};

export default function ResultPage() {
  const router = useRouter();
  const hasFetched = useRef(false);

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [lang, setLang] = useState('en');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [preview, setPreview] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copyDone, setCopyDone] = useState(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const imageBase64 = sessionStorage.getItem('parentpal_image');
    const imageType =
      sessionStorage.getItem('parentpal_image_type') || 'image/jpeg';
    const imagePreview = sessionStorage.getItem('parentpal_image_preview');

    if (!imageBase64) {
      router.replace('/upload');
      return;
    }

    setPreview(imagePreview);

    // Load history
    try {
      const h = JSON.parse(sessionStorage.getItem('parentpal_history') || '[]');
      setHistory(h);
    } catch {}

    // Call API
    fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, imageType }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setResult(data);
        setStatus('success');
        setShowConfetti(true);

        // Save to session history (max 5)
        const entry = {
          id: Date.now(),
          question: data.questionDetected,
          subject: data.subject,
          answer: data.answer,
          timestamp: new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          result: data,
        };
        setHistory((prev) => {
          const updated = [entry, ...prev].slice(0, 5);
          sessionStorage.setItem('parentpal_history', JSON.stringify(updated));
          return updated;
        });
      })
      .catch((err) => {
        console.error('Analyze error:', err);
        setErrorMsg(err.message || 'Analysis failed. Please try again.');
        setStatus('error');
      });
  }, [router]);

  const handleShare = useCallback(() => {
    if (!result) return;
    const msg = buildShareMsg(result, lang);
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: 'ParentPal Answer', text: msg }).catch(() => {});
    } else {
      window.open(
        'https://wa.me/?text=' + encodeURIComponent(msg),
        '_blank',
        'noopener,noreferrer'
      );
    }
  }, [result, lang]);

  const handleCopy = useCallback(() => {
    if (!result) return;
    const msg = buildShareMsg(result, lang);
    navigator.clipboard.writeText(msg).then(() => {
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    });
  }, [result, lang]);

  // ─── LOADING ───
  if (status === 'loading') return <LoadingScreen preview={preview} />;

  // ─── ERROR ───
  if (status === 'error')
    return (
      <ErrorScreen
        message={errorMsg}
        onRetry={() => router.push('/upload')}
      />
    );

  // ─── SUCCESS ───
  const subjectIcon = SUBJECT_ICONS[result.subject] || '📚';

  return (
    <div className="min-h-screen" style={{ background: '#F8F7FF' }}>
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}

      {/* ── Header ── */}
      <div
        className="px-5 pt-6 pb-10"
        style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.push('/')}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-opacity active:opacity-60"
            style={{ background: 'rgba(255,255,255,0.12)' }}
            aria-label="Back"
          >
            <span className="text-white text-xl">←</span>
          </button>
          <h1 className="font-baloo font-extrabold text-white text-xl flex-1">
            Your Answer
          </h1>
          <button
            onClick={() => setShowHistory(true)}
            className="text-xs font-bold px-3 py-1.5 rounded-full transition-opacity active:opacity-70"
            style={{ background: 'rgba(245,158,11,0.2)', color: '#FCD34D' }}
          >
            📋 History
          </button>
        </div>

        {/* Subject badge + class level */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="font-bold text-sm px-3 py-1 rounded-full"
            style={{ background: 'rgba(245,158,11,0.2)', color: '#FCD34D' }}
          >
            {subjectIcon} {result.subject}
          </span>
          {result.classLevel && (
            <span
              className="text-sm font-semibold"
              style={{ color: '#A5B4FC' }}
            >
              {result.classLevel}
            </span>
          )}
        </div>

        {/* Detected question */}
        <p
          className="text-sm italic leading-relaxed"
          style={{ color: '#C7D2FE' }}
        >
          "{result.questionDetected}"
        </p>
      </div>

      {/* ── Cards ── */}
      <div className="px-4 -mt-5 pb-10 space-y-4 max-w-lg mx-auto">

        {/* Answer Card */}
        <Card
          idx={1}
          header="✅ ANSWER"
          headerStyle={{
            background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
          }}
        >
          <div className="text-center py-2">
            <p
              className="font-baloo font-extrabold leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 10vw, 3.5rem)', color: '#059669' }}
            >
              {result.answer}
            </p>
          </div>
        </Card>

        {/* Steps Card */}
        <Card
          idx={2}
          header="📝 SOLUTION STEPS"
          headerStyle={{
            background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
          }}
        >
          <div className="space-y-3">
            {(result.steps || []).map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full font-bold text-sm flex items-center justify-center"
                  style={{ background: '#FEF3C7', color: '#92400E' }}
                >
                  {i + 1}
                </span>
                <p
                  className="text-sm leading-relaxed pt-0.5 font-medium"
                  style={{ color: '#374151' }}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Explanation Card */}
        <Card
          idx={3}
          header="🧠 EXPLANATION"
          headerStyle={{
            background: 'linear-gradient(135deg, #4338CA 0%, #6366F1 100%)',
          }}
        >
          <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
            {result.explanation}
          </p>
        </Card>

        {/* Parent Script Card with EN/HI Toggle */}
        <div
          className="bg-white rounded-3xl overflow-hidden shadow-sm card-4"
        >
          {/* Header with toggle */}
          <div
            className="px-5 py-3.5"
            style={{
              background: 'linear-gradient(135deg, #B45309 0%, #F59E0B 100%)',
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-baloo font-extrabold text-white text-base">
                👨‍👩‍👧 WHAT TO SAY
              </h2>
              {/* Toggle pills */}
              <div
                className="flex rounded-full p-0.5"
                style={{ background: 'rgba(0,0,0,0.2)' }}
              >
                {[
                  { key: 'en', label: 'English' },
                  { key: 'hi', label: 'हिंदी' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setLang(key)}
                    className="px-3 py-1 rounded-full text-xs font-bold transition-all"
                    style={{
                      background: lang === key ? '#FFFFFF' : 'transparent',
                      color: lang === key ? '#92400E' : '#FEF3C7',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="px-5 py-4">
            <p
              className="text-sm leading-relaxed"
              style={{
                color: '#374151',
                fontFamily: lang === 'hi' ? 'system-ui, sans-serif' : 'inherit',
              }}
            >
              {lang === 'en' ? result.parentScript_en : result.parentScript_hi}
            </p>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="space-y-3 pt-1 card-5">
          {/* WhatsApp share */}
          <button
            onClick={handleShare}
            className="w-full py-4 font-baloo font-extrabold text-lg rounded-2xl transition-transform active:scale-95 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              color: '#FFFFFF',
              boxShadow: '0 6px 20px rgba(37,211,102,0.3)',
            }}
          >
            📤 Share on WhatsApp
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="w-full py-3.5 font-baloo font-bold text-base rounded-2xl transition-transform active:scale-95"
            style={{ background: '#EEF2FF', color: '#4338CA' }}
          >
            {copyDone ? '✅ Copied!' : '📋 Copy Answer'}
          </button>

          {/* Try another */}
          <button
            onClick={() => router.push('/upload')}
            className="w-full py-4 font-baloo font-extrabold text-lg rounded-2xl transition-transform active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
              color: '#1E1B4B',
              boxShadow: '0 6px 20px rgba(245,158,11,0.25)',
            }}
          >
            📸 Try Another Question
          </button>

          {/* Go home */}
          <button
            onClick={() => router.push('/')}
            className="w-full py-3.5 font-baloo font-bold text-base rounded-2xl transition-transform active:scale-95"
            style={{
              border: '2px solid #C7D2FE',
              color: '#4338CA',
              background: 'transparent',
            }}
          >
            🏠 Go Home
          </button>
        </div>

        {/* Disclaimer */}
        <p
          className="text-center text-xs leading-relaxed"
          style={{ color: '#9CA3AF' }}
        >
          AI can make mistakes. Always verify important answers.
          <br />
          ParentPal is a guide, not a replacement for learning.
        </p>
      </div>

      {/* History panel */}
      {showHistory && (
        <HistoryPanel
          history={history}
          onClose={() => setShowHistory(false)}
          onSelect={(item) => {
            setResult(item.result);
            setShowHistory(false);
          }}
          onClear={() => {
            setHistory([]);
            sessionStorage.removeItem('parentpal_history');
            setShowHistory(false);
          }}
        />
      )}
    </div>
  );
}
