// Чтобы перерисовывать себя при интерактивности

import AbstractComponent from "./abstract-component";

export default class AbstractSmartComponent extends AbstractComponent {

  // Необходимо в наследниках восстанавливать обработчики событий после перерисовки
  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  rerender() {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;

    // Удаляет старый DOM-эл
    this.removeElement();

    // Заводит новый
    const newElement = this.getElement();

    // Заменяет старый на новый
    parent.replaceChild(newElement, oldElement);

    // Вешает заново обработчики
    this.recoveryListeners();
  }
}
