import {createElement} from "../utils";

const createContentTemplate = () => {
  return `<section class="board container">
            <div class="board__tasks"></div>
          </section>`;
};

export default class Content {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createContentTemplate();
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
