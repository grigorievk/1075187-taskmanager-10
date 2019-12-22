import AbstractComponent from "./abstract-component";

const createTaskListTemplate = () => {
  return `<div class="board__tasks"></div>`;
};

export default class TaskList extends AbstractComponent {
  getTemplate() {
    return createTaskListTemplate();
  }
}
