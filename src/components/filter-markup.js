import AbstractComponent from "./abstract-component";

export default class FilterMarkupComponent extends AbstractComponent {
  constructor(filter, isChecked) {
    super();
    this._isChecked = isChecked;


    this._name = filter.name;
    this._count = filter.count;
  }

  getTemplate() {
    return (
      `<input
        type="radio"
        id="filter__${this._name}"
        class="filter__input visually-hidden"
        name="filter"
        ${this._isChecked ? `checked` : ``}
      />
      <label for="filter__${this._name}" class="filter__label">
        ${this._name} <span class="filter__${this._name}-count">${this._count}</span></label
      >`
    );
  }
}
