import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const appConfig = window.TREX_CONFIG ?? {};
export const hasSupabaseConfig = Boolean(appConfig.supabaseUrl && appConfig.supabaseAnonKey);
export const storageBucket = appConfig.storageBucket || "trex-product-images";

export const supabase = hasSupabaseConfig
  ? createClient(appConfig.supabaseUrl, appConfig.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        storage: window.sessionStorage,
        detectSessionInUrl: true,
      },
    })
  : null;
