import { inputTitle, inputCategory, inputDesc } from './dom.js'

const titleError    = document.getElementById('titleError');
const categoryError = document.getElementById('categoryError');
const descError     = document.getElementById('descError');
const modalError    = document.getElementById('modalError');

export function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function validateTitle() {
  const value = inputTitle.value.trim();

  if (!value) {
    inputTitle.classList.add("is-invalid");
    inputTitle.classList.remove("is-valid");
    titleError.textContent = "Le titre est obligatoire.";
    return false;
  }

  if (value.length < 3) {
    inputTitle.classList.add("is-invalid");
    inputTitle.classList.remove("is-valid");
    titleError.textContent = "Le titre doit contenir au moins 3 caractères.";
    return false;
  }

  inputTitle.classList.remove("is-invalid");
  inputTitle.classList.add("is-valid");
  titleError.textContent = "";
  return true;
}

export function validateCategory() {
  const value = inputCategory.value.trim();

  if (!value) {
    inputCategory.classList.add("is-invalid");
    inputCategory.classList.remove("is-valid");
    categoryError.textContent = "Veuillez sélectionner une catégorie.";
    return false;
  }

  inputCategory.classList.remove("is-invalid");
  inputCategory.classList.add("is-valid");
  categoryError.textContent = "";
  return true;
}

export function validateDescription() {
  const value = inputDesc.value.trim();

  if (!value) {
    inputDesc.classList.add("is-invalid");
    inputDesc.classList.remove("is-valid");
    descError.textContent = "La description est obligatoire.";
    return false;
  }

  if (value.length < 5) {
    inputDesc.classList.add("is-invalid");
    inputDesc.classList.remove("is-valid");
    descError.textContent = "La description doit contenir au moins 10 caractères.";
    return false;
  }

  inputDesc.classList.remove("is-invalid");
  inputDesc.classList.add("is-valid");
  descError.textContent = "";
  return true;
}

export function validateModal() {
  modalError.textContent = "Veuillez remplir tous les champs !";
}

export function resetValidation() {
  [inputTitle, inputCategory, inputDesc].forEach(field => {
    field.classList.remove("is-valid", "is-invalid");
  });

  [titleError, categoryError, descError].forEach(error => {
    error.textContent = "";
  });
}

export function validateIdea() {
  const isTitleValid       = validateTitle();
  const isCategoryValid    = validateCategory();
  const isDescriptionValid = validateDescription();

  return isTitleValid && isCategoryValid && isDescriptionValid;
}

export function showNotification(notif) {
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.textContent = notif;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 3000);
}