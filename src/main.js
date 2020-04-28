import SiteMenuCopmonent from "./components/site-menu";
import BoardCopmonent from "./components/boards";
import BoardController from "./controllers/board";
import FiltersController from "./controllers/filters";
import {generateTasks} from "./mock/task";
import {renderPosition, render} from "./utils/render";
import TasksModel from "./models/tasks";

const TASK_COUNT = 22;
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);


const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

// Отрисовка Шапки меню и Фильтров
render(siteHeaderElement, new SiteMenuCopmonent(), renderPosition.BEFOREEND);
const filterController = new FiltersController(siteMainElement, tasksModel);
filterController.render();


const boardComponent = new BoardCopmonent();
const boardController = new BoardController(boardComponent, tasksModel);

render(siteMainElement, boardComponent, renderPosition.BEFOREEND);
boardController.render();
