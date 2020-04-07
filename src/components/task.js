// Ф генерации формы создания/редактирования задачи
export const createTaskTemplate = (task) => {
  const {} = task;

  const color = `black`;
  const description = `Согласовать макет визиток и бейджей`;
  const date = `11 Febrary 2020`;
  const time = `12:28`;
  const isArchive = true;
  const isFavorite = false;

  const classRepeat = `card--repeat`;
  const classDeadline = `card--deadline`;
  const archiveButtonInativeClass = isArchive ? `` : `card__btn--disabled`;
  const favoriteButtonInativeClass = isFavorite ? `` : `card__btn--disabled`;

  return (
    `<article class="card card--${color} ${classRepeat} ${classDeadline}">
    <div class="card__form">
      <div class="card__inner">
        <div class="card__control">
          <button type="button" class="card__btn card__btn--edit">
            edit
          </button>
          <button type="button" class="card__btn card__btn--archive ${archiveButtonInativeClass}">
            archive
          </button>
          <button
            type="button"
            class="card__btn card__btn--favorites card__btn--disabled ${favoriteButtonInativeClass}"
          >
            favorites
          </button>
        </div>

        <div class="card__color-bar">
          <svg class="card__color-bar-wave" width="100%" height="10">
            <use xlink:href="#wave"></use>
          </svg>
        </div>

        <div class="card__textarea-wrap">
          <p class="card__text">${description}.</p>
        </div>

        <div class="card__settings">
          <div class="card__details">
            <div class="card__dates">
              <div class="card__date-deadline">
                <p class="card__input-deadline-wrap">
                  <span class="card__date">${date}</span>
                  <span class="card__time">${time}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>`
  );
};
