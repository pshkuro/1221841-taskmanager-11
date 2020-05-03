import Task from "./models/task";

// Создаем отдельный класс, т.к. у нас ООП
const API = class {
  getTasks() {
    return fetch(`https://11.ecmascript.pages.academy/task-manager/tasks`)
    .then((response) => response.json())
    .then(Task.parseTasks);
  }
};

export default API;
