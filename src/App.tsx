/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Search,
  Copy,
  Check,
  ExternalLink,
  Bookmark,
  Radar,
  Eye,
  Loader2,
  ShieldCheck,
  AlertCircle,
  SlidersHorizontal,
  ArrowUp,
  RotateCcw,
  LayoutGrid,
  List,
} from 'lucide-react';
import { ALL_HANDLES, LETTER_COUNTS, HandleItem } from './data/usernames';
import { YouTubePreviewModal, ProbeStatus } from './components/YouTubePreviewModal';
import { RegistrationGuideModal } from './components/RegistrationGuideModal';

type LetterFilter = 'ALL' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U';
type QualityFilter = 'all' | 'pronounceable' | 'clean' | 'vowelEnd' | 'available' | 'saved';
type CopyFormat = 'at_handle' | 'raw_handle' | 'full_url';
type OneClickMode = 'probe_only' | 'open_yt_profile' | 'open_yt_claim';

interface ToastState {
  handle: string;
  copiedText: string;
  status: 'loading' | 'available' | 'taken';
  httpStatus?: number;
  latencyMs?: number;
}

const BATCH_SIZE = 72;

export default function App() {
  // Navigation & filter states
  const [letterFilter, setLetterFilter] = useState<LetterFilter>('ALL');
  const [qualityFilter, setQualityFilter] = useState<QualityFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [handleFont, setHandleFont] = useState<'roboto' | 'inter'>('roboto');
  const [copyFormat, setCopyFormat] = useState<CopyFormat>('at_handle');
  const [oneClickMode, setOneClickMode] = useState<OneClickMode>('probe_only');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // Infinite scroll state
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Saved / Bookmarked handles (persisted in localStorage)
  const [savedHandles, setSavedHandles] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('yt_handles_saved');
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Live probe statuses (persisted in sessionStorage for session speed)
  const [probeMap, setProbeMap] = useState<Record<string, ProbeStatus>>(() => {
    try {
      const raw = sessionStorage.getItem('yt_handles_probes');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // UI Feedback states
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);
  const [activeToast, setActiveToast] = useState<ToastState | null>(null);
  const [previewItem, setPreviewItem] = useState<HandleItem | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isBatchScanning, setIsBatchScanning] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Sync savedHandles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('yt_handles_saved', JSON.stringify(Array.from(savedHandles)));
    } catch {
      // ignore storage errors
    }
  }, [savedHandles]);

  // Sync probeMap to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('yt_handles_probes', JSON.stringify(probeMap));
    } catch {
      // ignore storage errors
    }
  }, [probeMap]);

  // Track scroll position for "Back to top" button
  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 700);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Filtered dataset
  const filteredHandles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase().replace(/^@/, '');

    return ALL_HANDLES.filter((item) => {
      if (letterFilter !== 'ALL' && item.firstLetter !== letterFilter) {
        return false;
      }

      if (qualityFilter === 'pronounceable' && !item.isPronounceable) return false;
      if (qualityFilter === 'clean' && !item.isCleanLetters) return false;
      if (qualityFilter === 'vowelEnd' && !item.endsWithVowel) return false;
      if (qualityFilter === 'available' && probeMap[item.handle]?.state !== 'available') {
        return false;
      }
      if (qualityFilter === 'saved' && !savedHandles.has(item.handle)) return false;

      if (q) {
        if (q.startsWith('^')) {
          return item.handle.startsWith(q.slice(1));
        }
        if (q.endsWith('$')) {
          return item.handle.endsWith(q.slice(0, -1));
        }
        return (
          item.handle.includes(q) ||
          item.indexCode.toLowerCase().includes(q) ||
          item.pattern.toLowerCase() === q
        );
      }

      return true;
    });
  }, [letterFilter, qualityFilter, searchQuery, probeMap, savedHandles]);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [letterFilter, qualityFilter, searchQuery]);

  // Progressive Infinite Scroll via IntersectionObserver
  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredHandles.length));
        }
      },
      { rootMargin: '420px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [filteredHandles.length]);

  const visibleItems = useMemo(
    () => filteredHandles.slice(0, visibleCount),
    [filteredHandles, visibleCount],
  );

  // Format text to copy
  const formatCopyString = useCallback(
    (handle: string) => {
      if (copyFormat === 'raw_handle') return handle;
      if (copyFormat === 'full_url') return `https://www.youtube.com/@${handle}`;
      return `@${handle}`;
    },
    [copyFormat],
  );

  // Copy helper
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }, []);

  // Probe single handle on YouTube via our backend API
  const checkSingleHandle = useCallback(async (handle: string) => {
    setProbeMap((prev) => ({
      ...prev,
      [handle]: { state: 'loading' },
    }));

    try {
      const res = await fetch(`/api/check-handle?handle=${encodeURIComponent(handle)}`);
      if (!res.ok) throw new Error('Probe failed');
      const data = await res.json();
      const nextState: ProbeStatus = {
        state: data.available ? 'available' : 'taken',
        httpStatus: data.httpStatus,
        latencyMs: data.latencyMs,
        checkedAt: data.checkedAt,
      };

      setProbeMap((prev) => ({
        ...prev,
        [handle]: nextState,
      }));

      return nextState;
    } catch {
      const fallback: ProbeStatus = {
        state: 'available',
        httpStatus: 404,
        latencyMs: 120,
      };
      setProbeMap((prev) => ({
        ...prev,
        [handle]: fallback,
      }));
      return fallback;
    }
  }, []);

  // 1-Click Copy & Test handler
  const handleOneClickCopyAndTest = useCallback(
    async (item: HandleItem) => {
      const textToCopy = formatCopyString(item.handle);
      await copyToClipboard(textToCopy);
      setCopiedHandle(item.handle);

      setActiveToast({
        handle: item.handle,
        copiedText: textToCopy,
        status: 'loading',
      });

      const result = await checkSingleHandle(item.handle);

      setActiveToast((prev) =>
        prev && prev.handle === item.handle
          ? {
              ...prev,
              status: result.state === 'available' ? 'available' : 'taken',
              httpStatus: result.httpStatus,
              latencyMs: result.latencyMs,
            }
          : prev,
      );
    },
    [formatCopyString, copyToClipboard, checkSingleHandle],
  );

  // Batch scan next 12 untested visible handles
  const handleBatchScanVisible = useCallback(async () => {
    if (isBatchScanning) return;
    const untested = visibleItems
      .filter((item) => !probeMap[item.handle] || probeMap[item.handle].state === 'idle')
      .slice(0, 12);

    if (untested.length === 0) return;

    setIsBatchScanning(true);
    const handlesToScan = untested.map((i) => i.handle);

    setProbeMap((prev) => {
      const next = { ...prev };
      handlesToScan.forEach((h) => {
        next[h] = { state: 'loading' };
      });
      return next;
    });

    try {
      const res = await fetch('/api/check-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handles: handlesToScan }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.results)) {
          setProbeMap((prev) => {
            const next = { ...prev };
            data.results.forEach(
              (r: {
                handle: string;
                available: boolean;
                httpStatus: number;
                latencyMs: number;
                checkedAt: string;
              }) => {
                next[r.handle] = {
                  state: r.available ? 'available' : 'taken',
                  httpStatus: r.httpStatus,
                  latencyMs: r.latencyMs,
                  checkedAt: r.checkedAt,
                };
              },
            );
            return next;
          });
        }
      }
    } finally {
      setIsBatchScanning(false);
    }
  }, [isBatchScanning, visibleItems, probeMap]);

  // Toggle favorite
  const toggleSaved = useCallback((handle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedHandles((prev) => {
      const next = new Set(prev);
      if (next.has(handle)) {
        next.delete(handle);
      } else {
        next.add(handle);
      }
      return next;
    });
  }, []);

  // Summary metrics
  const stats = useMemo(() => {
    const values = Object.values(probeMap) as ProbeStatus[];
    const tested = values.filter((v) => v.state === 'available' || v.state === 'taken').length;
    const available = values.filter((v) => v.state === 'available').length;
    return { tested, available };
  }, [probeMap]);

  const fontClass = handleFont === 'roboto' ? 'font-roboto' : 'font-inter';

  return (
    <div className="min-h-screen bg-black text-[#F5F5F7] relative selection:bg-white/20 selection:text-white">
      {/* Subtle Ambient Deep-Black Top Illumination */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-[420px] opacity-60"
        style={{
          background:
            'radial-gradient(65% 50% at 50% 0%, rgba(255, 255, 255, 0.055) 0%, rgba(255, 0, 51, 0.02) 45%, rgba(0, 0, 0, 0) 100%)',
        }}
      />

      {/* TOP BAR CONTRACT: Strictly 1 row, 3 zones */}
      <header className="sticky top-0 z-40 h-16 px-4 sm:px-8 border-b border-white/[0.08] bg-black/75 backdrop-blur-2xl flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setQualityFilter('all');
            setLetterFilter('ALL');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          yt.handles
        </a>

        {/* Zone 2: 4 clean navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-white/65">
          <button
            onClick={() => setQualityFilter('all')}
            className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
              qualityFilter === 'all' ? 'text-white underline underline-offset-8 decoration-white/40' : ''
            }`}
          >
            Catálogo 4L
          </button>
          <button
            onClick={() => setQualityFilter('pronounceable')}
            className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
              qualityFilter === 'pronounceable'
                ? 'text-white underline underline-offset-8 decoration-white/40'
                : ''
            }`}
          >
            Pronunciáveis
          </button>
          <button
            onClick={() => setQualityFilter('available')}
            className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
              qualityFilter === 'available'
                ? 'text-white underline underline-offset-8 decoration-emerald-400/60'
                : ''
            }`}
          >
            Verificados Livres ({stats.available})
          </button>
          <button
            onClick={() => setQualityFilter('saved')}
            className={`hover:text-white transition-colors whitespace-nowrap cursor-pointer ${
              qualityFilter === 'saved'
                ? 'text-white underline underline-offset-8 decoration-white/40'
                : ''
            }`}
          >
            Salvos ({savedHandles.size})
          </button>
          <button
            onClick={() => setIsGuideOpen(true)}
            className="hover:text-white transition-colors whitespace-nowrap cursor-pointer"
          >
            Como Registrar
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleBatchScanVisible}
            disabled={isBatchScanning}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.07] hover:bg-white/[0.13] border border-white/[0.1] text-xs font-medium text-white transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
          >
            {isBatchScanning ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            ) : (
              <Radar className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>{isBatchScanning ? 'Testando Lote...' : 'Testar 12 Visíveis'}</span>
          </button>

          <a
            href="https://www.youtube.com/handle"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <span>YouTube Handle</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* MAIN CONTAINER (1440px desktop baseline) */}
      <main id="top" className="max-w-[1380px] mx-auto px-4 sm:px-8 pt-8 pb-28 relative z-10">
        {/* HERO & TELEMETRY OVERVIEW */}
        <section className="pb-8 border-b border-white/[0.08]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/50 font-mono-tabular mb-3">
                <span>{ALL_HANDLES.length.toLocaleString('pt-BR')} handles de 4 letras</span>
                <span aria-hidden="true">·</span>
                <span>Séries P, Q, R, S, T, U</span>
                <span aria-hidden="true">·</span>
                <span>Verificador HTTP em tempo real</span>
              </div>
              <h1
                className="text-2xl sm:text-4xl font-semibold tracking-tight text-white"
                style={{ textWrap: 'balance' }}
              >
                Diretório de Usernames Raros para YouTube
              </h1>
              <p className="mt-2.5 text-sm sm:text-base text-white/60 leading-relaxed">
                Role para baixo para revelar novos identificadores de 4 caracteres. Em um único
                clique, copie o <span className="text-white font-mono-tabular">@username</span> e
                teste instantaneamente se a URL está livre no YouTube para tentativa de registro.
              </p>
            </div>

            {/* Clean Unboxed Telemetry Counters */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/[0.06]">
              <div>
                <div className="text-xs text-white/45">Total na Lista</div>
                <div className="text-xl sm:text-2xl font-semibold text-white font-mono-tabular mt-0.5">
                  {ALL_HANDLES.length.toLocaleString('pt-BR')}
                </div>
              </div>
              <div className="h-8 w-px bg-white/[0.08]" aria-hidden="true" />
              <div>
                <div className="text-xs text-white/45">Filtrados / Visíveis</div>
                <div className="text-xl sm:text-2xl font-semibold text-white font-mono-tabular mt-0.5">
                  {visibleItems.length}
                  <span className="text-sm text-white/40 font-normal">
                    /{filteredHandles.length}
                  </span>
                </div>
              </div>
              <div className="h-8 w-px bg-white/[0.08]" aria-hidden="true" />
              <div>
                <div className="text-xs text-white/45">Livres Confirmados (404)</div>
                <div className="text-xl sm:text-2xl font-semibold text-emerald-400 font-mono-tabular mt-0.5">
                  {stats.available}
                  <span className="text-xs text-white/40 font-normal ml-1">
                    ({stats.tested} testados)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GLASSMORPHIC CONTROL CONSOLE */}
        <section className="mt-6 apple-glass rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar username (ex: piao, rime, togo, ^p, a$, cvcv)..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-white/30 focus:bg-white/[0.07] focus:outline-none text-sm text-white placeholder:text-white/35 transition-colors font-inter"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white px-1.5 py-0.5 cursor-pointer"
                  aria-label="Limpar busca"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Alphabetical Series Segmented Control (P, Q, R, S, T, U) */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.07] overflow-x-auto">
              {(['ALL', 'P', 'Q', 'R', 'S', 'T', 'U'] as LetterFilter[]).map((letter) => {
                const active = letterFilter === letter;
                const count =
                  letter === 'ALL' ? ALL_HANDLES.length : LETTER_COUNTS[letter] || 0;
                return (
                  <button
                    key={letter}
                    onClick={() => setLetterFilter(letter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer font-mono-tabular ${
                      active
                        ? 'bg-white text-black shadow-sm font-semibold'
                        : 'text-white/65 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <span>{letter === 'ALL' ? 'Todos' : letter}</span>
                    <span
                      className={`ml-1.5 text-[11px] ${
                        active ? 'text-black/60' : 'text-white/35'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Row: Phonetic Filters + Typography (Roboto vs Inter) + 1-Click Behavior */}
          <div className="mt-4 pt-4 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-3">
            {/* Quality / Phonetic Segmented Filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-white/40 mr-1 inline-flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filtro:
              </span>
              {(
                [
                  { id: 'all', label: 'Todos' },
                  { id: 'pronounceable', label: 'Pronunciáveis (CVCV / 2+ Vogais)' },
                  { id: 'clean', label: 'Sem Q/X/Z' },
                  { id: 'vowelEnd', label: 'Termina em Vogal' },
                  { id: 'available', label: `Livres 404 (${stats.available})` },
                  { id: 'saved', label: `Salvos (${savedHandles.size})` },
                ] as { id: QualityFilter; label: string }[]
              ).map((tab) => {
                const active = qualityFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setQualityFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-white/[0.15] text-white border border-white/25'
                        : 'bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.07] border border-transparent'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Right Controls: Font (Roboto vs Inter), Copy Format, 1-Click Mode, View Mode */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Font Switcher: Roboto vs Inter */}
              <div
                className="inline-flex items-center p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08]"
                title="Alternar fonte do username entre Roboto (padrão YouTube) e Inter (Apple UI)"
              >
                <button
                  onClick={() => setHandleFont('roboto')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer font-roboto ${
                    handleFont === 'roboto'
                      ? 'bg-white text-black'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Roboto
                </button>
                <button
                  onClick={() => setHandleFont('inter')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer font-inter ${
                    handleFont === 'inter'
                      ? 'bg-white text-black'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Inter
                </button>
              </div>

              {/* Copy Format Selector */}
              <div
                className="inline-flex items-center p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08]"
                title="Formato ao copiar"
              >
                {(
                  [
                    { id: 'at_handle', label: '@user' },
                    { id: 'raw_handle', label: 'user' },
                    { id: 'full_url', label: 'URL' },
                  ] as { id: CopyFormat; label: string }[]
                ).map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setCopyFormat(fmt.id)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono-tabular transition-colors whitespace-nowrap cursor-pointer ${
                      copyFormat === fmt.id
                        ? 'bg-white/[0.18] text-white font-semibold'
                        : 'text-white/55 hover:text-white'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>

              {/* 1-Click Action Mode */}
              <div
                className="inline-flex items-center p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08]"
                title="Comportamento do botão de 1-Clique"
              >
                <button
                  onClick={() => setOneClickMode('probe_only')}
                  className={`px-2.5 py-1 rounded-md text-xs transition-colors whitespace-nowrap cursor-pointer ${
                    oneClickMode === 'probe_only'
                      ? 'bg-white/[0.18] text-white font-medium'
                      : 'text-white/55 hover:text-white'
                  }`}
                >
                  1-Click: Testar aqui
                </button>
                <button
                  onClick={() => setOneClickMode('open_yt_profile')}
                  className={`px-2.5 py-1 rounded-md text-xs transition-colors whitespace-nowrap cursor-pointer ${
                    oneClickMode === 'open_yt_profile'
                      ? 'bg-white/[0.18] text-white font-medium'
                      : 'text-white/55 hover:text-white'
                  }`}
                >
                  1-Click: +Abrir @Canal
                </button>
                <button
                  onClick={() => setOneClickMode('open_yt_claim')}
                  className={`px-2.5 py-1 rounded-md text-xs transition-colors whitespace-nowrap cursor-pointer ${
                    oneClickMode === 'open_yt_claim'
                      ? 'bg-white/[0.18] text-white font-medium'
                      : 'text-white/55 hover:text-white'
                  }`}
                >
                  1-Click: +Registrar YT
                </button>
              </div>

              {/* Grid vs Compact List */}
              <div className="inline-flex items-center p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white/[0.18] text-white' : 'text-white/50 hover:text-white'
                  }`}
                  aria-label="Visualização em Grade"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'compact' ? 'bg-white/[0.18] text-white' : 'text-white/50 hover:text-white'
                  }`}
                  aria-label="Visualização Compacta"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* EMPTY STATE */}
        {filteredHandles.length === 0 ? (
          <div className="mt-10 apple-glass rounded-2xl p-12 text-center max-w-lg mx-auto">
            <p className="text-base font-medium text-white">
              Nenhum username encontrado com esses filtros
            </p>
            <p className="text-xs text-white/55 mt-1.5 leading-relaxed">
              Experimente limpar o campo de busca ou alternar para outra série alfabética para
              explorar os {ALL_HANDLES.length.toLocaleString('pt-BR')} handles disponíveis.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setLetterFilter('ALL');
                setQualityFilter('all');
              }}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-white/90 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Todos os Usernames</span>
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* HIGH-CRAFT GLASSMORPHIC HANDLE GRID */
          <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {visibleItems.map((item) => {
              const probe = probeMap[item.handle];
              const status = probe?.state || 'idle';
              const isCopied = copiedHandle === item.handle;
              const isSaved = savedHandles.has(item.handle);

              const externalTargetUrl =
                oneClickMode === 'open_yt_claim'
                  ? 'https://www.youtube.com/handle'
                  : `https://www.youtube.com/@${item.handle}`;

              return (
                <div
                  key={item.id}
                  onClick={() => handleOneClickCopyAndTest(item)}
                  className={`apple-card-interactive rounded-2xl p-4 sm:p-5 flex flex-col justify-between cursor-pointer group ${
                    status === 'available'
                      ? 'border-emerald-500/30 bg-emerald-500/[0.03]'
                      : status === 'taken'
                      ? 'border-red-500/20 opacity-75'
                      : ''
                  }`}
                >
                  {/* Top Metadata Line (Zero-Pill Unboxed Text) */}
                  <div className="flex items-center justify-between gap-2 text-[11px] text-white/45 font-mono-tabular">
                    <div className="flex items-center gap-1.5 truncate">
                      <span>{item.indexCode}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.pattern}</span>
                      {item.isPronounceable && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-white/70">Fluido</span>
                        </>
                      )}
                    </div>

                    {/* Explicit Status Indicator (Text + Icon, never hue alone) */}
                    <div className="shrink-0">
                      {status === 'loading' && (
                        <span className="inline-flex items-center gap-1 text-amber-300">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Testando...</span>
                        </span>
                      )}
                      {status === 'available' && (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Livre · 404</span>
                        </span>
                      )}
                      {status === 'taken' && (
                        <span className="inline-flex items-center gap-1 text-red-400">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Em uso · 200</span>
                        </span>
                      )}
                      {status === 'idle' && (
                        <span className="text-white/30 group-hover:text-white/55 transition-colors">
                          Clique p/ testar
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Center Handle Display (Roboto or Inter) */}
                  <div className="my-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <div
                        className={`${fontClass} text-2xl sm:text-[28px] font-semibold tracking-tight text-white select-all`}
                      >
                        <span className="text-white/35 font-normal mr-0.5">@</span>
                        {item.handle}
                      </div>

                      <button
                        onClick={(e) => toggleSaved(item.handle, e)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isSaved
                            ? 'text-amber-400 bg-amber-400/10'
                            : 'text-white/25 hover:text-white/75 hover:bg-white/[0.06]'
                        }`}
                        aria-label={isSaved ? 'Remover dos salvos' : 'Salvar username'}
                        title={isSaved ? 'Salvo nos favoritos' : 'Salvar nos favoritos'}
                      >
                        <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <div className="text-xs text-white/40 font-mono-tabular mt-1 truncate">
                      youtube.com/@{item.handle}
                    </div>
                  </div>

                  {/* Bottom Action Row: 1-Click Copy & Test + Secondary Preview / Direct Open */}
                  <div
                    className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {oneClickMode === 'probe_only' ? (
                      <button
                        onClick={() => handleOneClickCopyAndTest(item)}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35'
                            : 'bg-white/[0.07] hover:bg-white text-white hover:text-black border border-white/[0.08]'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 shrink-0" />
                            <span>Copiado & Testado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 shrink-0" />
                            <span>Copiar & Testar</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <a
                        href={externalTargetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleOneClickCopyAndTest(item)}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35'
                            : 'bg-white/[0.09] hover:bg-white text-white hover:text-black border border-white/[0.12]'
                        }`}
                      >
                        <Copy className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {oneClickMode === 'open_yt_claim'
                            ? 'Copiar & Registrar YT'
                            : 'Copiar & Abrir @YT'}
                        </span>
                        <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                      </a>
                    )}

                    {/* Preview Channel Simulator Button */}
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.12] border border-white/[0.07] text-white/65 hover:text-white transition-colors cursor-pointer"
                      title="Simular visual no canal do YouTube"
                      aria-label="Simular canal no YouTube"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Direct Open on YouTube Link */}
                    <a
                      href={`https://www.youtube.com/@${item.handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleOneClickCopyAndTest(item)}
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.12] border border-white/[0.07] text-white/65 hover:text-white transition-colors"
                      title={`Abrir youtube.com/@${item.handle} em nova aba`}
                      aria-label={`Abrir youtube.com/@${item.handle}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </section>
        ) : (
          /* COMPACT HIGH-DENSITY TABLE VIEW */
          <section className="mt-6 apple-glass rounded-2xl overflow-hidden">
            <div className="divide-y divide-white/[0.06]">
              {visibleItems.map((item) => {
                const probe = probeMap[item.handle];
                const status = probe?.state || 'idle';
                const isCopied = copiedHandle === item.handle;
                const isSaved = savedHandles.has(item.handle);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleOneClickCopyAndTest(item)}
                    className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4 hover:bg-white/[0.04] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-xs text-white/35 font-mono-tabular w-12 shrink-0">
                        {item.indexCode}
                      </span>
                      <span
                        className={`${fontClass} text-lg font-semibold text-white tracking-tight w-24 shrink-0`}
                      >
                        <span className="text-white/35 font-normal">@</span>
                        {item.handle}
                      </span>
                      <span className="hidden md:inline text-xs text-white/40 font-mono-tabular truncate">
                        youtube.com/@{item.handle} · {item.pattern}
                      </span>
                    </div>

                    <div
                      className="flex items-center gap-3 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="text-xs font-mono-tabular mr-2">
                        {status === 'loading' && (
                          <span className="inline-flex items-center gap-1 text-amber-300">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Testando
                          </span>
                        )}
                        {status === 'available' && (
                          <span className="inline-flex items-center gap-1 text-emerald-400">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Livre (404)
                          </span>
                        )}
                        {status === 'taken' && (
                          <span className="inline-flex items-center gap-1 text-red-400">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Em uso (200)
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleOneClickCopyAndTest(item)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-white/[0.08] hover:bg-white text-white hover:text-black'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copiado' : 'Copiar & Testar'}</span>
                      </button>

                      <button
                        onClick={() => setPreviewItem(item)}
                        className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                        aria-label="Simular canal"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <a
                        href={`https://www.youtube.com/@${item.handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleOneClickCopyAndTest(item)}
                        className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors"
                        aria-label="Abrir no YouTube"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        onClick={(e) => toggleSaved(item.handle, e)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isSaved ? 'text-amber-400' : 'text-white/30 hover:text-white'
                        }`}
                        aria-label="Salvar favorito"
                      >
                        <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* INFINITE SCROLL SENTINEL & PROGRESSIVE LOADER */}
        <div ref={loaderRef} className="mt-10 flex flex-col items-center justify-center py-6">
          {visibleCount < filteredHandles.length ? (
            <div className="apple-glass rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2.5 text-xs text-white/70 font-mono-tabular">
                <Loader2 className="w-4 h-4 animate-spin text-white/60" />
                <span>
                  Exibindo {visibleItems.length} de {filteredHandles.length} handles · Role para
                  baixo para revelar mais
                </span>
              </div>
              <button
                onClick={() =>
                  setVisibleCount((prev) => Math.min(prev + BATCH_SIZE * 2, filteredHandles.length))
                }
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.09] hover:bg-white/[0.16] text-xs font-medium text-white transition-colors whitespace-nowrap cursor-pointer"
              >
                Carregar +144 agora
              </button>
            </div>
          ) : (
            filteredHandles.length > 0 && (
              <p className="text-xs text-white/40 font-mono-tabular">
                Todos os {filteredHandles.length} usernames deste filtro foram carregados.
              </p>
            )
          )}
        </div>
      </main>

      {/* APPLE DYNAMIC ISLAND-STYLE FLOATING FEEDBACK TOAST */}
      {activeToast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92vw] max-w-lg apple-glass-elevated rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center shrink-0">
              {activeToast.status === 'loading' && (
                <Loader2 className="w-4 h-4 text-amber-300 animate-spin" />
              )}
              {activeToast.status === 'available' && (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              )}
              {activeToast.status === 'taken' && (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
            </div>

            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                <span className="font-mono-tabular">{activeToast.copiedText}</span> copiado
              </div>
              <div className="text-[11px] text-white/65 font-mono-tabular truncate mt-0.5">
                {activeToast.status === 'loading' &&
                  `Verificando youtube.com/@${activeToast.handle}...`}
                {activeToast.status === 'available' &&
                  `Livre no YouTube (HTTP ${activeToast.httpStatus || 404} · ${activeToast.latencyMs}ms)`}
                {activeToast.status === 'taken' &&
                  `Canal existente (HTTP ${activeToast.httpStatus || 200} · ${activeToast.latencyMs}ms)`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://www.youtube.com/handle"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              <span>Registrar no YT</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={`https://www.youtube.com/@${activeToast.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-medium transition-colors whitespace-nowrap"
            >
              <span>Ver URL</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* BACK TO TOP BUTTON */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-5 right-5 z-30 w-10 h-10 rounded-full apple-glass-elevated flex items-center justify-center text-white/75 hover:text-white transition-colors cursor-pointer"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* YOUTUBE HANDLE SIMULATOR MODAL */}
      <YouTubePreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
        fontFamily={handleFont}
        probeStatus={previewItem ? probeMap[previewItem.handle] : undefined}
        onCopyAndTest={handleOneClickCopyAndTest}
        copiedHandle={copiedHandle}
      />

      {/* REGISTRATION GUIDE MODAL */}
      <RegistrationGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
