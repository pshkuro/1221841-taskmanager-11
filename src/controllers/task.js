// Логика отрисовка 1 карточки
import TaskEditCopmonent from "../components/task-edit";
import TaskCopmonent from "../components/task";
import {renderPosition, render, replace} from "../utils/render";


// Флаги в каком состоянии находится карточка в обычнои или редактрирования
const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};


export default class TaskController {
  constructor(container, onDataChange, onViewChange) { // В этом модуле подписчик решает что делать с сообщ
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._taskComponent = null; // Чтобы могли получить к ним дооступ, не выызвая render
    this._taskEditComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(task) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;

    this._taskComponent = new TaskCopmonent(task);
    this._taskEditComponent = new TaskEditCopmonent(task);


    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskEditComponent.setSabmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToTask();
    });

    this._taskComponent.setArchiveButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isArchive: !task.isArchive,
      }));
    });

    this._taskComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isFavorite: !task.isFavorite,
      }));
    });

    if (oldTaskEditComponent && oldTaskComponent) {
      replace(this._taskComponent, oldTaskComponent);
      replace(this._taskEditComponent, oldTaskEditComponent);
    } else {
      render(this._container, this._taskComponent, renderPosition.BEFOREEND); // Отрисовываем карточку
    }
  }

  // Отображения задачи вместо формы редактирования - вызывается внутри _onViewChange()
  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }


  _replaceTaskToEdit() { // Заменяем карточку на форму редактирование
    this._onViewChange(); // Реализуем сообщение, что все формы, открытые до этого, должны закрыться
    replace(this._taskEditComponent, this._taskComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToTask() { // Заменяем форму редактирования на карточку
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._taskEditComponent.reset();
    replace(this._taskComponent, this._taskEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

}
