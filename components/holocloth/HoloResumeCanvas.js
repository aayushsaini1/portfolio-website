'use client';

import React, { useEffect, useRef, useState } from 'react';
import { HoloApp } from './scene.js';

function loadImageWithProgress(url, onProgress, signal) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let blobUrl;
    let img;
    const cleanup = () => {
      signal.removeEventListener('abort', abort);
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
    const fail = (error) => {
      cleanup();
      reject(error);
    };
    const abort = () => {
      xhr.abort();
      if (img) {
        img.onload = null;
        img.onerror = null;
        img.src = '';
      }
      fail(new DOMException('Image load cancelled', 'AbortError'));
    };
    if (signal.aborted) return abort();
    signal.addEventListener('abort', abort, { once: true });
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded, e.total);
    };
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        fail(new Error(`${url}: HTTP ${xhr.status}`));
        return;
      }
      blobUrl = URL.createObjectURL(xhr.response);
      img = new Image();
      img.onload = () => {
        cleanup();
        resolve(img);
      };
      img.onerror = () => {
        fail(new Error(`${url}: decode failed`));
      };
      img.src = blobUrl;
    };
    xhr.onerror = () => fail(new Error(`${url}: network error`));
    xhr.send();
  });
}

export default function HoloResumeCanvas() {
  const hostRef = useRef(null);
  const appRef = useRef(null);
  const [loadPercent, setLoadPercent] = useState(0);
  const [assetsReady, setAssetsReady] = useState(false);
  const [loaderGone, setLoaderGone] = useState(false);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    if (!hostRef.current) return;

    const app = new HoloApp(hostRef.current);
    appRef.current = app;
    app.onFpsUpdate = (val) => setFps(val);
    const controller = new AbortController();
    let loaderTimeout;

    const assets = [
      { url: '/resume-texture.png', loaded: 0, total: 0, done: false },
      { url: '/bump-scratches.jpg', loaded: 0, total: 0, done: false },
    ];

    const report = () => {
      if (controller.signal.aborted) return;
      const total = assets.reduce((s, a) => s + a.total, 0);
      const loaded = assets.reduce((s, a) => s + a.loaded, 0);
      const pct = total > 0
        ? (loaded / total) * 100
        : (assets.filter((a) => a.done).length / assets.length) * 100;
      setLoadPercent((prev) => Math.max(prev, Math.min(100, pct)));
    };

    Promise.all(
      assets.map((a) =>
        loadImageWithProgress(a.url, (loaded, total) => {
          a.loaded = loaded;
          a.total = total;
          report();
        }, controller.signal).then((img) => {
          a.done = true;
          a.loaded = a.total || a.loaded;
          report();
          return img;
        }),
      ),
    )
      .then(([clothImg, bumpImg]) => {
        if (appRef.current !== app) return;
        app.setBumpMap(bumpImg);
        app.setClothImage(clothImg);
        setLoadPercent(100);
        app.reveal();
        setAssetsReady(true);
        loaderTimeout = setTimeout(() => setLoaderGone(true), 550);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error('[HoloResumeCanvas] asset load failed', err);
        if (appRef.current !== app) return;
        app.reveal();
        setAssetsReady(true);
        loaderTimeout = setTimeout(() => setLoaderGone(true), 550);
      });

    const updateThemeBackground = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const themeBg = isDark ? '#0c0c0c' : '#f4f4f4';
      app.setBackgroundColor(themeBg);
    };

    updateThemeBackground();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          updateThemeBackground();
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      controller.abort();
      clearTimeout(loaderTimeout);
      observer.disconnect();
      app.dispose();
      appRef.current = null;
    };
  }, []);

  const [downloading, setDownloading] = useState(false);

  const handleReset = () => {
    appRef.current?.resetCloth();
  };

  const handleDownloadResume = async (e) => {
    e.preventDefault();
    if (downloading) return;
    setDownloading(true);
    try {
      const res = await fetch('/api/download-resume');
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = blobUrl;
      tempLink.download = 'Aayush_Saini_Resume.pdf';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (err) {
      console.error('Error downloading resume:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none font-mono" style={{ backgroundColor: 'var(--bg-color)' }}>
      {/* Background canvas container */}
      <div
        ref={hostRef}
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: assetsReady ? 1 : 0 }}
      />

      {/* Top Center Muted Hint */}
      <div
        style={{
          position: 'absolute',
          top: '10rem',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'var(--muted-color, #888888)',
          fontSize: '1.2rem',
          pointerEvents: 'none',
          textTransform: 'lowercase',
          zIndex: 100
        }}
        className={`font-mono transition-all duration-500 ${assetsReady ? 'opacity-100' : 'opacity-0'}`}
      >
        Click/Touch to Drag
      </div>

      {/* Sticky Bottom Edge Footer */}
      <footer
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2.4rem',
          width: '100%',
          boxSizing: 'border-box'
        }}
        className={`transition-all duration-500 ${assetsReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
      >

        {/* Left: [Reset Cloth] Text Button & FPS Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} className="font-mono text-xs">
          <button
            onClick={handleReset}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-color, #a3a3a3)',
              textDecoration: 'underline',
              padding: 0
            }}
            className="hover:text-white transition-colors"
          >
            [Reset]
          </button>
          <span className="text-emerald-400 font-semibold">{fps} FPS</span>
        </div>

        {/* Rightmost: Download Resume.pdf button using Contact.js btn-primary style */}
        <div>
          <button
            onClick={handleDownloadResume}
            disabled={downloading}
            className="btn-primary"
            style={{
              transition: 'box-shadow 0.2s ease',
              cursor: downloading ? 'wait' : 'pointer',
              border: 'none',
              outline: 'none',
              padding: '1.6rem 2rem',
              fontSize: '1.4rem'
            }}
            onMouseEnter={(e) => {
              const isDark = document.documentElement.classList.contains('dark');
              const strokeColor = isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)';
              e.currentTarget.style.boxShadow = `inset 0 0 0 4px ${strokeColor}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {downloading ? 'Downloading...' : 'Download Resume.pdf'}
          </button>
        </div>
      </footer>

      {/* Loading Overlay */}
      {!loaderGone && (
        <div
          className={`fixed inset-0 z-50 grid place-items-center transition-opacity duration-500 ${assetsReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          style={{ backgroundColor: 'var(--bg-color)' }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16 grid place-items-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
                <circle
                  cx="36"
                  cy="36"
                  r="28"
                  fill="none"
                  stroke="rgba(128,128,128,0.15)"
                  strokeWidth="3"
                />
                <circle
                  cx="36"
                  cy="36"
                  r="28"
                  fill="none"
                  stroke="var(--accent-color, #ff5500)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - loadPercent / 100)}
                  className="transition-[stroke-dashoffset] duration-150 ease-linear"
                />
              </svg>
              <span className="absolute text-xs font-mono text-[var(--text-color)] font-medium">
                {Math.round(loadPercent)}%
              </span>
            </div>
            <span className="text-xs font-mono text-[var(--muted-color,#888888)] tracking-wider animate-pulse">
              loading file...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
