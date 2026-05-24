import { CATEGORY_DIVISIONS } from "./constants.js";
import { addToCart, checkoutOnWhatsapp, clearCart, getCart, getCartTotals, onCartChange, removeFromCart, updateQuantity } from "./cart.js";
import { $, $$, escapeHtml, formatCurrency, getCategoryUrl } from "./utils.js";
import { createProductCard } from "../components/cards/product-card.js";
import { initNavbar } from "../components/navbar/navbar.js";

const cartItemTemplate = (item, compact = false) => `
  <article class="${compact ? "quick-cart-item" : "cart-item"}">
    <div class="cart-item-info">
      <strong class="cart-item-name">${escapeHtml(item.name)}</strong>
      <span class="cart-item-meta">${formatCurrency(item.price)}</span>
    </div>
    <div class="cart-item-actions">
      <div class="cart-quantity">
        <button class="qty-btn" type="button" data-cart-action="decrease" data-id="${escapeHtml(item.id)}">-</button>
        <span class="qty-value">${item.quantity}</span>
        <button class="qty-btn" type="button" data-cart-action="increase" data-id="${escapeHtml(item.id)}">+</button>
      </div>
      <button class="cart-remove" type="button" data-cart-action="remove" data-id="${escapeHtml(item.id)}">Quitar</button>
    </div>
  </article>
`;

