import { ROUTES } from "../../shared/js/constants.js";
import { hasSupabaseConfig } from "../../shared/js/config.js";
import { loginAdmin, redirectLoggedAdmin } from "../../shared/js/auth.js";
import { initBaseUi } from "../../shared/js/ui.js";
import { $, setStatusMessage } from "../../shared/js/utils.js";

initBaseUi({ quickCart: false });

const form = $("#login-form");
const status = $("#login-status");

if (!hasSupabaseConfig) {
  setStatusMessage(status, "Configura Supabase en shared/js/app-config.js para iniciar sesion.", true);
} else {
  await redirectLoggedAdmin();
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatusMessage(status, "Validando credenciales...");

  try {
    await loginAdmin({
      email: $("#login-email")?.value.trim(),
      password: $("#login-password")?.value,
    });
    window.location.replace(ROUTES.admin);
  } catch (error) {
    setStatusMessage(status, error.message, true);
  }
});
