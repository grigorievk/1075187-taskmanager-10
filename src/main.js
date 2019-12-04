import {createSiteMenuTemplate} from "./components/menu";
import {createFilterTemplate} from "./components/filter";
import {createContentTemplate} from "./components/content";
import {createFilterBoardTemplate} from "./components/filter-board";
import {createTaskEditTemplate} from "./components/task-edit";
import {createTaskTemplate} from "./components/task";
import {createButtonLoadMoreTemplate} from "./components/button-more";

import {getTaskData, generateTaskData} from "./mock-data/task.data";
import {getFilterData} from "./mock-data/filter.data";

const TASK_PER_PAGE = 8;
// let currentTaskSlot = 1;
let taskData = generateTaskData((TASK_PER_PAGE * 3) + 1); // generate 3 slots of cards + 1 for first editable card
const firstTaskData = taskData.shift();

function render(selector, template, placing) {
  document.querySelector(selector).insertAdjacentHTML(placing, template);
}

render(`.main__control`, createSiteMenuTemplate(), `beforeend`);

const filterData = getFilterData(taskData);
render(`.main`, createFilterTemplate(filterData), `beforeend`);
render(`.main`, createContentTemplate(), `beforeend`);
render(`.board.container`, createFilterBoardTemplate(), `afterbegin`);

const taskListSelector = `.board__tasks`;
render(taskListSelector, createTaskEditTemplate(firstTaskData), `beforeend`);

new Array((TASK_PER_PAGE - 1)) // exclude first editable task
  .fill(``)
  .map((e, i) => {
    return render(taskListSelector, createTaskTemplate(taskData[i]), `beforeend`);
  })
  .join(``);

render(`.board`, createButtonLoadMoreTemplate(), `beforeend`);
