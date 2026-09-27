import React from 'react';
import { X, ExternalLink, CheckCircle2 } from 'lucide-react';

interface RegistrationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegistrationGuideModal: React.FC<RegistrationGuideModalProps> = ({
  isOpen,
  onClose,
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
            <p className="text-xs text-white/50">Fluxo de Verificação & Registro</p>
            <h2 className="text-lg font-semibold tracking-tight text-white mt-0.5">
              Como testar e registrar um @handle de 4 letras no YouTube
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors"
            aria-label="Fechar guia"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-5 text-sm text-white/80 leading-relaxed">
          <div className="space-y-1">
            <h3 className="font-semibold text-white">
              01. Copie e teste em 1 clique no catálogo
            </h3>
            <p className="text-white/60 text-xs sm:text-sm">
              Ao clicar em qualquer card ou no botão <strong className="text-white">Copiar & Testar</strong>, o username é copiado instantaneamente para sua área de transferência e nosso servidor verifica se <code className="font-mono-tabular text-white/90">youtube.com/@handle</code> retorna <strong className="text-emerald-400">HTTP 404 (Sem canal ativo)</strong> ou <strong className="text-red-400">HTTP 200 (Em uso)</strong>.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-white">
              02. Ative o modo &ldquo;Abrir YouTube em 1-Clique&rdquo; se preferir
            </h3>
            <p className="text-white/60 text-xs sm:text-sm">
              Na barra de controle superior, você pode alternar para <strong className="text-white">1-Click: Copiar + Abrir YT</strong>. Assim, um único clique já copia o identificador e abre a URL oficial no YouTube ou a página de troca de handle.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-white">
              03. Cole no YouTube Studio para reivindicar
            </h3>
            <p className="text-white/60 text-xs sm:text-sm">
              Acesse <code className="font-mono-tabular text-white/90">youtube.com/handle</code> ou abra o <strong className="text-white">YouTube Studio → Personalização → Identificador</strong> e cole (<code className="font-mono-tabular text-white/90">Ctrl+V</code> / <code className="font-mono-tabular text-white/90">Cmd+V</code>) o username de 4 letras para confirmar se o YouTube libera o registro imediato na sua conta.
            </p>
          </div>
        </div>

        <div className="mt-7 pt-5 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Dica: Filtre por &ldquo;Pronunciáveis&rdquo; ou &ldquo;Sem Q/X/Z&rdquo; para achar os melhores nomes.</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.youtube.com/handle"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              <span>Abrir youtube.com/handle</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
