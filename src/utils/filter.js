import {isOneDay, isOverdueDate, isRepeating} from "./date-time";
import {FilterType} from '../data/const';

export const getArchiveTasks = (taskListData) => {
  return taskListData.filter((taskData) => taskData.isArchive);
};

export const getNotArchiveTasks = (taskListData) => {
  return taskListData.filter((taskData) => !taskData.isArchive);
};

export const getFavoriteTasks = (taskListData) => {
  return taskListData.filter((taskData) => taskData.isFavorite);
};

export const getOverdueTasks = (taskListData, date) => {
  return taskListData.filter((taskData) => {
    const dueDate = taskData.dueDate;

    if (!dueDate) {
      return false;
    }

    return isOverdueDate(dueDate, date);
  });
};

export const getRepeatingTasks = (taskListData) => {
  return taskListData.filter((taskData) => isRepeating(taskData.repeatingDays));
};

export const getTasksWithHashtags = (taskListData) => {
  return taskListData.filter((taskData) => taskData.tags.size);
};

export const getTasksInOneDay = (taskListData, date) => {
  return taskListData.filter((taskData) => isOneDay(taskData.dueDate, date));
};

export const getTasksByFilter = (taskListData, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.ALL:
      return getNotArchiveTasks(taskListData);
    case FilterType.ARCHIVE:
      return getArchiveTasks(taskListData);
    case FilterType.FAVORITES:
      return getFavoriteTasks(getNotArchiveTasks(taskListData));
    case FilterType.OVERDUE:
      return getOverdueTasks(getNotArchiveTasks(taskListData), nowDate);
    case FilterType.REPEATING:
      return getRepeatingTasks(getNotArchiveTasks(taskListData));
    case FilterType.TAGS:
      return getTasksWithHashtags(getNotArchiveTasks(taskListData));
    case FilterType.TODAY:
      return getTasksInOneDay(getNotArchiveTasks(taskListData), nowDate);
  }

  return taskListData;
};
