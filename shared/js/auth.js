import { ROUTES } from "./constants.js";
import { hasSupabaseConfig, supabase } from "./config.js";

export const ensureSupabase = () => {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error("Falta configurar Supabase en shared/js/app-config.js");
  }
};

export const getSessionUser = async () => {
  ensureSupabase();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user ?? null;
};

export const getProfile = async (userId) => {
  const { data, error } = await supabase.from("profiles").select("id, email, role").eq("id", userId).single();
  if (error) throw error;
  return data;
};

export const verifyAdminSession = async () => {
  const user = await getSessionUser();
  if (!user) {
    window.location.replace(ROUTES.login);
    return null;
  }

  const profile = await getProfile(user.id);
  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    window.location.replace(`${ROUTES.login}?error=not_admin`);
    return null;
  }

  return { user, profile };
};

export const loginAdmin = async ({ email, password }) => {
  ensureSupabase();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const user = await getSessionUser();
  if (!user) throw new Error("No se pudo validar la sesion con Supabase.");

  const profile = await getProfile(user.id);
  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    throw new Error("Tu usuario existe, pero no tiene rol admin.");
  }
};

export const logout = async () => {
  ensureSupabase();
  await supabase.auth.signOut();
  window.location.replace(ROUTES.login);
};

export const redirectLoggedAdmin = async () => {
  try {
    const user = await getSessionUser();
    if (!user) return;

    const profile = await getProfile(user.id);
    if (profile?.role === "admin") window.location.replace(ROUTES.admin);
  } catch {
    await supabase?.auth.signOut();
  }
};
