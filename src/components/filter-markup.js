import {createElement} from "../util";

export default class FilterMarkupComponent {
  constructor(filter, isChecked) {
    this._isChecked = isChecked;
    this._element = null;

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
