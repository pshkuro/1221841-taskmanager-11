import moment from "moment";

export const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};

// Генерация случ эл массива
export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

// Генерация случ числа от мин до макс
export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

// Генерация случайной даты (+/- 7 дней с DateNow)
export const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 8);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

// Проверяет, является ли дата сег днем
export const isToday = (date) => date.getDate() === new Date().getDate();

export const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};

export const isOverdueDate = (dueDate, date) => {
  return dueDate < date && !isOneDay(date, dueDate);
};

export const isOneDay = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, `days`) === 0 && dateA.getDate() === dateB.getDate();
};

