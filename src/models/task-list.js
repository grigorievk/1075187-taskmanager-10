import {getTasksByFilter} from '../utils/filter.js';
import {FilterType} from "../data/const";

export default class TaskList {
  constructor() {
    this._taskListData = [];
    this._activeFilterType = FilterType.ALL;
    this._dataChangeHandlers = [];
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

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  addTask(taskData) {
    this._taskListData = [].concat(taskData, this._taskListData);
    this._callHandlers(this._dataChangeHandlers);
  }

  removeTask(id) {
    const index = this._taskListData.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._taskListData = [].concat(this._taskListData.slice(0, index), this._taskListData.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilterChangeHandler(handler) {
    console.log(`setFilterChangeHandler`);
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
