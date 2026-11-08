import View from './View.js';

export default class SummaryView extends View {
  _generateMarkup() {
    const { total, done, percent, remainingMinutes } = this._data;
    return `
      <span><b>${done}</b> of <b>${total}</b> done</span>
      <span><b>${this._formatMinutes(remainingMinutes)}</b> left</span>
      <div class="progress" role="progressbar" aria-label="${percent}% complete"
        aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}">
        <i style="width:${percent}%"></i>
      </div>`;
  }
}
