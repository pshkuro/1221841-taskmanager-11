import SiteMenuCopmonent from "./components/site-menu";
import FilterCopmonent from "./components/filter";
import BoardCopmonent from "./components/boards";
import SortCopmonent from "./components/sorting";
import TaskEditCopmonent from "./components/task-edit";
import TaskCopmonent from "./components/task";
import LoadMoreButtonCopmonent from "./components/load-more-button";
import TasksCopmonent from "./components/tasks";
import {generateFilters} from "./mock/filter";
import {generateTasks} from "./mock/task";
import {renderPosition, render} from "./util";

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;


const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters(tasks);

render(siteHeaderElement, createSiteMenuTemplate(), `beforeend`);
render(siteMainElement, createFilterTemplate(filters), `beforeend`);
render(siteMainElement, createBoardTemplate(), `beforeend`);

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
const boardElement = siteMainElement.querySelector(`.board`);

render(boardElement, createSortingTemplate(), `afterbegin`);
render(taskListElement, createTaskEditTemplate(tasks[0]), `beforeend`);

// Отрсиовка карточек на страницу
tasks.slice(1, showingTasksCount).forEach((task) => render(taskListElement, createTaskTemplate(task), `beforeend`));


render(boardElement, createLoadMoreButtonTemplate(), `beforeend`);

const loadMoreButton = boardElement.querySelector(`.load-more`);

// Загружаем карточки дополинтельно по клике на кнопку load-more
loadMoreButton.addEventListener(`click`, function clickButtonMore() {
  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount)
  .forEach((task) => render(taskListElement, createTaskTemplate(task), `beforeend`));

  if (showingTasksCount > tasks.length) {
    loadMoreButton.remove();
  }
});


