// Задача контроллера — создавать компоненты,
// добавлять их на страницу, навешивать обработчики.
// То есть реализовывать бизнес-логику и поведение приложения.

import SortCopmonent, {SortType} from "../components/sorting";
import LoadMoreButtonCopmonent from "../components/load-more-button";
import TasksCopmonent from "../components/tasks";
import NoTasks from "../components/no-tasks";
import {renderPosition, render, remove} from "../utils/render";
import TaskController from "../controllers/task";


const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange); // подписываем под-ков на сообщение
    taskController.render(task);

    return taskController;
  });
};


// Возвращаем отсорт карточки в зав-ти от типа сортировки
const getSortedTasks = (tasks, sortType, from, to) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_DOWN:
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks.slice(from, to);
};


// Логика отрисовки всего, что внутри Boad Container
export default class BoardController {
  constructor(container, tasksModel) {
    this._container = container.getElement();
    this._tasksModel = tasksModel;
    // `подписчики`
    this._showedTaskControllers = []; // Все карточки задач, чтобы иметь доступ ко всем карточкам

    this._noTasksComponent = new NoTasks();
    this._sortComponent = new SortCopmonent();
    this._tasksComponent = new TasksCopmonent();
    this._loadMoreButtonComponent = new LoadMoreButtonCopmonent();
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    this._taskListElement = this._tasksComponent.getElement();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._sortTasks = this._sortTasks.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._sortTasks);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._tasksModel.setFilterChangeHandler(this._onFilterChange); // Устанавливает callback, который вызывается, когда Фильтр обновился

  }

  render() {
    const tasks = this._tasksModel.getTasks();
    const isAllTasksArchived = tasks.every((task) => task.isArchive); // Проверяем, все ли задачи в архиве

    if (isAllTasksArchived) {
      render(this._container, this._noTasksComponent, renderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, renderPosition.BEFOREEND);
    render(this._container, this._tasksComponent, renderPosition.BEFOREEND);


    // Отрисовываем наши карточки
    this._renderTasks(tasks.slice(0, this._showingTasksCount));


    this._renderLoadMoreButton();
  }

  _renderTasks(tasks) {
    const taskListElement = this._tasksComponent.getElement();

    const newTasks = renderTasks(taskListElement, tasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._showingTasksCount = this._showedTaskControllers.length;
  }

  // Метод удаления карточек
  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  // Метод обновления карточек
  _updateTasks(count) {
    this._removeTasks(); // удалим все
    this._renderTasks(this._tasksModel.getTasks().slice(0, count)); // отрисовываем с новыми данными
    this._renderLoadMoreButton(); // кнопку рендерим
  }


  // Логика кнопки LoadMoreButton
  _renderLoadMoreButton() {
    remove(this._loadMoreButtonComponent); // удаляем, если < 5 на станице
    const tasks = this._tasksModel.getTasks();
    if (this._showingTasksCount >= tasks.length) {
      return;
    }
    render(this._container, this._loadMoreButtonComponent, renderPosition.BEFOREEND); // Отрисовываем кнопу

    this._loadMoreButtonComponent.setClickHandler(() => { // По щелочу подгружаем еще карточки
      const prevTasksCount = this._showingTasksCount;
      this._showingTasksCount = this._showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), prevTasksCount, this._showingTasksCount);
      this._renderTasks(sortedTasks);

      if (this._showingTasksCount >= tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }

  // Сортировка
  _sortTasks(sortType) {
    this._showingTasksCount = SHOWING_TASKS_COUNT_BY_BUTTON;

    const sortedTasks = getSortedTasks(this._tasksModel.getTasks(), sortType, 0, this._showingTasksCount);

    this._removeTasks();
    this._renderTasks(sortedTasks);

    const showMoreButton = this._container.querySelector(`.load-more`);
    if (!showMoreButton) {
      this._renderLoadMoreButton();
    }
  }

  // То, что вызывает, находится в board, а то, что происходит в task
  _onDataChange(taskController, oldData, newData) {
    const isSuccess = this._tasksModel.updateTask(oldData.id, newData); // Обновляем ее, если есть изменения

    if (isSuccess) {
      taskController.render(newData); // Отрисовываем
    }
  }

  // `уведомляем подписчиков о сообщении`
  _onViewChange() {
    this._showedTaskControllers.forEach((task) => task.setDefaultView());
  }

  _onFilterChange() {
    this._updateTasks(SHOWING_TASKS_COUNT_ON_START);
  }

}
