import { $$ } from "./utils.js";

const revealSelector = [
  ".hero-copy",
  ".hero-panel",
  ".section-heading",
  ".category-link",
  ".product-card",
  ".catalog-highlight",
  ".benefit-grid article",
  ".footer",
].join(",");

export const initRevealAnimations = () => {
  const elements = $$(revealSelector);
  if (!elements.length || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.add("is-visible");
        observer.unobserve(target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );

  elements.forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
};

export const initScrollEffects = () => {
  const update = () => {
    const y = Math.min(window.scrollY, 720);
    document.documentElement.style.setProperty("--parallax-y", `${y}px`);
    document.body.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  update();
  window.addEventListener("scroll", () => window.requestAnimationFrame(update), { passive: true });
};

export const initMotion = () => {
  initRevealAnimations();
  initScrollEffects();
};
