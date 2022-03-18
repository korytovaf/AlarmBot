const convertDataTime = (expiryTime) => {
  const minutes = `${expiryTime.getMinutes() <= 9 ? "0" : ""}${expiryTime.getMinutes()}`;
  const hours = `${expiryTime.getHours() <= 9 ? "0" : ""}${expiryTime.getHours()}`;
  const day = `${expiryTime.getDate() <= 9 ? "0" : ""}${expiryTime.getDate()}`;
  const month = `${expiryTime.getMonth() + 1 <= 9 ? "0" : ""}${expiryTime.getMonth() + 1}`;
  const year = expiryTime.getFullYear();

  const data = `${day}.${month}.${year}`;
  const time = `${hours}:${minutes}`;

  return {
    data,
    time,
  }
};
module.exports = convertDataTime;
