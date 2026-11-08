import View from './View.js';

export default class FilterView extends View {
  addHandlerFilter(handler) {
    this._parent.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-filter]');
      if (chip) handler(chip.dataset.filter);
    });
  }

  _generateMarkup() {
    const { options, active } = this._data;
    return options
      .map(
        (o) => `<button class="chip" data-filter="${this._escape(o.id)}"
          aria-pressed="${o.id === active}">${this._escape(o.label)}</button>`
      )
      .join('');
  }
}
