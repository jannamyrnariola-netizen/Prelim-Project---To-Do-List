import View from './View.js';

export default class BoardView extends View {
  addHandlerAdd(handler) {
    this._parent.addEventListener('click', (e) => {
      const button = e.target.closest('[data-action="add"]');
      if (button) handler(button.dataset.day);
    });
  }
  // Listens for clicks on the done circle and tells the controller which task was toggled
  addHandlerToggle(handler) {
    this._addHandler('toggle', handler);
  }

  addHandlerEdit(handler) {
    this._addHandler('edit', handler);
  }

  addHandlerDelete(handler) {
    this._addHandler('delete', handler);
  }

  _addHandler(action, handler) {
    this._parent.addEventListener('click', (e) => {
      const button = e.target.closest(`[data-action="${action}"]`);
      if (!button) return;
      handler(Number(button.closest('[data-id]').dataset.id));
    });
  }

  _generateMarkup() {
    const { days, tasks } = this._data;
    return days.map((day) => this._generateColumn(day, tasks.filter((t) => t.day === day))).join('');
  }

  _generateColumn(day, tasks) {
    const done = tasks.filter((t) => t.done).length;
    const note = tasks.length
      ? `${done} of ${tasks.length} done`
            : `Nothing planned for ${day} yet. Click + to add a task.`;
    return `
      <section class="day" aria-label="${day}">
        <header class="day-head">
          <h2>${day} <span class="day-count">(${tasks.length})</span></h2>
          <button class="icon-btn" data-action="add" data-day="${day}" aria-label="Add task on ${day}">+</button>
        </header>
        <div class="day-body">
          ${tasks.length ? `<ul class="tasks">${tasks.map((t) => this._generateTask(t)).join('')}</ul>` : ''}
          <p class="day-note">${note}</p>
        </div>
      </section>`;
  }

  _when(day) {
    const { today, tomorrow } = this._data;
    if (day === today) return ['when-soon', 'Today'];
    if (day === tomorrow) return ['when-soon', 'Tomorrow'];
    return ['', day];
  }

  _generateTask(t) {
    const title = this._escape(t.title);
    const [whenClass, whenLabel] = this._when(t.day);
    return `
      <li class="task${t.done ? ' is-done' : ''}" data-id="${t.id}">
        <span class="pill pill-${t.priority.toLowerCase()}">${t.priority} priority</span>
        <div class="task-row">
          <button class="check" data-action="toggle" aria-pressed="${t.done}"
            aria-label="${t.done ? 'Mark not done' : 'Mark done'}: ${title}"></button>
          <p class="task-title">${title}</p>
        </div>
        <dl class="fields">
          <div><dt>Estimated time</dt><dd>${this._formatMinutes(t.minutes)}</dd></div>
          <div><dt>Due</dt><dd class="${whenClass}">${whenLabel}</dd></div>
        </dl>
        <div class="task-actions">
          <button class="link" data-action="edit">Edit</button>
          <button class="link link-danger" data-action="delete">Delete</button>
        </div>
      </li>`;
  }
}
