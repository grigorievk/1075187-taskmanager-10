import SiteMenuComponent from "./components/menu";
import FilterComponent from "./components/filter";
import ContentComponent from "./components/content";

import {generateTaskData} from "./mock-data/task.data";
import {getFilterData} from "./mock-data/filter.data";

import {render, RenderPosition} from "./utils/render";
import BoardController from "./controllers/board";
import {TASK_PER_PAGE} from "./data/const";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const contentComponent = new ContentComponent();

let taskData = generateTaskData(TASK_PER_PAGE * 3); // generate 3 slots of cards

render(siteHeaderElement, new SiteMenuComponent(), RenderPosition.BEFOREEND);

const filterData = getFilterData(taskData);

render(siteMainElement, new FilterComponent(filterData), RenderPosition.BEFOREEND);
render(siteMainElement, contentComponent, RenderPosition.BEFOREEND);

const boardController = new BoardController(contentComponent);

boardController.render(taskData);
