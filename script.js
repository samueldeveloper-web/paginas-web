import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const pageType = document.body.dataset.page ?? "public";
const legacyCategoryHref = document.body.dataset.categoryHref ?? "";
const legacyCategorySlugMap = {
  "traumaticas.html": "armas-traumaticas",
  "aire-comprimido.html": "aire-comprimido",
  "airsoft.html": "airsoft-tactico",
  "accesorios.html": "accesorios",
};
const currentCategorySlug =
  new URLSearchParams(window.location.search).get("slug") ??
  legacyCategorySlugMap[legacyCategoryHref] ??
  "";

const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const year = document.querySelector("#year");

const featuredProductGrid = document.querySelector("#featured-product-grid");
const categoryGrid = document.querySelector("#category-grid");
const categoryProductGrid = document.querySelector("#category-product-grid");
const categoryTitle = document.querySelector("#category-title");
const categoryDescription = document.querySelector("#category-description");
const categoryTag = document.querySelector("#category-tag");
const categoryHeading = document.querySelector("#category-heading");
const subcategorySection = document.querySelector("#subcategory-section");
const subcategoryHeading = document.querySelector("#subcategory-heading");
const subcategoryGrid = document.querySelector("#subcategory-grid");

const cartItemsContainer = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const cartCount = document.querySelector("#cart-count");
const cartItemsTotal = document.querySelector("#cart-items-total");
const clearCartButton = document.querySelector("#clear-cart");
const checkoutButtons = document.querySelectorAll(".cart-checkout");

const categoryForm = document.querySelector("#category-form");
const categoryIdInput = document.querySelector("#category-id");
const categoryTitleInput = document.querySelector("#category-title");
const categoryDescriptionInput = document.querySelector("#category-description");
const categorySlugInput = document.querySelector("#category-slug");
const categoryTagInput = document.querySelector("#category-tag");
const categoryCancelButton = document.querySelector("#category-cancel");
const resetCategoriesButton = document.querySelector("#reset-categories");
const adminCategoryList = document.querySelector("#admin-category-list");

const productForm = document.querySelector("#product-form");
const productIdInput = document.querySelector("#product-id");
const productNameInput = document.querySelector("#product-name");
const productCategoryIdInput = document.querySelector("#product-category-id");
const productPriceInput = document.querySelector("#product-price");
const productDescriptionInput = document.querySelector("#product-description");
const productImageSrcInput = document.querySelector("#product-image-src");
const productImageFileInput = document.querySelector("#product-image-file");
const uploadImageButton = document.querySelector("#upload-image-button");
const productImageStatus = document.querySelector("#product-image-status");
const productBadgeInput = document.querySelector("#product-badge");
const productBadgeTypeInput = document.querySelector("#product-badge-type");
const productFeaturedInput = document.querySelector("#product-featured");
const productCancelButton = document.querySelector("#product-cancel");
const adminProductList = document.querySelector("#admin-product-list");

const loginForm = document.querySelector("#login-form");
const loginEmailInput = document.querySelector("#login-email");
const loginPasswordInput = document.querySelector("#login-password");
const loginStatus = document.querySelector("#login-status");

const logoutButton = document.querySelector("#logout-button");
const adminApp = document.querySelector("#admin-app");
const authMessage = document.querySelector("#auth-message");
const authStatus = document.querySelector("#auth-status");

