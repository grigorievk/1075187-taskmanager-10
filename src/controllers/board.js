import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import TaskListEmptyComponent from "../components/task-list-empty";
import FilterBoardComponent from "../components/filter-board";
import LoadMoreButtonComponent from "../components/button-more";

import {render, RenderPosition, replace} from "../utils/render";
import {TASK_PER_PAGE} from "../data/const";

let currentTaskSlot = 1;

const generateTaskTemplate = (taskListElement, data, count) => {
  new Array(count)
    .fill(``)
    .map((e, i) => {
      const taskComponent = new TaskComponent(data[i]);
      const taskEditComponent = new TaskEditComponent(data[i]);
      const onEscKeyDown = (evt) => {
        const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

        if (isEscKey) {
          replaceEditToTask();
          document.removeEventListener(`keydown`, onEscKeyDown);
        }
      };

      const replaceEditToTask = () => {
        replace(taskComponent, taskEditComponent);
      };

      const replaceTaskToEdit = () => {
        replace(taskComponent, taskEditComponent);
      };

      taskComponent.setEditButtonClickHandler(() => {
        replaceTaskToEdit();
        document.addEventListener(`keydown`, onEscKeyDown);
      });

      taskEditComponent.setSubmitHandler(replaceEditToTask);

      return render(taskListElement, taskComponent, RenderPosition.BEFOREEND);
    })
    .join(``);
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._taskListEmptyComponent = new TaskListEmptyComponent();
    this._filterBoardComponent = new FilterBoardComponent();
    this._taskListElement = this._container.getElement().querySelector(`.board__tasks`);
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(taskData) {
    const container = this._container.getElement();
    const isAllTasksArchived = taskData.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._taskListEmptyComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._filterBoardComponent, RenderPosition.AFTERBEGIN);

    generateTaskTemplate(this._taskListElement, taskData, TASK_PER_PAGE);

    render(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    document.addEventListener(`click`, (event) => {
      if (event.target && event.target.classList.contains(`load-more`)) {
        const dataFrom = currentTaskSlot * TASK_PER_PAGE;
        const dataTo = dataFrom + TASK_PER_PAGE;
        const moreTaskData = taskData.slice(dataFrom, dataTo);

        generateTaskTemplate(this._taskListElement, moreTaskData, TASK_PER_PAGE);
        currentTaskSlot++;

        if (dataTo === taskData.length) {
          event.target.classList.add(`visually-hidden`);
        }
      }
    });
  }
}
