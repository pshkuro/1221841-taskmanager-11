import {createElement} from "../util";
import FilterMarkupCopmonent from "./filter-markup";

export default class FilterCopmonent {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
    this.init();
  }

  init() {
    this._filterMarkup = this._filters.map((it, i) => new FilterMarkupCopmonent(it, i === 0).getTemplate()).join(`\n`);
  }

  getTemplate() {
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


