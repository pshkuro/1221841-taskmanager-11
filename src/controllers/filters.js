import FilterCopmonent from "../components/filter";
import {FilterType} from "../const";
import {getTasksByFilter} from "../utils/filters";
import {renderPosition, render, replace} from "../utils/render";

export default class FiltersController {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;

    this._activeFilterType = FilterType.ALL; // текущий выбранный фильтр
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._tasksModel.setDataChangeHandler(this._onDataChange); // подписка на обновление тасков
    // задача обновилась -> вызывается callback this._onDataChange -> фильтры обновляются
  }

  render() {
    const container = this._container;
    const allTasks = this._tasksModel.getAllTasks();

    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getTasksByFilter(allTasks, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterCopmonent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange); // подписка на нажатие по фильтру, в зав-ти от его типа

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, renderPosition.BEFOREEND);
    }
  }

  rerender() {
    this._activeFilterType = FilterType.ALL;
    this.render();
    this._tasksModel.setFilters(FilterType.ALL);
  }

  _onFilterChange(filterType) {
    this._tasksModel.setFilters(filterType); // уведомляет всех кому интересно, что фильтр изменился
    this._activeFilterType = filterType; // текущий выбранный фильтр
  }

  _onDataChange() {
    this.render();
  }
}