const cartStorageKey = "trex-cart";
const whatsappNumber = "573116455682";
const defaultDynamicCategories = [
  {
    number_label: "01",
    title: "Armas traumaticas",
    description: "Pistolas, revolveres y accesorios con presencia visual fuerte.",
    slug: "armas-traumaticas",
    tag: "Categoria TREX",
  },
  {
    number_label: "02",
    title: "Aire comprimido",
    description: "Rifles, pistolas y municiones para tiro deportivo y practica.",
    slug: "aire-comprimido",
    tag: "Categoria TREX",
  },
  {
    number_label: "03",
    title: "Airsoft tactico",
    description: "Replicas, BBs, chalecos, cascos y plataformas de juego.",
    slug: "airsoft-tactico",
    tag: "Categoria TREX",
  },
  {
    number_label: "04",
    title: "Accesorios",
    description: "Miras, linternas, estuches, protectores y repuestos.",
    slug: "accesorios",
    tag: "Categoria TREX",
  },
];
const categoryDivisions = {
  "armas-traumaticas": {
    heading: "Explora la linea traumatica por tipo de arma.",
    items: [
      {
        title: "Pistolas",
        description: "Modelos compactos y de respuesta rapida para vitrina comercial y uso deportivo.",
      },
      {
        title: "Escopetas",
        description: "Plataformas largas con silueta dominante para una linea mas robusta y tactica.",
      },
      {
        title: "Revolveres",
        description: "Piezas clasicas de alto impacto visual, ideales para coleccion y exhibicion premium.",
      },
    ],
  },
};

const config = window.TREX_CONFIG ?? {};
const hasSupabaseConfig = Boolean(config.supabaseUrl && config.supabaseAnonKey);
const storageBucket = config.storageBucket || "trex-product-images";
const supabase = hasSupabaseConfig
  ? createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        storage: window.sessionStorage,
        detectSessionInUrl: true,
      },
    })
  : null;

let cart = loadCart();
let categories = [];
let products = [];
let currentUser = null;
let currentProfile = null;
let quickCart;
let quickCartBody;
let quickCartTotal;
let quickCartCount;

function loadCart() {
  const savedCart = window.localStorage.getItem(cartStorageKey);

  if (!savedCart) {
    return [];
  }

  try {
    return JSON.parse(savedCart);
  } catch {
    return [];
  }
}

