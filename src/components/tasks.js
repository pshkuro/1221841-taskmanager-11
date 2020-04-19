import AbstractComponent from "./abstract-component";


export default class TasksCopmonent extends AbstractComponent {
  getTemplate() {
    return (
      `<div class="board__tasks"></div>`
    );
  }
}
