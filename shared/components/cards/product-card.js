import { escapeHtml, formatCurrency, normalizeImageSrc } from "../../js/utils.js";

export const createProductCard = (product) => {
  const badge = product.badge
    ? `<div class="product-badge ${escapeHtml(product.badge_type ?? "")}">${escapeHtml(product.badge)}</div>`
    : "";

  const image = product.image_src
    ? `
        <img
          class="product-art-image"
          src="${normalizeImageSrc(product.image_src)}"
          alt="${escapeHtml(product.name)}"
          loading="lazy"
          decoding="async"
          onerror="this.hidden=true; this.nextElementSibling.hidden=false;"
        />
        <div class="product-art-fallback" hidden>Imagen pendiente</div>
      `
    : '<div class="product-art-fallback">Imagen pendiente</div>';

  return `
    <article class="product-card">
      ${badge}
      <div class="product-art">${image}</div>
      <div class="product-info">
        <p class="product-category">${escapeHtml(product.category_label)}</p>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.description)}</p>
        <div class="product-footer">
          <strong>${formatCurrency(product.price_cop)}</strong>
          <button
            class="add-to-cart"
            type="button"
            data-id="${escapeHtml(product.id)}"
            data-name="${escapeHtml(product.name)}"
            data-price="${Number(product.price_cop || 0)}"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  `;
};
