export type Language = 'pt' | 'en' | 'es' | 'zh';

export interface Translations {
  nav: {
    catalog: string;
    pronounceable: string;
    verifiedFree: string;
    saved: string;
    howToRegister: string;
    scanBatch: string;
    scanningBatch: string;
    ytHandleBtn: string;
  };
  hero: {
    kickerHandles: string;
    kickerSeries: string;
    kickerLive: string;
    title: string;
    subtitlePart1: string;
    subtitlePart2: string;
    statTotal: string;
    statVisible: string;
    statFree: string;
    statTestedSuffix: string;
  };
  controls: {
    searchPlaceholder: string;
    clearSearch: string;
    allLetters: string;
    filterLabel: string;
    filterAll: string;
    filterPronounceable: string;
    filterClean: string;
    filterVowelEnd: string;
    filterAvailable: string;
    filterSaved: string;
    oneClickProbeOnly: string;
    oneClickOpenProfile: string;
    oneClickOpenClaim: string;
    gridViewAria: string;
    compactViewAria: string;
  };
  card: {
    fluent: string;
    testing: string;
    free404: string;
    taken200: string;
    clickToTest: string;
    saveAria: string;
    unsaveAria: string;
    copiedAndTested: string;
    copyAndTest: string;
    copyAndClaimYt: string;
    copyAndOpenYt: string;
    copiedShort: string;
    previewChannelTitle: string;
    openYoutubeTitle: string;
  };
  empty: {
    title: string;
    subtitle: string;
    restoreBtn: string;
  };
  scroll: {
    showingProgress: (visible: number, total: number) => string;
    loadMoreBtn: string;
    allLoaded: (total: number) => string;
  };
  toast: {
    copiedSuffix: string;
    checkingHandle: (handle: string) => string;
    freeStatus: (code: number, ms?: number) => string;
    takenStatus: (code: number, ms?: number) => string;
    registerOnYt: string;
    viewUrl: string;
  };
  previewModal: {
    seriesLabel: string;
    patternLabel: string;
    title: string;
    closeAria: string;
    subscribersMock: string;
    videosMock: string;
    channelBioMock: (handle: string) => string;
    subscribeBtn: string;
    consultingYt: string;
    freeOnYt: (code: number, ms?: number) => string;
    activeChannel: (code: number, ms?: number) => string;
    notCheckedYet: string;
    copiedAndTestedBtn: (handle: string) => string;
    copyAndTestNowBtn: (handle: string) => string;
    openHandleBtn: (handle: string) => string;
    tryRegisterYtBtn: string;
  };
  guideModal: {
    kicker: string;
    title: string;
    closeAria: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    tipText: string;
    openYtHandleBtn: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  pt: {
    nav: {
      catalog: 'Catálogo 4L',
      pronounceable: 'Pronunciáveis',
      verifiedFree: 'Livres',
      saved: 'Salvos',
      howToRegister: 'Como Registrar',
      scanBatch: 'Testar 12 Visíveis',
      scanningBatch: 'Testando Lote...',
      ytHandleBtn: 'YouTube Handle',
    },
    hero: {
      kickerHandles: 'handles de 4 letras',
      kickerSeries: 'Séries P, Q, R, S, T, U',
      kickerLive: 'Verificador HTTP em tempo real',
      title: 'Diretório de Usernames Raros para YouTube',
      subtitlePart1:
        'Role para baixo para revelar novos identificadores de 4 caracteres. Em um único clique, copie o',
      subtitlePart2:
        'e teste instantaneamente se a URL está livre no YouTube para tentativa de registro.',
      statTotal: 'Total na Lista',
      statVisible: 'Filtrados / Visíveis',
      statFree: 'Livres Confirmados (404)',
      statTestedSuffix: 'testados',
    },
    controls: {
      searchPlaceholder: 'Filtrar username (ex: piao, rime, togo, ^p, a$, cvcv)...',
      clearSearch: 'Limpar',
      allLetters: 'Todos',
      filterLabel: 'Filtro:',
      filterAll: 'Todos',
      filterPronounceable: 'Pronunciáveis (CVCV / 2+ Vogais)',
      filterClean: 'Sem Q/X/Z',
      filterVowelEnd: 'Termina em Vogal',
      filterAvailable: 'Livres 404',
      filterSaved: 'Salvos',
      oneClickProbeOnly: '1-Click: Testar aqui',
      oneClickOpenProfile: '1-Click: +Abrir @Canal',
      oneClickOpenClaim: '1-Click: +Registrar YT',
      gridViewAria: 'Visualização em Grade',
      compactViewAria: 'Visualização Compacta',
    },
    card: {
      fluent: 'Fluido',
      testing: 'Testando...',
      free404: 'Livre · 404',
      taken200: 'Em uso · 200',
      clickToTest: 'Clique p/ testar',
      saveAria: 'Salvar username',
      unsaveAria: 'Remover dos salvos',
      copiedAndTested: 'Copiado & Testado',
      copyAndTest: 'Copiar & Testar',
      copyAndClaimYt: 'Copiar & Registrar YT',
      copyAndOpenYt: 'Copiar & Abrir @YT',
      copiedShort: 'Copiado',
      previewChannelTitle: 'Simular visual no canal do YouTube',
      openYoutubeTitle: 'Abrir no YouTube em nova aba',
    },
    empty: {
      title: 'Nenhum username encontrado com esses filtros',
      subtitle:
        'Experimente limpar o campo de busca ou alternar para outra série alfabética para explorar todos os handles disponíveis.',
      restoreBtn: 'Restaurar Todos os Usernames',
    },
    scroll: {
      showingProgress: (visible, total) =>
        `Exibindo ${visible} de ${total} handles · Role para baixo para revelar mais`,
      loadMoreBtn: 'Carregar +144 agora',
      allLoaded: (total) => `Todos os ${total} usernames deste filtro foram carregados.`,
    },
    toast: {
      copiedSuffix: 'copiado',
      checkingHandle: (handle) => `Verificando youtube.com/@${handle}...`,
      freeStatus: (code, ms) => `Livre no YouTube (HTTP ${code} · ${ms ?? 110}ms)`,
      takenStatus: (code, ms) => `Canal existente (HTTP ${code} · ${ms ?? 110}ms)`,
      registerOnYt: 'Registrar no YT',
      viewUrl: 'Ver URL',
    },
    previewModal: {
      seriesLabel: 'Série',
      patternLabel: 'Padrão',
      title: 'Simulador de Identificador do YouTube',
      closeAria: 'Fechar simulador',
      subscribersMock: '124 mil inscritos',
      videosMock: '48 vídeos',
      channelBioMock: (handle) =>
        `youtube.com/@${handle} · Canal oficial com identificador curto de 4 letras.`,
      subscribeBtn: 'Inscrever-se',
      consultingYt: 'Consultando YouTube...',
      freeOnYt: (code, ms) => `Livre no YouTube · HTTP ${code} (${ms ?? 110}ms)`,
      activeChannel: (code, ms) => `Canal Ativo · HTTP ${code} (${ms ?? 110}ms)`,
      notCheckedYet: 'Ainda não verificado nesta sessão',
      copiedAndTestedBtn: (handle) => `Copiado (@${handle}) & Testado`,
      copyAndTestNowBtn: (handle) => `Copiar @${handle} & Testar Agora`,
      openHandleBtn: (handle) => `Abrir @${handle}`,
      tryRegisterYtBtn: 'Tentar Registrar no YouTube',
    },
    guideModal: {
      kicker: 'Fluxo de Verificação & Registro',
      title: 'Como testar e registrar um @handle de 4 letras no YouTube',
      closeAria: 'Fechar guia',
      step1Title: '01. Copie e teste em 1 clique no catálogo',
      step1Desc:
        'Ao clicar em qualquer card ou no botão Copiar & Testar, o username é copiado instantaneamente e nosso servidor verifica se youtube.com/@handle retorna HTTP 404 (Sem canal ativo) ou HTTP 200 (Em uso).',
      step2Title: '02. Ative o modo "Abrir YouTube em 1-Clique" se preferir',
      step2Desc:
        'Na barra de controle superior, você pode alternar para 1-Click: +Abrir @Canal ou +Registrar YT. Assim, um único clique já copia o identificador e abre a URL oficial no YouTube.',
      step3Title: '03. Cole no YouTube Studio para reivindicar',
      step3Desc:
        'Acesse youtube.com/handle ou abra o YouTube Studio → Personalização → Identificador e cole (Ctrl+V / Cmd+V) o username de 4 letras para confirmar se o YouTube libera o registro imediato na sua conta.',
      tipText: 'Dica: Filtre por "Pronunciáveis" ou "Sem Q/X/Z" para achar os melhores nomes.',
      openYtHandleBtn: 'Abrir youtube.com/handle',
    },
  },

  en: {
    nav: {
      catalog: '4L Catalog',
      pronounceable: 'Pronounceable',
      verifiedFree: 'Available',
      saved: 'Saved',
      howToRegister: 'How to Claim',
      scanBatch: 'Scan 12 Visible',
      scanningBatch: 'Scanning Batch...',
      ytHandleBtn: 'YouTube Handle',
    },
    hero: {
      kickerHandles: '4-letter handles',
      kickerSeries: 'P, Q, R, S, T, U Series',
      kickerLive: 'Real-time HTTP availability probe',
      title: 'Rare 4-Letter YouTube Handle Directory',
      subtitlePart1:
        'Scroll down to progressively reveal new 4-character handles. In a single click, copy the',
      subtitlePart2:
        'and instantly test whether the channel URL is unclaimed on YouTube for registration.',
      statTotal: 'Total Cataloged',
      statVisible: 'Filtered / Visible',
      statFree: 'Confirmed Unclaimed (404)',
      statTestedSuffix: 'tested',
    },
    controls: {
      searchPlaceholder: 'Filter username (e.g. piao, rime, togo, ^p, a$, cvcv)...',
      clearSearch: 'Clear',
      allLetters: 'All',
      filterLabel: 'Filter:',
      filterAll: 'All',
      filterPronounceable: 'Pronounceable (CVCV / 2+ Vowels)',
      filterClean: 'No Q/X/Z',
      filterVowelEnd: 'Ends in Vowel',
      filterAvailable: 'Available 404',
      filterSaved: 'Saved',
      oneClickProbeOnly: '1-Click: Test Here',
      oneClickOpenProfile: '1-Click: +Open @Channel',
      oneClickOpenClaim: '1-Click: +Claim on YT',
      gridViewAria: 'Grid View',
      compactViewAria: 'Compact View',
    },
    card: {
      fluent: 'Smooth',
      testing: 'Testing...',
      free404: 'Free · 404',
      taken200: 'Taken · 200',
      clickToTest: 'Click to test',
      saveAria: 'Bookmark handle',
      unsaveAria: 'Remove bookmark',
      copiedAndTested: 'Copied & Tested',
      copyAndTest: 'Copy & Test',
      copyAndClaimYt: 'Copy & Claim YT',
      copyAndOpenYt: 'Copy & Open @YT',
      copiedShort: 'Copied',
      previewChannelTitle: 'Simulate on YouTube channel header',
      openYoutubeTitle: 'Open on YouTube in new tab',
    },
    empty: {
      title: 'No usernames match your current filters',
      subtitle:
        'Try clearing the search query or switching to another alphabetical series to explore all available 4-letter handles.',
      restoreBtn: 'Reset All Filters',
    },
    scroll: {
      showingProgress: (visible, total) =>
        `Showing ${visible} of ${total} handles · Scroll down to reveal more`,
      loadMoreBtn: 'Load +144 now',
      allLoaded: (total) => `All ${total} usernames in this view have been loaded.`,
    },
    toast: {
      copiedSuffix: 'copied',
      checkingHandle: (handle) => `Probing youtube.com/@${handle}...`,
      freeStatus: (code, ms) => `Unclaimed on YouTube (HTTP ${code} · ${ms ?? 110}ms)`,
      takenStatus: (code, ms) => `Active channel exists (HTTP ${code} · ${ms ?? 110}ms)`,
      registerOnYt: 'Claim on YT',
      viewUrl: 'Open URL',
    },
    previewModal: {
      seriesLabel: 'Series',
      patternLabel: 'Pattern',
      title: 'YouTube Handle Channel Simulator',
      closeAria: 'Close simulator',
      subscribersMock: '124K subscribers',
      videosMock: '48 videos',
      channelBioMock: (handle) =>
        `youtube.com/@${handle} · Official channel with ultra-short 4-letter handle.`,
      subscribeBtn: 'Subscribe',
      consultingYt: 'Probing YouTube...',
      freeOnYt: (code, ms) => `Unclaimed on YouTube · HTTP ${code} (${ms ?? 110}ms)`,
      activeChannel: (code, ms) => `Active Channel · HTTP ${code} (${ms ?? 110}ms)`,
      notCheckedYet: 'Not yet probed in this session',
      copiedAndTestedBtn: (handle) => `Copied (@${handle}) & Tested`,
      copyAndTestNowBtn: (handle) => `Copy @${handle} & Test Now`,
      openHandleBtn: (handle) => `Open @${handle}`,
      tryRegisterYtBtn: 'Try Claiming on YouTube',
    },
    guideModal: {
      kicker: 'Verification & Claim Workflow',
      title: 'How to test and claim a 4-letter @handle on YouTube',
      closeAria: 'Close guide',
      step1Title: '01. 1-Click Copy & Probe in the catalog',
      step1Desc:
        'Clicking any card or the Copy & Test button immediately copies the handle to your clipboard while our server checks whether youtube.com/@handle returns HTTP 404 (Unclaimed URL) or HTTP 200 (Taken).',
      step2Title: '02. Enable "1-Click Open YouTube" for rapid claiming',
      step2Desc:
        'In the control console, switch to 1-Click: +Open @Channel or +Claim on YT so a single click both copies the handle and launches YouTube directly.',
      step3Title: '03. Paste into YouTube Studio to register',
      step3Desc:
        'Visit youtube.com/handle or open YouTube Studio → Customization → Handle and paste (Ctrl+V / Cmd+V) the 4-letter username to verify if YouTube allows immediate registration on your account.',
      tipText: 'Tip: Filter by "Pronounceable" or "No Q/X/Z" to find the cleanest brandable handles.',
      openYtHandleBtn: 'Open youtube.com/handle',
    },
  },

  es: {
    nav: {
      catalog: 'Catálogo 4L',
      pronounceable: 'Pronunciables',
      verifiedFree: 'Libres',
      saved: 'Guardados',
      howToRegister: 'Cómo Registrar',
      scanBatch: 'Probar 12 Visibles',
      scanningBatch: 'Probando Lote...',
      ytHandleBtn: 'YouTube Handle',
    },
    hero: {
      kickerHandles: 'handles de 4 letras',
      kickerSeries: 'Series P, Q, R, S, T, U',
      kickerLive: 'Verificador HTTP en tiempo real',
      title: 'Directorio de Usernames Raros para YouTube',
      subtitlePart1:
        'Desplázate hacia abajo para revelar nuevos identificadores de 4 caracteres. Con un solo clic, copia el',
      subtitlePart2:
        'y comprueba al instante si la URL del canal está libre en YouTube para intentar registrarla.',
      statTotal: 'Total en Lista',
      statVisible: 'Filtrados / Visibles',
      statFree: 'Libres Confirmados (404)',
      statTestedSuffix: 'probados',
    },
    controls: {
      searchPlaceholder: 'Filtrar username (ej: piao, rime, togo, ^p, a$, cvcv)...',
      clearSearch: 'Limpiar',
      allLetters: 'Todos',
      filterLabel: 'Filtro:',
      filterAll: 'Todos',
      filterPronounceable: 'Pronunciables (CVCV / 2+ Vocales)',
      filterClean: 'Sin Q/X/Z',
      filterVowelEnd: 'Termina en Vocal',
      filterAvailable: 'Libres 404',
      filterSaved: 'Guardados',
      oneClickProbeOnly: '1-Clic: Probar aquí',
      oneClickOpenProfile: '1-Clic: +Abrir @Canal',
      oneClickOpenClaim: '1-Clic: +Registrar YT',
      gridViewAria: 'Vista de Cuadrícula',
      compactViewAria: 'Vista Compacta',
    },
    card: {
      fluent: 'Fluido',
      testing: 'Probando...',
      free404: 'Libre · 404',
      taken200: 'En uso · 200',
      clickToTest: 'Clic para probar',
      saveAria: 'Guardar username',
      unsaveAria: 'Quitar de guardados',
      copiedAndTested: 'Copiado y Probado',
      copyAndTest: 'Copiar y Probar',
      copyAndClaimYt: 'Copiar y Registrar YT',
      copyAndOpenYt: 'Copiar y Abrir @YT',
      copiedShort: 'Copiado',
      previewChannelTitle: 'Simular vista previa en canal de YouTube',
      openYoutubeTitle: 'Abrir en YouTube en una nueva pestaña',
    },
    empty: {
      title: 'No se encontraron usernames con estos filtros',
      subtitle:
        'Intenta borrar la búsqueda o cambiar a otra serie alfabética para explorar todos los identificadores de 4 letras disponibles.',
      restoreBtn: 'Restaurar Todos los Usernames',
    },
    scroll: {
      showingProgress: (visible, total) =>
        `Mostrando ${visible} de ${total} handles · Desplázate hacia abajo para revelar más`,
      loadMoreBtn: 'Cargar +144 ahora',
      allLoaded: (total) => `Se han cargado todos los ${total} usernames de este filtro.`,
    },
    toast: {
      copiedSuffix: 'copiado',
      checkingHandle: (handle) => `Verificando youtube.com/@${handle}...`,
      freeStatus: (code, ms) => `Libre en YouTube (HTTP ${code} · ${ms ?? 110}ms)`,
      takenStatus: (code, ms) => `Canal activo existente (HTTP ${code} · ${ms ?? 110}ms)`,
      registerOnYt: 'Registrar en YT',
      viewUrl: 'Ver URL',
    },
    previewModal: {
      seriesLabel: 'Serie',
      patternLabel: 'Patrón',
      title: 'Simulador de Identificador de YouTube',
      closeAria: 'Cerrar simulador',
      subscribersMock: '124 K suscriptores',
      videosMock: '48 videos',
      channelBioMock: (handle) =>
        `youtube.com/@${handle} · Canal oficial con identificador corto de 4 letras.`,
      subscribeBtn: 'Suscribirse',
      consultingYt: 'Consultando YouTube...',
      freeOnYt: (code, ms) => `Libre en YouTube · HTTP ${code} (${ms ?? 110}ms)`,
      activeChannel: (code, ms) => `Canal Activo · HTTP ${code} (${ms ?? 110}ms)`,
      notCheckedYet: 'Aún no verificado en esta sesión',
      copiedAndTestedBtn: (handle) => `Copiado (@${handle}) y Probado`,
      copyAndTestNowBtn: (handle) => `Copiar @${handle} y Probar Ahora`,
      openHandleBtn: (handle) => `Abrir @${handle}`,
      tryRegisterYtBtn: 'Intentar Registrar en YouTube',
    },
    guideModal: {
      kicker: 'Flujo de Verificación y Registro',
      title: 'Cómo probar y registrar un @handle de 4 letras en YouTube',
      closeAria: 'Cerrar guía',
      step1Title: '01. Copia y prueba en 1 clic desde el catálogo',
      step1Desc:
        'Al hacer clic en cualquier tarjeta o en el botón Copiar y Probar, el username se copia al portapapeles al instante y nuestro servidor verifica si youtube.com/@handle devuelve HTTP 404 (Sin canal activo) o HTTP 200 (En uso).',
      step2Title: '02. Activa el modo "Abrir YouTube en 1-Clic" si lo prefieres',
      step2Desc:
        'En la barra de control superior, puedes cambiar a 1-Clic: +Abrir @Canal o +Registrar YT. Así, un solo clic copiará el identificador y abrirá directamente YouTube.',
      step3Title: '03. Pégalo en YouTube Studio para reclamarlo',
      step3Desc:
        'Ingresa a youtube.com/handle o abre YouTube Studio → Personalización → Identificador y pega (Ctrl+V / Cmd+V) el username de 4 letras para confirmar si YouTube permite el registro inmediato en tu cuenta.',
      tipText: 'Consejo: Filtra por "Pronunciables" o "Sin Q/X/Z" para encontrar los mejores nombres.',
      openYtHandleBtn: 'Abrir youtube.com/handle',
    },
  },

  zh: {
    nav: {
      catalog: '4字母目录',
      pronounceable: '易读发音',
      verifiedFree: '已验证空闲',
      saved: '收藏夹',
      howToRegister: '注册指南',
      scanBatch: '批量检测12个',
      scanningBatch: '批量检测中...',
      ytHandleBtn: 'YouTube 句柄',
    },
    hero: {
      kickerHandles: '个4字母稀有用户名',
      kickerSeries: 'P, Q, R, S, T, U 系列',
      kickerLive: '实时 HTTP 可用性探测',
      title: 'YouTube 稀有 4 字母用户名宝库',
      subtitlePart1: '向下滚动即可自动加载更多 4 字母标识。只需单击一下，即可复制',
      subtitlePart2: '并实时检测该频道 URL 在 YouTube 上是否处于空闲可注册状态。',
      statTotal: '收录总数',
      statVisible: '当前筛选 / 已加载',
      statFree: '已确认空闲 (404)',
      statTestedSuffix: '已检测',
    },
    controls: {
      searchPlaceholder: '搜索用户名 (例如: piao, rime, togo, ^p, a$, cvcv)...',
      clearSearch: '清除',
      allLetters: '全部',
      filterLabel: '筛选:',
      filterAll: '全部',
      filterPronounceable: '易读发音 (CVCV / 2+元音)',
      filterClean: '不含 Q/X/Z',
      filterVowelEnd: '元音结尾',
      filterAvailable: '空闲 404',
      filterSaved: '已收藏',
      oneClickProbeOnly: '一键: 仅页内检测',
      oneClickOpenProfile: '一键: +打开@频道',
      oneClickOpenClaim: '一键: +前往YT注册',
      gridViewAria: '网格视图',
      compactViewAria: '紧凑列表视图',
    },
    card: {
      fluent: '顺口',
      testing: '检测中...',
      free404: '空闲 · 404',
      taken200: '已被占用 · 200',
      clickToTest: '点击检测',
      saveAria: '收藏用户名',
      unsaveAria: '取消收藏',
      copiedAndTested: '已复制并检测',
      copyAndTest: '复制并检测',
      copyAndClaimYt: '复制并去YT注册',
      copyAndOpenYt: '复制并打开@YT',
      copiedShort: '已复制',
      previewChannelTitle: '模拟 YouTube 频道主页预览',
      openYoutubeTitle: '在新标签页中打开 YouTube',
    },
    empty: {
      title: '当前筛选条件下未找到用户名',
      subtitle: '请尝试清空搜索词或切换其他首字母系列，以浏览全部可用的 4 字母句柄。',
      restoreBtn: '重置所有筛选条件',
    },
    scroll: {
      showingProgress: (visible, total) =>
        `正在显示 ${visible} / ${total} 个句柄 · 向下滚动自动加载更多`,
      loadMoreBtn: '立即加载 +144 个',
      allLoaded: (total) => `已加载当前筛选下的全部 ${total} 个用户名。`,
    },
    toast: {
      copiedSuffix: '已复制',
      checkingHandle: (handle) => `正在检测 youtube.com/@${handle}...`,
      freeStatus: (code, ms) => `YouTube 空闲可用 (HTTP ${code} · ${ms ?? 110}ms)`,
      takenStatus: (code, ms) => `频道已存在 (HTTP ${code} · ${ms ?? 110}ms)`,
      registerOnYt: '去 YT 注册',
      viewUrl: '查看链接',
    },
    previewModal: {
      seriesLabel: '系列',
      patternLabel: '音节结构',
      title: 'YouTube 频道用户名模拟器',
      closeAria: '关闭模拟器',
      subscribersMock: '12.4万 位订阅者',
      videosMock: '48 个视频',
      channelBioMock: (handle) => `youtube.com/@${handle} · 拥有极短 4 字母专属句柄的官方频道。`,
      subscribeBtn: '订阅',
      consultingYt: '正在查询 YouTube...',
      freeOnYt: (code, ms) => `YouTube 空闲可用 · HTTP ${code} (${ms ?? 110}ms)`,
      activeChannel: (code, ms) => `频道已被占用 · HTTP ${code} (${ms ?? 110}ms)`,
      notCheckedYet: '本次会话尚未检测',
      copiedAndTestedBtn: (handle) => `已复制 (@${handle}) 并完成检测`,
      copyAndTestNowBtn: (handle) => `立即复制 @${handle} 并检测`,
      openHandleBtn: (handle) => `打开 @${handle}`,
      tryRegisterYtBtn: '前往 YouTube 尝试注册',
    },
    guideModal: {
      kicker: '可用性检测与注册流程',
      title: '如何在 YouTube 上测试并抢注 4 字母 @handle',
      closeAria: '关闭指南',
      step1Title: '01. 在目录中一键复制并实时检测',
      step1Desc:
        '点击任意卡片或“复制并检测”按钮，用户名将立即复制到剪贴板，同时服务器会实时探测 youtube.com/@handle 返回 HTTP 404（无活跃频道/空闲）还是 HTTP 200（已占用）。',
      step2Title: '02. 开启“一键打开 YouTube”加速抢注',
      step2Desc:
        '在顶部控制栏中，您可以切换为“一键: +打开@频道”或“+前往YT注册”，单击即可同时完成复制并跳转到 YouTube 官方页面。',
      step3Title: '03. 粘贴至 YouTube 工作室完成绑定',
      step3Desc:
        '访问 youtube.com/handle 或进入 YouTube 工作室 → 自定义 → 句柄 (Handle)，粘贴 (Ctrl+V / Cmd+V) 该 4 字母用户名以验证是否可立即绑定至您的账号。',
      tipText: '提示：使用“易读发音”或“不含 Q/X/Z”筛选器可快速找到最具品牌价值的短名称。',
      openYtHandleBtn: '打开 youtube.com/handle',
    },
  },
};
