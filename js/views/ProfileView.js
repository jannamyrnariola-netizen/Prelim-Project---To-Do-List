import View from './View.js';

// Header badge: avatar with initials + "<Name>'s weekly to-do list".
export default class ProfileView extends View {
  addHandlerOpen(handler) {
    this._parent.addEventListener('click', (e) => {
      if (e.target.closest('[data-action="edit-profile"]')) handler();
    });
  }

  _initials(name) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join('');
  }

  _generateMarkup() {
    const { name, color } = this._data;
    return `
      <button class="avatar" data-action="edit-profile" style="background:${this._escape(color)}"
        aria-label="Edit profile for ${this._escape(name)}">${this._escape(this._initials(name))}</button>
      <h1>${this._escape(name)}'s weekly to-do list</h1>`;
  }
}
