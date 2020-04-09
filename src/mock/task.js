import {getRandomArrayItem, getRandomDate} from "../util";
import {DESCRIPTION_ITEMS, COLORS, DAYS} from "../const";

const DefaultRepeatingDays = {
  "mo": false,
  "tu": false,
  "we": false,
  "th": false,
  "fr": false,
  "sa": false,
  "su": false,
};


const generateRepeatingDays = () => {
  return Object.assign({}, DefaultRepeatingDays, {
    [getRandomArrayItem(DAYS)]: Math.random() > 0.5,
  });
};


const generateTask = () => {
  const dueDate = Math.random() > 0.5 ? null : getRandomDate();

  return {
    description: getRandomArrayItem(DESCRIPTION_ITEMS),
    dueDate,
    repeatingDays: dueDate ? DefaultRepeatingDays : generateRepeatingDays(),
    color: getRandomArrayItem(COLORS),
    isArchive: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
  };


};

const generateTasks = (count) => {
  return new Array(count).fill(``).map(generateTask);
};

export {generateTask, generateTasks};
