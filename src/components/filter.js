import AbstractComponent from "./abstract-component";
import FilterMarkupComponent from "./filter-markup";

const FILTER_ID_PREFIX = `filter__`;

// Извлекает имя фильтра
const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length); // метод substring() и свойство length для извлечения последних символов из строки
};

export default class FilterCopmonent extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    const filterMarkup = this._filters.map((filter) => new FilterMarkupComponent(filter, filter.checked).getTemplate()).join(`\n`);
    return `<section class="main__filter filter container">
              ${filterMarkup}
            </section>`;
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id); // имя фильтра, кот изменился
      handler(filterName);
    });
  }
}


