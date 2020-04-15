import {MONTH_NAMES} from "../const";
import {formatTime, createElement} from "../util";

export default class TaskCopmonent {

  constructor(task) { // В Task передаются данные(объекты) карточек, сейчас моки, потом с сервера
    this._task = task;
    this._element = null; // Создали пустой элемент карточки
    this.init();
  }

  init() {
    const {description, dueDate, color, repeatingDays, isArchive, isFavorite} = this._task;

    this._description = description;
    this._color = color;

    const isExpired = dueDate instanceof Date && dueDate < Date.now();
    const isDateShowing = !!dueDate;

    this._date = isDateShowing ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
    this._time = isDateShowing ? formatTime(dueDate) : ``;

    this._repeatClass = Object.values(repeatingDays).some(Boolean) ? `card--repeat` : ``;
    this._deadlineClass = isExpired ? `card--deadline` : ``;
    this._archiveButtonInactiveClass = isArchive ? `` : `card__btn--disabled`;
    this._favoriteButtonInactiveClass = isFavorite ? `` : `card__btn--disabled`;
  }

  getTemplate() {
    return `<article class="card card--${this._color} ${this._repeatClass} ${this._deadlineClass}">
    <div class="card__form">
      <div class="card__inner">
        <div class="card__control">
          <button type="button" class="card__btn card__btn--edit">
            edit
          </button>
          <button type="button" class="card__btn card__btn--archive ${this._archiveButtonInactiveClass}">
            archive
          </button>
          <button
            type="button"
            class="card__btn card__btn--favorites ${this._favoriteButtonInactiveClass}"
          >
            favorites
          </button>
        </div>

        <div class="card__color-bar">
          <svg class="card__color-bar-wave" width="100%" height="10">
            <use xlink:href="#wave"></use>
          </svg>
        </div>

        <div class="card__textarea-wrap">
          <p class="card__text">${this._description}</p>
        </div>

        <div class="card__settings">
          <div class="card__details">
            <div class="card__dates">
              <div class="card__date-deadline">
                <p class="card__input-deadline-wrap">
                  <span class="card__date">${this._date}</span>
                  <span class="card__time">${this._time}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>`;
  }

  getElement() {
    if (!this._element) { // Если элемента нет, создаем его
      this._element = createElement(this.getTemplate()); // Создает DOM_элемент на основе сгенерир строки(разметки)
    }

    return this._element;
  }

  removeElement() {
    this._element = null; // Отчищает ресурс, удаляет ссылку на созданный DOM-элемент
  }

}
