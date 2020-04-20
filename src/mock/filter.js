import {FILTER_NAMES} from "../const";
import {isToday} from "../utils/common";

const generateFilters = (tasks) => {

  const archiveCount = tasks.filter((it) => it.isArchive === true);
  const favoriteCount = tasks.filter((it) => it.isFavorite === true);
  const repeatingDaysCount = tasks.filter((it) => Object.values(it.repeatingDays).some(Boolean));
  const overdueCount = tasks.filter((it) => it.dueDate instanceof Date && it.dueDate <= Date.now());
  const todayTasksCount = tasks.filter((it) => it.dueDate instanceof Date && isToday(it.dueDate));

  const filtersData = [tasks.length, overdueCount.length, todayTasksCount.length, favoriteCount.length, repeatingDaysCount.length, archiveCount.length];

  return FILTER_NAMES.map((filterName, index) => {
    return {
      name: filterName,
      count: filtersData[index],
    };
  });
};

export {generateFilters};

