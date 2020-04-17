import {DAYS, COLORS, MONTH_NAMES} from "../const";
import {formatTime, createElement} from "../util";
import ColorMarkupComponent from "./task-color-markup";
import RepeatingDaysMarkupComponent from "./task-repeatingDays-markup";


export default class TaskEditCopmonent {
  constructor(task) {
    this._element = null;

    this._description = task.description;
    this._color = task.color;
    this._dueDate = task.dueDate;
    this._repeatingDays = task.repeatingDays;
  }

  getTemplate() {
    // Флаг, что задача просрочена
    // (создан ли dueDate с пом-ю конструктора Date (мб придет объект другого типа, тогда = null и авто задача Expired)
    const isExpired = this._dueDate instanceof Date && this._dueDate < Date.now();
    const isDateShowing = Boolean(this._dueDate); // Проверка, приходит ли такой объект, или нет (true/false)

    const date = isDateShowing ? `${this._dueDate.getDate()} ${MONTH_NAMES[this._dueDate.getMonth()]}` : ``;
    const time = isDateShowing ? formatTime(this._dueDate) : ``;

    // Флаг возвращает true, если
    // хотя бы 1 эл true из repeatingDays
    const isRepeatingTask = Object.values(this._repeatingDays).some(Boolean);
    const classRepeat = isRepeatingTask ? `card--repeat` : ``;
    const classDeadline = isExpired ? `card--deadline` : ``; // Если задача просрочена, доб класс deadline, иначе ничего

    const colorsMarkup = new ColorMarkupComponent(COLORS, this._color).getTemplate();
    const repeatingDaysMarkup = new RepeatingDaysMarkupComponent(DAYS, this._repeatingDays).getTemplate();

    return (
      `<article class="card card--edit card--${this._color} ${classRepeat} ${classDeadline}">
        <form class="card__form" method="get">
          <div class="card__inner">
            <div class="card__color-bar">
              <svg class="card__color-bar-wave" width="100%" height="10">
                <use xlink:href="#wave"></use>
              </svg>
            </div>
  
            <div class="card__textarea-wrap">
              <label>
                <textarea
                  class="card__text"
                  placeholder="Start typing your text here..."
                  name="text"
                >${this._description}</textarea>
              </label>
            </div>
  
            <div class="card__settings">
              <div class="card__details">
                <div class="card__dates">
                  <button class="card__date-deadline-toggle" type="button">
                    date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
                  </button>
  
                  ${isDateShowing ?
        `<fieldset class="card__date-deadline">
                    <label class="card__input-deadline-wrap">
                      <input
                        class="card__date"
                        type="text"
                        placeholder=""
                        name="date"
                        value="${date} ${time}"
                      />
                    </label>
                  </fieldset>` : ``}
  
                  <button class="card__repeat-toggle" type="button">
                    repeat:<span class="card__repeat-status">yes</span>
                  </button>
                  
                
        <fieldset class="card__repeat-days">
                    <div class="card__repeat-days-inner">
                      ${repeatingDaysMarkup}
                    </div>
                  </fieldset> 
                </div>
              </div>
  
              <div class="card__colors-inner">
                <h3 class="card__colors-title">Color</h3>
                <div class="card__colors-wrap">
                  ${colorsMarkup}
                </div>
              </div>
            </div>
  
            <div class="card__status-btns">
              <button class="card__save" type="submit">save</button>
              <button class="card__delete" type="button">delete</button>
            </div>
          </div>
        </form>
      </article>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