function saveCart() {
  window.localStorage.setItem(cartStorageKey, JSON.stringify(cart));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

function normalizeSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function setStatusMessage(element, message, isError = false) {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.classList.toggle("is-error", isError);
}

function sanitizeFilename(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeImageSrc(value) {
  const imageSrc = (value || "").trim();

  if (!imageSrc) {
    return "";
  }

  if (/^https?:\/\//i.test(imageSrc) || imageSrc.startsWith("data:")) {
    return imageSrc;
  }

  const legacyImageMap = {
    "ASGCZP-09.jpeg": "img/productos/traumaticas/ASGCZP-09.jpeg",
    "img/ASGCZP-09.jpeg": "img/productos/traumaticas/ASGCZP-09.jpeg",
    "ASGDAN.jpeg": "img/productos/traumaticas/ASGDAN.jpeg",
    "img/ASGDAN.jpeg": "img/productos/traumaticas/ASGDAN.jpeg",
    "waltherp38.jpeg": "img/productos/airsoft/waltherp38.jpeg",
    "img/waltherp38.jpeg": "img/productos/airsoft/waltherp38.jpeg",
  };

  return legacyImageMap[imageSrc] || imageSrc;
}

function getNextCategoryNumber() {
  const numbers = categories
    .map((category) => Number.parseInt(category.number_label || "0", 10))
    .filter((value) => Number.isFinite(value) && value > 0);
  const nextValue = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  return String(nextValue).padStart(2, "0");
}

function ensureQuickCart() {
  if (pageType === "admin" || pageType === "login" || document.body.classList.contains("has-quick-cart")) {
    return;
  }

  const widget = document.createElement("aside");
  widget.className = "quick-cart";
  widget.hidden = true;
  widget.innerHTML = `
    <div class="quick-cart-header">
      <div class="quick-cart-title">
        <img class="quick-cart-icon" src="img/ui/cart-icon.svg" alt="" aria-hidden="true" />
        <div>
          <p class="eyebrow">Resumen rapido</p>
          <h3>Carrito</h3>
        </div>
      </div>
      <span class="cart-count" id="quick-cart-count">0</span>
    </div>
    <div class="quick-cart-body" id="quick-cart-body">
      <p class="quick-cart-empty">Aun no has agregado productos.</p>
    </div>
    <div class="quick-cart-footer">
      <strong class="quick-cart-total" id="quick-cart-total">$ 0</strong>
      <a class="btn btn-primary" href="carrito.html">Ver carrito</a>
    </div>
  `;

  document.body.appendChild(widget);
  document.body.classList.add("has-quick-cart");
  quickCart = widget;
  quickCartBody = widget.querySelector("#quick-cart-body");
  quickCartTotal = widget.querySelector("#quick-cart-total");
  quickCartCount = widget.querySelector("#quick-cart-count");
}

function getCartItemMarkup(item, compact = false) {
  return `
    <article class="${compact ? "quick-cart-item" : "cart-item"}">
      <div class="cart-item-info">
        <strong class="cart-item-name">${item.name}</strong>
        <span class="cart-item-meta">${formatCurrency(item.price)}</span>
      </div>
      <div class="cart-item-actions">
        <div class="cart-quantity">
          <button class="qty-btn" type="button" data-action="decrease" data-id="${item.id}">-</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" type="button" data-action="increase" data-id="${item.id}">+</button>
        </div>
        <button class="cart-remove" type="button" data-remove-id="${item.id}">Quitar</button>
      </div>
    </article>
  `;
}

function bindCartControls(scope) {
  scope.querySelectorAll("[data-action='increase']").forEach((button) => {
    button.addEventListener("click", () => updateQuantity(button.dataset.id ?? "", 1));
  });

  scope.querySelectorAll("[data-action='decrease']").forEach((button) => {
    button.addEventListener("click", () => updateQuantity(button.dataset.id ?? "", -1));
  });

  scope.querySelectorAll(".cart-remove").forEach((button) => {
    button.addEventListener("click", () => removeFromCart(button.dataset.removeId ?? ""));
  });
}

function renderCart() {
  ensureQuickCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartCount) {
    cartCount.textContent = String(totalItems);
  }

  if (cartTotal) {
    cartTotal.textContent = formatCurrency(totalPrice);
  }

  if (cartItemsTotal) {
    cartItemsTotal.textContent = String(totalItems);
  }

  if (quickCartCount) {
    quickCartCount.textContent = String(totalItems);
  }

  if (quickCartTotal) {
    quickCartTotal.textContent = formatCurrency(totalPrice);
  }

  saveCart();

  if (cartItemsContainer) {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="cart-empty">Tu carrito esta vacio.</p>';
    } else {
      cartItemsContainer.innerHTML = cart.map((item) => getCartItemMarkup(item)).join("");
      bindCartControls(cartItemsContainer);
    }
  }

  if (!quickCart || !quickCartBody) {
    return;
  }

  quickCart.hidden = cart.length === 0;

  if (cart.length === 0) {
    quickCartBody.innerHTML = '<p class="quick-cart-empty">Aun no has agregado productos.</p>';
    return;
  }

  quickCartBody.innerHTML = cart.slice(0, 3).map((item) => getCartItemMarkup(item, true)).join("");
  bindCartControls(quickCartBody);
}

function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
}

function updateQuantity(productId, delta) {
  const product = cart.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  product.quantity += delta;

  if (product.quantity <= 0) {
    cart = cart.filter((item) => item.id !== productId);
  }

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

function createProductCard(product) {
  const badgeMarkup = product.badge
    ? `<div class="product-badge ${product.badge_type ?? ""}">${product.badge}</div>`
    : "";
  const imageMarkup = product.image_src
    ? `
        <img
          class="product-art-image"
          src="${normalizeImageSrc(product.image_src)}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.hidden=true; this.nextElementSibling.hidden=false;"
        />
        <div class="product-art-fallback" hidden>Imagen pendiente</div>
      `
    : '<div class="product-art-fallback">Imagen pendiente</div>';

  return `
    <article class="product-card">
      ${badgeMarkup}
      <div class="product-art">
        ${imageMarkup}
      </div>
      <div class="product-info">
        <p class="product-category">${product.category_label}</p>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-footer">
          <strong>${formatCurrency(Number(product.price_cop || 0))}</strong>
          <button
            class="add-to-cart"
            type="button"
            data-id="${product.id}"
            data-name="${product.name}"
            data-price="${product.price_cop}"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  `;
}

function bindAddToCart(scope) {
  scope.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart({
        id: button.dataset.id ?? "",
        name: button.dataset.name ?? "Producto TREX",
        price: Number(button.dataset.price ?? 0),
      });
    });
  });
}

