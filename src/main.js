import API from "./api";
import SiteMenuCopmonent, {MenuItem} from "./components/site-menu";
import BoardCopmonent from "./components/boards";
import BoardController from "./controllers/board";
import FiltersController from "./controllers/filters";
import StatisticsComponent from "./components/statistics";
import {renderPosition, render} from "./utils/render";
import TasksModel from "./models/tasks";

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=`;
const END_POINT = `https://11.ecmascript.pages.academy/task-manager`;

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();


const api = new API(END_POINT, AUTHORIZATION);
const tasksModel = new TasksModel();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuComponent = new SiteMenuCopmonent();
const filterController = new FiltersController(siteMainElement, tasksModel);
const boardComponent = new BoardCopmonent();
const boardController = new BoardController(boardComponent, tasksModel, api, () => {
  filterController.rerender();
});
const statisticsComponent = new StatisticsComponent({tasks: tasksModel, dateFrom, dateTo});


render(siteHeaderElement, siteMenuComponent, renderPosition.BEFOREEND);
filterController.render();
render(siteMainElement, boardComponent, renderPosition.BEFOREEND);
render(siteMainElement, statisticsComponent, renderPosition.BEFOREEND);
statisticsComponent.hide();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      statisticsComponent.hide();
      boardController.show();
      boardController.createTask();
      break;
    case MenuItem.STATISTICS:
      filterController.rerender();
      boardController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TASKS:
      statisticsComponent.hide();
      boardController.show();
      break;
  }
});

api.getTasks()
  .then((tasks) => { // Загружаем контейнер тасков не сразу, а после того, как они придут с сервера
    tasksModel.setTasks(tasks);
    filterController.rerender();
    boardController.render();
  });
