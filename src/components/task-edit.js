import {DAYS, COLORS, MONTH_NAMES} from "../const";
import {formatTime, createElement} from "../util";
import ColorMarkupComponent from "./task-color-markup";
import RepeatingDaysMarkupComponent from "./task-repeatingDays-markup";


export default class TaskEditCopmonent {
  constructor(task) {
    this._task = task;
    this._element = null;
    this.init();
  }

  init() {
    const {description, dueDate, color, repeatingDays} = this._task;

    this._description = description;
    this._color = color;
    // Флаг, что задача просрочена
    // (создан ли dueDate с пом-ю конструктора Date (мб придет объект другого типа, тогда = null и авто задача Expired)
    const isExpired = dueDate instanceof Date && dueDate < Date.now();
    this._isDateShowing = Boolean(dueDate); // Проверка, приходит ли такой объект, или нет (true/false)

    this._date = this._isDateShowing ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
    this._time = this._isDateShowing ? formatTime(dueDate) : ``;

    // Флаг возвращает true, если
    // хотя бы 1 эл true из repeatingDays
    const isRepeatingTask = Object.values(repeatingDays).some(Boolean);
    this._classRepeat = isRepeatingTask ? `card--repeat` : ``;
    this._classDeadline = isExpired ? `card--deadline` : ``; // Если задача просрочена, доб класс deadline, иначе ничего

    this._colorsMarkup = new ColorMarkupComponent(COLORS, color).getTemplate();
    this._repeatingDaysMarkup = new RepeatingDaysMarkupComponent(DAYS, repeatingDays).getTemplate();

  }

  getTemplate() {
    return (
      `<article class="card card--edit card--${this._color} ${this._classRepeat} ${this._classDeadline}">
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
                    date: <span class="card__date-status">${this._isDateShowing ? `yes` : `no`}</span>
                  </button>
  
                  ${this._isDateShowing ?
        `<fieldset class="card__date-deadline">
                    <label class="card__input-deadline-wrap">
                      <input
                        class="card__date"
                        type="text"
                        placeholder=""
                        name="date"
                        value="${this._date} ${this._time}"
                      />
                    </label>
                  </fieldset>` : ``}
  
                  <button class="card__repeat-toggle" type="button">
                    repeat:<span class="card__repeat-status">yes</span>
                  </button>
                  
                
        <fieldset class="card__repeat-days">
                    <div class="card__repeat-days-inner">
                      ${this._repeatingDaysMarkup}
                    </div>
                  </fieldset> 
                </div>
              </div>
  
              <div class="card__colors-inner">
                <h3 class="card__colors-title">Color</h3>
                <div class="card__colors-wrap">
                  ${this._colorsMarkup}
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