function renderCategories() {
  if (!categoryGrid) {
    return;
  }

  if (categories.length === 0) {
    categoryGrid.innerHTML = '<p class="cart-empty">No hay categorias publicadas.</p>';
    return;
  }

  categoryGrid.innerHTML = categories
    .map(
      (category) => `
        <a class="category-link" href="categoria.html?slug=${encodeURIComponent(category.slug)}">
          <article class="category-card">
            <h3>${category.title}</h3>
            <p>${category.description}</p>
          </article>
        </a>
      `
    )
    .join("");
}

function renderFeaturedProducts() {
  if (!featuredProductGrid) {
    return;
  }

  const featured = products.filter((product) => product.is_featured);

  if (featured.length === 0) {
    featuredProductGrid.innerHTML = '<p class="product-empty">No hay productos destacados publicados.</p>';
    return;
  }

  featuredProductGrid.innerHTML = featured.map((product) => createProductCard(product)).join("");
  bindAddToCart(featuredProductGrid);
}

function renderCategoryDivisions(category) {
  if (!subcategorySection || !subcategoryGrid) {
    return;
  }

  const division = categoryDivisions[category.slug];

  if (!division) {
    subcategorySection.hidden = true;
    subcategoryGrid.innerHTML = "";
    return;
  }

  subcategorySection.hidden = false;

  if (subcategoryHeading) {
    subcategoryHeading.textContent = division.heading;
  }

  subcategoryGrid.innerHTML = division.items
    .map(
      (item) => `
        <article class="subcategory-card">
          <p class="eyebrow">Linea TREX</p>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </article>
      `
    )
    .join("");
}

function renderCategoryPage() {
  if (!categoryProductGrid) {
    return;
  }

  const category = categories.find((item) => item.slug === currentCategorySlug);

  if (!category) {
    categoryProductGrid.innerHTML = '<p class="product-empty">No se encontro esta categoria.</p>';
    return;
  }

  if (categoryTitle) {
    categoryTitle.textContent = category.title;
  }

  if (categoryDescription) {
    categoryDescription.textContent = category.description;
  }

  if (categoryTag) {
    categoryTag.textContent = category.tag || "Categoria TREX";
  }

  if (categoryHeading) {
    categoryHeading.textContent = `Productos disponibles en ${category.title}.`;
  }

  renderCategoryDivisions(category);

  const filtered = products.filter((product) => product.category_id === category.id);

  if (filtered.length === 0) {
    categoryProductGrid.innerHTML = '<p class="product-empty">No hay productos publicados para esta categoria.</p>';
    return;
  }

  categoryProductGrid.innerHTML = filtered.map((product) => createProductCard(product)).join("");
  bindAddToCart(categoryProductGrid);
}

function populateProductCategoryOptions() {
  if (!productCategoryIdInput) {
    return;
  }

  productCategoryIdInput.innerHTML = categories
    .map((category) => `<option value="${category.id}">${category.title}</option>`)
    .join("");
}

function resetCategoryForm() {
  if (!categoryForm) {
    return;
  }

  categoryForm.reset();

  if (categoryIdInput) {
    categoryIdInput.value = "";
  }
}

function resetProductForm() {
  if (!productForm) {
    return;
  }

  productForm.reset();
  populateProductCategoryOptions();

  if (productIdInput) {
    productIdInput.value = "";
  }

  if (productImageSrcInput) {
    productImageSrcInput.value = "";
  }

  if (productImageFileInput) {
    productImageFileInput.value = "";
  }

  setStatusMessage(productImageStatus, "");

  if (productFeaturedInput) {
    productFeaturedInput.checked = true;
  }
}

