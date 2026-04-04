import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { openDatabaseSync } from "expo-sqlite";
import type { Database } from "./database.types";

// expo-sqlite backed storage for Supabase auth sessions
const db = openDatabaseSync("supabase-storage.db");

db.execSync(
  "CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);"
);

const ExpoSQLiteStorage = {
  getItem(key: string): string | null {
    const row = db.getFirstSync<{ value: string }>(
      "SELECT value FROM kv WHERE key = ?;",
      [key]
    );
    return row?.value ?? null;
  },
  setItem(key: string, value: string): void {
    db.runSync(
      "INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?);",
      [key, value]
    );
  },
  removeItem(key: string): void {
    db.runSync("DELETE FROM kv WHERE key = ?;", [key]);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY env vars"
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSQLiteStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
