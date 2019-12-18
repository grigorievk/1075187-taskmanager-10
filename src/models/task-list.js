import {getTasksByFilter} from '../utils/filter.js';
import {FilterType} from "../data/const";

export default class TaskList {
  constructor() {
    this._taskListData = [];
    this._activeFilterType = FilterType.ALL;
    this._filterChangeHandlers = [];
  }

  getTasks() {
    return getTasksByFilter(this._taskListData, this._activeFilterType);
  }

  getTasksAll() {
    return this._taskListData;
  }

  setTasks(taskListData) {
    this._taskListData = Array.from(taskListData);
  }

  updateTask(id, taskData) {
    const index = this._taskListData.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    this._taskListData = [].concat(this._taskListData.slice(0, index), taskData, this._taskListData.slice(index + 1));

    return true;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }
}