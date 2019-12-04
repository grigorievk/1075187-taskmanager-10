import {createSiteMenuTemplate} from "./components/menu";
import {createFilterTemplate} from "./components/filter";
import {createContentTemplate} from "./components/content";
import {createFilterBoardTemplate} from "./components/filter-board";
import {createTaskEditTemplate} from "./components/task-edit";
import {createTaskTemplate} from "./components/task";
import {createButtonLoadMoreTemplate} from "./components/button-more";

import {generateTaskData} from "./mock-data/task.data";
import {getFilterData} from "./mock-data/filter.data";

const taskListSelector = `.board__tasks`;
const TASK_PER_PAGE = 8;
let currentTaskSlot = 1;
let taskData = generateTaskData((TASK_PER_PAGE * 3) + 1); // generate 3 slots of cards + 1 for first editable card
const firstTaskData = taskData.shift();
const generateTaskTemplate = (data, count) => {
  new Array(count)
    .fill(``)
    .map((e, i) => {
      return render(taskListSelector, createTaskTemplate(data[i]), `beforeend`);
    })
    .join(``);
};

function render(selector, template, placing) {
  document.querySelector(selector).insertAdjacentHTML(placing, template);
}

render(`.main__control`, createSiteMenuTemplate(), `beforeend`);

const filterData = getFilterData(taskData);
render(`.main`, createFilterTemplate(filterData), `beforeend`);
render(`.main`, createContentTemplate(), `beforeend`);
render(`.board.container`, createFilterBoardTemplate(), `afterbegin`);
render(taskListSelector, createTaskEditTemplate(firstTaskData), `beforeend`);

generateTaskTemplate(taskData, (TASK_PER_PAGE - 1)); // exclude first editable task

render(`.board`, createButtonLoadMoreTemplate(), `beforeend`);

document.addEventListener(`click`, (event) => {
  if (event.target && event.target.classList.contains(`load-more`)){
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
