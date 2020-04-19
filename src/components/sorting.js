import AbstractComponent from "./abstract-component";


export default class SortCopmonent extends AbstractComponent {
  getTemplate() {
    return `<div class="board__filter-list">
    <a href="#" class="board__filter">SORT BY DEFAULT</a>
    <a href="#" class="board__filter">SORT BY DATE up</a>
    <a href="#" class="board__filter">SORT BY DATE down</a>
  </div>`;
  }
}
