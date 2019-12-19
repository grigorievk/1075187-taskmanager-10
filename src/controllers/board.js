import TaskListComponent from "../components/task-list";
import TaskListEmptyComponent from "../components/task-list-empty";
import SortComponent from "../components/sort";
import LoadMoreButtonComponent from "../components/button-more";

import {remove, render, RenderPosition} from "../utils/render";
import {TASK_PER_PAGE, SortType} from "../data/const";
import TaskController from "./task";

let currentTaskSlot = 1;

const generateTaskList = (taskListElement, data, count, onDataChange, onViewChange) => {
  return data.map((e, i) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
    taskController.render(data[i]);

    return taskController;
  });
};

export default class BoardController {
  constructor(container, taskListModel) {
    this._container = container;
    this._taskListModel = taskListModel;

    this._showedTaskControllers = [];

    this._taskListEmptyComponent = new TaskListEmptyComponent();
    this._sortComponent = new SortComponent();
    this._taskListElement = new TaskListComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._taskListModel.setFilterChangeHandler(this._onFilterChange);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
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

    this._renderTasks(taskListData.slice(0, this._showingTasksCount));
    this._showedTaskControllers = this._showedTaskControllers.concat(generateTaskList);

    render(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    document.addEventListener(`click`, (event) => {
      if (event.target && event.target.classList.contains(`load-more`)) {
        const dataFrom = currentTaskSlot * TASK_PER_PAGE;
        const dataTo = dataFrom + TASK_PER_PAGE;
        const moreTaskData = taskListData.slice(dataFrom, dataTo);

        generateTaskList(this._taskListElement, moreTaskData, TASK_PER_PAGE, this._onDataChange, this._onViewChange);
        currentTaskSlot++;

        if (dataTo === taskListData.length) {
          event.target.classList.add(`visually-hidden`);
        }
      }
    });
  }

  _renderTasks(taskListData) {
    const taskListElement = this._taskListElement.getElement();

    const newTasks = generateTaskList(taskListElement, taskListData, TASK_PER_PAGE, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._showingTasksCount = this._showedTaskControllers.length;
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

    const newTasks = generateTaskList(this._taskListElement, sortedTasks, TASK_PER_PAGE, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = newTasks;

    if (sortType === SortType.DEFAULT) {
      //this._renderLoadMoreButton();
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
  }
}
