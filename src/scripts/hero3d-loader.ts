/**
 * Propósito:
 * Gestionar la activación progresiva del Hero3D sin bloquear el contenido
 * inicial y sin depender exclusivamente de una interacción táctil.
 *
 * Estrategia:
 * 1. Verificar reduced motion y WebGL.
 * 2. Observar cuándo el Hero se aproxima al viewport.
 * 3. Solicitar la carga durante un periodo idle.
 * 4. Aplicar un timeout máximo para impedir que Android/iOS permanezcan
 *    indefinidamente en estado deferred.
 *
 * Tipos de datos:
 * - HeroModule: contrato del módulo Three.js cargado dinámicamente.
 * - LanguageKey: idiomas admitidos.
 * - KnownFallbackReason: causas localizables de fallback.
 *
 * Retorno:
 * Este módulo no exporta valores. Inicializa todos los nodos data-hero3d
 * presentes en el documento.
 */

type HeroModule = {
  initHero: (host: HTMLElement) => Promise<void>;
};

type LanguageKey = "es" | "en" | "de";

type KnownFallbackReason =
  | "prefers-reduced-motion"
  | "webgl-unavailable"
  | "fallback";

type FallbackMessages = Record<
  LanguageKey,
  Record<KnownFallbackReason, string>
>;

