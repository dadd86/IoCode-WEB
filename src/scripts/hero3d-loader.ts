type HeroModule = {
  initHero: (host: HTMLElement) => Promise<void>;
};

const hosts = [...document.querySelectorAll<HTMLElement>("[data-hero3d]")];
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

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

function armUserIntentLoading(host: HTMLElement): void {
  if (host.dataset.hero3dArmed === "true" || host.dataset.fallback === "true") {
    return;
  }

  host.dataset.hero3dArmed = "true";
  host.dataset.hero3dState = "deferred";

  const controller = new AbortController();

  const requestLoad = () => {
    controller.abort();
    void loadHero(host);
  };

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
        armUserIntentLoading(host);
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
  hosts.forEach((host) => armUserIntentLoading(host));
}