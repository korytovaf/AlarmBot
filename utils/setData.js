const setData = (time, date) => {
  const currentDate = new Date();
  const [hour, minutes] = time.split(':');

  if (date === 'Сегодня') {
    date = `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`
  }

  if (date === 'Завтра') {
    date = `${currentDate.getDate() + 1}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`
  }

  const [day, month, year] = date.split('.');

  return new Date(+year, +month - 1, +day, +hour, +minutes);
}

module.exports = setData;
