type HeroModule = {
  initHero: (host: HTMLElement) => Promise<void>;
};

type LanguageKey = "es" | "en" | "de";
type KnownFallbackReason = "prefers-reduced-motion" | "webgl-unavailable" | "fallback";

type FallbackMessages = Record<LanguageKey, Record<KnownFallbackReason, string>>;

type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (
      callback: IdleRequestCallback,
      options?: IdleRequestOptions
    ) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

type ScheduledLoad =
  | {
      type: "idle";
      id: number;
    }
  | {
      type: "timeout";
      id: ReturnType<typeof globalThis.setTimeout>;
    };

const hosts = [...document.querySelectorAll<HTMLElement>("[data-hero3d]")];
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const idleWindow = window as IdleWindow;

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

function getLanguage(host: HTMLElement): LanguageKey {
  const language = host.dataset.language || document.documentElement.lang || "es";

  return language === "en" || language === "de" ? language : "es";
}

function normalizeFallbackReason(reason: string): KnownFallbackReason {
  if (reason === "prefers-reduced-motion" || reason === "webgl-unavailable") {
    return reason;
  }

  return "fallback";
}

function getFallbackMessage(host: HTMLElement, reason: string): string {
  const messages = fallbackMessages[getLanguage(host)];
  const normalizedReason = normalizeFallbackReason(reason);

  return messages[normalizedReason];
}

function updateFallbackMessage(host: HTMLElement, reason: string): void {
  const messageNode = host.querySelector<HTMLElement>("[data-hero-fallback-message]");

  if (!messageNode) {
    return;
  }

  messageNode.textContent = getFallbackMessage(host, reason);
}

function browserHasWebGL(): boolean {
  try {
    if (!window.WebGLRenderingContext) {
      return false;
    }

    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    return Boolean(context);
  } catch {
    return false;
  }
}

function activateFallback(host: HTMLElement, reason = "fallback"): void {
  updateFallbackMessage(host, reason);

  host.dataset.fallback = "true";
  host.dataset.hero3dState = "fallback";
  host.dataset.hero3dFallbackReason = reason;
  host.classList.remove("is-loading", "is-three-ready");
  host.classList.add("is-fallback");
}

async function loadHero(host: HTMLElement): Promise<void> {
  if (host.dataset.hero3dRequested === "true" || host.dataset.fallback === "true") {
    return;
  }

  host.dataset.hero3dRequested = "true";
  host.dataset.hero3dState = "loading";
  host.classList.add("is-loading");

  try {
    const module = (await import("./hero3d")) as HeroModule;
    await module.initHero(host);

    if (host.dataset.fallback === "true" || host.classList.contains("is-fallback")) {
      host.dataset.hero3dState = "fallback";
      return;
    }

    host.dataset.hero3dState = "ready";
  } catch (error) {
    activateFallback(
      host,
      error instanceof Error ? error.message : "hero3d-loader-error"
    );
  }
}

function scheduleWhenIdle(callback: () => void): ScheduledLoad {
  if (typeof idleWindow.requestIdleCallback === "function") {
    return {
      type: "idle",
      id: idleWindow.requestIdleCallback(() => callback(), {
        timeout: 120
      })
    };
  }

  return {
    type: "timeout",
    id: globalThis.setTimeout(callback, 50)
  };
}

function cancelScheduledLoad(scheduledLoad: ScheduledLoad): void {
  if (
    scheduledLoad.type === "idle" &&
    typeof idleWindow.cancelIdleCallback === "function"
  ) {
    idleWindow.cancelIdleCallback(scheduledLoad.id);
    return;
  }

  if (scheduledLoad.type === "timeout") {
    globalThis.clearTimeout(scheduledLoad.id);
  }
}

function armVisibleLoading(host: HTMLElement): void {
  if (host.dataset.hero3dArmed === "true" || host.dataset.fallback === "true") {
    return;
  }

  host.dataset.hero3dArmed = "true";
  host.dataset.hero3dState = "deferred";

  let scheduledLoad: ScheduledLoad | null = null;
  const controller = new AbortController();

  const requestLoad = () => {
    if (scheduledLoad !== null) {
      cancelScheduledLoad(scheduledLoad);
      scheduledLoad = null;
    }

    controller.abort();
    void loadHero(host);
  };

  scheduledLoad = scheduleWhenIdle(() => {
    scheduledLoad = null;
    void loadHero(host);
  });

  host.addEventListener("pointerenter", requestLoad, {
    once: true,
    passive: true,
    signal: controller.signal
  });

  host.addEventListener("pointerdown", requestLoad, {
    once: true,
    passive: true,
    signal: controller.signal
  });

  host.addEventListener("touchstart", requestLoad, {
    once: true,
    passive: true,
    signal: controller.signal
  });

  host.addEventListener("focusin", requestLoad, {
    once: true,
    signal: controller.signal
  });
}

if (reducedMotionQuery.matches) {
  hosts.forEach((host) => activateFallback(host, "prefers-reduced-motion"));
} else if (!browserHasWebGL()) {
  hosts.forEach((host) => activateFallback(host, "webgl-unavailable"));
} else if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        const host = entry.target as HTMLElement;
        observer.unobserve(host);
        armVisibleLoading(host);
      }
    },
    {
      root: null,
      rootMargin: "520px 0px",
      threshold: 0.001
    }
  );

  hosts.forEach((host) => observer.observe(host));
} else {
  hosts.forEach((host) => armVisibleLoading(host));
}