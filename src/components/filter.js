import {createElement} from "../util";

// Создание 1 блока фильтра
const createFilterMarkup = (filter, isChecked) => {
  const {name, count} = filter; // Собираем отдельные параметры в объект и исп деструктуризацию,
  // чтобы каждый раз не обращаться filter.name...

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
};


// Ф генерации блока фильтров
const createFilterTemplate = (filters) => {

  const filterMarkup = filters.map((it, i) => createFilterMarkup(it, i === 0)).join(`\n`);

  return `<section class="main__filter filter container">
    ${filterMarkup}
  </section>`;
};

export default class FilterCopmonent {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
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


