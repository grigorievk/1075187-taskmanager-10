import AbstractComponent from "./abstract-component";

const createContentTemplate = () => {
  return `<section class="board container">
            <div class="board__tasks"></div>
          </section>`;
};

export default class Content extends AbstractComponent {
  getTemplate() {
    return createContentTemplate();
  }
}
