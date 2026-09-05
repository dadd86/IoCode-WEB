document.querySelectorAll<HTMLElement>("[data-page-control]").forEach((root) => {
  const view = root.querySelector<HTMLElement>("[data-page-control-viewport]");
  const tabs = [...root.querySelectorAll<HTMLButtonElement>("[data-page-control-tab]")];
  const pages = [...root.querySelectorAll<HTMLElement>("[data-page-control-panel]")];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDeck = root.classList.contains("pageControl--projects");
  let programmaticTarget: number | null = null;
  if (!view || tabs.length !== pages.length) return;

  const nearestIndex = () => {
    const center = view.getBoundingClientRect().left + view.clientWidth / 2;
    const gaps = pages.map((page) => Math.abs(page.getBoundingClientRect().left + page.clientWidth / 2 - center));
    return gaps.indexOf(Math.min(...gaps));
  };

  const updateDeck = () => {
    if (!isDeck || reduce) return;
    const center = view.getBoundingClientRect().left + view.clientWidth / 2;
    pages.forEach((page) => {
      const pageCenter = page.getBoundingClientRect().left + page.clientWidth / 2;
      const progress = (pageCenter - center) / view.clientWidth;
      const depth = Math.min(Math.abs(progress), 1);
      page.style.setProperty("--card-progress", String(progress));
      page.style.setProperty("--card-depth", String(depth));
      page.style.zIndex = String(Math.round((1 - depth) * 10));
    });
  };

  const show = (index: number, scroll = false, focus = false) => {
    if (!tabs[index] || !pages[index]) return;
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      pages[i]!.ariaHidden = String(!selected);
      pages[i]!.inert = !selected;
      pages[i]!.tabIndex = selected ? 0 : -1;
    });
    if (scroll) {
      programmaticTarget = index;
      pages[index].scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest", inline: "center" });
    }
    if (focus) tabs[index].focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => show(index, true));
    tab.addEventListener("pointerup", (event) => {
      if (event.pointerType === "touch") show(index, true);
    });
    tab.addEventListener("keydown", (event) => {
      const last = tabs.length - 1;
      const next = event.key === "ArrowRight" ? (index + 1) % tabs.length :
        event.key === "ArrowLeft" ? (index + last) % tabs.length :
        event.key === "Home" ? 0 : event.key === "End" ? last : -1;
      if (next < 0) return;
      event.preventDefault();
      show(next, true, true);
    });
  });

  let frame = 0;
  view.addEventListener("pointerdown", () => {
    programmaticTarget = null;
  }, { passive: true });
  view.addEventListener("scroll", () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      updateDeck();
      if (programmaticTarget !== null) {
        show(programmaticTarget);
        return;
      }
      show(nearestIndex());
    });
  }, { passive: true });

  if (isDeck && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let dragging = false;
    let startX = 0;
    let startScroll = 0;

    view.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse") return;
      dragging = true;
      startX = event.clientX;
      startScroll = view.scrollLeft;
      view.classList.add("is-dragging");
      view.setPointerCapture(event.pointerId);
    });
    view.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      view.scrollLeft = startScroll - (event.clientX - startX);
      updateDeck();
    });
    const stopDrag = () => {
      if (!dragging) return;
      dragging = false;
      view.classList.remove("is-dragging");
      show(nearestIndex(), true);
    };
    view.addEventListener("pointerup", stopDrag);
    view.addEventListener("pointercancel", stopDrag);
  }

  const h = pages.findIndex((page) => `#${page.id}` === location.hash);
  show(h < 0 ? 0 : h);
  updateDeck();
});
