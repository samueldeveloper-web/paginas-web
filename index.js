import { fetchCategories, fetchProducts } from "./shared/js/api.js";
import { hasSupabaseConfig } from "./shared/js/config.js";
import { withErrorBoundary } from "./shared/js/errors.js";
import { initBaseUi, renderCategoryGrid, renderFeaturedProducts } from "./shared/js/ui.js";

initBaseUi();

if (hasSupabaseConfig) {
  await withErrorBoundary(async () => {
    const [categories, products] = await Promise.all([fetchCategories(), fetchProducts()]);
    renderCategoryGrid(categories);
    renderFeaturedProducts(products);
  });
}
