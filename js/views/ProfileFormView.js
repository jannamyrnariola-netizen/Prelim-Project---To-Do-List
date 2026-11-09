
import View from './View.js';

// The "Edit profile" dialog.
export default class ProfileFormView extends View {
  open() {
    if (!this._parent.open) {
      this._parent.showModal();

      requestAnimationFrame(() => {
        this._parent.querySelector('[name="name"]')?.focus();
      });
    }
  }

  close() {
    if (this._parent.open) {
      this._parent.close();
    }
  }

  // Handle profile form submission and validate inputs.
  addHandlerSubmit(handler) {
    this._parent.addEventListener('submit', (e) => {
      e.preventDefault();

      const form = e.target;
      const submitButton = form.querySelector('[type="submit"]');

      const data = Object.fromEntries(new FormData(form));

      // Normalize name by removing unnecessary spaces.
      data.name = (data.name || '').trim().replace(/\s+/g, ' ');

      // Validate empty name.
      if (!data.name) {
        alert('Please enter your name.');
        return;
      }

      // Validate minimum length.
      if (data.name.length < 2) {
        alert('Name must contain at least 2 characters.');
        return;
      }

      // Validate maximum length.
      if (data.name.length > 50) {
        alert('Your name must not exceed 50 characters.');
        return;
      }

      // Allow letters, spaces, hyphens, and apostrophes.
      if (!/^[\p{L}\s'-]+$/u.test(data.name)) {
        alert('Name can only contain letters, spaces, hyphens, and apostrophes.');
        return;
      }

      // Validate selected avatar color.
      if (!this._data.colors.includes(data.color)) {
        alert('Please select a valid avatar color.');
        return;
      }

      // Prevent duplicate submission.
      if (submitButton.disabled) return;

      submitButton.disabled = true;
      submitButton.textContent = 'Saving...';

      try {
        handler(data);
      } catch (error) {
        submitButton.disabled = false;
        submitButton.textContent = 'Save profile';
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
    this._parent.addEventListener('close', () => {
      handler();
    });
  }

  // Generate the profile form markup.
  _generateMarkup() {
    const { colors, values, error } = this._data;

    const swatches = colors
      .map(
        (c) => `
          <label class="swatch">
            <input
              type="radio"
              name="color"
              value="${this._escape(c)}"
              aria-label="Select avatar color ${this._escape(c)}"
              ${c === values.color ? 'checked' : ''}
              required
            >
            <span style="background:${this._escape(c)}"></span>
          </label>`
      )
      .join('');

    return `
      <h2>Edit profile</h2>

      <form class="form" novalidate>
        <label for="profileName">
          Your name
        </label>

        <input
          id="profileName"
          name="name"
          type="text"
          value="${this._escape(values.name ?? '')}"
          minlength="2"
          maxlength="50"
          required
          autocomplete="name"
          autocapitalize="words"
          spellcheck="false"
          placeholder="Enter your name"
          aria-label="Your name"
        >

        <fieldset class="field">
          <legend>Avatar color</legend>

          <div class="swatches">
            ${swatches}
          </div>
        </fieldset>

        ${
          error
            ? `<p class="error" role="alert">${this._escape(error)}</p>`
            : ''
        }

        <div class="form-actions">
          <button
            class="btn btn-primary"
            type="submit"
          >
            Save profile
          </button>

          <button
            class="btn"
            type="button"
            data-action="cancel"
          >
            Cancel
          </button>
        </div>
      </form>
    `;
  }
}
