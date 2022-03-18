const convertDataTime = require('./convertDataTime');

const convertDataToString = (expiryTime) => {
  const today = new Date();
  const date = convertDataTime(expiryTime);
  const { data } = convertDataTime(today);
  const day = `${expiryTime.getDate() <= 9 ? "0" : ""}${expiryTime.getDate()}`;
  const tomorrow = `${expiryTime.getDate() <= 9 ? "0" : ""}${expiryTime.getDate() - 1}`;
  const month = `${expiryTime.getMonth() + 1 <= 9 ? "0" : ""}${expiryTime.getMonth() + 1}`;
  const year = expiryTime.getFullYear();

  let dateString = date.data;

  const expiryToday = `${day}.${month}.${year}`;
  const expiryTomorrow = `${tomorrow}.${month}.${year}`;

  if (data === expiryToday) {
    dateString = "Сегодня";
  }
  if (data === expiryTomorrow) {
    dateString = "Завтра";
  }

  return {
    dateString
  }
};
module.exports = convertDataToString;
