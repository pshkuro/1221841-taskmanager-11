import AbstractComponent from "./abstract-component";

// Добавляем dataset атрибут, чтобы узнать, какой тип сортировки нам нужен
export const SortType = {
  DEFAULT: `default`,
  DATE_UP: `date-up`,
  DATE_DOWN: `date-down`
};

export default class SortCopmonent extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return `<div class="board__filter-list">
    <a href="#" data-sort-type="${SortType.DEFAULT}" class="board__filter">SORT BY DEFAULT</a>
    <a href="#" data-sort-type="${SortType.DATE_UP}" class="board__filter">SORT BY DATE up</a>
    <a href="#" data-sort-type="${SortType.DATE_DOWN}" class="board__filter">SORT BY DATE down</a>
  </div>`;
  }

  // Возвращает нам тип сортировки
  getSortType() {
    return this._currentSortType;
  }

  // В обработчик будем передавать полученный тип
  // А обработчик на основе типа сортировки будет сортировать задачи и перерендеривать их
  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      // Если клик произошел не по ссылке(в нашем случае по тегу a), прерываем
      // tag name is always in the canonical upper-case form.
      if (evt.target.tagName !== `A`) {
        return;
      }

      // Определяем, по какой из сортировок произошел клик
      // Атрибуты, состоящие из нескольких слов, к примеру data-order-state,
      // становятся свойствами, записанными с помощью верблюжьей нотации: dataset.orderState
      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;
      handler(this._currentSortType);
    });
  }
}
