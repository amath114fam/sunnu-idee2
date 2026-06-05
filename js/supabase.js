import { createClient } from '@supabase/supabase-js' 
import { renderIdeas } from './dom.js' 

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY); 

export async function getIdeas() {
  try {
    const { data, error } = await supabaseClient.from('ideas').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    console.log('Erreur  :', error);
    return [];
  }
}

export async function saveIdeas(newIdea) {
  try {
    const { error } = await supabaseClient.from('ideas').insert(newIdea);
    if (error) throw error;
  } catch (error) {
    console.log('Erreur saveIdea :', error);
  }
}

export async function updateIdeaDB(id, title, category, description) {
  try {
    const { error } = await supabaseClient.from('ideas').update({ title, category, description }).eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.log('Erreur updateIdeaDB :', error);
  }
}

export async function deleteIdeaDB(id) {
  try {
    const { error } = await supabaseClient.from('ideas').delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.log('Erreur deleteIdeaDB :', error);
  }
}

const channel = supabaseClient
  .channel("realtime:ideas")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "ideas" },
    () => {
      renderIdeas();
  
    }
  )
  .subscribe();