import {FILTER_NAMES} from "../const";

const generateFilters = () => {
  return FILTER_NAMES.map((it) => {
    return {
      name: it,
      count: Math.floor(Math.random() * 10),
    };
  });
};

export {generateFilters};

