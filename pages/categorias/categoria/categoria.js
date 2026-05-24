import { fetchCategories, fetchProducts } from "../../../shared/js/api.js";
import { hasSupabaseConfig } from "../../../shared/js/config.js";
import { withErrorBoundary } from "../../../shared/js/errors.js";
import { initBaseUi, renderCategoryPage } from "../../../shared/js/ui.js";
import { getCurrentCategorySlug } from "../../../shared/js/utils.js";

initBaseUi();

if (hasSupabaseConfig) {
  await withErrorBoundary(async () => {
    const [categories, products] = await Promise.all([fetchCategories(), fetchProducts()]);
    renderCategoryPage({ categories, products, slug: getCurrentCategorySlug() });
  });
}
