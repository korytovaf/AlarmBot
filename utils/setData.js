const setData = (time, date) => {
  let day, month, year;
  const [hour, minutes] = time.split(':');

  if (date === 'Сегодня') {
    const currentDate = new Date();
    date = `${currentDate.getUTCDate()}.${currentDate.getUTCMonth() + 1}.${currentDate.getUTCFullYear()}`
  }

  if (date === 'Завтра') {
    const currentDate = new Date();
    date = `${currentDate.getUTCDate() + 1}.${currentDate.getUTCMonth() + 1}.${currentDate.getUTCFullYear()}`
  }
  [day, month, year] = date.split('.');
  const receivedDate = new Date(+year, +month - 1, +day, +hour, +minutes);
  let currentDate = new Date();

  return {
    timer: receivedDate.getTime() - currentDate.getTime(),
    expiryTime: receivedDate.getTime()
  };
}

module.exports = setData;
