import AbstractComponent from "./abstract-component";

export default class LoadingComponent extends AbstractComponent {
  getTemplate() {
    return (`<section class="board container">
    <p class="board__no-tasks">
      Loading...
    </p>
  </section>`);
  }
}
