import BoardController from "./controllers/board";
import FilterController from "./controllers/filter";

import TaskListModel from './models/task-list.js';

import SiteMenuComponent, {MenuItem} from "./components/menu";
import ContentComponent from "./components/content";
import StatisticsComponent from './components/statistics.js';

import {generateTaskData} from "./mock-data/task.data";

import {render, RenderPosition} from "./utils/render";
import "../node_modules/flatpickr/dist/flatpickr.min.css";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const contentComponent = new ContentComponent();

const taskListData = generateTaskData(22);
const taskListModel = new TaskListModel();
taskListModel.setTasks(taskListData);

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

const boardController = new BoardController(contentComponent, taskListModel);
boardController.render();

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