function populateCategoryForm(categoryId) {
  const category = categories.find((item) => item.id === categoryId);

  if (
    !category ||
    !categoryIdInput ||
    !categoryTitleInput ||
    !categoryDescriptionInput ||
    !categorySlugInput ||
    !categoryTagInput
  ) {
    return;
  }

  categoryIdInput.value = category.id;
  categoryTitleInput.value = category.title;
  categoryDescriptionInput.value = category.description;
  categorySlugInput.value = category.slug;
  categoryTagInput.value = category.tag || "";
}

function populateProductForm(productId) {
  const product = products.find((item) => item.id === productId);

  if (
    !product ||
    !productIdInput ||
    !productNameInput ||
    !productCategoryIdInput ||
    !productPriceInput ||
    !productDescriptionInput ||
    !productImageSrcInput ||
    !productBadgeInput ||
    !productBadgeTypeInput ||
    !productFeaturedInput
  ) {
    return;
  }

  populateProductCategoryOptions();
  productIdInput.value = product.id;
  productNameInput.value = product.name;
  productCategoryIdInput.value = product.category_id;
  productPriceInput.value = String(product.price_cop);
  productDescriptionInput.value = product.description;
  productImageSrcInput.value = product.image_src;
  productBadgeInput.value = product.badge || "";
  productBadgeTypeInput.value = product.badge_type || "";
  productFeaturedInput.checked = Boolean(product.is_featured);
  setStatusMessage(productImageStatus, "Imagen lista. Puedes reemplazarla subiendo otro archivo.");
}

function renderAdminCategories() {
  if (!adminCategoryList) {
    return;
  }

  if (categories.length === 0) {
    adminCategoryList.innerHTML = '<p class="cart-empty">No hay categorias cargadas.</p>';
    return;
  }

  adminCategoryList.innerHTML = categories
    .map(
      (category) => `
        <article class="admin-item">
          <div class="admin-item-top">
            <div>
              <h3>${category.title}</h3>
              <p class="admin-item-meta">${category.description}</p>
            </div>
            <div class="admin-item-actions">
              <button class="admin-btn" type="button" data-edit-category="${category.id}">Editar</button>
              <button class="admin-btn delete" type="button" data-delete-category="${category.id}">Eliminar</button>
            </div>
          </div>
          <span class="admin-item-chip">${category.tag || "Categoria TREX"}</span>
          <a class="admin-item-link" href="categoria.html?slug=${encodeURIComponent(category.slug)}">${category.slug}</a>
        </article>
      `
    )
    .join("");

  adminCategoryList.querySelectorAll("[data-edit-category]").forEach((button) => {
    button.addEventListener("click", () => populateCategoryForm(button.dataset.editCategory ?? ""));
  });

  adminCategoryList.querySelectorAll("[data-delete-category]").forEach((button) => {
    button.addEventListener("click", async () => {
      await deleteCategory(button.dataset.deleteCategory ?? "");
    });
  });
}

function renderAdminProducts() {
  if (!adminProductList) {
    return;
  }

  if (products.length === 0) {
    adminProductList.innerHTML = '<p class="cart-empty">No hay productos cargados.</p>';
    return;
  }

  adminProductList.innerHTML = products
    .map(
      (product) => `
        <article class="admin-item">
          <div class="admin-item-top">
            <div>
              <p class="eyebrow">${product.category_label}</p>
              <h3>${product.name}</h3>
              <p class="admin-item-meta">${product.description}</p>
            </div>
            <div class="admin-item-actions">
              <button class="admin-btn" type="button" data-edit-product="${product.id}">Editar</button>
              <button class="admin-btn delete" type="button" data-delete-product="${product.id}">Eliminar</button>
            </div>
          </div>
          <span class="admin-item-chip">${formatCurrency(Number(product.price_cop || 0))}</span>
          <p class="admin-item-meta">${product.is_featured ? "Visible en destacados" : "Solo en categoria"}</p>
          <a class="admin-item-link" href="${product.image_src}">${product.image_src}</a>
        </article>
      `
    )
    .join("");

  adminProductList.querySelectorAll("[data-edit-product]").forEach((button) => {
    button.addEventListener("click", () => populateProductForm(button.dataset.editProduct ?? ""));
  });

  adminProductList.querySelectorAll("[data-delete-product]").forEach((button) => {
    button.addEventListener("click", async () => {
      await deleteProduct(button.dataset.deleteProduct ?? "");
    });
  });
}

