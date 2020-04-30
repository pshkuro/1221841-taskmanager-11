import SiteMenuCopmonent, {MenuItem} from "./components/site-menu";
import BoardCopmonent from "./components/boards";
import BoardController from "./controllers/board";
import FiltersController from "./controllers/filters";
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

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      boardController.createTask();
      break;
  }
});
