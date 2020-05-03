import Task from "./models/task";

// Создаем отдельный класс, т.к. у нас ООП
const API = class {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getTasks() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/task-manager/tasks`, {headers})
    .then((response) => response.json()) // Преобразуем json полученный с сервера в js
    .then(Task.parseTasks); // Преобразуем в модели

  }
};

export default API;
