if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let frame = 0;
  let pending: { card: HTMLElement; x: number; y: number } | null = null;

  document.addEventListener(
    "pointermove",
    (event) => {
      const target = event.target as HTMLElement | null;
      const card = target?.closest<HTMLElement>(".skillBlock__section");
      if (!card) return;

      const rect = card.getBoundingClientRect();
      pending = { card, x: event.clientX - rect.left, y: event.clientY - rect.top };

      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          if (!pending) return;
          pending.card.style.setProperty("--spot-x", `${pending.x}px`);
          pending.card.style.setProperty("--spot-y", `${pending.y}px`);
        });
      }
    },
    { passive: true }
  );
}
