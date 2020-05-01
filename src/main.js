import SiteMenuCopmonent, {MenuItem} from "./components/site-menu";
import BoardCopmonent from "./components/boards";
import BoardController from "./controllers/board";
import FiltersController from "./controllers/filters";
import StatisticsComponent from "./components/statistics";
import {generateTasks} from "./mock/task";
import {renderPosition, render} from "./utils/render";
import TasksModel from "./models/tasks";


const TASK_COUNT = 22;
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuComponent = new SiteMenuCopmonent();
render(siteHeaderElement, siteMenuComponent, renderPosition.BEFOREEND);


const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);


const filterController = new FiltersController(siteMainElement, tasksModel);
filterController.render();


const boardComponent = new BoardCopmonent();
render(siteMainElement, boardComponent, renderPosition.BEFOREEND);

const boardController = new BoardController(boardComponent, tasksModel, () => {
  filterController.rerender();
});
boardController.render();

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();
const statisticsComponent = new StatisticsComponent({tasks: tasksModel, dateFrom, dateTo});
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
