import {DAYS, COLORS, MONTH_NAMES} from "../const";
import AbstractSmartComponent from "./abstract-smart-component";
import {formatTime} from "../utils/common";
import ColorMarkupComponent from "./task-color-markup";
import RepeatingDaysMarkupComponent from "./task-repeatingDays-markup";

const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some((a) => a);
};


export default class TaskEditCopmonent extends AbstractSmartComponent {
  constructor(task) {
    super();

    this._description = task.description;
    this._color = task.color;
    this._dueDate = task.dueDate;
    this._repeatingDays = task.repeatingDays;
    this._isDateShowing = Boolean(this._dueDate); // Проверка, приходит ли такой объект, или нет (true/false)
    // Флаг возвращает true, если
    // хотя бы 1 эл true из repeatingDays
    this._isRepeatingTask = Object.values(this._repeatingDays).some((a) => a);
    this._activeRepeatingDays = Object.assign({}, this._repeatingDays);
    this._element = this.getElement();

    this._submitHandler = null;
    this._subscribeOnDeadlineEvent();
    this._subscribeOnRepeatEvent();
    this._subscribeOnRepeatingDaysEvent();
  }

  // Обработчики добавляются заново при перерисовке
  recoveryListeners() {
    this.setSabmitHandler(this._submitHandler);
    this._subscribeOnDeadlineEvent();
    this._subscribeOnRepeatEvent();
    this._subscribeOnRepeatingDaysEvent();
  }

  rerender() {
    super.rerender();
  }

  getTemplate() {
    // Флаг, что задача просрочена
    // (создан ли dueDate с пом-ю конструктора Date (мб придет объект другого типа, тогда = null и авто задача Expired)
    const isExpired = this._dueDate instanceof Date && this._dueDate < Date.now();
    // кнопку «Save» необходимо блокировать, если поля показаны, а дата или дни повторения не выбраны
    const isBlockSaveButton = (this._isDateShowing && this._isRepeatingTask) ||
    (this._isRepeatingTask && !isRepeating(this._activeRepeatingDays));

    const date = (this._isDateShowing && this._dueDate) ? `${this._dueDate.getDate()} ${MONTH_NAMES[this._dueDate.getMonth()]}` : ``;
    const time = (this._isDateShowing && this._dueDate) ? formatTime(this._dueDate) : ``;

    const classRepeat = this._isRepeatingTask ? `card--repeat` : ``;
    const classDeadline = isExpired ? `card--deadline` : ``; // Если задача просрочена, доб класс deadline, иначе ничего

    const colorsMarkup = new ColorMarkupComponent(COLORS, this._color).getTemplate();
    const repeatingDaysMarkup = new RepeatingDaysMarkupComponent(DAYS, this._activeRepeatingDays).getTemplate();

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
                        value="${date} ${time}"
                      />
                    </label>
                  </fieldset>` : ``}
  
                  <button class="card__repeat-toggle" type="button">
                    repeat:<span class="card__repeat-status">${this._isRepeatingTask ? `yes` : `no`}</span>
                  </button>
                  
                
        <fieldset class="card__repeat-days">
          ${this._isRepeatingTask ? `<div class="card__repeat-days-inner">
                    ${repeatingDaysMarkup} </div>` : ``}
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
              <button class="card__save" type="submit" ${isBlockSaveButton ? `disabled` : ``}>save</button>
              <button class="card__delete" type="button">delete</button>
            </div>
          </div>
        </form>
      </article>`
    );
  }

  setSabmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  _subscribeOnDeadlineEvent() {
    this._element.querySelector(`.card__date-deadline-toggle`)
    .addEventListener(`click`, () => {
      this._isDateShowing = !this._isDateShowing;

      this.rerender();
    });
  }

  _subscribeOnRepeatEvent() {
    this._element.querySelector(`.card__repeat-toggle`)
    .addEventListener(`click`, () => {
      this._isRepeatingTask = !this._isRepeatingTask;

      this.rerender();
    });
  }

  _subscribeOnRepeatingDaysEvent() {
    const repeatDays = this._element.querySelector(`.card__repeat-days`);
    if (repeatDays) {
      repeatDays.addEventListener(`change`, (evt) => {
        this._activeRepeatingDays[evt.target.value] = evt.target.checked;

        this.rerender();
      });
    }
  }
}
