import AbstractComponent from "./abstract-component";
import FilterMarkupComponent from "./filter-markup";

export default class FilterCopmonent extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    const filterMarkup = this._filters.map((filter, i) => new FilterMarkupComponent(filter, i === 0).getTemplate()).join(`\n`);
    return `<section class="main__filter filter container">
              ${filterMarkup}
            </section>`;
  }
}


