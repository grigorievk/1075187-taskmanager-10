import API from './api.js';
import BoardController from "./controllers/board";
import FilterController from "./controllers/filter";

import TaskListModel from './models/task-list.js';

import SiteMenuComponent, {MenuItem} from "./components/menu";
import ContentComponent from "./components/content";
import StatisticsComponent from './components/statistics.js';

import {render, RenderPosition} from "./utils/render";
import "../node_modules/flatpickr/dist/flatpickr.min.css";

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/task-manager`;
const api = new API(END_POINT, AUTHORIZATION);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const contentComponent = new ContentComponent();

const taskListModel = new TaskListModel();

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();
const statisticsComponent = new StatisticsComponent({taskData: taskListModel, dateFrom, dateTo});

const siteMenuComponent = new SiteMenuComponent();
render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);

const filterController = new FilterController(siteMainElement, taskListModel);
filterController.render();

render(siteMainElement, contentComponent, RenderPosition.BEFOREEND);
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);

const boardController = new BoardController(contentComponent, taskListModel, api);

statisticsComponent.hide();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      statisticsComponent.hide();
      boardController.show();
      boardController.createTask();
      break;
    case MenuItem.STATISTICS:
      boardController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TASKS:
      statisticsComponent.hide();
      boardController.show();
      break;
  }
});

api.getTasks()
  .then((taskListData) => {
    taskListModel.setTasks(taskListData);
    boardController.render();
  });
