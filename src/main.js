import BoardController from "./controllers/board";
import FilterController from "./controllers/filter";

import TaskListModel from './models/task-list.js';

import SiteMenuComponent from "./components/menu";
import ContentComponent from "./components/content";

import {generateTaskData} from "./mock-data/task.data";

import {render, RenderPosition} from "./utils/render";
import "../node_modules/flatpickr/dist/flatpickr.min.css";

const siteMainElement = document.querySelector(`.main`);
const siteMenuComponent = new SiteMenuComponent();
siteMenuComponent.getElement().querySelector(`.control__label--new-task`)
  .addEventListener(`click`, () => {
    boardController.createTask();
  });

const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const contentComponent = new ContentComponent();

const taskListData = generateTaskData(22);
const taskListModel = new TaskListModel();
taskListModel.setTasks(taskListData);

render(siteHeaderElement, new SiteMenuComponent(), RenderPosition.BEFOREEND);

const filterController = new FilterController(siteMainElement, taskListModel);
filterController.render();

render(siteMainElement, contentComponent, RenderPosition.BEFOREEND);

const boardController = new BoardController(contentComponent, taskListModel);

boardController.render();
