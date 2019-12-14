import AbstractComponent from './abstract-component.js';

const createHashTagTemplate = (tagList) => {
  return Array.from(tagList)
    .map((tag) => {
      return (
        `<span class="card__hashtag-inner">
            <span class="card__hashtag-name">
              #${tag}
            </span>
          </span>`
      );
    })
    .join(`\n`);
};

const createTaskTemplate = (taskData) => {
  const {description, dueDate, repeatingDays, tagList, color} = taskData;

  const isDateShowing = !!dueDate;
  const repeatClass = Object.keys(repeatingDays).some((day) => repeatingDays[day]) ? `card--repeat` : ``;
  const deadlineClass = (dueDate instanceof Date && dueDate < Date.now()) ? `card--deadline` : ``;
  const date = isDateShowing ? new Date(dueDate).toDateString() : ``;
  const hashtagList = createHashTagTemplate(tagList);

  return `<article class="card card--${color} ${repeatClass} ${deadlineClass}">
            <div class="card__form">
              <div class="card__inner">
                <div class="card__control">
                  <button type="button" class="card__btn card__btn--edit">
                    edit
                  </button>
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
                  <svg class="card__color-bar-wave" width="100%" height="10">
                    <use xlink:href="#wave"></use>
                  </svg>
                </div>
                <div class="card__textarea-wrap">
                  <p class="card__text">${description}</p>
                </div>
                <div class="card__settings">
                  <div class="card__details">
                    <div class="card__dates">
                      <div class="card__date-deadline">
                        <p class="card__input-deadline-wrap">
                          <span class="card__date">${date}</span>
<!--                          <span class="card__time">11:15 PM</span>-->
                        </p>
                      </div>
                    </div>
                    <div class="card__hashtag">
                      <div class="card__hashtag-list">
                         ${hashtagList}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>`;
};

export default class Task extends AbstractComponent {
  constructor(task) {
    super();

    this._task = task;
  }

  getTemplate() {
    return createTaskTemplate(this._task);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--edit`)
      .addEventListener(`click`, handler);
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--favorites`)
      .addEventListener(`click`, handler);
  }

  setArchiveButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--archive`)
      .addEventListener(`click`, handler);
  }
}
