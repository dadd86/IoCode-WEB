type HeroModule = {
  initHero: (host: HTMLElement) => Promise<void>;
};

const hosts = [...document.querySelectorAll<HTMLElement>("[data-hero3d]")];

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

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
        void loadHero(host);
      }
    },
    {
      root: null,
      rootMargin: "320px 0px",
      threshold: 0.01
    }
  );

  hosts.forEach((host) => observer.observe(host));
} else {
  hosts.forEach((host) => {
    void loadHero(host);
  });
}