const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const year = document.querySelector("#year");
const cartItemsContainer = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const cartCount = document.querySelector("#cart-count");
const cartItemsTotal = document.querySelector("#cart-items-total");
const clearCartButton = document.querySelector("#clear-cart");
const categoryGrid = document.querySelector("#category-grid");
const featuredProductGrid = document.querySelector("#featured-product-grid");
const categoryProductGrid = document.querySelector("#category-product-grid");
const categoryTitle = document.querySelector("#category-title");
const categoryDescription = document.querySelector("#category-description");
const categoryTag = document.querySelector("#category-tag");
const categoryHeading = document.querySelector("#category-heading");
const categoryForm = document.querySelector("#category-form");
const adminCategoryList = document.querySelector("#admin-category-list");
const categoryIdInput = document.querySelector("#category-id");
const categoryNumberInput = document.querySelector("#category-number");
const categoryTitleInput = document.querySelector("#category-title");
const categoryDescriptionInput = document.querySelector("#category-description");
const categoryHrefInput = document.querySelector("#category-href");
const categoryTagInput = document.querySelector("#category-tag");
const categoryCancelButton = document.querySelector("#category-cancel");
const resetCategoriesButton = document.querySelector("#reset-categories");
const productForm = document.querySelector("#product-form");
const adminProductList = document.querySelector("#admin-product-list");
const productIdInput = document.querySelector("#product-id");
const productNameInput = document.querySelector("#product-name");
const productCategoryLabelInput = document.querySelector("#product-category-label");
const productCategoryHrefInput = document.querySelector("#product-category-href");
const productPriceInput = document.querySelector("#product-price");
const productDescriptionInput = document.querySelector("#product-description");
const productImageSrcInput = document.querySelector("#product-image-src");
const productImagePositionInput = document.querySelector("#product-image-position");
const productBadgeInput = document.querySelector("#product-badge");
const productBadgeTypeInput = document.querySelector("#product-badge-type");
const productFeaturedInput = document.querySelector("#product-featured");
const productCancelButton = document.querySelector("#product-cancel");
const checkoutButtons = document.querySelectorAll(".cart-checkout");
let quickCart;
let quickCartBody;
let quickCartTotal;
let quickCartCount;

const storageKey = "trex-cart";
const categoryStorageKey = "trex-categories";
const productStorageKey = "trex-products";
const whatsappNumber = "573116455682";
const categoryPageOptions = [
  { value: "traumaticas.html", label: "Armas traumaticas" },
  { value: "aire-comprimido.html", label: "Aire comprimido" },
  { value: "airsoft.html", label: "Airsoft tactico" },
  { value: "accesorios.html", label: "Accesorios" },
];
const defaultCategories = [
  {
    id: "cat-traumaticas",
    number: "01",
    title: "Armas traumaticas",
    description: "Pistolas, revolveres y accesorios con presencia visual fuerte.",
    href: "traumaticas.html",
    tag: "Categoria TREX",
  },
  {
    id: "cat-aire",
    number: "02",
    title: "Aire comprimido",
    description: "Rifles, pistolas y municiones para tiro deportivo y practica.",
    href: "aire-comprimido.html",
    tag: "Categoria TREX",
  },
  {
    id: "cat-airsoft",
    number: "03",
    title: "Airsoft tactico",
    description: "Replicas, BBs, chalecos, cascos y plataformas de juego.",
    href: "airsoft.html",
    tag: "Categoria TREX",
  },
  {
    id: "cat-accesorios",
    number: "04",
    title: "Accesorios",
    description: "Miras, linternas, estuches, protectores y repuestos.",
    href: "accesorios.html",
    tag: "Categoria TREX",
  },
];
const defaultProducts = [
  {
    id: "asg-cz-p09",
    name: "ASG CZ P-09",
    categoryLabel: "Airsoft",
    categoryHref: "aire-comprimido.html",
    price: 890000,
    description: "Pistola de perfil tactico con presentacion fuerte y fondo verde TREX.",
    imageSrc: "ASGCZP-09.jpeg",
    imagePosition: "center 38%",
    badge: "Nuevo",
    badgeType: "",
    featured: true,
  },
  {
    id: "asg-dan-wesson-6pl",
    name: "ASG Dan Wesson 6PL Silver",
    categoryLabel: "Traumatica",
    categoryHref: "traumaticas.html",
    price: 1450000,
    description: "Revolver de impacto visual premium con accesorios y acabado metalico.",
    imageSrc: "ASGDAN.jpeg",
    imagePosition: "center 36%",
    badge: "Oferta",
    badgeType: "offer",
    featured: true,
  },
  {
    id: "walther-p38",
    name: "Walther P38",
    categoryLabel: "Clasica",
    categoryHref: "airsoft.html",
    price: 1190000,
    description: "Modelo iconico con empunadura en madera y perfil de coleccion.",
    imageSrc: "waltherp38.jpeg",
    imagePosition: "center 34%",
    badge: "Top",
    badgeType: "",
    featured: true,
  },
];

