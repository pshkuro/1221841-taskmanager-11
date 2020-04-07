import {DAYS, MONTH_NAMES} from "../const";
import {formatTime} from "../util";

// Генерация блока выбора цвета
const createColorsMarkup = () => {
  return (
    `<input
    type="radio"
    id="color-black-4"
    class="card__color-input card__color-input--black visually-hidden"
    name="color"
    value="black"
  />
  <label
    for="color-black-4"
    class="card__color card__color--black"
    >black</label
  >
  <input
    type="radio"
    id="color-yellow-4"
    class="card__color-input card__color-input--yellow visually-hidden"
    name="color"
    value="yellow"
    checked
  />
  <label
    for="color-yellow-4"
    class="card__color card__color--yellow"
    >yellow</label
  >
  <input
    type="radio"
    id="color-blue-4"
    class="card__color-input card__color-input--blue visually-hidden"
    name="color"
    value="blue"
  />
  <label
    for="color-blue-4"
    class="card__color card__color--blue"
    >blue</label
  >
  <input
    type="radio"
    id="color-green-4"
    class="card__color-input card__color-input--green visually-hidden"
    name="color"
    value="green"
  />
  <label
    for="color-green-4"
    class="card__color card__color--green"
    >green</label
  >
  <input
    type="radio"
    id="color-pink-4"
    class="card__color-input card__color-input--pink visually-hidden"
    name="color"
    value="pink"
  />
  <label
    for="color-pink-4"
    class="card__color card__color--pink"
    >pink</label
  >`
  );
};

// Генерация блока выбора дня недели
const createRepeatingDaysMarkup = (days, repeatingDays) => {
  return days.map((it, index) => {
    const isChecked = repeatingDays[it];
    return (
      `<input
      class="visually-hidden card__repeat-day-input"
      type="checkbox"
      id="repeat-${it}-${index}"
      name="repeat"
      value="${it}"
      ${isChecked ? `checked` : ``}
    />
    <label class="card__repeat-day" for="repeat-${it}-${index}"
      >${it}</label
    >`
    );
  }).join(`\n`);
};


// Ф генерации карточки задачи
export const createTaskEditTemplate = (task) => {
  const {description, dueDate, color, repeatingDays} = task;

  // Флаг, что задача просрочена
  // (создан ли dueDate с пом-ю конструктора Date (мб придет объект другого типа, тогда = null и авто задача Expired)
  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const isDateShowing = Boolean(dueDate); // Проверка, приходит ли такой объект, или нет (true/false)

  const date = isDateShowing ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const time = isDateShowing ? formatTime(dueDate) : ``;

  // Флаг возвращает true, если
  // хотя бы 1 эл true из repeatingDays
  const isRepeatingTask = Object.values(repeatingDays).some(Boolean);
  const classRepeat = isRepeatingTask ? `card--repeat` : ``;
  const classDeadline = isExpired ? `card--deadline` : ``; // Если задача просрочена, доб класс deadline, иначе ничего

  const colorsMarkup = createColorsMarkup();
  const repeatingDaysMarkup = createRepeatingDaysMarkup(DAYS, repeatingDays);

  return (
    `<article class="card card--edit card--${color} ${classRepeat} ${classDeadline}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
                </button>

                ${isDateShowing ?
      `<fieldset class="card__date-deadline">
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder=""
                      name="date"
                      value="${date} ${time}"
                    />
                  </label>
                </fieldset>` : ``}

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">yes</span>
                </button>
                
              ${isRepeatingTask ?
      `<fieldset class="card__repeat-days">
                  <div class="card__repeat-days-inner">
                    ${repeatingDaysMarkup}
                  </div>
                </fieldset>` : ``}
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${colorsMarkup}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};
