'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Compress image to max 1024px wide/tall, 85% quality JPEG
function compressImage(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1024;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width >= height) {
          height = Math.round((height * MAX) / width);
          width = MAX;
        } else {
          width = Math.round((width * MAX) / height);
          height = MAX;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = dataUrl;
  });
}

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null); // full data URL (preview)
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const compressed = await compressImage(e.target.result);
      setImage(compressed);
      setIsCompressing(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInput = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSolve = () => {
    if (!image) return;
    // Strip data URL prefix → raw base64
    const [header, base64] = image.split(',');
    const mimeMatch = header.match(/data:([^;]+)/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    sessionStorage.setItem('parentpal_image', base64);
    sessionStorage.setItem('parentpal_image_type', mimeType);
    sessionStorage.setItem('parentpal_image_preview', image);
    router.push('/result');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8F7FF' }}>
      {/* Header */}
      <div
        className="px-5 pt-6 pb-5 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)' }}
      >
        <button
          onClick={() => router.push('/')}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-opacity active:opacity-60"
          style={{ background: 'rgba(255,255,255,0.12)' }}
          aria-label="Back"
        >
          <span className="text-white text-xl">←</span>
        </button>
        <div>
          <h1 className="font-baloo font-extrabold text-white text-xl leading-tight">
            Upload Homework
          </h1>
          <p className="text-xs" style={{ color: '#A5B4FC' }}>
            Camera or gallery — any subject
          </p>
        </div>
      </div>

      <div className="flex-1 px-5 py-6 max-w-lg mx-auto w-full">
        {/* Upload zone */}
        <div
          className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all mb-4 ${
            isDragging ? 'ring-4 ring-amber-400' : ''
          }`}
          style={{
            border: image ? '2.5px solid #F59E0B' : '2.5px dashed #A5B4FC',
            minHeight: '240px',
            background: image ? '#000' : 'rgba(99,102,241,0.04)',
          }}
          onClick={() => !image && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {isCompressing ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div
                className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin-slow mb-3"
                style={{ borderColor: '#F59E0B', borderTopColor: 'transparent' }}
              />
              <p className="text-sm font-semibold" style={{ color: '#6366F1' }}>
                Preparing image…
              </p>
            </div>
          ) : image ? (
            <>
              {/* Preview */}
              <img
                src={image}
                alt="Homework preview"
                className="w-full object-contain"
                style={{ maxHeight: '320px' }}
              />
              {/* Dark overlay for readability */}
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
              {/* Change badge */}
              <button
                className="absolute top-3 right-3 font-bold text-xs px-3 py-1.5 rounded-full transition-transform active:scale-95"
                style={{ background: '#F59E0B', color: '#1E1B4B' }}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                ✏️ Change
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-60 px-6 text-center">
              <div className="text-6xl mb-4">📷</div>
              <p
                className="font-baloo font-extrabold text-xl mb-1"
                style={{ color: '#4338CA' }}
              >
                Tap to Upload
              </p>
              <p className="text-sm" style={{ color: '#818CF8' }}>
                Camera or Photo Gallery
              </p>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
        />

        {/* Remove image */}
        {image && !isCompressing && (
          <button
            className="w-full py-2.5 mb-4 flex items-center justify-center gap-2 text-sm font-semibold transition-opacity active:opacity-60 rounded-xl"
            style={{ color: '#EF4444', background: '#FEF2F2' }}
            onClick={() => setImage(null)}
          >
            🗑️ Remove image
          </button>
        )}

        {/* Tips card */}
        {!image && (
          <div
            className="rounded-2xl p-4 mb-6"
            style={{ background: '#FFFBEB', border: '1.5px solid #FDDf8A' }}
          >
            <p className="font-baloo font-bold text-base mb-2" style={{ color: '#92400E' }}>
              📝 Tips for the best result
            </p>
            <ul className="space-y-1.5">
              {[
                ['☀️', 'Good lighting — avoid harsh shadows'],
                ['🎯', 'Hold camera steady — avoid blur'],
                ['🔍', 'Capture the full question clearly'],
                ['📐', 'Landscape for long equations works great'],
              ].map(([icon, tip]) => (
                <li key={tip} className="flex items-start gap-2 text-sm" style={{ color: '#78350F' }}>
                  <span>{icon}</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Solve button */}
        <button
          onClick={handleSolve}
          disabled={!image || isCompressing}
          className={`w-full py-5 font-baloo font-extrabold text-xl rounded-2xl transition-all ${
            image && !isCompressing
              ? 'active:scale-95'
              : 'opacity-40 cursor-not-allowed'
          }`}
          style={{
            background:
              image && !isCompressing
                ? 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)'
                : '#E5E7EB',
            color: image && !isCompressing ? '#1E1B4B' : '#9CA3AF',
            boxShadow:
              image && !isCompressing
                ? '0 8px 24px rgba(245,158,11,0.3)'
                : 'none',
          }}
        >
          🚀 Solve This!
        </button>

        {/* Helper text */}
        {image && (
          <p className="text-center text-xs mt-3" style={{ color: '#818CF8' }}>
            Uses AI to read and solve — takes ~20 seconds
          </p>
        )}
      </div>
    </div>
  );
}
