import AbstractComponent from "./abstract-component";

export const MenuItem = {
  NEW_TASK: `control__new-task`,
  STATISTICS: `control__statistic`,
  TASKS: `control__task`,
};

export default class SiteMenuCopmonent extends AbstractComponent {

  // подписка на активирование выбранного пункта меню
  setActiveItem(menuItem) {
    const item = this.getElement().querySelector(`#${menuItem}`);

    if (item) {
      item.checked = true;
    }
  }

  // Подписка на событие выбранного пункта меню
  setOnChange(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }

      const menuItem = evt.target.id;

      handler(menuItem);
    });
  }

  getTemplate() {
    return (
      `<section class="control__btn-wrap">
        <input
          type="radio"
          name="control"
          id="control__new-task"
          class="control__input visually-hidden"
        />
        <label for="control__new-task" class="control__label control__label--new-task"
          >+ ADD NEW TASK</label
        >
        <input
          type="radio"
          name="control"
          id="control__task"
          class="control__input visually-hidden"
          checked
        />
        <label for="control__task" class="control__label">TASKS</label>
        <input
          type="radio"
          name="control"
          id="control__statistic"
          class="control__input visually-hidden"
        />
        <label for="control__statistic" class="control__label"
          >STATISTICS</label
        >
      </section>`
    );
  }
}


