import {createElement} from "../util";

export default class FilterCopmonent {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getFilterMarkupTemplate(filter, isChecked) {
    const {name, count} = filter;
    return (
      `<input
        type="radio"
        id="filter__${name}"
        class="filter__input visually-hidden"
        name="filter"
        ${isChecked ? `checked` : ``}
      />
      <label for="filter__${name}" class="filter__label">
        ${name} <span class="filter__${name}-count">${count}</span></label
      >`
    );
  }

  getTemplate() {

    this._filterMarkup = this._filters.map((it, i) => this.getFilterMarkupTemplate(it, i === 0)).join(`\n`);

    return `<section class="main__filter filter container">
              ${this._filterMarkup}
            </section>`;
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


