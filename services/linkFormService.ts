// linkFormService.js
let formToEdit: null = null;

export const setFormToEdit = (form: null) => {
  formToEdit = form;
};

export const getFormToEdit = () => formToEdit;

export const clearFormToEdit = () => {
  formToEdit = null;
};
