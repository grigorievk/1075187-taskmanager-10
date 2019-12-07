import {createElement} from "../utils";

const createFilterBoardTemplate = () => {
  return `<div class="board__filter-list">
          <a href="#" class="board__filter">SORT BY DEFAULT</a>
          <a href="#" class="board__filter">SORT BY DATE up</a>
          <a href="#" class="board__filter">SORT BY DATE down</a>
        </div>`;
};

export default class FilterBoard {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilterBoardTemplate();
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
