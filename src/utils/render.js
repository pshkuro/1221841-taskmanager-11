export const renderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

// Функция для создания DOM-Элемента
// Берет строку-разметку, првращает в Dom элемент и возвращаю
export const createElement = (template) => { // Принимает шаблонную строку (getTemplate)
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template; // Вставляем нашу строку(разметку) в созданный div

  return newElement.firstChild;
};

// Функция рендеринга DOM-эл
export const render = (container, component, place) => {
  switch (place) {
    case renderPosition.AFTERBEGIN:
      container.prepend(component.getElement());
      break;
    case renderPosition.BEFOREEND:
      container.append(component.getElement());
      break;
  }
};

export const replace = (newComponent, oldComponent) => {
  const parentElement = oldComponent.getElement().parentElement;
  const newElement = newComponent.getElement();
  const oldElement = oldComponent.getElement();

  const isExistElements = !!(parentElement && newElement && oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};
