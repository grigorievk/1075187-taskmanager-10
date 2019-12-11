import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import {render, RenderPosition, replace} from "../utils/render";


export default class TaskController {
  constructor(container) {
    this._container = container;

    this._taskComponent = null;
    this._taskEditComponent = null;

    //this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(taskData) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = new this._taskEditComponent;

    this._taskComponent = new TaskComponent(taskData);
    this._taskEditComponent = new TaskEditComponent(taskData);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskEditComponent.setSubmitHandler(() => this._replaceEditToTask());

    if (oldTaskEditComponent && oldTaskComponent) {
      replace(this._taskComponent, oldTaskComponent);
      replace(this._taskEditComponent, oldTaskEditComponent);
    } else {
      render(this._container, this._taskComponent, RenderPosition.BEFOREEND);
    }
  }

  _replaceEditToTask() {
    replace(this._taskComponent, this._taskEditComponent);
  }

  _replaceTaskToEdit() {
    replace(this._taskComponent, this._taskEditComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
