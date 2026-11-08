import View from './View.js';

// The "Edit profile" dialog.
export default class ProfileFormView extends View {
  open() {
    if (!this._parent.open) this._parent.showModal();
  }

  close() {
    if (this._parent.open) this._parent.close();
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
    const { colors, values, error } = this._data;
    const swatches = colors
      .map(
        (c) => `
          <label class="swatch">
            <input type="radio" name="color" value="${this._escape(c)}"${c === values.color ? ' checked' : ''}>
            <span style="background:${this._escape(c)}"></span>
          </label>`
      )
      .join('');

    return `
      <h2>Edit profile</h2>
      <form class="form" novalidate>
        <label>Your name
          <input name="name" type="text" value="${this._escape(values.name ?? '')}" autocomplete="off">
        </label>
        <fieldset class="field">
          <legend>Avatar color</legend>
          <div class="swatches">${swatches}</div>
        </fieldset>
        ${error ? `<p class="error" role="alert">${this._escape(error)}</p>` : ''}
        <div class="form-actions">
          <button class="btn btn-primary" type="submit">Save profile</button>
          <button class="btn" type="button" data-action="cancel">Cancel</button>
        </div>
      </form>`;
  }
}
