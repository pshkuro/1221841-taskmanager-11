// Логика отрисовка 1 карточки
import TaskEditCopmonent from "../components/task-edit";
import TaskCopmonent from "../components/task";
import {renderPosition, render, replace} from "../utils/render";

let activeCard = null;
let activeCardEditForm = null;

export default class TaskController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._taskComponent = null; // Чтобы могли получить к ним дооступ, не выызвая render
    this._taskEditComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(task) {

    this._taskComponent = new TaskCopmonent(task);
    this._taskEditComponent = new TaskEditCopmonent(task);


    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
    });

    this._taskEditComponent.setSabmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToTask();
    });

    this._taskComponent.setArchiveButtonClickHandler(() => {
      const newTask = Object.assign({}, task, {
        isArchive: !task.isArchive,
      });

      this._onDataChange(this, task, newTask);

      // replace(new TaskCopmonent(newTask), this._taskComponent);
    });

    this._taskComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isFavorite: !task.isFavorite,
      }));
    });

    render(this._container, this._taskComponent, renderPosition.BEFOREEND); // Отрисовываем карточку
  }


  _replaceTaskToEdit() { // Заменяем карточку на форму редактирование
    document.addEventListener(`keydown`, this._onEscKeyDown);

    if (activeCardEditForm) {
      this._replaceEditToTask();
    }

    replace(this._taskEditComponent, this._taskComponent);
    activeCard = this._taskComponent;
    activeCardEditForm = this._taskEditComponent;

  }

  _replaceEditToTask() { // Заменяем форму редактирования на карточку
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    if (activeCard && activeCardEditForm) {
      replace(activeCard, activeCardEditForm);
      activeCard = null;
      activeCardEditForm = null;
    }
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToTask();
    }
  }

}
