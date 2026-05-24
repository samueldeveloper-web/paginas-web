import { CATEGORY_ROUTES, LEGACY_CATEGORY_SLUGS, ROUTES } from "./constants.js";

export const $ = (selector, scope = document) => scope.querySelector(selector);
export const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

export const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const setStatusMessage = (element, message, isError = false) => {
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("is-error", isError);
};

export const normalizeSlug = (value = "") =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const sanitizeFilename = (value = "") =>
  normalizeSlug(value.replace(/\.[^.]+$/, "")).replace(/[^a-z0-9.-]/g, "-");

export const getCategoryUrl = (slug = "") =>
  CATEGORY_ROUTES[slug] || `${ROUTES.dynamicCategory}?slug=${encodeURIComponent(slug)}`;

export const getCurrentCategorySlug = () => {
  const params = new URLSearchParams(window.location.search);
  return (
    document.body.dataset.categorySlug ||
    params.get("slug") ||
    LEGACY_CATEGORY_SLUGS[document.body.dataset.categoryHref] ||
    ""
  );
};

export const normalizeImageSrc = (value = "") => {
  const imageSrc = value.trim();
  if (!imageSrc) return "";
  if (/^https?:\/\//i.test(imageSrc) || imageSrc.startsWith("data:")) return imageSrc;

  const legacyImageMap = {
    "ASGCZP-09.jpeg": "/assets/img/productos/traumaticas/ASGCZP-09.jpeg",
    "img/ASGCZP-09.jpeg": "/assets/img/productos/traumaticas/ASGCZP-09.jpeg",
    "ASGDAN.jpeg": "/assets/img/productos/traumaticas/ASGDAN.jpeg",
    "img/ASGDAN.jpeg": "/assets/img/productos/traumaticas/ASGDAN.jpeg",
    "waltherp38.jpeg": "/assets/img/productos/airsoft/waltherp38.jpeg",
    "img/waltherp38.jpeg": "/assets/img/productos/airsoft/waltherp38.jpeg",
  };

  if (legacyImageMap[imageSrc]) return legacyImageMap[imageSrc];
  return imageSrc.startsWith("/") ? imageSrc : `/${imageSrc.replace(/^img\//, "assets/img/")}`;
};

export const getNextCategoryNumber = (categories = []) => {
  const numbers = categories
    .map(({ number_label }) => Number.parseInt(number_label || "0", 10))
    .filter((value) => Number.isFinite(value) && value > 0);

  return String(numbers.length ? Math.max(...numbers) + 1 : 1).padStart(2, "0");
};

export const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
