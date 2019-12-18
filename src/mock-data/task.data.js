import {COLORS} from "../data/const";

const DescriptionList = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`,
];

const DefaultRepeatingDays = {
  'mo': false,
  'tu': false,
  'we': false,
  'th': false,
  'fr': false,
  'sa': false,
  'su': false,
};

const TagList = new Set([
  `homework`,
  `theory`,
  `practice`,
  `intensive`,
  `keks`,
]);

const getRndArrayItem = (array) => array[getRndIntNumber(array.length)];

const getRndIntNumber = (max, min = 0) => {
  return min + Math.floor((max - min) * Math.random());
};

const getRndDate = () => Date.now() + getRndIntNumber(7, 1) * 24 * 60 * 60 * 1000;

const getRndBoolean = () => Boolean(Math.round(Math.random()));

const generateRepeatingDays = () => {
  return Object.assign({}, DefaultRepeatingDays, {
    'mo': Math.random() > 0.5,
  });
};

export const getTaskData = () => {
  const dueDate = getRndBoolean() ? null : getRndDate();

  return {
    id: String(new Date() + Math.random()),
    description: getRndArrayItem(DescriptionList),
    dueDate: getRndDate(),
    repeatingDays: dueDate ? DefaultRepeatingDays : generateRepeatingDays,
    tags: TagList,
    get tagList() {
      return Array.from(TagList).filter((t, i) => i === getRndIntNumber(3));
    },
    color: getRndArrayItem(COLORS),
    isFavorite: getRndBoolean(),
    isArchive: getRndBoolean()
  };
};

export const generateTaskData = (count) => {
  return new Array(count)
    .fill(``)
    .map(getTaskData);
};
