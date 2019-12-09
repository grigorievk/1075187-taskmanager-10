import AbstractComponent from './abstract-component.js';
import {COLORS} from "../data/const";

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

const createRepeatingDaysTemplate = (repeatingDays) => {
  return Array.from(repeatingDays)
    .map((day) => `
      <input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}-1"
        name="repeat"
        value="${day}"
      />
      <label class="card__repeat-day" for="repeat-${day}-1">${day}</label>`)
    .join(``);
};

const createTaskEditTemplate = (taskData) => {
  const {description, dueDate, repeatingDays, tagList, color} = taskData;

  const isDateShowing = !!dueDate;
  const date = isDateShowing ? new Date(dueDate).toDateString() : ``;
  const isRepeatingTask = Object.values(repeatingDays).some(Boolean);
  const repeatClass = Object.keys(repeatingDays).some((day) => repeatingDays[day]) ? `card--repeat` : ``;
  const deadlineClass = (dueDate instanceof Date && dueDate < Date.now()) ? `card--deadline` : ``;
  const colorList = createColorListTemplate(COLORS, color);
  const hashTagList = createTagListTemplate(tagList);
  const repeatingDaysList = createRepeatingDaysTemplate(repeatingDays);

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
                      <fieldset class="card__date-deadline" disabled>
                        <label class="card__input-deadline-wrap">
                          <input
                            class="card__date"
                            type="text"
                            placeholder="${date}"
                            name="date"
                            value="${date}"
                          />
                        </label>
                      </fieldset>` : ``}
                      <button class="card__repeat-toggle" type="button">
                        repeat:<span class="card__repeat-status">${isRepeatingTask ? `yes` : `no`}</span>
                      </button>
                      ${isDateShowing ? `
                      <fieldset class="card__repeat-days" disabled>
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
                  <button class="card__save" type="submit">save</button>
                  <button class="card__delete" type="button">delete</button>
                </div>
              </div>
            </form>
          </article>`;
};

export default class TaskEdit extends AbstractComponent {
  constructor(taskData) {
    super();

    this._taskData = taskData;
  }

  getTemplate() {
    return createTaskEditTemplate(this._taskData);
  }
}