type IdleScheduler = {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

type LoadingController = {
  scheduleVisibleLoad: () => void;
  dispose: () => void;
};

const HERO_PRELOAD_MARGIN_PX = 320;

const hosts = [
  ...document.querySelectorAll<HTMLElement>("[data-hero3d]")
];

const reducedMotionQuery = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

const fallbackMessages: FallbackMessages = {
  es: {
    "prefers-reduced-motion":
      "La animación 3D está desactivada porque tu navegador o sistema tiene activada la reducción de movimiento. Los enlaces del hero siguen disponibles.",
    "webgl-unavailable":
      "WebGL no está disponible en este navegador. La navegación sigue disponible mediante los enlaces del hero.",
    fallback:
      "La escena 3D no se pudo cargar. La navegación sigue disponible mediante los enlaces del hero."
  },
  en: {
    "prefers-reduced-motion":
      "The 3D animation is disabled because your browser or system has reduced motion enabled. Hero links remain available.",
    "webgl-unavailable":
      "WebGL is not available in this browser. Navigation remains available through the hero links.",
    fallback:
      "The 3D scene could not be loaded. Navigation remains available through the hero links."
  },
  de: {
    "prefers-reduced-motion":
      "Die 3D-Animation ist deaktiviert, weil dein Browser oder System reduzierte Bewegung aktiviert hat. Die Hero-Links bleiben verfügbar.",
    "webgl-unavailable":
      "WebGL ist in diesem Browser nicht verfügbar. Die Navigation bleibt über die Hero-Links verfügbar.",
    fallback:
      "Die 3D-Szene konnte nicht geladen werden. Die Navigation bleibt über die Hero-Links verfügbar."
  }
};

/**
 * Propósito:
 * Obtener el idioma válido del componente.
 *
 * Parámetros:
 * - host: elemento raíz del Hero3D.
 *
 * Retorno:
 * `es`, `en` o `de`.
 */
function getLanguage(host: HTMLElement): LanguageKey {
  const language =
    host.dataset.language ||
    document.documentElement.lang ||
    "es";

  return language === "en" || language === "de"
    ? language
    : "es";
}

/**
 * Propósito:
 * Convertir causas técnicas variables en claves de traducción conocidas.
 *
 * Parámetros:
 * - reason: causa recibida del runtime.
 *
 * Retorno:
 * Clave localizable.
 */
function normalizeFallbackReason(
  reason: string
): KnownFallbackReason {
  if (
    reason === "prefers-reduced-motion" ||
    reason === "webgl-unavailable"
  ) {
    return reason;
  }

  return "fallback";
}

/**
 * Propósito:
 * Obtener el mensaje de fallback localizado.
 *
 * Parámetros:
 * - host: raíz del Hero.
 * - reason: causa técnica.
 *
 * Retorno:
 * Mensaje localizado.
 */
function getFallbackMessage(
  host: HTMLElement,
  reason: string
): string {
  const messages = fallbackMessages[getLanguage(host)];
  const normalizedReason = normalizeFallbackReason(reason);

  return messages[normalizedReason];
}

/**
 * Propósito:
 * Actualizar el mensaje visible de fallback.
 *
 * Parámetros:
 * - host: raíz del Hero.
 * - reason: causa técnica.
 *
 * Retorno:
 * void.
 */
function updateFallbackMessage(
  host: HTMLElement,
  reason: string
): void {
  const messageNode =
    host.querySelector<HTMLElement>(
      "[data-hero-fallback-message]"
    );

  if (!messageNode) {
    return;
  }

  messageNode.textContent = getFallbackMessage(
    host,
    reason
  );
}

/**
 * Propósito:
 * Verificar WebGL con un contexto temporal y liberarlo inmediatamente.
 *
 * Retorno:
 * true cuando WebGL está disponible.
 */
function browserHasWebGL(): boolean {
  try {
    if (!window.WebGLRenderingContext) {
      return false;
    }

    const canvas = document.createElement("canvas");

    const contextAttributes: WebGLContextAttributes = {
      alpha: true,
      antialias: false,
      depth: true,
      failIfMajorPerformanceCaveat: false,
      powerPreference: "default",
      preserveDrawingBuffer: false,
      stencil: false
    };

    let context:
      | WebGLRenderingContext
      | WebGL2RenderingContext
      | null = canvas.getContext(
        "webgl2",
        contextAttributes
      );

    if (!context) {
      context = canvas.getContext(
        "webgl",
        contextAttributes
      );
    }

    if (!context) {
      context = canvas.getContext(
        "experimental-webgl",
        contextAttributes
      ) as WebGLRenderingContext | null;
    }

    const available = context !== null;

    const loseContext = context?.getExtension(
      "WEBGL_lose_context"
    );

    loseContext?.loseContext();

    return available;
  } catch {
    return false;
  }
}

/**
 * Propósito:
 * Activar el contenido alternativo manteniendo accesibles los enlaces HTML.
 *
 * Parámetros:
 * - host: raíz del Hero.
 * - reason: causa técnica.
 *
 * Retorno:
 * void.
 */
function activateFallback(
  host: HTMLElement,
  reason = "fallback"
): void {
  updateFallbackMessage(host, reason);

  host.dataset.fallback = "true";
  host.dataset.hero3dState = "fallback";
  host.dataset.hero3dFallbackReason = reason;

  host.classList.remove(
    "is-loading",
    "is-three-ready"
  );

  host.classList.add("is-fallback");
}

/**
 * Propósito:
 * Importar Three.js y crear la escena una sola vez.
 *
 * Parámetros:
 * - host: raíz del Hero.
 *
 * Retorno:
 * Promise<void>.
 */
async function loadHero(
  host: HTMLElement
): Promise<void> {
  if (
    host.dataset.hero3dRequested === "true" ||
    host.dataset.fallback === "true"
  ) {
    return;
  }

  host.dataset.hero3dRequested = "true";
  host.dataset.hero3dState = "loading";
  host.classList.add("is-loading");

  const startedAt = performance.now();

  try {
    const module =
      (await import("./hero3d")) as HeroModule;

    await module.initHero(host);

    host.dataset.hero3dLoadDuration = String(
      Math.round(performance.now() - startedAt)
    );

    if (
      host.dataset.fallback === "true" ||
      host.classList.contains("is-fallback")
    ) {
      host.dataset.hero3dState = "fallback";
      return;
    }

    host.dataset.hero3dState = "ready";
  } catch (error) {
    activateFallback(
      host,
      error instanceof Error
        ? error.message
        : "hero3d-loader-error"
    );
  }
}

/**
 * Propósito:
 * Preparar la carga automática cuando el Hero entra o se aproxima al viewport.
 *
 * Parámetros:
 * - host: raíz del Hero.
 *
 * Retorno:
 * Controlador para programar o cancelar la carga.
 *
 * Notas:
 * `data-hero3d-armed` se publica de forma síncrona. No se registran eventos de
 * puntero, toque ni foco: la inicialización depende exclusivamente de
 * IntersectionObserver y del programador idle con timeout de seguridad.
 */
function createLoadingController(
  host: HTMLElement
): LoadingController {
  const idleScheduler =
    window as unknown as IdleScheduler;

  let idleHandle: number | null = null;
  let timeoutHandle: number | null = null;
  let requested = false;
  let scheduled = false;

  host.dataset.hero3dArmed = "true";
  host.dataset.hero3dState = "deferred";

  const clearScheduledLoad = (): void => {
    if (
      idleHandle !== null &&
      typeof idleScheduler.cancelIdleCallback ===
        "function"
    ) {
      idleScheduler.cancelIdleCallback.call(
        window,
        idleHandle
      );
    }

    if (timeoutHandle !== null) {
      window.clearTimeout(timeoutHandle);
    }

    idleHandle = null;
    timeoutHandle = null;
    scheduled = false;
  };

  const requestLoad = (): void => {
    if (requested) {
      return;
    }

    requested = true;
    clearScheduledLoad();

    void loadHero(host);
  };

  const scheduleVisibleLoad = (): void => {
    if (
      requested ||
      scheduled ||
      host.dataset.fallback === "true"
    ) {
      return;
    }

    scheduled = true;

    /*
     * En navegadores compatibles se espera un periodo idle corto.
     * El timeout garantiza que Safari/Chrome iOS y Android no queden
     * indefinidamente en deferred.
     */
    const requestIdleCallback =
      idleScheduler.requestIdleCallback;

    if (
      typeof requestIdleCallback === "function"
    ) {
      idleHandle = requestIdleCallback.call(
        window,
        () => requestLoad(),
        {
          timeout: 650
        }
      );
    }

    timeoutHandle = window.setTimeout(
      requestLoad,
      typeof requestIdleCallback === "function"
        ? 800
        : 250
    );
  };

  return {
    scheduleVisibleLoad,
    dispose: () => {
      clearScheduledLoad();
    }
  };
}

/**
 * Propósito:
 * Inicializar todos los Hero3D del documento.
 *
 * Retorno:
 * void.
 */
function initializeHeroes(): void {
  if (reducedMotionQuery.matches) {
    hosts.forEach((host) => {
      activateFallback(
        host,
        "prefers-reduced-motion"
      );
    });

    return;
  }

  if (!browserHasWebGL()) {
    hosts.forEach((host) => {
      activateFallback(
        host,
        "webgl-unavailable"
      );
    });

    return;
  }

  const controllers = new Map<
    HTMLElement,
    LoadingController
  >();

  hosts.forEach((host) => {
    controllers.set(
      host,
      createLoadingController(host)
    );
  });

  if (!("IntersectionObserver" in window)) {
    controllers.forEach((controller) => {
      controller.scheduleVisibleLoad();
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        const host = entry.target as HTMLElement;
        const controller = controllers.get(host);

        observer.unobserve(host);
        controller?.scheduleVisibleLoad();
      }
    },
    {
      root: null,
      rootMargin:
        `${HERO_PRELOAD_MARGIN_PX}px 0px`,
      threshold: 0.01
    }
  );

  hosts.forEach((host) => {
    observer.observe(host);

    /*
     * WebKit puede diferir la primera notificación del observer cuando varias
     * páginas se abren en paralelo. La comprobación geométrica conserva la
     * carga diferida para contenido lejano, pero activa de inmediato el Hero
     * que ya está dentro del mismo margen de precarga.
     */
    const bounds = host.getBoundingClientRect();
    const isNearViewport =
      bounds.top <=
        window.innerHeight +
          HERO_PRELOAD_MARGIN_PX &&
      bounds.bottom >=
        -HERO_PRELOAD_MARGIN_PX;

    if (!isNearViewport) {
      return;
    }

    observer.unobserve(host);
    controllers.get(host)?.scheduleVisibleLoad();
  });

  window.addEventListener(
    "pagehide",
    () => {
      observer.disconnect();

      controllers.forEach((controller) => {
        controller.dispose();
      });
    },
    {
      once: true
    }
  );
}

initializeHeroes();
