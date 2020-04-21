// Задача контроллера — создавать компоненты,
// добавлять их на страницу, навешивать обработчики.
// То есть реализовывать бизнес-логику и поведение приложения.

import SortCopmonent, {SortType} from "../components/sorting";
import TaskEditCopmonent from "../components/task-edit";
import TaskCopmonent from "../components/task";
import LoadMoreButtonCopmonent from "../components/load-more-button";
import TasksCopmonent from "../components/tasks";
import NoTasks from "../components/no-tasks";
import {renderPosition, render, replace, remove} from "../utils/render";

let activeCard = null;
let activeCardEditForm = null;


const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

// Логика отрисовка 1 карточки
const renderTask = (taskElement, task) => {

  const taskComponent = new TaskCopmonent(task);
  const taskEditComponent = new TaskEditCopmonent(task);


  const replaceTaskToEdit = () => { // Заменяем карточку на форму редактирование
    document.addEventListener(`keydown`, onEscKeyDown);

    if (activeCardEditForm) {
      replaceEditToTask();
    }

    replace(taskEditComponent, taskComponent);
    activeCard = taskComponent;
    activeCardEditForm = taskEditComponent;

  };

  const replaceEditToTask = () => { // Заменяем форму редактирования на карточку
    document.removeEventListener(`keydown`, onEscKeyDown);

    if (activeCard && activeCardEditForm) {
      replace(activeCard, activeCardEditForm);
      activeCard = null;
      activeCardEditForm = null;
    }
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToTask();
    }
  };

  taskComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
  });

  taskEditComponent.setSabmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToTask();
  });

  render(taskElement, taskComponent, renderPosition.BEFOREEND); // Отрисовываем карточку

};

const renderTasks = (taskListElement, tasks) => {
  tasks.forEach((task) => {
    renderTask(taskListElement, task);
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
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoTasks();
    this._sortComponent = new SortCopmonent();
    this._tasksComponent = new TasksCopmonent();
    this._loadMoreButtonComponent = new LoadMoreButtonCopmonent();
  }

  render(tasksData) {

    // Логика кнопки LoadMoreButton
    const renderLoadMoreButton = () => {
      if (showingTasksCount >= tasksData.length) {
        return;
      }
      render(container, this._loadMoreButtonComponent, renderPosition.BEFOREEND); // Отрисовываем кнопу

      this._loadMoreButtonComponent.setClickHandler(() => { // По щелочу подгружаем еще карточки
        const prevTasksCount = showingTasksCount;
        showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

        const sortedTasks = getSortedTasks(tasksData, this._sortComponent.getSortType(), prevTasksCount, showingTasksCount);
        renderTasks(taskListElement, sortedTasks);

        if (showingTasksCount >= tasksData.length) {
          remove(this._loadMoreButtonComponent);
        }
      });
    };

    const container = this._container.getElement();
    const isAllTasksArchived = tasksData.every((task) => task.isArchive); // Проверяем, все ли задачи в архиве

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent, renderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, renderPosition.BEFOREEND);
    render(container, this._tasksComponent, renderPosition.BEFOREEND);


    // Отрисовываем наши карточки
    const taskListElement = this._tasksComponent.getElement();
    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    renderTasks(taskListElement, tasksData.slice(0, showingTasksCount));
    renderLoadMoreButton();

    // Сортировка
    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      showingTasksCount = SHOWING_TASKS_COUNT_BY_BUTTON;

      const sortedTasks = getSortedTasks(tasksData, sortType, 0, showingTasksCount);
      taskListElement.innerHTML = ``;

      renderTasks(taskListElement, sortedTasks);

      const showMoreButton = container.querySelector(`.load-more`);
      if (!showMoreButton) {
        renderLoadMoreButton();
      }

    });
  }
}
