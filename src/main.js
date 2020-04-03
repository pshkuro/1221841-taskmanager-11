

const TASK_COUNT = 3;
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);


// Ф рендеринга
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};


// Отрисовываем Меню, Фильтры, Сортировку
render(siteHeaderElement, createSiteMenuTemplate(), `beforeend`);
render(siteMainElement, createFilterTemplate(), `beforeend`);
render(siteMainElement, createBoardTemplate(), `beforeend`);

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
const boardElement = siteMainElement.querySelector(`.board`);

// Отрис Карточку создания/ред задачи
render(taskListElement, createTaskEditTemplate(), `beforeend`);

// Отрис Карточки задачи
for (let i = 0; i < TASK_COUNT; i++) {
  render(taskListElement, createTaskTemplate(), `beforeend`);
}

// Отрис кнопки 'Load more'
render(boardElement, createLoadMoreButtonTemplate(), `beforeend`);


