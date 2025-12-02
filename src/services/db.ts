import { supabase } from "../lib/supabase";
import type { Entity } from "../logic/EntitySystem";

// Mock User ID for prototype (in real app, use Auth)
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

export interface DBUser {
  id: string;
  username: string;
  resources: any;
  authority_tier: string;
}

export const DBService = {
  async getUser(userId: string = DEMO_USER_ID) {
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

  async createUser(username: string = "New Kingdom") {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          id: DEMO_USER_ID, // Force ID for demo
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

  async saveState(resources: any, _factions: Entity[]) {
    // 1. Update Resources
    const { error: userError } = await supabase
      .from("users")
      .update({ resources })
      .eq("id", DEMO_USER_ID);

    if (userError) console.error("Error saving resources:", userError);

    // 2. Update Factions (Upsert)
    // Note: In real app, we'd map local IDs to DB UUIDs properly.
    // For prototype, we assume they exist or we recreate them.
    // This is a simplified sync.
    /* 
    const updates = factions.map(f => ({
      user_id: DEMO_USER_ID,
      name: f.name,
      type: f.type,
      loyalty: f.loyalty,
      power: f.power,
      tags: f.tags
    }));
    
    const { error: factionError } = await supabase
      .from('internal_entities')
      .upsert(updates, { onConflict: 'name,user_id' }); // Requires unique constraint
      
    if (factionError) console.error('Error saving factions:', factionError);
    */
  },
};
