// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ntrkxpwfmbvadkpeuoli.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50cmt4cHdmbWJ2YWRrcGV1b2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTcwNDAsImV4cCI6MjA2NjUzMzA0MH0.Gl5JaHdCoXeAPwCIzQKv_m5MQOXpZXqgw1acD7nbS0k";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);