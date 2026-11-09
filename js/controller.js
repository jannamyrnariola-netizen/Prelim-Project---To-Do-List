// CONTROLLER: the only layer that talks to both the model and the views.
// It builds no HTML.
import * as model from './model.js';
import FormView from './views/FormView.js';
import BoardView from './views/BoardView.js';
import SummaryView from './views/SummaryView.js';
import FilterView from './views/FilterView.js';
import ProfileView from './views/ProfileView.js';
import ProfileFormView from './views/ProfileFormView.js';

const formView = new FormView('.task-form');
const boardView = new BoardView('.board');
const summaryView = new SummaryView('.summary');
const filterView = new FilterView('.filters');
const profileView = new ProfileView('.profile-badge');
const profileFormView = new ProfileFormView('.profile-form');

const getEditingTask = () => model.state.tasks.find((t) => t.id === model.state.editingId) ?? null;

const renderForm = (values = null, error = '') => {
  const editing = getEditingTask();
  formView.render({
    days: model.DAYS,
    priorities: model.PRIORITIES,
    editing,
    values: values ?? editing ?? {},
    error,
  });
};

const getBoardData = () => {
  const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0
  return {
    days: model.DAYS,
    tasks: model.getVisibleTasks(),
    today: model.DAYS[todayIndex],
    tomorrow: model.DAYS[(todayIndex + 1) % 7],
  };
};

const renderAll = () => {
  renderForm();
  boardView.render(getBoardData());
  summaryView.render(model.getSummary());
  filterView.render({ options: model.FILTERS, active: model.state.filter });
};

const controlSubmit = (data) => {
  const error = model.validateTask(data);
  if (error) return renderForm(data, error);

  if (model.state.editingId) model.updateTask(model.state.editingId, data);
  else model.addTask(data);
  model.cancelEdit();
  formView.close();
  renderAll();
};

const controlToggle = (id) => {
  model.toggleDone(id);
  renderAll();
};

const controlOpenAdd = (day) => {
  model.cancelEdit();
  renderForm(day ? { day } : null);
  formView.open();
};

const controlEdit = (id) => {
  model.startEdit(id);
  renderForm();
  formView.open();
};

const controlCancelEdit = () => {
  model.cancelEdit();
  formView.close();
};

const controlDelete = (id) => {
  if (!confirm('Are you sure you want to delete this task?')) return; 
  model.deleteTask(id);
  renderAll();
};

const renderProfileForm = (values = null, error = '') =>
  profileFormView.render({ colors: model.AVATAR_COLORS, values: values ?? model.state.profile, error });

const renderProfile = () => {
  profileView.render(model.state.profile);
  renderProfileForm();
};

const controlOpenProfile = () => {
  renderProfileForm();
  profileFormView.open();
};

const controlSaveProfile = (data) => {
  const error = model.validateProfile(data);
  if (error) return renderProfileForm(data, error);

  model.updateProfile(data);
  profileFormView.close();
  renderProfile();
};

const controlCancelProfile = () => profileFormView.close();

const controlFilter = (filter) => {
  model.setFilter(filter);
  renderAll();
};

const init = () => {
  model.loadState();
  formView.addHandlerOpen(controlOpenAdd);
  formView.addHandlerSubmit(controlSubmit);
  formView.addHandlerCancel(controlCancelEdit);
  boardView.addHandlerAdd(controlOpenAdd);
  boardView.addHandlerToggle(controlToggle);
  boardView.addHandlerEdit(controlEdit);
  boardView.addHandlerDelete(controlDelete);
  filterView.addHandlerFilter(controlFilter);
  profileView.addHandlerOpen(controlOpenProfile);
  profileFormView.addHandlerSubmit(controlSaveProfile);
  profileFormView.addHandlerCancel(controlCancelProfile);
  renderProfile();
  renderAll();
};

init();