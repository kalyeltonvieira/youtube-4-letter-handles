import React from 'react';
import { X, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Translations } from '../i18n/translations';

interface RegistrationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translations;
}

export const RegistrationGuideModal: React.FC<RegistrationGuideModalProps> = ({
  isOpen,
  onClose,
  t,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="apple-glass-elevated w-full max-w-xl rounded-2xl p-6 sm:p-8 text-[#F5F5F7] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
          <div>
            <p className="text-xs text-white/50">{t.guideModal.kicker}</p>
            <h2 className="text-lg font-semibold tracking-tight text-white mt-0.5">
              {t.guideModal.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            aria-label={t.guideModal.closeAria}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-5 text-sm text-white/80 leading-relaxed">
          <div className="space-y-1">
            <h3 className="font-semibold text-white">{t.guideModal.step1Title}</h3>
            <p className="text-white/60 text-xs sm:text-sm">{t.guideModal.step1Desc}</p>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-white">{t.guideModal.step2Title}</h3>
            <p className="text-white/60 text-xs sm:text-sm">{t.guideModal.step2Desc}</p>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-white">{t.guideModal.step3Title}</h3>
            <p className="text-white/60 text-xs sm:text-sm">{t.guideModal.step3Desc}</p>
          </div>
        </div>

        <div className="mt-7 pt-5 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{t.guideModal.tipText}</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.youtube.com/handle"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              <span>{t.guideModal.openYtHandleBtn}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
