import { CART_STORAGE_KEY, WHATSAPP_NUMBER } from "./constants.js";
import { readJson, writeJson } from "./storage.js";
import { formatCurrency } from "./utils.js";

let cart = readJson(CART_STORAGE_KEY, []);
const subscribers = new Set();

const commit = () => {
  writeJson(CART_STORAGE_KEY, cart);
  subscribers.forEach((callback) => callback(cart));
};

export const onCartChange = (callback) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
};

export const getCart = () => [...cart];

export const getCartTotals = () => ({
  items: cart.reduce((sum, item) => sum + item.quantity, 0),
  price: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
});

export const addToCart = (product) => {
  const existing = cart.find(({ id }) => id === product.id);
  cart = existing
    ? cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
    : [...cart, { ...product, quantity: 1 }];
  commit();
};

export const updateQuantity = (productId, delta) => {
  cart = cart
    .map((item) => (item.id === productId ? { ...item, quantity: item.quantity + delta } : item))
    .filter(({ quantity }) => quantity > 0);
  commit();
};

export const removeFromCart = (productId) => {
  cart = cart.filter(({ id }) => id !== productId);
  commit();
};

export const clearCart = () => {
  cart = [];
  commit();
};

export const checkoutOnWhatsapp = () => {
  if (!cart.length) return;

  const total = getCartTotals().price;
  const lines = [
    "Hola TREX, quiero finalizar este pedido:",
    "",
    ...cart.map(
      ({ name, quantity, price }, index) =>
        `${index + 1}. ${name} x${quantity} - ${formatCurrency(price * quantity)}`
    ),
    "",
    `Total: ${formatCurrency(total)}`,
  ];

  window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
};
