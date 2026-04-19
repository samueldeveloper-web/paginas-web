const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const year = document.querySelector("#year");
const cartItemsContainer = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const cartCount = document.querySelector("#cart-count");
const addToCartButtons = document.querySelectorAll(".add-to-cart");
const cartItemsTotal = document.querySelector("#cart-items-total");
const clearCartButton = document.querySelector("#clear-cart");
let quickCart;
let quickCartBody;
let quickCartTotal;
let quickCartCount;

const storageKey = "trex-cart";

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

renderCart();
