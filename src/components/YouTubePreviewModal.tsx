import React from 'react';
import { X, Check, Copy, ExternalLink, Globe, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { HandleItem } from '../data/usernames';

export interface ProbeStatus {
  state: 'idle' | 'loading' | 'available' | 'taken';
  httpStatus?: number;
  latencyMs?: number;
  checkedAt?: string;
}

interface YouTubePreviewModalProps {
  item: HandleItem | null;
  onClose: () => void;
  fontFamily: 'inter' | 'roboto';
  probeStatus?: ProbeStatus;
  onCopyAndTest: (item: HandleItem) => void;
  copiedHandle: string | null;
}

export const YouTubePreviewModal: React.FC<YouTubePreviewModalProps> = ({
  item,
  onClose,
  fontFamily,
  probeStatus,
  onCopyAndTest,
  copiedHandle,
}) => {
  if (!item) return null;

  const fontClass = fontFamily === 'roboto' ? 'font-roboto' : 'font-inter';
  const isCopied = copiedHandle === item.handle;
  const status = probeStatus?.state || 'idle';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="apple-glass-elevated w-full max-w-2xl rounded-2xl p-6 sm:p-8 text-[#F5F5F7] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
          <div>
            <div className="text-xs text-white/50 font-mono-tabular">
              <span>{item.indexCode}</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>Série {item.firstLetter}</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>Padrão {item.pattern}</span>
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-white mt-1">
              Simulador de Identificador do YouTube
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors"
            aria-label="Fechar simulador"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulated YouTube Dark Channel Header */}
        <div className="mt-6 rounded-xl bg-[#0F0F0F] border border-white/[0.08] p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar Monogram */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/15 to-white/[0.03] border border-white/15 flex items-center justify-center shrink-0">
              <span className={`${fontClass} text-2xl font-bold tracking-tight text-white uppercase`}>
                {item.handle.slice(0, 2)}
              </span>
            </div>

            {/* Channel Identity */}
            <div className="flex-1 min-w-0">
              <div className={`${fontClass} text-2xl sm:text-3xl font-bold text-white tracking-tight truncate`}>
                {item.handle}
              </div>
              <div className={`${fontClass} flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#AAAAAA] mt-1`}>
                <span className="text-white font-medium">@{item.handle}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">124 mil inscritos</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">48 vídeos</span>
              </div>
              <p className={`${fontClass} text-xs text-[#888888] mt-2 line-clamp-1`}>
                youtube.com/@{item.handle} · Canal oficial com identificador curto de 4 letras.
              </p>
            </div>

            {/* Subscribe Mock Button */}
            <div className="shrink-0">
              <span className={`${fontClass} inline-flex items-center px-4 py-2 rounded-full bg-[#F1F1F1] text-[#0F0F0F] text-xs font-medium`}>
                Inscrever-se
              </span>
            </div>
          </div>

          {/* URL Bar Preview */}
          <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-white/70 font-mono-tabular">
              <Globe className="w-3.5 h-3.5 text-white/40" />
              <span>https://www.youtube.com/</span>
              <span className="text-white font-semibold">@{item.handle}</span>
            </div>

            <div className="font-mono-tabular text-xs">
              {status === 'loading' && (
                <span className="inline-flex items-center gap-1.5 text-amber-300">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Consultando YouTube...
                </span>
              )}
              {status === 'available' && (
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Livre no YouTube · HTTP {probeStatus?.httpStatus || 404} ({probeStatus?.latencyMs}ms)
                </span>
              )}
              {status === 'taken' && (
                <span className="inline-flex items-center gap-1.5 text-red-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Canal Ativo · HTTP {probeStatus?.httpStatus || 200} ({probeStatus?.latencyMs}ms)
                </span>
              )}
              {status === 'idle' && (
                <span className="text-white/40">Ainda não verificado nesta sessão</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onCopyAndTest(item)}
            className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-medium text-sm hover:bg-white/90 transition-colors cursor-pointer whitespace-nowrap"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? `Copiado (@${item.handle}) & Testado` : `Copiar @${item.handle} & Testar Agora`}</span>
          </button>

          <a
            href={`https://www.youtube.com/@${item.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-sm font-medium text-white transition-colors whitespace-nowrap"
          >
            <span>Abrir @{item.handle}</span>
            <ExternalLink className="w-4 h-4 text-white/60" />
          </a>

          <a
            href="https://www.youtube.com/handle"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#FF0033]/15 hover:bg-[#FF0033]/25 border border-[#FF0033]/30 text-sm font-medium text-red-200 transition-colors whitespace-nowrap"
          >
            <span>Tentar Registrar no YouTube</span>
            <ExternalLink className="w-4 h-4 text-red-300" />
          </a>
        </div>
      </div>
    </div>
  );
};
