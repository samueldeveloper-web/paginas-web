import {
  deleteCategory,
  deleteProduct,
  fetchCategories,
  fetchProducts,
  restoreDefaultCategories,
  saveCategory,
  saveProduct,
  uploadProductImage,
} from "../../shared/js/api.js";
import { hasSupabaseConfig } from "../../shared/js/config.js";
import { logout, verifyAdminSession } from "../../shared/js/auth.js";
import {
  initBaseUi,
  populateProductCategoryOptions,
  renderAdminCategories,
  renderAdminProducts,
} from "../../shared/js/ui.js";
import { $, getCategoryUrl, getNextCategoryNumber, normalizeSlug, setStatusMessage } from "../../shared/js/utils.js";

let categories = [];
let products = [];
let currentUser = null;

const authStatus = $("#auth-status");
const adminApp = $("#admin-app");
const authMessage = $("#auth-message");
const categoryForm = $("#category-form");
const productForm = $("#product-form");
const imageStatus = $("#product-image-status");

const refreshAdmin = async () => {
  [categories, products] = await Promise.all([fetchCategories({ admin: true }), fetchProducts({ admin: true })]);
  populateProductCategoryOptions(categories);
  renderAdminCategories({ categories, onEdit: fillCategoryForm, onDelete: handleDeleteCategory });
  renderAdminProducts({ products, onEdit: fillProductForm, onDelete: handleDeleteProduct });
};

const resetCategoryForm = () => {
  categoryForm?.reset();
  if ($("#category-id")) $("#category-id").value = "";
};

const resetProductForm = () => {
  productForm?.reset();
  populateProductCategoryOptions(categories);
  if ($("#product-id")) $("#product-id").value = "";
  if ($("#product-image-src")) $("#product-image-src").value = "";
  if ($("#product-image-file")) $("#product-image-file").value = "";
  if ($("#product-featured")) $("#product-featured").checked = true;
  setStatusMessage(imageStatus, "");
};

const fillCategoryForm = (categoryId) => {
  const category = categories.find(({ id }) => id === categoryId);
  if (!category) return;

  $("#category-id").value = category.id;
  $("#category-title").value = category.title;
  $("#category-description").value = category.description;
  $("#category-slug").value = category.slug;
  $("#category-tag").value = category.tag || "";
};

const fillProductForm = (productId) => {
  const product = products.find(({ id }) => id === productId);
  if (!product) return;

  populateProductCategoryOptions(categories);
  $("#product-id").value = product.id;
  $("#product-name").value = product.name;
  $("#product-category-id").value = product.category_id;
  $("#product-price").value = String(product.price_cop);
  $("#product-description").value = product.description;
  $("#product-image-src").value = product.image_src;
  $("#product-badge").value = product.badge || "";
  $("#product-badge-type").value = product.badge_type || "";
  $("#product-featured").checked = Boolean(product.is_featured);
  setStatusMessage(imageStatus, "Imagen lista. Puedes reemplazarla subiendo otro archivo.");
};

const handleSaveCategory = async () => {
  const categoryId = $("#category-id")?.value.trim();
  const slug = normalizeSlug($("#category-slug")?.value);
  const existing = categories.find(({ id }) => id === categoryId);

  if (!slug) {
    setStatusMessage(authStatus, "Debes ingresar un slug valido para la categoria.", true);
    return;
  }

  await saveCategory({
    categoryId,
    payload: {
      number_label: existing?.number_label || getNextCategoryNumber(categories),
      title: $("#category-title").value.trim(),
      description: $("#category-description").value.trim(),
      slug,
      href: getCategoryUrl(slug),
      tag: $("#category-tag").value.trim(),
      is_published: true,
      created_by: currentUser.id,
    },
  });

  await refreshAdmin();
  resetCategoryForm();
  setStatusMessage(authStatus, "Categoria guardada correctamente.");
};

const handleDeleteCategory = async (categoryId) => {
  await deleteCategory(categoryId);
  await refreshAdmin();
  resetCategoryForm();
  setStatusMessage(authStatus, "Categoria eliminada correctamente.");
};

const handleSaveProduct = async () => {
  const selectedCategory = categories.find(({ id }) => id === $("#product-category-id")?.value);
  if (!selectedCategory) {
    setStatusMessage(authStatus, "Selecciona una categoria destino valida.", true);
    return;
  }

  await saveProduct({
    productId: $("#product-id")?.value.trim(),
    payload: {
      category_id: selectedCategory.id,
      category_label: selectedCategory.title,
      name: $("#product-name").value.trim(),
      description: $("#product-description").value.trim(),
      price_cop: Number($("#product-price").value || 0),
      image_src: $("#product-image-src").value.trim(),
      image_position: "center",
      badge: $("#product-badge").value.trim(),
      badge_type: $("#product-badge-type").value,
      is_featured: $("#product-featured").checked,
      is_published: true,
      created_by: currentUser.id,
    },
  });

  await refreshAdmin();
  resetProductForm();
  setStatusMessage(authStatus, "Producto guardado correctamente.");
};

const handleDeleteProduct = async (productId) => {
  await deleteProduct(productId);
  await refreshAdmin();
  resetProductForm();
  setStatusMessage(authStatus, "Producto eliminado correctamente.");
};

const bindAdminEvents = () => {
  $("#logout-button")?.addEventListener("click", logout);
  $("#category-cancel")?.addEventListener("click", resetCategoryForm);
  $("#product-cancel")?.addEventListener("click", resetProductForm);

  categoryForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await runAdminAction(handleSaveCategory);
  });

  productForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await runAdminAction(handleSaveProduct);
  });

  $("#upload-image-button")?.addEventListener("click", async () => {
    await runAdminAction(async () => {
      const file = $("#product-image-file")?.files?.[0];
      const category = categories.find(({ id }) => id === $("#product-category-id")?.value);

      if (!file) {
        setStatusMessage(imageStatus, "Selecciona un archivo antes de subirlo.", true);
        return;
      }

      if (!category) {
        setStatusMessage(imageStatus, "Selecciona primero una categoria destino.", true);
        return;
      }

      setStatusMessage(imageStatus, "Subiendo imagen...");
      $("#product-image-src").value = await uploadProductImage({ file, category });
      $("#product-image-file").value = "";
      setStatusMessage(imageStatus, "Imagen subida correctamente.");
    });
  });

  $("#reset-categories")?.addEventListener("click", async () => {
    await runAdminAction(async () => {
      await restoreDefaultCategories(currentUser.id);
      await refreshAdmin();
      setStatusMessage(authStatus, "Categorias restauradas.");
    });
  });
};

const runAdminAction = async (action) => {
  try {
    await action();
  } catch (error) {
    setStatusMessage(authStatus, error.message, true);
  }
};

initBaseUi({ quickCart: false });

if (!hasSupabaseConfig) {
  setStatusMessage(authStatus, "Configura Supabase en shared/js/app-config.js para habilitar login y admin.", true);
} else {
  try {
    setStatusMessage(authStatus, "Validando sesion admin con Supabase...");
    const session = await verifyAdminSession();

    if (session) {
      currentUser = session.user;
      if (adminApp) adminApp.hidden = false;
      if (authMessage) authMessage.hidden = true;
      document.querySelectorAll("#admin-app .reveal").forEach((element) => element.classList.add("is-visible"));
      bindAdminEvents();
      await runAdminAction(refreshAdmin);
    }
  } catch (error) {
    if (authMessage) authMessage.hidden = false;
    setStatusMessage(authStatus, `No se pudo validar el acceso admin: ${error.message}`, true);
  }
}
