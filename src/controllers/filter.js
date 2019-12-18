export default class FilterController {
  constructor(container, taskListModel) {
    this._container = container;
    this.taskListModel = taskListModel;
    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  render() {}

  _onFilterChange(filterType) {
    this.taskListModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }
}
