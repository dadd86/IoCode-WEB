type HeroModule = {
  initHero: (host: HTMLElement) => Promise<void>;
};

type IdleDeadlineLike = {
  didTimeout: boolean;
  timeRemaining: () => number;
};

type WindowWithIdleCallback = Window &
  typeof globalThis & {
    requestIdleCallback?: (
      callback: (deadline: IdleDeadlineLike) => void,
      options?: { timeout?: number }
    ) => number;
  };

const hosts = [...document.querySelectorAll<HTMLElement>("[data-hero3d]")];
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const HERO_MIN_DELAY_AFTER_LOAD_MS = 1200;
const HERO_IDLE_TIMEOUT_MS = 3500;

async function loadHero(host: HTMLElement): Promise<void> {
  if (host.dataset.hero3dRequested === "true") {
    return;
  }

  host.dataset.hero3dRequested = "true";

  const module = (await import("./hero3d")) as HeroModule;
  await module.initHero(host);
}

function activateFallback(host: HTMLElement): void {
  host.dataset.fallback = "true";
  host.classList.remove("is-loading");
  host.classList.add("is-fallback");
}

function runWhenIdle(callback: () => void): void {
  const idleWindow = window as WindowWithIdleCallback;

  if (typeof idleWindow.requestIdleCallback === "function") {
    idleWindow.requestIdleCallback(
      () => {
        callback();
      },
      {
        timeout: HERO_IDLE_TIMEOUT_MS
      }
    );

    return;
  }

  window.setTimeout(callback, HERO_MIN_DELAY_AFTER_LOAD_MS);
}

function scheduleDeferredHeroLoad(host: HTMLElement): void {
  if (host.dataset.hero3dQueued === "true") {
    return;
  }

  host.dataset.hero3dQueued = "true";

  const schedule = () => {
    window.setTimeout(() => {
      runWhenIdle(() => {
        void loadHero(host);
      });
    }, HERO_MIN_DELAY_AFTER_LOAD_MS);
  };

  if (document.readyState === "complete") {
    schedule();
    return;
  }

  window.addEventListener("load", schedule, {
    once: true
  });
}

if (reducedMotionQuery.matches) {
  hosts.forEach((host) => {
    activateFallback(host);
  });
} else if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        const host = entry.target as HTMLElement;
        observer.unobserve(host);
        scheduleDeferredHeroLoad(host);
      }
    },
    {
      root: null,
      rootMargin: "96px 0px",
      threshold: 0.01
    }
  );

  hosts.forEach((host) => observer.observe(host));
} else {
  hosts.forEach((host) => {
    scheduleDeferredHeroLoad(host);
  });
}