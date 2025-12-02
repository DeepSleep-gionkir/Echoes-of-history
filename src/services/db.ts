import { supabase } from "../lib/supabase";
import type { Entity } from "../logic/EntitySystem";

export interface DBUser {
  id: string;
  username: string;
  resources: any;
  authority_tier: string;
}

export const DBService = {
  async getUser(userId: string) {
    if (!userId) return null;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }
    return data;
  },

  async createUser(userId: string, username: string = "New Kingdom") {
    if (!userId) return null;

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          id: userId,
          username,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      return null;
    }
    return data;
  },

  async saveState(userId: string, resources: any, _factions: Entity[]) {
    if (!userId) return;

    // 1. Update Resources
    const { error: userError } = await supabase
      .from("users")
      .update({ resources })
      .eq("id", userId);

    if (userError) console.error("Error saving resources:", userError);
  },
};
