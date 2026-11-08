import View from './View.js';

// The form lives in a <dialog> opened by the "+" buttons.
export default class FormView extends View {
  open() {
    if (!this._parent.open) this._parent.showModal();
  }

  close() {
    if (this._parent.open) this._parent.close();
  }

  addHandlerOpen(handler) {
    document.querySelector('.open-form').addEventListener('click', () => handler());
  }

  addHandlerSubmit(handler) {
    this._parent.addEventListener('submit', (e) => {
      e.preventDefault();
      handler(Object.fromEntries(new FormData(e.target)));
    });
  }

  // Runs for the Cancel button and for Esc / any other way the dialog closes.
  addHandlerCancel(handler) {
    this._parent.addEventListener('click', (e) => {
      if (e.target.closest('[data-action="cancel"]')) handler();
    });
    this._parent.addEventListener('close', () => handler());
  }

  _generateMarkup() {
    const { days, priorities, editing, values, error } = this._data;
    const v = { title: '', day: days[0], priority: 'Medium', minutes: 30, ...values };
    const options = (list, selected) =>
      list.map((o) => `<option${o === selected ? ' selected' : ''}>${this._escape(o)}</option>`).join('');

    return `
      <h2>${editing ? 'Edit task' : 'Add a task'}</h2>
      <form class="form" novalidate>
        <label>Title
          <input name="title" type="text" value="${this._escape(v.title)}" autocomplete="off">
        </label>
        <label>Day
          <select name="day">${options(days, v.day)}</select>
        </label>
        <label>Priority
          <select name="priority">${options(priorities, v.priority)}</select>
        </label>
        <label>Estimated minutes
          <input name="minutes" type="number" step="5" value="${this._escape(v.minutes)}">
        </label>
        ${error ? `<p class="error" role="alert">${this._escape(error)}</p>` : ''}
        <div class="form-actions">
          <button class="btn btn-primary" type="submit">${editing ? 'Save changes' : 'Add task'}</button>
          <button class="btn" type="button" data-action="cancel">Cancel</button>
        </div>
      </form>`;
  }
}
