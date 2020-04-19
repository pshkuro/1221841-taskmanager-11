import SiteMenuCopmonent from "./components/site-menu";
import FilterCopmonent from "./components/filter";
import BoardCopmonent from "./components/boards";
import BoardController from "./controllers/board";
import {generateFilters} from "./mock/filter";
import {generateTasks} from "./mock/task";
import {renderPosition, render} from "./utils/render";

const TASK_COUNT = 22;
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters(tasks);

// Отрисовка Шапки меню и Фильтров
render(siteHeaderElement, new SiteMenuCopmonent(), renderPosition.BEFOREEND);
render(siteMainElement, new FilterCopmonent(filters), renderPosition.BEFOREEND);

const boardComponent = new BoardCopmonent();
const boardController = new BoardController(boardComponent);
render(siteMainElement, boardComponent, renderPosition.BEFOREEND);
boardController.render(tasks);
