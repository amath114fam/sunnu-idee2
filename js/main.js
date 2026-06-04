const filterButtons = document.querySelectorAll('[data-filter]');

filterButtons.forEach(button => {
  button.addEventListener('click', function() {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    renderIdeas(this.dataset.filter);
  });
});

async function addIdea() {
  const title       = sanitize(document.getElementById('idea-title').value.trim());
  const description = sanitize(document.getElementById('idea-description').value.trim());
  const category    = inputCategory.value;

  if (!validateIdea()) return;

  btnAdd.disabled = true;
  btnAdd.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Enregistrement...';

  const newIdea = {
    title       : title,
    category    : category,
    description : description
  };

  await saveIdeas(newIdea);
  await renderIdeas();

  inputTitle.value       = '';
  inputCategory.value    = '';
  inputDesc.value        = '';

  ResetCounter()

  resetValidation()

  btnAdd.disabled = false;
  btnAdd.innerHTML = '<i class="bi bi-send me-2"></i>Publier l\'idée';

}

async function deleteIdeaDB(id) {
  try {
    const { error } = await supabaseClient.from('ideas').delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.log('Erreur deleteIdea :', error);
  }
  await renderIdeas();
}

let ideaToDelete = null;

function deleteIdea(id) {
  ideaToDelete = id;
  const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
  modal.show();
}

async function confirmDelete() {
  if (ideaToDelete) {
    try {
      await deleteIdeaDB(ideaToDelete);
      await renderIdeas();
      ideaToDelete = null;
      bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
    } catch (error) {
      console.log('Erreur suppression :', error);
      alert('Une erreur est survenue, veuillez réessayer !');
    }
  }
};

document.getElementById('btn-confirm-delete').addEventListener('click',confirmDelete);

async function openEdit(id) {
  const ideas = await getIdeas();
  const idea = ideas.find(idea => idea.id === id);

  document.getElementById('edit-id').value          = idea.id;
  document.getElementById('edit-title').value       = idea.title;
  document.getElementById('edit-description').value = idea.description;
  document.getElementById('edit-category').value    = idea.category;

  const modal = new bootstrap.Modal(document.getElementById('editModal'));
  modal.show();
}

async function saveEdit() {
  const id          = Number(document.getElementById('edit-id').value);
  const title       = sanitize(document.getElementById('edit-title').value.trim());  
  const category    = document.getElementById('edit-category').value;
  const description = sanitize(document.getElementById('edit-description').value.trim());

  if (!title || !category || !description) {
    validateModal()
    return;
  }

  await updateIdeaDB(id, title, category, description);
  await renderIdeas();

  document.getElementById('btn-save-edit').blur();
  bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
}

async function search() {
  const query = document.getElementById('search').value;
  const ideas = await getIdeas();

  const filtered = ideas.filter(idea => 
    idea.title.toLowerCase().includes(query.toLowerCase())
  );

  ideasContainer.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
    ideasCount.textContent = 0;
    return;
  }

  emptyState.style.display = 'none';
  ideasCount.textContent = filtered.length;

  filtered.forEach(idea => {
    const col = document.createElement('div');
    col.className = 'col-md-6';
    col.innerHTML = buildCard(idea);
    ideasContainer.appendChild(col);
  });
}

btnAdd.addEventListener('click', addIdea);
document.getElementById('btn-save-edit').addEventListener('click', saveEdit);
document.getElementById('btnSearch').addEventListener('click', search);
document.getElementById('btn-suggest').addEventListener('click', suggestIdea);
inputTitle.addEventListener("blur", validateTitle)
inputCategory.addEventListener("blur", validateCategory)
inputDesc.addEventListener("blur", validateDescription)

renderIdeas();