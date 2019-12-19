import BoardController from "./controllers/board";
import TaskListModel from './models/task-list.js';

import SiteMenuComponent from "./components/menu";
import FilterComponent from "./components/filter";
import ContentComponent from "./components/content";

import {generateTaskData} from "./mock-data/task.data";
import {getFilterData} from "./mock-data/filter.data";

import {render, RenderPosition} from "./utils/render";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const contentComponent = new ContentComponent();

import "../node_modules/flatpickr/dist/flatpickr.min.css";

const taskListData = generateTaskData(22);
const taskListModel = new TaskListModel();
taskListModel.setTasks(taskListData);

render(siteHeaderElement, new SiteMenuComponent(), RenderPosition.BEFOREEND);

const filterData = getFilterData(taskListData);

render(siteMainElement, new FilterComponent(filterData), RenderPosition.BEFOREEND);
render(siteMainElement, contentComponent, RenderPosition.BEFOREEND);

const boardController = new BoardController(contentComponent, taskListModel);

boardController.render();
