import { saveIdeas } from './supabase.js'
import { renderIdeas, inputTitle, inputDesc,ResetCounter } from './dom.js'
import { sanitize, validateTitle, validateDescription, resetValidation, showNotification }  from './validation.js'

// const API_KEY = 
// console.log(API_KEY);


export async function suggestIdea() {
  const title       = sanitize(document.getElementById('idea-title').value.trim());
  const description = sanitize(document.getElementById('idea-description').value.trim());

  if (!title || !description) {
    validateTitle()
    validateDescription()
    return;
  }


  document.getElementById('btn-suggest').disabled = true;
  document.getElementById('btn-suggest').innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Analyse IA en cours...';


  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_KEY}`
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.3-70b-instruct",
      messages: [{ 
        role: 'user', 
        content: `Tu es un assistant pour une boîte à idées collaborative appelée Sunu-Idées.
        
À partir du titre : "${title}" et la description : "${description}"
Donne moi la catégorie correspondante parmi :
Pédagogie, Événement, Vie de campus, Amélioration technique

Réponds UNIQUEMENT en JSON sans aucun texte autour :
{
  "category": "une des catégories ci-dessus"
}` 
  }]
    })
  });

  const data = await response.json();
  const result = JSON.parse(data.choices[0].message.content);

  const newIdea = {
    title       : title,
    category    : result.category,
    description : description
  };
  
  await saveIdeas(newIdea);
  await renderIdeas();
  showNotification("L'idée ajoutée avec succès")

  inputTitle.value = '';
  inputDesc.value = '';

  ResetCounter()

  resetValidation()

  document.getElementById('btn-suggest').disabled = false;
  document.getElementById('btn-suggest').innerHTML = '<i class="bi bi-stars me-2"></i>Suggérer avec l\'IA';
}