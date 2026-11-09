
import View from './View.js';

// The form lives in a <dialog> opened by the "+" buttons.
export default class FormView extends View {
  open() {
    if (!this._parent.open) {
      this._parent.showModal();

      requestAnimationFrame(() => {
        this._parent.querySelector('[name="title"]')?.focus();
      });
    }
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

      const form = e.target;
      const submitButton = form.querySelector('[type="submit"]');
      const data = Object.fromEntries(new FormData(form));

      // Normalize task title.
      data.title = (data.title || '').trim().replace(/\s+/g, ' ');

      // Validate empty title.
      if (!data.title) {
        alert('Please enter a task title.');
        return;
      }

      // Validate minimum title length.
      if (data.title.length < 3) {
        alert('Task title must contain at least 3 characters.');
        return;
      }

      // Validate maximum title length.
      if (data.title.length > 100) {
        alert('Task title must not exceed 100 characters.');
        return;
      }

      // Validate selected day.
      if (!this._data.days.includes(data.day)) {
        alert('Please select a valid day.');
        return;
      }

      // Validate selected priority.
      if (!this._data.priorities.includes(data.priority)) {
        alert('Please select a valid priority.');
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

      // Prevent duplicate submission.
      if (submitButton.disabled) return;

      submitButton.disabled = true;
      submitButton.textContent = 'Saving...';

      try {
        handler(data);
      } catch (error) {
        submitButton.disabled = false;
        submitButton.textContent = this._data.editing
          ? 'Save changes'
          : 'Add task';

        throw error;
      }
    });
  }

  // Handle Cancel button and dialog closing.
  addHandlerCancel(handler) {
    this._parent.addEventListener('click', (e) => {
      if (e.target.closest('[data-action="cancel"]')) {
        this.close();
      }
    });

    // Runs when the dialog closes, including through Escape.
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
            `<option value="${this._escape(o)}"${o === selected ? ' selected' : ''}>${this._escape(o)}</option>`
        )
        .join('');

    return `
      <h2>${editing ? 'Edit task' : 'Add a task'}</h2>

      <form class="form" novalidate>
        <label for="taskTitle">
          Title
        </label>

        <input
          id="taskTitle"
          name="title"
          type="text"
          value="${this._escape(v.title)}"
          minlength="3"
          maxlength="100"
          required
          autocomplete="off"
          placeholder="Enter task title"
        >

        <label for="taskDay">Day</label>
        <select id="taskDay" name="day" required>
          ${options(days, v.day)}
        </select>

        <label for="taskPriority">Priority</label>
        <select id="taskPriority" name="priority" required>
          ${options(priorities, v.priority)}
        </select>

        <label for="taskMinutes">
          Estimated minutes
        </label>

        <input
          id="taskMinutes"
          name="minutes"
          type="number"
          min="5"
          step="5"
          value="${this._escape(v.minutes)}"
          required
        >

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
