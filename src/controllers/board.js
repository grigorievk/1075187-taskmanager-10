import TaskListComponent from "../components/task-list";
import TaskListEmptyComponent from "../components/task-list-empty";
import SortComponent from "../components/sort";
import LoadMoreButtonComponent from "../components/button-more";

import {remove, render, RenderPosition} from "../utils/render";
import {SHOWING_TASKS_COUNT_BY_BUTTON, SHOWING_TASKS_COUNT_ON_START, SortType} from "../data/const";
import TaskController from "./task";

const generateTaskList = (taskListElement, taskListData, onDataChange, onViewChange) => {
  return taskListData.map((taskData) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.render(taskData);

    return taskController;
  });
};

export default class BoardController {
  constructor(container, taskListModel) {
    this._container = container;
    this._taskListModel = taskListModel;
    this._showedTaskControllers = [];
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    this._taskListEmptyComponent = new TaskListEmptyComponent();
    this._sortComponent = new SortComponent();
    this._taskListElement = new TaskListComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);

    this._taskListModel.setFilterChangeHandler(this._onFilterChange);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render() {
    const container = this._container.getElement();
    const taskListData = [...this._taskListModel.getTasks()];
    const isAllTasksArchived = taskListData.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._taskListEmptyComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.AFTERBEGIN);
    render(container, this._taskListElement, RenderPosition.BEFOREEND);

    this._renderTasks(taskListData.slice(0, this._showingTasksCount));

    this._renderLoadMoreButton();
  }

  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  _renderTasks(taskListData) {
    const taskListElement = this._taskListElement.getElement();

    const newTasks = generateTaskList(taskListElement, taskListData, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._showingTasksCount = this._showedTaskControllers.length;
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

    const taskListElement = this._taskListElement.getElement();

    taskListElement.innerHTML = ``;

    const newTasks = generateTaskList(this._taskListElement, sortedTasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = newTasks;

    if (sortType === SortType.DEFAULT) {
      this._renderLoadMoreButton();
    } else {
      remove(this._loadMoreButtonComponent);
    }
  }

  _onDataChange(taskController, oldTaskData, newTaskData) {
    const isSuccess = this._taskListModel.updateTask(oldTaskData.id, newTaskData);

    if (isSuccess) {
      taskController.render(newTaskData);
    }

  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._removeTasks();
    this._renderTasks(this._taskListModel.getTasks().slice(0, SHOWING_TASKS_COUNT_ON_START));
    this._renderLoadMoreButton();
  }

  _onLoadMoreButtonClick() {
    const prevTasksCount = this._showingTasksCount;
    const taskListData = this._taskListModel.getTasks();

    this._showingTasksCount = this._showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    this._renderTasks(taskListData.slice(prevTasksCount, this._showingTasksCount));

    if (this._showingTasksCount >= taskListData.length) {
      remove(this._loadMoreButtonComponent);
    }
  }


}
