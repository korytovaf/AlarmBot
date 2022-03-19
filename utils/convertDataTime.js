const convertDataTime = (expiryTime) => {
  const today = new Date();
  expiryTime = expiryTime.getTime() + today.getTimezoneOffset()*60*1000;
  const expiryDate = new Date(expiryTime);

  const minutes = `${expiryDate.getMinutes() <= 9 ? "0" : ""}${expiryDate.getMinutes()}`;
  const hours = `${expiryDate.getHours() <= 9 ? "0" : ""}${expiryDate.getHours()}`;
  const day = `${expiryDate.getDate() <= 9 ? "0" : ""}${expiryDate.getDate()}`;
  const month = `${expiryDate.getMonth() + 1 <= 9 ? "0" : ""}${expiryDate.getMonth() + 1}`;
  const year = expiryDate.getFullYear();

  const date = `${day}.${month}.${year}`;
  const time = `${hours}:${minutes}`;

  return {
    date,
    time,
  }
};
module.exports = convertDataTime;
