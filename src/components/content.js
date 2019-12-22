import AbstractComponent from "./abstract-component";

const createContentTemplate = () => {
  return `<section class="board container"></section>`;
};

export default class Content extends AbstractComponent {
  getTemplate() {
    return createContentTemplate();
  }
}
