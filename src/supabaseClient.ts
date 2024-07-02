import { createClient } from "@supabase/supabase-js";
import { Database } from "./types/supabase.types";

export const supabase = createClient<Database>(
  "https://vllwvygnhmjdizetutvj.supabase.co",
  import.meta.env.VITE_SUPABASE_KEY
);
