import flatpickr from 'flatpickr';
import {COLOR_LIST, DAYS} from "../data/const";
import AbstractSmartComponent from "./abstract-smart-component";
import {formatTime, formatDate, isRepeating, isOverdueDate} from '../utils/date-time.js';

const createColorListTemplate = (colors, currentColor) => {
  return Array.from(colors)
    .map((tagColor) => ` 
      <input
        type="radio"
        id="color-${tagColor}-1"
        class="card__color-input card__color-input--${tagColor} visually-hidden"
        name="color"
        value="${tagColor}"
        ${tagColor === currentColor ? ` checked` : ``}
      />
      <label
        for="color-${tagColor}-1"
        class="card__color card__color--${tagColor}">
        ${tagColor}
      </label>`)
    .join(`\n`);
};

const createTagListTemplate = (tagList) => {
  return Array.from(tagList)
    .map((tag) => `<label>
        <input
          type="text"
          class="card__hashtag-input"
          name="hashtag-input"
          placeholder="${tag}"
        />
      </label>`)
    .join(``);
};

const createRepeatingDaysTemplate = (days, repeatingDays) => {
  return days
    .map((day) => {
      const isChecked = repeatingDays[day];
      return (`
        <input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-${day}-1"
          name="repeat"
          value="${day}"
          ${isChecked ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-${day}-1"
          >${day}</label
        >`
      );
    })
    .join(`\n`);
};

const createTaskEditTemplate = (taskData, options = {}) => {
  const {description, dueDate, repeatingDays, tagList, color} = taskData;
  const {isDateShowing, isRepeatingTask, activeRepeatingDays} = options;

  const date = (isDateShowing && dueDate) ? formatDate(dueDate) : ``;
  const time = (isDateShowing && dueDate) ? formatTime(dueDate) : ``;
  const isDisableSaveButton = (isDateShowing && isRepeatingTask) ||
    (isRepeatingTask && !isRepeating(activeRepeatingDays));

  const repeatClass = Object.keys(repeatingDays).some((day) => repeatingDays[day]) ? `card--repeat` : ``;
  const deadlineClass = (dueDate instanceof Date && isOverdueDate(dueDate, new Date())) ? `card--deadline` : ``;
  const colorList = createColorListTemplate(COLOR_LIST, color);
  const hashTagList = createTagListTemplate(tagList);
  const repeatingDaysList = createRepeatingDaysTemplate(DAYS, activeRepeatingDays);

  return `<article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
            <form class="card__form" method="get">
              <div class="card__inner">
                <div class="card__control">
                  <button type="button" class="card__btn card__btn--archive">
                    archive
                  </button>
                  <button
                    type="button"
                    class="card__btn card__btn--favorites card__btn--disabled"
                  >
                    favorites
                  </button>
                </div>
                <div class="card__color-bar">
                  <svg width="100%" height="10">
                    <use xlink:href="#wave"></use>
                  </svg>
                </div>
                <div class="card__textarea-wrap">
                  <label>
                    <textarea
                      class="card__text"
                      placeholder="Start typing your text here..."
                      name="text"
                    >${description}</textarea>
                  </label>
                </div>
                <div class="card__settings">
                  <div class="card__details">
                    <div class="card__dates">
                      <button class="card__date-deadline-toggle" type="button">
                        date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
                      </button>
                       ${isDateShowing ? `
                      <fieldset class="card__date-deadline">
                        <label class="card__input-deadline-wrap">
                          <input
                            class="card__date"
                            type="text"
                            placeholder=""
                            name="date"
                            value="${date} ${time}"
                          />
                        </label>
                      </fieldset>` : ``}
                      <button class="card__repeat-toggle" type="button">
                        repeat:<span class="card__repeat-status">${isRepeatingTask ? `yes` : `no`}</span>
                      </button>
                      ${isRepeatingTask ? `
                        <fieldset class="card__repeat-days">
                          <div class="card__repeat-days-inner">
                            ${repeatingDaysList}
                          </div>
                    </fieldset>` : ``}
                    </div>
                    <div class="card__hashtag">
                      <div class="card__hashtag-list"></div>
                       ${hashTagList}
                    </div>
                  </div>
                  <div class="card__colors-inner">
                    <h3 class="card__colors-title">Color</h3>
                    <div class="card__colors-wrap">
                      ${colorList}
                    </div>
                  </div>
                </div>
                <div class="card__status-btns">
                  <button class="card__save" type="submit"${isDisableSaveButton ? ` disabled` : ``}>save</button>
                  <button class="card__delete" type="button">delete</button>
                </div>
              </div>
            </form>
          </article>`;
};

export default class TaskEdit extends AbstractSmartComponent {
  constructor(taskData) {
    super();

    this._taskData = taskData;
    this._isDateShowing = !!taskData.dueDate;
    this._isRepeatingTask = Object.values(taskData.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, taskData.repeatingDays);
    this._submitHandler = null;
    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTaskEditTemplate(this._taskData, {
      isDateShowing: this._isDateShowing,
      isRepeatingTask: this._isRepeatingTask,
      activeRepeatingDays: this._activeRepeatingDays,
    });
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  reset() {
    const taskData = this._taskData;

    this._isDateShowing = !!taskData.dueDate;
    this._isRepeatingTask = Object.values(taskData.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, taskData.repeatingDays);

    this.rerender();
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`)
      .addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    if (this._isDateShowing) {
      const dateElement = this.getElement().querySelector(`.card__date`);
      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this._taskData.dueDate,
      });
    }
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, () => {
        this._isDateShowing = !this._isDateShowing;

        this.rerender();
      });

    element.querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, () => {
        this._isRepeatingTask = !this._isRepeatingTask;

        this.rerender();
      });

    const repeatDays = element.querySelector(`.card__repeat-days`);
    if (repeatDays) {
      repeatDays.addEventListener(`change`, (evt) => {
        this._activeRepeatingDays[evt.target.value] = evt.target.checked;

        this.rerender();
      });
    }
  }
}