async function fetchCategories(adminMode = false) {
  if (!supabase) {
    return [];
  }

  let query = supabase
    .from("categories")
    .select("id, number_label, title, description, href, slug, tag, is_published")
    .order("number_label", { ascending: true });

  if (!adminMode) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error loading categories:", error.message);
    return [];
  }

  return (data ?? []).map((category) => ({
    ...category,
    slug: category.slug || decodeURIComponent(category.href?.split("slug=")[1] || ""),
  }));
}

async function fetchProducts(adminMode = false) {
  if (!supabase) {
    return [];
  }

  let query = supabase
    .from("products")
    .select(
      "id, category_id, category_label, name, description, price_cop, image_src, image_position, badge, badge_type, is_featured, is_published"
    )
    .order("created_at", { ascending: false });

  if (!adminMode) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error loading products:", error.message);
    return [];
  }

  return (data ?? []).map((product) => ({
    ...product,
    image_src: normalizeImageSrc(product.image_src),
  }));
}

async function refreshContent(adminMode = false) {
  categories = await fetchCategories(adminMode);
  products = await fetchProducts(adminMode);
  renderCategories();
  renderFeaturedProducts();
  renderCategoryPage();
  populateProductCategoryOptions();
  renderAdminCategories();
  renderAdminProducts();
}

async function saveCategory() {
  if (
    !supabase ||
    !currentUser ||
    !categoryIdInput ||
    !categoryTitleInput ||
    !categoryDescriptionInput ||
    !categorySlugInput ||
    !categoryTagInput
  ) {
    return;
  }

  const normalizedSlug = normalizeSlug(categorySlugInput.value);
  const categoryId = categoryIdInput.value.trim();
  const existingCategory = categories.find((category) => category.id === categoryId);

  if (!normalizedSlug) {
    setStatusMessage(authStatus, "Debes ingresar un slug valido para la categoria.", true);
    return;
  }

  categorySlugInput.value = normalizedSlug;
  const payload = {
    number_label: existingCategory?.number_label || getNextCategoryNumber(),
    title: categoryTitleInput.value.trim(),
    description: categoryDescriptionInput.value.trim(),
    slug: normalizedSlug,
    href: `categoria.html?slug=${encodeURIComponent(normalizedSlug)}`,
    tag: categoryTagInput.value.trim(),
    is_published: true,
    created_by: currentUser.id,
  };

  const query = categoryId
    ? supabase.from("categories").update(payload).eq("id", categoryId)
    : supabase.from("categories").insert(payload);

  const { error } = await query;

  if (error) {
    setStatusMessage(authStatus, `No se pudo guardar la categoria: ${error.message}`, true);
    return;
  }

  await refreshContent(true);
  resetCategoryForm();
  setStatusMessage(authStatus, "Categoria guardada correctamente.");
}

async function deleteCategory(categoryId) {
  if (!supabase || !categoryId) {
    return;
  }

  const { error } = await supabase.from("categories").delete().eq("id", categoryId);

  if (error) {
    setStatusMessage(authStatus, `No se pudo eliminar la categoria: ${error.message}`, true);
    return;
  }

  await refreshContent(true);
  resetCategoryForm();
  setStatusMessage(authStatus, "Categoria eliminada correctamente.");
}

