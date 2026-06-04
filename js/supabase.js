const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function getIdeas() {
  try {
    const { data, error } = await supabaseClient.from('ideas').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    console.log('Erreur  :', error);
    return [];
  }
}

async function saveIdeas(newIdea) {
  try {
    const { error } = await supabaseClient.from('ideas').insert(newIdea);
    if (error) throw error;
  } catch (error) {
    console.log('Erreur saveIdea :', error);
  }
}

async function updateIdeaDB(id, title, category, description) {
  try {
    const { error } = await supabaseClient.from('ideas').update({ title, category, description }).eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.log('Erreur updateIdeaDB :', error);
  }
}

async function deleteIdeaDB(id) {
  try {
    const { error } = await supabaseClient.from('ideas').delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.log('Erreur deleteIdeaDB :', error);
  }
}