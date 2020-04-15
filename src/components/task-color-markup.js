import {createElement} from "../util";

// Генерация блока выбора цвета
export default class ColorMarkupComponent {
  constructor(colors, currentColor) {
    this._element = null;
    this._colors = colors;
    this._currentColor = currentColor;
  }

  getTemplate() {
    return this._colors.map((color, index) => {
      return (`<input
    type="radio"
    id="color-${color}-${index}"
    class="card__color-input card__color-input--${color} visually-hidden"
    name="color"
    value="${color}"
    ${this._currentColor === color ? `checked` : ``}
  />
  <label
    for="color-${color}-${index}"
    class="card__color card__color--${color}"
    >${color}</label
  >`);
    }).join(`\n`);
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
