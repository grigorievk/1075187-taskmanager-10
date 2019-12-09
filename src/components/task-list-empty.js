import AbstractComponent from './abstract-component.js';

const createTaskListEmptyTemplate = () => {
  return (
    `<p class="board__no-tasks">
      Click «ADD NEW TASK» in menu to create your first task
    </p>`
  );
};

export default class TaskListEmpty extends AbstractComponent {
  getTemplate() {
    return createTaskListEmptyTemplate();
  }
}
