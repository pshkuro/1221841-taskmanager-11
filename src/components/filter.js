import {createElement} from "../util";
import FilterMarkupComponent from "./filter-markup";

export default class FilterCopmonent {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    this._filterMarkup = this._filters.map((filter, i) => new FilterMarkupComponent(filter, i === 0).getTemplate()).join(`\n`);
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


