import SiteMenuComponent from "./components/menu";
import FilterComponent from "./components/filter";
import ContentComponent from "./components/content";
import FilterBoardComponent from "./components/filter-board";
import TaskEditComponent from "./components/task-edit";
import TaskComponent from "./components/task";
import LoadMoreButtonComponent from "./components/button-more";

import {generateTaskData} from "./mock-data/task.data";
import {getFilterData} from "./mock-data/filter.data";

import {render, RenderPosition} from "./utils";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const contentComponent = new ContentComponent();
const taskListElement = contentComponent.getElement().querySelector(`.board__tasks`);
const TASK_PER_PAGE = 8;
let currentTaskSlot = 1;
let taskData = generateTaskData(TASK_PER_PAGE * 3); // generate 3 slots of cards + 1 for first editable card
const generateTaskTemplate = (data, count) => {
  new Array(count)
    .fill(``)
    .map((e, i) => {
      const taskComponent = new TaskComponent(data[i]);
      const taskEditComponent = new TaskEditComponent(data[i]);
      const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
      const editForm = taskEditComponent.getElement().querySelector(`form`);

      editButton.addEventListener(`click`, () => {
        taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
      });

      editForm.addEventListener(`submit`, () => {
        taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
      });

      return render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
    })
    .join(``);
};

render(siteHeaderElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND);

const filterData = getFilterData(taskData);

render(siteMainElement, new FilterComponent(filterData).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, contentComponent.getElement(), RenderPosition.BEFOREEND);
render(contentComponent.getElement(), new FilterBoardComponent().getElement(), RenderPosition.AFTERBEGIN);

generateTaskTemplate(taskData, TASK_PER_PAGE);

render(contentComponent.getElement(), new LoadMoreButtonComponent().getElement(), RenderPosition.BEFOREEND);

document.addEventListener(`click`, (event) => {
  if (event.target && event.target.classList.contains(`load-more`)) {
    const dataFrom = currentTaskSlot * TASK_PER_PAGE;
    const dataTo = dataFrom + TASK_PER_PAGE;
    const moreTaskData = taskData.slice(dataFrom, dataTo);

    generateTaskTemplate(moreTaskData, TASK_PER_PAGE);
    currentTaskSlot++;

    if (dataTo === taskData.length) {
      event.target.classList.add(`visually-hidden`);
    }
  }
});
