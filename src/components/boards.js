import AbstractComponent from "./abstract-component";


export default class BoardCopmonent extends AbstractComponent {
  getTemplate() {
    return (
      `<section class="board container"></section>`
    );
  }

}
