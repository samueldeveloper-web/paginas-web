import { CATEGORY_ROUTES, DEFAULT_CATEGORIES, ROUTES } from "./constants.js";
import { supabase, storageBucket } from "./config.js";
import { normalizeImageSrc, sanitizeFilename } from "./utils.js";

const requireSupabase = () => {
  if (!supabase) throw new Error("Falta configurar Supabase en shared/js/app-config.js");
  return supabase;
};

export const fetchCategories = async ({ admin = false } = {}) => {
  let query = requireSupabase()
    .from("categories")
    .select("id, number_label, title, description, href, slug, tag, is_published")
    .order("number_label", { ascending: true });

  if (!admin) query = query.eq("is_published", true);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((category) => ({
    ...category,
    slug: category.slug || decodeURIComponent(category.href?.split("slug=")[1] || ""),
  }));
};

export const fetchProducts = async ({ admin = false } = {}) => {
  let query = requireSupabase()
    .from("products")
    .select(
      "id, category_id, category_label, name, description, price_cop, image_src, image_position, badge, badge_type, is_featured, is_published"
    )
    .order("created_at", { ascending: false });

  if (!admin) query = query.eq("is_published", true);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((product) => ({ ...product, image_src: normalizeImageSrc(product.image_src) }));
};

export const saveCategory = async ({ categoryId, payload }) => {
  const query = categoryId
    ? requireSupabase().from("categories").update(payload).eq("id", categoryId)
    : requireSupabase().from("categories").insert(payload);

  const { error } = await query;
  if (error) throw error;
};

export const deleteCategory = async (categoryId) => {
  const { error } = await requireSupabase().from("categories").delete().eq("id", categoryId);
  if (error) throw error;
};

export const saveProduct = async ({ productId, payload }) => {
  const query = productId
    ? requireSupabase().from("products").update(payload).eq("id", productId)
    : requireSupabase().from("products").insert(payload);

  const { error } = await query;
  if (error) throw error;
};

export const deleteProduct = async (productId) => {
  const { error } = await requireSupabase().from("products").delete().eq("id", productId);
  if (error) throw error;
};

export const uploadProductImage = async ({ file, category }) => {
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "";
  const safeName = sanitizeFilename(file.name) || `producto-${Date.now()}`;
  const filePath = `${category.slug}/${Date.now()}-${safeName}${extension ? `.${extension.toLowerCase()}` : ""}`;

  const { error } = await requireSupabase().storage.from(storageBucket).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) throw error;

  const { data } = requireSupabase().storage.from(storageBucket).getPublicUrl(filePath);
  if (!data?.publicUrl) throw new Error("La imagen subio, pero no se pudo obtener la URL publica.");

  return data.publicUrl;
};

export const restoreDefaultCategories = async (userId) => {
  const rows = DEFAULT_CATEGORIES.map((category) => ({
    ...category,
    href: CATEGORY_ROUTES[category.slug] || `${ROUTES.dynamicCategory}?slug=${encodeURIComponent(category.slug)}`,
    is_published: true,
    created_by: userId,
  }));

  const { error } = await requireSupabase().from("categories").upsert(rows, { onConflict: "slug" });
  if (error) throw error;
};
