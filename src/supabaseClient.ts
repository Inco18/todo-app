import { createClient } from "@supabase/supabase-js";
import { Database } from "./types/supabase.types";

export const supabase = createClient<Database>(
  "https://vllwvygnhmjdizetutvj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbHd2eWduaG1qZGl6ZXR1dHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk5MTkwNzcsImV4cCI6MjAzNTQ5NTA3N30.wy0jP4pC3OIGpjW_Qy3pUr77D49y8oCpDf0j4XDhtFo"
);
