const itemsListReducer = (items) => {
  return items.reduce((acc, curr, index, items) => {
    let sep = items.length === index + 1 ? "" : " - ";
    return acc + curr + sep;
  }, "");
};

const isPermitted = (key, userRole) => {
  if (userRole === "admin" || key === userRole) {
    return true;
  }
  return false;
};

const roundToTwo = (num) => {
  return +(Math.round(num + "e+2") + "e-2");
};

export { itemsListReducer, isPermitted, roundToTwo };