function loadCart() {
  const savedCart = window.localStorage.getItem(storageKey);

  if (!savedCart) {
    return [];
  }

  try {
    return JSON.parse(savedCart);
  } catch {
    return [];
  }
}

let cart = loadCart();

function loadCategories() {
  const savedCategories = window.localStorage.getItem(categoryStorageKey);

  if (!savedCategories) {
    return [...defaultCategories];
  }

  try {
    const parsed = JSON.parse(savedCategories);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...defaultCategories];
  } catch {
    return [...defaultCategories];
  }
}

let categories = loadCategories();

function loadProducts() {
  const savedProducts = window.localStorage.getItem(productStorageKey);

  if (!savedProducts) {
    return [...defaultProducts];
  }

  try {
    const parsed = JSON.parse(savedProducts);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...defaultProducts];
  } catch {
    return [...defaultProducts];
  }
}

let products = loadProducts();

function ensureQuickCart() {
  if (document.body.classList.contains("has-quick-cart")) {
    return;
  }

  if (window.location.pathname.endsWith("/carrito.html") || window.location.pathname.endsWith("carrito.html")) {
    return;
  }

  const widget = document.createElement("aside");
  widget.className = "quick-cart";
  widget.id = "quick-cart";
  widget.hidden = true;
  widget.innerHTML = `
    <div class="quick-cart-header">
      <div class="quick-cart-title">
        <img class="quick-cart-icon" src="cart-icon.svg" alt="" aria-hidden="true" />
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

function getItemMarkup(item, compact = false) {
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
    button.addEventListener("click", () => {
      updateQuantity(button.dataset.id ?? "", 1);
    });
  });

  scope.querySelectorAll("[data-action='decrease']").forEach((button) => {
    button.addEventListener("click", () => {
      updateQuantity(button.dataset.id ?? "", -1);
    });
  });

  scope.querySelectorAll(".cart-remove").forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(button.dataset.removeId);
    });
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

function saveCategories() {
  window.localStorage.setItem(categoryStorageKey, JSON.stringify(categories));
}

function saveProducts() {
  window.localStorage.setItem(productStorageKey, JSON.stringify(products));
}

function populateCategoryHrefOptions() {
  if (!categoryHrefInput) {
    return;
  }

  categoryHrefInput.innerHTML = categoryPageOptions
    .map((option) => `<option value="${option.value}">${option.label} (${option.value})</option>`)
    .join("");
}

function createProductCard(product) {
  const badgeClass = product.badgeType ? `product-badge ${product.badgeType}` : "product-badge";
  const safeBadge = product.badge || "Nuevo";
  const backgroundStyle = [
    "linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.68))",
    `url("${product.imageSrc}")`,
    "linear-gradient(145deg, #18271c, #070907)",
  ].join(", ");
  const position = product.imagePosition || "center";

  return `
    <article class="product-card">
      <div class="${badgeClass}">${safeBadge}</div>
      <div class="product-art" style="background-image: ${backgroundStyle}; background-position: center, ${position}, center; background-size: cover, cover, cover;"></div>
      <div class="product-info">
        <p class="product-category">${product.categoryLabel}</p>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-footer">
          <strong>${formatCurrency(product.price)}</strong>
          <button
            class="add-to-cart"
            type="button"
            data-id="${product.id}"
            data-name="${product.name}"
            data-price="${product.price}"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  `;
}

function bindAddToCart(scope = document) {
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
    categoryGrid.innerHTML = '<p class="cart-empty">No hay categorias configuradas.</p>';
    return;
  }

  categoryGrid.innerHTML = categories
    .map(
      (category) => `
        <a class="category-link" href="${category.href}">
          <article class="category-card">
            <span>${category.number}</span>
            <h3>${category.title}</h3>
            <p>${category.description}</p>
          </article>
        </a>
      `
    )
    .join("");
}

function populateProductCategoryOptions() {
  if (!productCategoryHrefInput) {
    return;
  }

  productCategoryHrefInput.innerHTML = categories
    .map((category) => `<option value="${category.href}">${category.title} (${category.href})</option>`)
    .join("");
}

function renderFeaturedProducts() {
  if (!featuredProductGrid) {
    return;
  }

  const featuredProducts = products.filter((product) => product.featured).slice(0, 6);

  if (featuredProducts.length === 0) {
    featuredProductGrid.innerHTML = '<p class="product-empty">No hay productos destacados configurados.</p>';
    return;
  }

  featuredProductGrid.innerHTML = featuredProducts.map((product) => createProductCard(product)).join("");
  bindAddToCart(featuredProductGrid);
}

function renderCategoryPage() {
  if (!categoryProductGrid) {
    return;
  }

  const currentCategoryHref = document.body.dataset.categoryHref ?? "";
  const currentCategory = categories.find((item) => item.href === currentCategoryHref);
  const categoryProducts = products.filter((product) => product.categoryHref === currentCategoryHref);

  if (currentCategory) {
    if (categoryTitle) {
      categoryTitle.textContent = currentCategory.title;
    }

    if (categoryDescription) {
      categoryDescription.textContent = currentCategory.description;
    }

    if (categoryTag) {
      categoryTag.textContent = currentCategory.tag || "Categoria TREX";
    }

    if (categoryHeading) {
      categoryHeading.textContent = `Productos disponibles en ${currentCategory.title}.`;
    }
  }

  if (categoryProducts.length === 0) {
    categoryProductGrid.innerHTML = '<p class="product-empty">No hay productos asignados a esta categoria.</p>';
    return;
  }

  categoryProductGrid.innerHTML = categoryProducts.map((product) => createProductCard(product)).join("");
  bindAddToCart(categoryProductGrid);
}

function resetCategoryForm() {
  if (!categoryForm) {
    return;
  }

  categoryForm.reset();
  populateCategoryHrefOptions();
  if (categoryIdInput) {
    categoryIdInput.value = "";
  }
}

function populateCategoryForm(categoryId) {
  const category = categories.find((item) => item.id === categoryId);

  if (!category || !categoryIdInput || !categoryNumberInput || !categoryTitleInput || !categoryDescriptionInput || !categoryHrefInput || !categoryTagInput) {
    return;
  }

  populateCategoryHrefOptions();
  categoryIdInput.value = category.id;
  categoryNumberInput.value = category.number;
  categoryTitleInput.value = category.title;
  categoryDescriptionInput.value = category.description;
  categoryHrefInput.value = category.href;
  categoryTagInput.value = category.tag ?? "";
}

function resetProductForm() {
  if (!productForm) {
    return;
  }

  productForm.reset();

  if (productIdInput) {
    productIdInput.value = "";
  }

  if (productFeaturedInput) {
    productFeaturedInput.checked = true;
  }

  populateProductCategoryOptions();
}

function populateProductForm(productId) {
  const product = products.find((item) => item.id === productId);

  if (
    !product ||
    !productIdInput ||
    !productNameInput ||
    !productCategoryLabelInput ||
    !productCategoryHrefInput ||
    !productPriceInput ||
    !productDescriptionInput ||
    !productImageSrcInput ||
    !productImagePositionInput ||
    !productBadgeInput ||
    !productBadgeTypeInput ||
    !productFeaturedInput
  ) {
    return;
  }

  populateProductCategoryOptions();
  productIdInput.value = product.id;
  productNameInput.value = product.name;
  productCategoryLabelInput.value = product.categoryLabel;
  productCategoryHrefInput.value = product.categoryHref;
  productPriceInput.value = String(product.price);
  productDescriptionInput.value = product.description;
  productImageSrcInput.value = product.imageSrc;
  productImagePositionInput.value = product.imagePosition || "";
  productBadgeInput.value = product.badge || "";
  productBadgeTypeInput.value = product.badgeType || "";
  productFeaturedInput.checked = Boolean(product.featured);
}

function renderAdminCategories() {
  if (!adminCategoryList) {
    return;
  }

  if (categories.length === 0) {
    adminCategoryList.innerHTML = '<p class="cart-empty">No hay categorias configuradas.</p>';
    return;
  }

  adminCategoryList.innerHTML = categories
    .map(
      (category) => `
        <article class="admin-item">
          <div class="admin-item-top">
            <div>
              <p class="eyebrow">${category.number}</p>
              <h3>${category.title}</h3>
              <p class="admin-item-meta">${category.description}</p>
            </div>
            <div class="admin-item-actions">
              <button class="admin-btn" type="button" data-edit-category="${category.id}">Editar</button>
              <button class="admin-btn delete" type="button" data-delete-category="${category.id}">Eliminar</button>
            </div>
          </div>
          <p class="admin-item-meta">
            Etiqueta: ${category.tag || "Sin etiqueta"}
          </p>
          <a class="admin-item-link" href="${category.href}">${category.href}</a>
        </article>
      `
    )
    .join("");

  adminCategoryList.querySelectorAll("[data-edit-category]").forEach((button) => {
    button.addEventListener("click", () => {
      populateCategoryForm(button.dataset.editCategory ?? "");
    });
  });

  adminCategoryList.querySelectorAll("[data-delete-category]").forEach((button) => {
    button.addEventListener("click", () => {
      categories = categories.filter((item) => item.id !== button.dataset.deleteCategory);
      saveCategories();
      renderCategories();
      renderAdminCategories();
      resetCategoryForm();
    });
  });
}

function renderAdminProducts() {
  if (!adminProductList) {
    return;
  }

  if (products.length === 0) {
    adminProductList.innerHTML = '<p class="cart-empty">No hay productos configurados.</p>';
    return;
  }

  adminProductList.innerHTML = products
    .map(
      (product) => `
        <article class="admin-item">
          <div class="admin-item-top">
            <div>
              <p class="eyebrow">${product.categoryLabel}</p>
              <h3>${product.name}</h3>
              <p class="admin-item-meta">${product.description}</p>
            </div>
            <div class="admin-item-actions">
              <button class="admin-btn" type="button" data-edit-product="${product.id}">Editar</button>
              <button class="admin-btn delete" type="button" data-delete-product="${product.id}">Eliminar</button>
            </div>
          </div>
          <span class="admin-item-chip">${formatCurrency(product.price)}</span>
          <p class="admin-item-meta">Destino: ${product.categoryHref}</p>
          <a class="admin-item-link" href="${product.imageSrc}">${product.imageSrc}</a>
        </article>
      `
    )
    .join("");

  adminProductList.querySelectorAll("[data-edit-product]").forEach((button) => {
    button.addEventListener("click", () => {
      populateProductForm(button.dataset.editProduct ?? "");
    });
  });

  adminProductList.querySelectorAll("[data-delete-product]").forEach((button) => {
    button.addEventListener("click", () => {
      products = products.filter((item) => item.id !== button.dataset.deleteProduct);
      saveProducts();
      renderFeaturedProducts();
      renderCategoryPage();
      renderAdminProducts();
      resetProductForm();
    });
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

  window.localStorage.setItem(storageKey, JSON.stringify(cart));

  if (cartItemsContainer) {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="cart-empty">Tu carrito esta vacio.</p>';
    } else {
      cartItemsContainer.innerHTML = cart.map((item) => getItemMarkup(item)).join("");
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

  quickCartBody.innerHTML = cart.slice(0, 3).map((item) => getItemMarkup(item, true)).join("");
  bindCartControls(quickCartBody);
}

function addToCart(product) {
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
}

function removeFromCart(productId) {
  const productIndex = cart.findIndex((item) => item.id === productId);

  if (productIndex === -1) {
    return;
  }

  if (cart[productIndex].quantity > 1) {
    cart[productIndex].quantity -= 1;
  } else {
    cart.splice(productIndex, 1);
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

function clearCart() {
  cart = [];
  renderCart();
}

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

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    addToCart({
      id: button.dataset.id ?? "",
      name: button.dataset.name ?? "Producto TREX",
      price: Number(button.dataset.price ?? 0),
    });
  });
});

if (clearCartButton) {
  clearCartButton.addEventListener("click", () => {
    clearCart();
  });
}

if (categoryForm && categoryIdInput && categoryNumberInput && categoryTitleInput && categoryDescriptionInput && categoryHrefInput && categoryTagInput) {
  categoryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const categoryPayload = {
      id: categoryIdInput.value || `cat-${Date.now()}`,
      number: categoryNumberInput.value.trim(),
      title: categoryTitleInput.value.trim(),
      description: categoryDescriptionInput.value.trim(),
      href: categoryHrefInput.value.trim(),
      tag: categoryTagInput.value.trim(),
    };

    const existingIndex = categories.findIndex((item) => item.id === categoryPayload.id);

    if (existingIndex >= 0) {
      categories[existingIndex] = categoryPayload;
    } else {
      categories.push(categoryPayload);
    }

    saveCategories();
    renderCategories();
    renderCategoryPage();
    populateProductCategoryOptions();
    renderAdminCategories();
    resetCategoryForm();
  });
}

if (categoryCancelButton) {
  categoryCancelButton.addEventListener("click", () => {
    resetCategoryForm();
  });
}

if (resetCategoriesButton) {
  resetCategoriesButton.addEventListener("click", () => {
    categories = [...defaultCategories];
    saveCategories();
    renderCategories();
    renderCategoryPage();
    populateProductCategoryOptions();
    renderAdminCategories();
    resetCategoryForm();
  });
}

if (
  productForm &&
  productIdInput &&
  productNameInput &&
  productCategoryLabelInput &&
  productCategoryHrefInput &&
  productPriceInput &&
  productDescriptionInput &&
  productImageSrcInput &&
  productImagePositionInput &&
  productBadgeInput &&
  productBadgeTypeInput &&
  productFeaturedInput
) {
  productForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const productPayload = {
      id: productIdInput.value || `prod-${Date.now()}`,
      name: productNameInput.value.trim(),
      categoryLabel: productCategoryLabelInput.value.trim(),
      categoryHref: productCategoryHrefInput.value.trim(),
      price: Number(productPriceInput.value || 0),
      description: productDescriptionInput.value.trim(),
      imageSrc: productImageSrcInput.value.trim(),
      imagePosition: productImagePositionInput.value.trim() || "center",
      badge: productBadgeInput.value.trim(),
      badgeType: productBadgeTypeInput.value,
      featured: productFeaturedInput.checked,
    };

    const existingIndex = products.findIndex((item) => item.id === productPayload.id);

    if (existingIndex >= 0) {
      products[existingIndex] = productPayload;
    } else {
      products.push(productPayload);
    }

    saveProducts();
    renderFeaturedProducts();
    renderCategoryPage();
    renderAdminProducts();
    resetProductForm();
  });
}

if (productCancelButton) {
  productCancelButton.addEventListener("click", () => {
    resetProductForm();
  });
}

checkoutButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (cart.length === 0) {
      return;
    }

    const messageLines = [
      "Hola TREX, quiero finalizar este pedido:",
      "",
      ...cart.map(
        (item, index) =>
          `${index + 1}. ${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}`
      ),
      "",
      `Total: ${formatCurrency(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))}`,
    ];

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageLines.join("\n"))}`;
    window.open(whatsappUrl, "_blank", "noopener");
  });
});

populateCategoryHrefOptions();
renderCategories();
populateProductCategoryOptions();
renderAdminCategories();
renderFeaturedProducts();
renderCategoryPage();
renderAdminProducts();
renderCart();
