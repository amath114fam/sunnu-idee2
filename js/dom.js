import { getIdeas } from './supabase.js'

export const btnAdd         = document.getElementById('btn-add-idea');
export const inputTitle     = document.getElementById('idea-title');
export const inputCategory  = document.getElementById('idea-category');
export const inputDesc      = document.getElementById('idea-description');
export const ideasContainer = document.getElementById('ideas-container');
export const ideasCount     = document.getElementById('ideas-count');
export const emptyState     = document.getElementById('empty-state');

export function buildCard(idea) {
  return `
    <div class="card h-100 shadow-sm">
      <div class="card-body">
        <span class="badge mb-2 badge-${idea.category.replaceAll(' ', '-')}">${idea.category}</span>
        <h5 class="card-title">${idea.title}</h5>
        <p class="card-text text-muted">${idea.description}</p>
      </div>
      <div class="card-footer d-flex justify-content-end gap-2">
        <button class="btn btn-sm btn-outline-primary" onclick="openEdit(${idea.id})">
          <i class="bi bi-pencil"></i> Éditer
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteIdea(${idea.id})">
          <i class="bi bi-trash"></i> Supprimer
        </button>
      </div>
    </div>
  `;
}

export async function renderIdeas(filter = 'Tous') {
  const ideas = await getIdeas();

  const filtered = filter === 'Tous'
    ? ideas
    : ideas.filter(idea => idea.category === filter);

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

export function ResetCounter() {

    const remaining = 255;

    counter.textContent =
        `${remaining} caractères restants`;

}
export function updateCounter() {

    const remaining =
        255 - inputDesc.value.length;

    counter.textContent =
        `${remaining} caractères restants`;

}
inputDesc.addEventListener("input", updateCounter);

