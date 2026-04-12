const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const year = document.querySelector("#year");
const cartTrigger = document.querySelector(".cart-trigger");
const cartPanel = document.querySelector("#cart-panel");
const cartOverlay = document.querySelector("#cart-overlay");
const cartClose = document.querySelector(".cart-close");
const cartItemsContainer = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const cartCount = document.querySelector("#cart-count");
const addToCartButtons = document.querySelectorAll(".add-to-cart");

const cart = [];

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

function setCartOpen(isOpen) {
  if (!cartPanel || !cartTrigger || !cartOverlay) {
    return;
  }

  cartPanel.classList.toggle("is-open", isOpen);
  cartPanel.setAttribute("aria-hidden", String(!isOpen));
  cartTrigger.setAttribute("aria-expanded", String(isOpen));
  cartOverlay.hidden = !isOpen;
}

function renderCart() {
  if (!cartItemsContainer || !cartTotal || !cartCount) {
    return;
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = String(totalItems);
  cartTotal.textContent = formatCurrency(totalPrice);

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="cart-empty">Tu carrito esta vacio.</p>';
    return;
  }

  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <article class="cart-item">
          <div>
            <strong class="cart-item-name">${item.name}</strong>
            <span class="cart-item-meta">Cantidad: ${item.quantity}</span>
            <span class="cart-item-meta">${formatCurrency(item.price)}</span>
          </div>
          <button class="cart-remove" type="button" data-remove-id="${item.id}">Quitar</button>
        </article>
      `
    )
    .join("");

  cartItemsContainer.querySelectorAll(".cart-remove").forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(button.dataset.removeId);
    });
  });
}

function addToCart(product) {
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  setCartOpen(true);
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

if (cartTrigger && cartClose && cartOverlay) {
  cartTrigger.addEventListener("click", () => {
    const isOpen = !cartPanel?.classList.contains("is-open");
    setCartOpen(Boolean(isOpen));
  });

  cartClose.addEventListener("click", () => {
    setCartOpen(false);
  });

  cartOverlay.addEventListener("click", () => {
    setCartOpen(false);
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

renderCart();