async function saveProduct() {
  if (
    !supabase ||
    !productIdInput ||
    !productNameInput ||
    !productCategoryIdInput ||
    !productPriceInput ||
    !productDescriptionInput ||
    !productImageSrcInput ||
    !productBadgeInput ||
    !productBadgeTypeInput ||
    !productFeaturedInput
  ) {
    return;
  }

  const selectedCategory = categories.find((category) => category.id === productCategoryIdInput.value);

  if (!selectedCategory) {
    setStatusMessage(authStatus, "Selecciona una categoria destino valida.", true);
    return;
  }

  const payload = {
    category_id: productCategoryIdInput.value,
    category_label: selectedCategory.title,
    name: productNameInput.value.trim(),
    description: productDescriptionInput.value.trim(),
    price_cop: Number(productPriceInput.value || 0),
    image_src: productImageSrcInput.value.trim(),
    image_position: "center",
    badge: productBadgeInput.value.trim(),
    badge_type: productBadgeTypeInput.value,
    is_featured: productFeaturedInput.checked,
    is_published: true,
    created_by: currentUser?.id ?? null,
  };

  const productId = productIdInput.value.trim();
  const query = productId
    ? supabase.from("products").update(payload).eq("id", productId)
    : supabase.from("products").insert(payload);

  const { error } = await query;

  if (error) {
    setStatusMessage(authStatus, `No se pudo guardar el producto: ${error.message}`, true);
    return;
  }

  await refreshContent(true);
  resetProductForm();
  setStatusMessage(authStatus, "Producto guardado correctamente.");
}

async function uploadProductImage() {
  if (!supabase || !currentUser || !productImageFileInput || !productImageSrcInput || !productCategoryIdInput) {
    return;
  }

  const file = productImageFileInput.files?.[0];

  if (!file) {
    setStatusMessage(productImageStatus, "Selecciona un archivo antes de subirlo.", true);
    return;
  }

  const category = categories.find((item) => item.id === productCategoryIdInput.value);

  if (!category) {
    setStatusMessage(productImageStatus, "Selecciona primero una categoria destino.", true);
    return;
  }

  const extension = file.name.includes(".") ? file.name.split(".").pop() : "";
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const safeName = sanitizeFilename(baseName) || `producto-${Date.now()}`;
  const filePath = `${category.slug}/${Date.now()}-${safeName}${extension ? `.${extension.toLowerCase()}` : ""}`;

  setStatusMessage(productImageStatus, "Subiendo imagen...");

  const { error: uploadError } = await supabase.storage.from(storageBucket).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });

  if (uploadError) {
    setStatusMessage(productImageStatus, `No se pudo subir la imagen: ${uploadError.message}`, true);
    return;
  }

  const { data } = supabase.storage.from(storageBucket).getPublicUrl(filePath);

  if (!data?.publicUrl) {
    setStatusMessage(productImageStatus, "La imagen subio, pero no se pudo obtener la URL publica.", true);
    return;
  }

  productImageSrcInput.value = data.publicUrl;
  productImageFileInput.value = "";
  setStatusMessage(productImageStatus, "Imagen subida correctamente.");
}

async function deleteProduct(productId) {
  if (!supabase || !productId) {
    return;
  }

  const { error } = await supabase.from("products").delete().eq("id", productId);

  if (error) {
    setStatusMessage(authStatus, `No se pudo eliminar el producto: ${error.message}`, true);
    return;
  }

  await refreshContent(true);
  resetProductForm();
  setStatusMessage(authStatus, "Producto eliminado correctamente.");
}

