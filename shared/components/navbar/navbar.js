import { $, $$ } from "../../js/utils.js";

export const initNavbar = () => {
  const menuButton = $(".menu-toggle");
  const mainNav = $(".main-nav");
  if (!menuButton || !mainNav) return;

  menuButton.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  $$("a", mainNav).forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
};
