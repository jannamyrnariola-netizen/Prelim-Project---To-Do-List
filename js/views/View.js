// Base View class. NOTE: if your Week 5 View.js has different method names,
// keep yours and adjust the child views to match.
export default class View {
  _parent;
  _data;

  constructor(parentSelector) {
    this._parent = document.querySelector(parentSelector);
  }

  render(data) {
    this._data = data;
    this._parent.innerHTML = '';
    this._parent.insertAdjacentHTML('afterbegin', this._generateMarkup());
  }

  _generateMarkup() {
    throw new Error('Child views must implement _generateMarkup()');
  }

  _escape(value) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(value).replace(/[&<>"']/g, (c) => map[c]);
  }

  _formatMinutes(total) {
    const h = Math.floor(total / 60);
    const m = total % 60;
    if (!h) return `${m} min`;
    return m ? `${h} h ${m} min` : `${h} h`;
  }
}
