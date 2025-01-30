// FormService.js
let formToEdit = null;

export const setFormToEdit = (form) => {
  formToEdit = form;
};

export const getFormToEdit = () => formToEdit;

export const clearFormToEdit = () => {
  formToEdit = null;
};
