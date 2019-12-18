export default class Tasks {
  constructor() {
    this._taskListData = [];
  }

  getTasks() {
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
}
