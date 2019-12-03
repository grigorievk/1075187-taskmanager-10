export const getFilterData = (taskData) => ([
  {
    title: `ALL`,
    count: taskData.length
  },
  {
    title: `Overdue`,
    count: taskData.filter((i) => i.dueDate < Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).length
  },
  {
    title: `Today`,
    count: taskData.filter((i) => i.dueDate === Date.now()).length
  },
  {
    title: `Favorites`,
    count: taskData.filter((i) => i.isFavorite).length
  },
  {
    title: `Repeating`,
    count: taskData.filter((i) => Object.keys(i.repeatingDays).some(day => i.repeatingDays[day])).length
  },
  {
    title: `Tags`,
    count: taskData.filter((i) => Boolean(i.tagList.length > 0)).length
  },
  {
    title: `Archive`,
    count: taskData.filter((i) => i.isArchive).length
  },
]);
