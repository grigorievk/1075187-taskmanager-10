import TaskListComponent from "../components/task-list";
import TaskListEmptyComponent from "../components/task-list-empty";
import SortComponent from "../components/sort";
import LoadMoreButtonComponent from "../components/button-more";

import {remove, render, RenderPosition} from "../utils/render";
import {
  SHOWING_TASKS_COUNT_BY_BUTTON,
  SHOWING_TASKS_COUNT_ON_START,
  SortType,
  Mode as TaskControllerMode,
  EmptyTask
} from "../data/const";
import TaskController from "./task";

const generateTaskList = (taskListElement, taskListData, onDataChange, onViewChange) => {
  return taskListData.map((taskData) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.render(taskData, TaskControllerMode.DEFAULT);

    return taskController;
  });
};

export default class BoardController {
  constructor(container, taskListModel, api) {
    this._container = container;
    this._taskListModel = taskListModel;
    this._showedTaskControllers = [];
    this._api = api;
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    this._taskListEmptyComponent = new TaskListEmptyComponent();
    this._sortComponent = new SortComponent();
    this._taskListElement = new TaskListComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._creatingTask = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._taskListModel.setFilterChangeHandler(this._onFilterChange);
  }

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }

  render() {
    const container = this._container.getElement();
    const taskListData = this._taskListModel.getTasks();
    const isAllTasksArchived = taskListData.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._taskListEmptyComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.AFTERBEGIN);
    render(container, this._taskListElement, RenderPosition.BEFOREEND);

    this._renderTaskList(taskListData.slice(0, this._showingTasksCount));

    this._renderLoadMoreButton();
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }

    const taskListElement = this._taskListElement.getElement();
    const container = this._container.getElement();
    if (!document.querySelector(`.board__tasks`)) {
      render(container, this._taskListElement, RenderPosition.BEFOREEND);
    }

    this._creatingTask = new TaskController(taskListElement, this._onDataChange, this._onViewChange);
    this._creatingTask.render(EmptyTask, TaskControllerMode.ADDING);
  }

  _removeTaskList() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }
  _renderTaskList(taskListData) {
    const taskListElement = this._taskListElement.getElement();

    const newTasks = generateTaskList(taskListElement, taskListData, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._showingTasksCount = this._showedTaskControllers.length;
  }

  _updateTaskList(count) {
    this._removeTaskList();
    this._renderTaskList(this._taskListModel.getTasks().slice(0, count));
    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    remove(this._loadMoreButtonComponent);

    if (this._showingTasksCount >= this._taskListModel.getTasks().length) {
      return;
    }

    const container = this._container.getElement();
    render(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);
    this._loadMoreButtonComponent.setClickHandler(this._onLoadMoreButtonClick);
  }

  _onSortTypeChange(sortType) {
    let sortedTasks = [];
    const taskListData = this._taskListModel.getTasks();

    switch (sortType) {
      case SortType.DATE_UP:
        sortedTasks = taskListData.slice().sort((a, b) => a.dueDate - b.dueDate);
        break;
      case SortType.DATE_DOWN:
        sortedTasks = taskListData.slice().sort((a, b) => b.dueDate - a.dueDate);
        break;
      case SortType.DEFAULT:
        sortedTasks = taskListData.slice();
        break;
    }

    this._removeTaskList();
    this._renderTaskList(sortedTasks);

    if (sortType === SortType.DEFAULT) {
      this._renderLoadMoreButton();
    } else {
      remove(this._loadMoreButtonComponent);
    }
  }

  _onDataChange(taskController, oldTaskData, newTaskData) {
    if (oldTaskData === EmptyTask) {
      this._creatingTask = null;
      if (newTaskData === null) {
        taskController.destroy();
        this._updateTaskList(this._showingTasksCount);
      } else {
        this._api.createTask(newTaskData)
          .then((taskModel) => {
            this._taskListModel.addTask(taskModel);
            taskController.render(taskModel, TaskControllerMode.DEFAULT);

            const destroyedTask = this._showedTaskControllers.pop();
            destroyedTask.destroy();

            this._showedTaskControllers = [].concat(taskController, this._showedTaskControllers);
            this._showingTasksCount = this._showedTaskControllers.length;
          })
          .catch(() => {
            taskController.shake();
          });
      }
    } else if (newTaskData === null) {
      this._api.deleteTask(oldTaskData.id)
        .then(() => {
          this._taskListModel.removeTask(oldTaskData.id);
          this._updateTaskList(this._showingTasksCount);
        })
        .catch(() => {
          taskController.shake();
        });
    } else {
      this._api.updateTask(oldTaskData.id, newTaskData)
        .then((taskModel) => {
          const isSuccess = this._taskListModel.updateTask(oldTaskData.id, taskModel);

          if (isSuccess) {
            taskController.render(taskModel, TaskControllerMode.DEFAULT);
            this._updateTaskList(this._showingTasksCount);
          }
        })
        .catch(() => {
          taskController.shake();
        });
    }

  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._updateTaskList(SHOWING_TASKS_COUNT_ON_START);
  }

  _onLoadMoreButtonClick() {
    const prevTasksCount = this._showingTasksCount;
    const taskListData = this._taskListModel.getTasks();

    this._showingTasksCount = this._showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    this._renderTaskList(taskListData.slice(prevTasksCount, this._showingTasksCount));

    if (this._showingTasksCount >= taskListData.length) {
      remove(this._loadMoreButtonComponent);
    }
  }


}
