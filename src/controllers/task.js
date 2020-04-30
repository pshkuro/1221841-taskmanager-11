// Логика отрисовка 1 карточки
import TaskEditCopmonent from "../components/task-edit";
import TaskCopmonent from "../components/task";
import {renderPosition, render, remove, replace} from "../utils/render";
import {COLOR} from "../const";


// Флаги в каком состоянии находится карточка в обычнои или редактрирования
export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};


// Пустая форма создания задачи
export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    "mo": false,
    "tu": false,
    "we": false,
    "th": false,
    "fr": false,
    "sa": false,
    "su": false,
  },
  color: COLOR.BLACK,
  isFavorite: false,
  isArchive: false,
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

  render(task, mode) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;
    this._mode = mode;

    this._taskComponent = new TaskCopmonent(task);
    this._taskEditComponent = new TaskEditCopmonent(task);


    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskEditComponent.setSabmitHandler((evt) => {
      evt.preventDefault();
      const data = this._taskEditComponent.getData();
      this._onDataChange(this, task, data);
    });

    this._taskEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, task, null));

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

    // Рендерим карточки в зав-ти от типа - обычные или создания
    switch (mode) {
      case Mode.DEFAULT:
        if (oldTaskEditComponent && oldTaskComponent) {
          replace(this._taskComponent, oldTaskComponent);
          replace(this._taskEditComponent, oldTaskEditComponent);
          this._replaceEditToTask();
        } else {
          render(this._container, this._taskComponent, renderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldTaskEditComponent && oldTaskComponent) {
          remove(oldTaskComponent);
          remove(oldTaskEditComponent);
        }
        this._onViewChange();
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._taskEditComponent, renderPosition.AFTERBEGIN);

        break;
    }
  }

  // Отображения задачи вместо формы редактирования - вызывается внутри _onViewChange()
  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  // Удалление задачи, ее контроллера и из памяти
  destroy() {
    remove(this._taskEditComponent);
    remove(this._taskComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceTaskToEdit() { // Заменяем карточку на форму редактирование
    this._onViewChange(); // Реализуем сообщение, что все формы, открытые до этого, должны закрыться
    replace(this._taskEditComponent, this._taskComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToTask() { // Заменяем форму редактирования на карточку
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._taskEditComponent.reset();

    if (document.contains(this._taskEditComponent.getElement())) {
      replace(this._taskComponent, this._taskEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyTask, null);
      }
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

}
