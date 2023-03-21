import { createClient } from "@supabase/supabase-js";

import { config } from "../Config";

export const supabase = createClient(config.supabase.uri, config.supabase.anonKey);
