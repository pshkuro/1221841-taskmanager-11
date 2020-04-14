import {MONTH_NAMES} from "../const";
import {formatTime, createElement} from "../util";

// Ф генерации формы создания/редактирования задачи
const createTaskTemplate = (task) => {
  const {description, dueDate, color, repeatingDays, isArchive, isFavorite} = task;

  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const isDateShowing = !!dueDate;

  const date = isDateShowing ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const time = isDateShowing ? formatTime(dueDate) : ``;

  const repeatClass = Object.values(repeatingDays).some(Boolean) ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;
  const archiveButtonInactiveClass = isArchive ? `` : `card__btn--disabled`;
  const favoriteButtonInactiveClass = isFavorite ? `` : `card__btn--disabled`;

  return `<article class="card card--${color} ${repeatClass} ${deadlineClass}">
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
          <p class="card__text">${description}</p>
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
};

export default class Task {

  constructor(task) { // В Task передаются данные(объекты) карточек, сейчас моки, потом с сервера
    this._task = task;

    this._element = null; // Создали пустой элемент карточки
  }

  getTemplate() {
    return createTaskTemplate(this._task); // Разметка нашей карточки, в которую передаем данные карточки - task
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
