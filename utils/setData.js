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
  const today = new Date();
  const utc = today.getTimezoneOffset();
  const expiryTime = new Date(+year, +month - 1, +day, +hour, +minutes - utc);

  return {
    expiryTime,
    utc
  };
}

module.exports = setData;
