import AbstractComponent from "./abstract-component";

// Генерация блока выбора дня недели
export default class RepeatingDaysMarkupComponent extends AbstractComponent {
  constructor(days, repeatingDays) {
    super();
    this._days = days;
    this._repeatingDays = repeatingDays;
  }

  getTemplate() {
    return this._days.map((day, index) => {
      this._isChecked = this._repeatingDays[day];
      return (
        `<input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}-${index}"
        name="repeat"
        value="${day}"
        ${this._isChecked ? `checked` : ``}
      />
      <label class="card__repeat-day" for="repeat-${day}-${index}"
        >${day}</label
      >`
      );
    }).join(`\n`);
  }
}