const ensureQuickCart = () => {
  if (document.body.classList.contains("has-quick-cart") || document.body.dataset.page === "admin") return;

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <aside class="quick-cart" id="quick-cart" hidden>
        <div class="quick-cart-header">
          <div class="quick-cart-title">
            <img class="quick-cart-icon" src="/assets/img/ui/cart-icon.svg" alt="" aria-hidden="true" loading="lazy" />
            <div>
              <p class="eyebrow">Resumen rapido</p>
              <h3>Carrito</h3>
            </div>
          </div>
          <span class="cart-count" id="quick-cart-count">0</span>
        </div>
        <div class="quick-cart-body" id="quick-cart-body"></div>
        <div class="quick-cart-footer">
          <strong class="quick-cart-total" id="quick-cart-total">$ 0</strong>
          <a class="btn btn-primary" href="/pages/carrito/carrito.html">Ver carrito</a>
        </div>
      </aside>
    `
  );

  document.body.classList.add("has-quick-cart");
};

export const renderCart = ({ quick = true } = {}) => {
  if (quick) ensureQuickCart();

  const cart = getCart();
  const { items, price } = getCartTotals();

  $$(".cart-count").forEach((element) => {
    element.textContent = String(items);
  });

  if ($("#cart-total")) $("#cart-total").textContent = formatCurrency(price);
  if ($("#cart-items-total")) $("#cart-items-total").textContent = String(items);
  if ($("#quick-cart-total")) $("#quick-cart-total").textContent = formatCurrency(price);

  const cartItems = $("#cart-items");
  if (cartItems) {
    cartItems.innerHTML = cart.length
      ? cart.map((item) => cartItemTemplate(item)).join("")
      : '<p class="cart-empty">Tu carrito esta vacio.</p>';
  }

  const quickCart = $("#quick-cart");
  const quickCartBody = $("#quick-cart-body");
  if (!quickCart || !quickCartBody) return;

  quickCart.hidden = cart.length === 0;
  quickCartBody.innerHTML = cart.length
    ? cart.slice(0, 3).map((item) => cartItemTemplate(item, true)).join("")
    : '<p class="quick-cart-empty">Aun no has agregado productos.</p>';
};

export const initCartUi = ({ quick = true } = {}) => {
  renderCart({ quick });
  onCartChange(() => renderCart({ quick }));

  document.addEventListener("click", (event) => {
    const addButton = event.target.closest(".add-to-cart");
    const cartButton = event.target.closest("[data-cart-action]");
    const checkoutButton = event.target.closest(".cart-checkout");
    const clearButton = event.target.closest("#clear-cart");

    if (addButton) {
      addToCart({
        id: addButton.dataset.id,
        name: addButton.dataset.name || "Producto TREX",
        price: Number(addButton.dataset.price || 0),
      });
    }

    if (cartButton) {
      const { cartAction, id } = cartButton.dataset;
      if (cartAction === "increase") updateQuantity(id, 1);
      if (cartAction === "decrease") updateQuantity(id, -1);
      if (cartAction === "remove") removeFromCart(id);
    }

    if (checkoutButton) checkoutOnWhatsapp();
    if (clearButton) clearCart();
  });
};

export const initBaseUi = ({ quickCart = true } = {}) => {
  initNavbar();
  initCartUi({ quick: quickCart });
  if ($("#year")) $("#year").textContent = new Date().getFullYear();
};

export const renderCategoryGrid = (categories = []) => {
  const grid = $("#category-grid");
  if (!grid) return;

  grid.innerHTML = categories.length
    ? categories
        .map(
          ({ title, description, slug }) => `
            <a class="category-link" href="${getCategoryUrl(slug)}">
              <article class="category-card">
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(description)}</p>
              </article>
            </a>
          `
        )
        .join("")
    : '<p class="cart-empty">No hay categorias publicadas.</p>';
};

export const renderFeaturedProducts = (products = []) => {
  const grid = $("#featured-product-grid");
  if (!grid) return;

  const featured = products.filter(({ is_featured }) => is_featured);
  grid.innerHTML = featured.length
    ? featured.map(createProductCard).join("")
    : '<p class="product-empty">No hay productos destacados publicados.</p>';
};

export const renderCategoryPage = ({ categories = [], products = [], slug = "" }) => {
  const grid = $("#category-product-grid");
  if (!grid) return;

  const category = categories.find((item) => item.slug === slug);
  if (!category) {
    grid.innerHTML = '<p class="product-empty">No se encontro esta categoria.</p>';
    return;
  }

  if ($("#category-title")) $("#category-title").textContent = category.title;
  if ($("#category-description")) $("#category-description").textContent = category.description;
  if ($("#category-tag")) $("#category-tag").textContent = category.tag || "Categoria TREX";
  if ($("#category-heading")) $("#category-heading").textContent = `Productos disponibles en ${category.title}.`;

  renderCategoryDivisions(category.slug);

  const filtered = products.filter(({ category_id }) => category_id === category.id);
  grid.innerHTML = filtered.length
    ? filtered.map(createProductCard).join("")
    : '<p class="product-empty">No hay productos publicados para esta categoria.</p>';
};

export const renderCategoryDivisions = (slug) => {
  const section = $("#subcategory-section");
  const grid = $("#subcategory-grid");
  if (!section || !grid) return;

  const division = CATEGORY_DIVISIONS[slug];
  section.hidden = !division;
  if (!division) {
    grid.innerHTML = "";
    return;
  }

  if ($("#subcategory-heading")) $("#subcategory-heading").textContent = division.heading;
  grid.innerHTML = division.items
    .map(
      ({ title, description }) => `
        <article class="subcategory-card">
          <p class="eyebrow">Linea TREX</p>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(description)}</p>
        </article>
      `
    )
    .join("");
};

export const renderAdminCategories = ({ categories, onEdit, onDelete }) => {
  const list = $("#admin-category-list");
  if (!list) return;

  list.innerHTML = categories.length
    ? categories
        .map(
          (category) => `
            <article class="admin-item">
              <div class="admin-item-top">
                <div>
                  <h3>${escapeHtml(category.title)}</h3>
                  <p class="admin-item-meta">${escapeHtml(category.description)}</p>
                </div>
                <div class="admin-item-actions">
                  <button class="admin-btn" type="button" data-admin-edit-category="${category.id}">Editar</button>
                  <button class="admin-btn delete" type="button" data-admin-delete-category="${category.id}">Eliminar</button>
                </div>
              </div>
              <span class="admin-item-chip">${escapeHtml(category.tag || "Categoria TREX")}</span>
              <a class="admin-item-link" href="${getCategoryUrl(category.slug)}">${escapeHtml(category.slug)}</a>
            </article>
          `
        )
        .join("")
    : '<p class="cart-empty">No hay categorias cargadas.</p>';

  list.onclick = ({ target }) => {
    const editId = target.closest("[data-admin-edit-category]")?.dataset.adminEditCategory;
    const deleteId = target.closest("[data-admin-delete-category]")?.dataset.adminDeleteCategory;
    if (editId) onEdit(editId);
    if (deleteId) onDelete(deleteId);
  };
};

export const renderAdminProducts = ({ products, onEdit, onDelete }) => {
  const list = $("#admin-product-list");
  if (!list) return;

  list.innerHTML = products.length
    ? products
        .map(
          (product) => `
            <article class="admin-item">
              <div class="admin-item-top">
                <div>
                  <p class="eyebrow">${escapeHtml(product.category_label)}</p>
                  <h3>${escapeHtml(product.name)}</h3>
                  <p class="admin-item-meta">${escapeHtml(product.description)}</p>
                </div>
                <div class="admin-item-actions">
                  <button class="admin-btn" type="button" data-admin-edit-product="${product.id}">Editar</button>
                  <button class="admin-btn delete" type="button" data-admin-delete-product="${product.id}">Eliminar</button>
                </div>
              </div>
              <span class="admin-item-chip">${formatCurrency(product.price_cop)}</span>
              <p class="admin-item-meta">${product.is_featured ? "Visible en destacados" : "Solo en categoria"}</p>
              <a class="admin-item-link" href="${escapeHtml(product.image_src)}">${escapeHtml(product.image_src)}</a>
            </article>
          `
        )
        .join("")
    : '<p class="cart-empty">No hay productos cargados.</p>';

  list.onclick = ({ target }) => {
    const editId = target.closest("[data-admin-edit-product]")?.dataset.adminEditProduct;
    const deleteId = target.closest("[data-admin-delete-product]")?.dataset.adminDeleteProduct;
    if (editId) onEdit(editId);
    if (deleteId) onDelete(deleteId);
  };
};

export const populateProductCategoryOptions = (categories = []) => {
  const select = $("#product-category-id");
  if (!select) return;
  select.innerHTML = categories.map(({ id, title }) => `<option value="${id}">${escapeHtml(title)}</option>`).join("");
};
