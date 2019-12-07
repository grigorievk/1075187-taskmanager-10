import {createElement} from "../utils";

const createFilterItemTemplate = (filter) => {
  return `<input
        type="radio"
        id="filter__${filter.title.toLowerCase()}"
        class="filter__input visually-hidden"
        name="filter"
        checked
      />
      <label for="filter__${filter.title.toLowerCase()}" class="filter__label">
        ${filter.title} <span class="filter__${filter.title.toLowerCase()}-count">${filter.count}</span>
      </label>`;
};

export const createFilterTemplate = (filterData) => {
  const filterList = Array.from(filterData).map((filter) => createFilterItemTemplate(filter)).join(`\n`);

  return `<section class="main__filter filter container">
    ${filterList}
  </section>`;
};

export default class Filter {
  constructor(filterData) {
    this._filterData = filterData;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filterData);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
