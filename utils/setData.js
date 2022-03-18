const setData = (time, date) => {
  let day, month, year;
  const [hour, minutes] = time.split(':');

  if (date === 'Сегодня') {
    const currentDate = new Date();
    date = `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`
  }

  if (date === 'Завтра') {
    const currentDate = new Date();
    date = `${currentDate.getDate() + 1}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`
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
