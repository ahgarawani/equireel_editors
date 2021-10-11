exports.calculateEventDays = ({ startDate, endDate }) => {
  const millisecsInDay = 1000 * 60 * 60 * 24;
  let days = [];
  const numOfDays = (endDate - startDate) / millisecsInDay + 1;
  for (let i = 1; i < numOfDays + 1; i++) {
    newDay = startDate + millisecsInDay * i;
    days.push(newDay);
  }
  return days;
};

exports.createUTCDate = (dateToParse) => {
  const date = new Date(dateToParse);
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
};
