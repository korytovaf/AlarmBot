const convertDataTime = require('./convertDataTime');

const convertDataToString = (expiryTime) => {
  const today = new Date();
  const date = convertDataTime(expiryTime);
  const { data } = convertDataTime(today);
  const day = `${expiryTime.getUTCDate() + 1 <= 9 ? "0" : ""}${expiryTime.getUTCDate()}`;
  const tomorrow = `${expiryTime.getUTCDate() + 1 <= 9 ? "0" : ""}${expiryTime.getUTCDate() - 1}`;
  const month = `${expiryTime.getUTCMonth() + 1 <= 9 ? "0" : ""}${expiryTime.getUTCMonth() + 1}`;
  const year = expiryTime.getUTCFullYear();

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
