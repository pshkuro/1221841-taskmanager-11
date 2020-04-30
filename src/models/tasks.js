// для синхронизации задач между различными частями приложения

import {getTasksByFilter} from "../utils/filters.js";
import {FilterType} from "../const.js";

export default class TasksModel {
  constructor() {
    this._tasks = [];
    this._activeFilterType = FilterType.ALL; // текущий выбранный фильтр

    this._dataChangeHandlers = []; // Складываем хэндлеры, которые должны реагировать на изменение данных
    this._filterChangeHandlers = []; // Callbackи на изменение фильтров
  }

  // Получение задач
  getAllTasks() {
    return this._tasks;
  }

  getTasks() {
    return getTasksByFilter(this._tasks, this._activeFilterType);
  }

  // Добавление задач
  setTasks(tasks) {
    this._tasks = Array.from(tasks);
    this._callHandlers(this._dataChangeHandlers);
  }

  // Удаление задачи из набора
  removeTask(id) {
    const index = this._tasks.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), this._tasks.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  // Добавляет задачу в наш набор
  addTask(task) {
    this._tasks = [].concat(task, this._tasks);
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

  // Устанавливает callback, который вызывается, когда Задача обновилась
  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  // Устанавливает callback, который вызывается, когда Фильтр обновился
  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }


  // Подписка на изменение фильтров
  // фильтры обновились -> уведомляем всех, кому интересно, что измениля тип фильтра ->
  // получают новые отфильтрованные задачи getTasks()
  setFilters(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  // Вызывает каждый callback, когда задача обновилась
  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
