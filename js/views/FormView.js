
import View from './View.js';

// The form lives in a <dialog> opened by the "+" buttons.
export default class FormView extends View {
  open() {
    if (!this._parent.open) this._parent.showModal();
  }

  close() {
    if (this._parent.open) this._parent.close();
  }

  // Allow all buttons with the open-form class to open the dialog.
  addHandlerOpen(handler) {
    document.querySelectorAll('.open-form').forEach((button) => {
      button.addEventListener('click', () => handler());
    });
  }

  // Handle form submission and validate user inputs.
  addHandlerSubmit(handler) {
    this._parent.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(e.target));

      // Remove unnecessary spaces from the title.
      data.title = data.title.trim();

      // Validate task title.
      if (!data.title) {
        alert('Please enter a task title.');
        return;
      }

      if (data.title.length > 100) {
        alert('Task title must not exceed 100 characters.');
        return;
      }

      // Validate estimated minutes.
      const minutes = Number(data.minutes);

      if (!Number.isFinite(minutes) || minutes <= 0) {
        alert('Estimated minutes must be greater than zero.');
        return;
      }

      if (!Number.isInteger(minutes) || minutes % 5 !== 0) {
        alert('Estimated minutes must be in increments of 5.');
        return;
      }

      data.minutes = minutes;

      handler(data);
    });
  }

  // Handle Cancel button, Escape key, and dialog closing.
  addHandlerCancel(handler) {
    this._parent.addEventListener('click', (e) => {
      if (e.target.closest('[data-action="cancel"]')) {
        handler();
      }
    });

    this._parent.addEventListener('close', () => handler());
  }

  // Generate the form markup.
  _generateMarkup() {
    const { days, priorities, editing, values, error } = this._data;

    const v = {
      title: '',
      day: days[0],
      priority: 'Medium',
      minutes: 30,
      ...values,
    };

    const options = (list, selected) =>
      list
        .map(
          (o) =>
            `<option${o === selected ? ' selected' : ''}>${this._escape(o)}</option>`
        )
        .join('');

    return `
      <h2>${editing ? 'Edit task' : 'Add a task'}</h2>

      <form class="form" novalidate>
        <label>
          Title
          <input
            name="title"
            type="text"
            value="${this._escape(v.title)}"
            maxlength="100"
            required
            autocomplete="off"
            placeholder="Enter task title"
          >
        </label>

        <label>
          Day
          <select name="day">
            ${options(days, v.day)}
          </select>
        </label>

        <label>
          Priority
          <select name="priority">
            ${options(priorities, v.priority)}
          </select>
        </label>

        <label>
          Estimated minutes
          <input
            name="minutes"
            type="number"
            min="5"
            step="5"
            value="${this._escape(v.minutes)}"
            required
          >
        </label>

        ${
          error
            ? `<p class="error" role="alert">${this._escape(error)}</p>`
            : ''
        }

        <div class="form-actions">
          <button class="btn btn-primary" type="submit">
            ${editing ? 'Save changes' : 'Add task'}
          </button>

          <button class="btn" type="button" data-action="cancel">
            Cancel
          </button>
        </div>
      </form>
    `;
  }
}
