const convertDataTime = require('./convertDataTime');

const convertDataToString = (expiryTime) => {
  const today = new Date();
  const dateExpiry = convertDataTime(expiryTime);
  const { date } = convertDataTime(today);
  const day = `${expiryTime.getDate() <= 9 ? "0" : ""}${expiryTime.getDate()}`;
  const tomorrow = `${expiryTime.getDate() <= 9 ? "0" : ""}${expiryTime.getDate() - 1}`;
  const month = `${expiryTime.getMonth() + 1 <= 9 ? "0" : ""}${expiryTime.getMonth() + 1}`;
  const year = expiryTime.getFullYear();

  let dateString = dateExpiry.date;

  const expiryToday = `${day}.${month}.${year}`;
  const expiryTomorrow = `${tomorrow}.${month}.${year}`;

  if (date === expiryToday) {
    dateString = "Сегодня";
  }
  if (date === expiryTomorrow) {
    dateString = "Завтра";
  }

  return {
    dateString
  }
};
module.exports = convertDataToString;
