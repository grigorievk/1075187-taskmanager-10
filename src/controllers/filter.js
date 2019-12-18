import {FilterType} from "../data/const";
import {getTasksByFilter} from "../utils/filter";
import FilterComponent from "../components/filter";
import {render, RenderPosition, replace} from "../utils/render";

export default class FilterController {
  constructor(container, taskListModel) {
    this._container = container;
    this._taskListModel = taskListModel;
    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  render() {
    const container = this._container;
    const allTasks = this._taskListModel.getTasksAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getTasksByFilter(allTasks, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._taskListModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }
}
