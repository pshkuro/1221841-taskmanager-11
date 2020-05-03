import {DAYS, COLORS} from "../const";
import AbstractSmartComponent from "./abstract-smart-component";
import {formatTime, formatDate, isRepeating, isOverdueDate} from "../utils/common";
import ColorMarkupComponent from "./task-color-markup";
import RepeatingDaysMarkupComponent from "./task-repeatingDays-markup";
import flatpickr from "flatpickr";
import {encode} from "he";

import "flatpickr/dist/flatpickr.min.css"; // Импорт как css файл

const MIN_DESCRIPTION_LENGTH = 1;
const MAX_DESCRIPTION_LENGTH = 140;

const isAllowableDescriptionLength = (description) => {
  const length = description.length;

  return length >= MIN_DESCRIPTION_LENGTH &&
    length <= MAX_DESCRIPTION_LENGTH;
};

export default class TaskEditCopmonent extends AbstractSmartComponent {
  constructor(task) {
    super();
    this._task = task;

    this._currentDescription = task.description;
    this._color = task.color;
    this._cardColor = this._color;
    this._dueDate = task.dueDate;
    this._repeatingDays = task.repeatingDays;
    this._isDateShowing = Boolean(this._dueDate); // Проверка, приходит ли такой объект, или нет (true/false)
    // Флаг возвращает true, если
    // хотя бы 1 эл true из repeatingDays
    this._isRepeatingTask = Object.values(this._repeatingDays).some((a) => a);
    this._activeRepeatingDays = Object.assign({}, this._repeatingDays);
    this._element = this.getElement();
    this._flatpickr = null;
    this._applyFlatpickr();

    this._submitHandler = null;
    this._deleteButtonClickHandler = null;
    this._subscribeOnDeadlineEvent();
    this._subscribeOnRepeatEvent();
    this._subscribeOnRepeatingDaysEvent();
    this._subscribeOnColors();
    this._subscribeOnDescription();
  }

  // Обработчики добавляются заново при перерисовке
  recoveryListeners() {
    this.setSabmitHandler(this._submitHandler);
    this._subscribeOnDeadlineEvent();
    this._subscribeOnRepeatEvent();
    this._subscribeOnRepeatingDaysEvent();
    this._subscribeOnColors();
    this._applyFlatpickr();
    this._subscribeOnDescription();
  }

  rerender() {
    super.rerender();
  }

  // Сброс измененных данных, если форма редактирования просто закрыта, а не сохранена
  reset() {
    this._isDateShowing = Boolean(this._dueDate); // Проверка, приходит ли такой объект, или нет (true/false)
    this._isRepeatingTask = Object.values(this._repeatingDays).some((a) => a);
    this._activeRepeatingDays = Object.assign({}, this._repeatingDays);

    this.rerender();
  }

  // Удаляет форму редактирования (кнопка Delete)
  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }

  // Получает данные из формы редактирования в виде объекта - передает модели
  getData() {
    const form = this.getElement().querySelector(`.card__form`);
    return new FormData(form);
  }

  getTemplate() {
    // Флаг, что задача просрочена
    // (создан ли dueDate с пом-ю конструктора Date (мб придет объект другого типа, тогда = null и авто задача Expired)
    const isExpired = this._dueDate instanceof Date && isOverdueDate(this._dueDate, new Date());

    const date = (this._isDateShowing && this._dueDate) ? formatDate(this._dueDate) : ``;
    const time = (this._isDateShowing && this._dueDate) ? formatTime(this._dueDate) : ``;

    const classRepeat = this._isRepeatingTask ? `card--repeat` : ``;
    const classDeadline = isExpired ? `card--deadline` : ``; // Если задача просрочена, доб класс deadline, иначе ничего

    const colorsMarkup = new ColorMarkupComponent(COLORS, this._cardColor).getTemplate();
    const repeatingDaysMarkup = new RepeatingDaysMarkupComponent(DAYS, this._activeRepeatingDays).getTemplate();

    const description = encode(this._currentDescription);
    // кнопку «Save» необходимо блокировать, если поля показаны, а дата или дни повторения не выбраны
    const isBlockSaveButton = (this._isDateShowing && isRepeating(this._activeRepeatingDays)
    && isAllowableDescriptionLength(this._currentDescription));

    return (
      `<article class="card card--edit card--${this._cardColor} ${classRepeat} ${classDeadline}">
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
                >${description}</textarea>
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
              <button class="card__save" type="submit"${isBlockSaveButton ? `` : `disabled`}>save</button>
              <button class="card__delete" type="button">delete</button>
            </div>
          </div>
        </form>
      </article>`
    );
  }

  // Обаботчик по форме Submit
  setSabmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  // Обработчик по кнопке Delete
  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__delete`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
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

  _subscribeOnColors() {
    const colors = this._element.querySelector(`.card__colors-wrap`);
    colors.addEventListener(`click`, (evt) => {
      const colorInput = evt.target.closest(`.card__color-input`);
      if (colorInput) {
        this._cardColor = colorInput.value;
        this.rerender();
      }
    });
  }

  _subscribeOnDescription() {
    this._element.querySelector(`.card__text`)
    .addEventListener(`input`, (evt) => {
      this._currentDescription = evt.target.value;

      const saveButton = this.getElement().querySelector(`.card__save`);
      saveButton.disabled = !isAllowableDescriptionLength(this._currentDescription);
    });
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      // При своем создании `flatpickr` дополнительно создает вспомогательные DOM-элементы.
      // Что бы их удалять, нужно вызывать метод `destroy` у созданного инстанса `flatpickr`.
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    if (this._isDateShowing) {
      const dateElement = this.getElement().querySelector(`.card__date`);
      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this._dueDate || `today`,
        onClose: (selectedDates) => {
          this._dueDate = selectedDates[0];
          this.rerender();
        }
      });
    }
  }
}
