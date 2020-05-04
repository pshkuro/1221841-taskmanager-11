import TaskModel from "./models/task";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

// Проверяет, чтобы статус ответа сервера ок
const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

// Создаем отдельный класс, т.к. у нас ООП
const API = class {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getTasks() {
    return this._load({url: `tasks`})
    .then((response) => response.json()) // Преобразуем json полученный с сервера в js
    .then(TaskModel.parseTasks); // Преобразуем в модели
  }

  // Обновляет данные на сервере
  updateTask(id, data) {
    return this._load({
      url: `tasks/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()), // Raw - сырой фромат данных для сервера
      headers: new Headers({"Content-Type": `application/json`}),
    })
      .then((response) => response.json())
      .then(TaskModel.parseTask);
  }

  // Создание тасков
  createTask(task) {
    return this._load({
      url: `tasks`,
      method: Method.POST,
      body: JSON.stringify(task.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(TaskModel.parseTask);
  }

  // Удаление тасков
  deleteTask(id) {
    return this._load({url: `tasks/${id}`, method: Method.DELETE});
  }

  // Создает запрос, поверяет ответ от сервера
  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus) // Проверяет, что статус ответа сервера норм
      .catch((err) => {
        throw err;
      });
  }
};

export default API;
