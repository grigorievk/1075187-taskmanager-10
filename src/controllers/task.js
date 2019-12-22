import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import {render, remove, RenderPosition, replace} from "../utils/render";
import {Mode, EmptyTask} from "../data/const";

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(taskData, mode) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;

    this._mode = mode;
    this._taskComponent = new TaskComponent(taskData);
    this._taskEditComponent = new TaskEditComponent(taskData);

    this._taskComponent.setArchiveButtonClickHandler(() => {
      this._onDataChange(this, taskData, Object.assign({}, taskData, {
        isArchive: !taskData.isArchive,
      }));
    });

    this._taskComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this, taskData, Object.assign({}, taskData, {
        isFavorite: !taskData.isFavorite,
      }));
    });

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskEditComponent.setSubmitHandler((event) => {
      event.preventDefault();
      const data = this._taskEditComponent.getData();
      this._onDataChange(this, taskData, data);
    });

    this._taskEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, taskData, null));

    switch (mode) {
      case Mode.DEFAULT:
        if (oldTaskEditComponent && oldTaskComponent) {
          replace(oldTaskComponent, this._taskComponent);
          replace(oldTaskEditComponent, this._taskEditComponent);
          this._replaceEditToTask();
        } else {
          render(this._container, this._taskComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldTaskEditComponent && oldTaskComponent) {
          remove(oldTaskComponent);
          remove(oldTaskEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._taskEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  destroy() {
    remove(this._taskEditComponent);
    remove(this._taskComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  _replaceEditToTask() {
    this._taskEditComponent.reset();

    if (document.contains(this._taskEditComponent.getElement())) {
      replace(this._taskEditComponent, this._taskComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _replaceTaskToEdit() {
    this._onViewChange();

    replace(this._taskComponent, this._taskEditComponent);
    this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyTask, null);
      }

      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
