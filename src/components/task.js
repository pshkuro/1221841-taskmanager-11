import {formatTime, formatDate, isOverdueDate} from "../utils/common";
import AbstractComponent from "./abstract-component";
import {encode} from "he";

export default class TaskCopmonent extends AbstractComponent {

  constructor(task) { // В Task передаются данные(объекты) карточек, сейчас моки, потом с сервера
    super();

    const {description: notSanitizedDescription, dueDate, color, repeatingDays} = task;
    this._description = encode(notSanitizedDescription);
    this._color = color;
    this._dueDate = dueDate;
    this._repeatingDays = repeatingDays;
    this._isArchive = task.isArchive;
    this._isFavorite = task.isFavorite;
  }


  getTemplate() {
    const isExpired = this._dueDate instanceof Date && isOverdueDate(this._dueDate, new Date());
    const isDateShowing = !!this._dueDate;

    const date = isDateShowing ? formatDate(this._dueDate) : ``;
    const time = isDateShowing ? formatTime(this._dueDate) : ``;

    const repeatClass = Object.values(this._repeatingDays).some(Boolean) ? `card--repeat` : ``;
    const deadlineClass = isExpired ? `card--deadline` : ``;
    const archiveButtonInactiveClass = this._isArchive ? `` : `card__btn--disabled`;
    const favoriteButtonInactiveClass = this._isFavorite ? `` : `card__btn--disabled`;

    return `<article class="card card--${this._color} ${repeatClass} ${deadlineClass}">
    <div class="card__form">
      <div class="card__inner">
        <div class="card__control">
          <button type="button" class="card__btn card__btn--edit">
            edit
          </button>
          <button type="button" class="card__btn card__btn--archive ${archiveButtonInactiveClass}">
            archive
          </button>
          <button
            type="button"
            class="card__btn card__btn--favorites ${favoriteButtonInactiveClass}"
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
                  <span class="card__date">${date}</span>
                  <span class="card__time">${time}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>`;
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--edit`)
      .addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--favorites`)
    .addEventListener(`click`, handler);
  }

  setArchiveButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--archive`)
    .addEventListener(`click`, handler);
  }
}
