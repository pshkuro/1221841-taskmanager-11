import {createElement} from "../util";

export default class FilterMarkupCopmonent {
  constructor(filters, isChecked) {
    this._filters = filters;
    this._isChecked = isChecked;
    this._element = null;
    this.init();
  }

  init() {
    const {name, count} = this._filters;
    this._name = name;
    this._count = count;
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
