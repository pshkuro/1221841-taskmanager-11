// для синхронизации задач между различными частями приложения

export default class TasksModel {
  constructor() {
    this._tasks = [];

    this._dataChangeHandlers = []; // Складываем хэндлеры, которые должны реагировать на изменение данных
  }

  // Получение задач
  getTasks() {
    return this._tasks;
  }

  // Добавление задач
  setTasks(tasks) {
    this._tasks = Array.from(tasks);
    this._callHandlers(this._dataChangeHandlers);
  }

  // Обновление конкретной задачи
  updateTask(id, newTask) {
    const index = this._tasks.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newTask, this._tasks.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  // Устанавливает callback, который вызывается, когда задача обновилась
  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  // Вызывает каждый callback, когда задача обновилась
  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
