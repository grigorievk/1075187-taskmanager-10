import AbstractComponent from './abstract-component.js';

const FILTER_ID_PREFIX = `filter__`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const createFilterItemTemplate = (filter) => {
  return `<input
        type="radio"
        id="filter__${filter.title.toLowerCase()}"
        class="filter__input visually-hidden"
        name="filter"
        ${filter.checked ? `checked` : ``}
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

export default class Filter extends AbstractComponent {
  constructor(filterData) {
    super();
    this._filterData = filterData;
  }

  getTemplate() {
    return createFilterTemplate(this._filterData);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      console.log(`filterName`, filterName);
      handler(filterName);
    });
  }
}
