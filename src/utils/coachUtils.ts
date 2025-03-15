import { supabase } from "../lib/supabase";

// Cache for coach names to avoid redundant fetches
const coachNamesCache = new Map<string, string>();

export async function fetchCoachNames(coachIds: string[]) {
  try {
    // Filter out IDs we already have cached
    const uncachedIds = coachIds.filter(id => !coachNamesCache.has(id));
    
    if (uncachedIds.length > 0) {
      // Query from user_profile table based on your actual schema
      const { data, error } = await supabase
        .from('user_profile')  // Your table is named 'user_profile' (singular)
        .select('user_id, Username')  // Column is capitalized 'Username'
        .in('user_id', uncachedIds);  // Foreign key is 'user_id'
      
      if (error) {
        console.error("Error fetching user profiles:", error);
        throw error;
      }
      
      console.log("Fetched profiles:", data);
      
      // Update cache with new data
      data?.forEach(user => {
        // Use Username from your schema
        coachNamesCache.set(user.user_id, user.Username || 'Unnamed');
      });
    }
    
    // Return a mapping for all requested IDs
    const result: Record<string, string> = {};
    coachIds.forEach(id => {
      result[id] = coachNamesCache.get(id) || 'Unknown';
    });
    
    return result;
  } catch (error) {
    console.error("Error fetching coach names:", error);
    return {};
  }
}