async function verifyAdminSession() {
  if (!supabase) {
    setStatusMessage(authStatus, "Falta configurar Supabase en app-config.js", true);
    return false;
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    window.location.replace("login.html");
    return false;
  }

  currentUser = userData.user ?? null;

  if (!currentUser) {
    window.location.replace("login.html");
    return false;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, role")
    .eq("id", currentUser.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    await supabase.auth.signOut();
    window.location.replace("login.html?error=not_admin");
    return false;
  }

  currentProfile = profile;

  if (adminApp) {
    adminApp.hidden = false;
  }

  if (authMessage) {
    authMessage.hidden = true;
  }

  return true;
}

async function handleLoginSubmit(event) {
  event.preventDefault();

  if (!supabase || !loginEmailInput || !loginPasswordInput) {
    setStatusMessage(loginStatus, "Falta configurar Supabase en app-config.js", true);
    return;
  }

  setStatusMessage(loginStatus, "Validando credenciales...");

  const { error } = await supabase.auth.signInWithPassword({
    email: loginEmailInput.value.trim(),
    password: loginPasswordInput.value,
  });

  if (error) {
    setStatusMessage(loginStatus, error.message, true);
    return;
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    setStatusMessage(loginStatus, "No se pudo validar la sesion con Supabase.", true);
    return;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    await supabase.auth.signOut();
    setStatusMessage(loginStatus, "Tu usuario existe, pero no tiene rol admin.", true);
    return;
  }

  window.location.replace("admin.html");
}

async function handleLogout() {
  if (!supabase) {
    return;
  }

  await supabase.auth.signOut();
  window.location.replace("login.html");
}

function handleCheckout() {
  if (cart.length === 0) {
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const lines = [
    "Hola TREX, quiero finalizar este pedido:",
    "",
    ...cart.map(
      (item, index) =>
        `${index + 1}. ${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}`
    ),
    "",
    `Total: ${formatCurrency(total)}`,
  ];

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.location.href = url;
}

function initializeBaseUi() {
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (menuButton && mainNav) {
    menuButton.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (clearCartButton) {
    clearCartButton.addEventListener("click", () => clearCart());
  }

  checkoutButtons.forEach((button) => {
    button.addEventListener("click", handleCheckout);
  });

  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }

  if (categoryForm) {
    categoryForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await saveCategory();
    });
  }

  if (categoryCancelButton) {
    categoryCancelButton.addEventListener("click", () => resetCategoryForm());
  }

  if (resetCategoriesButton) {
    resetCategoriesButton.addEventListener("click", async () => {
      if (!supabase) {
        return;
      }

      const { error } = await supabase
        .from("categories")
        .upsert(
          defaultDynamicCategories.map((category) => ({
            ...category,
            href: `categoria.html?slug=${encodeURIComponent(category.slug)}`,
            is_published: true,
            created_by: currentUser?.id ?? null,
          })),
          { onConflict: "href" }
        );

      if (error) {
        setStatusMessage(authStatus, `No se pudieron restaurar categorias: ${error.message}`, true);
        return;
      }

      await refreshContent(true);
      resetCategoryForm();
      setStatusMessage(authStatus, "Categorias restauradas.");
    });
  }

  if (productForm) {
    productForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await saveProduct();
    });
  }

  if (productCancelButton) {
    productCancelButton.addEventListener("click", () => resetProductForm());
  }

  if (uploadImageButton) {
    uploadImageButton.addEventListener("click", async () => {
      await uploadProductImage();
    });
  }
}

async function bootstrap() {
  initializeBaseUi();
  renderCart();

  if (!hasSupabaseConfig) {
    setStatusMessage(authStatus, "Configura Supabase en app-config.js para habilitar login y admin.", true);
    setStatusMessage(loginStatus, "Configura Supabase en app-config.js para iniciar sesion.", true);
    return;
  }

  if (pageType === "login") {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
      if (profile?.role === "admin") {
        window.location.replace("admin.html");
        return;
      }
    }
  }

  if (pageType === "admin") {
    const accessGranted = await verifyAdminSession();
    if (!accessGranted) {
      return;
    }

    await refreshContent(true);
  } else if (pageType !== "login") {
    await refreshContent(false);
  }

  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT" && pageType === "admin") {
      setTimeout(() => {
        window.location.replace("login.html");
      }, 0);
    }
  });
}

bootstrap();
