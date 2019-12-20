export const COLOR = {
  BLACK: `black`,
  YELLOW: `yellow`,
  BLUE: `blue`,
  GREEN: `green`,
  PINK: `pink`,
};

export const COLOR_LIST = [
  COLOR.BLACK,
  COLOR.YELLOW,
  COLOR.BLUE,
  COLOR.GREEN,
  COLOR.PINK
];

export const DAYS = [`mo`, `tu`, `we`, `th`, `fr`, `sa`, `su`];

export const SortType = {
  DATE_DOWN: `date-down`,
  DATE_UP: `date-up`,
  DEFAULT: `default`,
};

export const FilterType = {
  ALL: `all`,
  ARCHIVE: `archive`,
  FAVORITES: `favorites`,
  OVERDUE: `overdue`,
  REPEATING: `repeating`,
  TAGS: `tags`,
  TODAY: `today`,
};

export const SHOWING_TASKS_COUNT_ON_START = 8;
export const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    'mo': false,
    'tu': false,
    'we': false,
    'th': false,
    'fr': false,
    'sa': false,
    'su': false,
  },
  tags: [],
  color: COLOR.BLACK,
  isFavorite: false,
  isArchive: false,
};
